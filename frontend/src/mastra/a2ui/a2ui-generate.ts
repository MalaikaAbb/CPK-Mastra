/**
 * Mastra `generate-a2ui` tool — the LLM-driven A2UI pattern.
 *
 * This file is the doc-facing source for `/mastra/generative-ui/a2ui/fixed-schema`
 * (the `backend-render-operations` region below is what the guide renders), so it
 * is deliberately SELF-CONTAINED: the A2UI operation builder is defined here
 * rather than imported from the showcase's shared tools, exactly as the reference
 * TypeScript cell does in
 * `showcase/integrations/langgraph-typescript/src/agent/a2ui-fixed.ts`.
 * A reader can copy the region into their own project and have it compile
 * (OSS-901: the guide previously called `generateA2uiImpl` /
 * `buildA2uiOperationsFromToolCall` from `@copilotkit/showcase-shared-tools`,
 * which is a tsconfig path alias inside this repo and not an installable
 * package).
 *
 * Two imports below are showcase plumbing, and both have a one-line
 * equivalent in a real app — see the comments at each import.
 */

import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { generateText, tool as aiTool } from "ai";
// In your own app this is `import { openai } from "@ai-sdk/openai"`. The
// showcase wraps it so this backend tool's own LLM call carries the inbound
// request's aimock headers — see `_header_forwarding.ts`.
import { openai } from "@ai-sdk/openai";
/** Catalog the surface is pinned to when the model omits `catalogId`. */
const DEFAULT_CATALOG_ID = "copilotkit://app-dashboard-catalog";
const DEFAULT_SURFACE_ID = "dynamic-surface";

/**
 * Server-side read of the A2UI schema context the `@ag-ui/mastra` bridge
 * forwards onto Mastra's request context.
 *
 * The bridge does `requestContext.set("ag-ui", { context })` with
 * `RunAgentInput.context`, which carries the catalog schema + A2UI generation
 * guidelines the middleware injected. The dynamic `generate_a2ui` tool must
 * ground its inner `render_a2ui` subagent on this — the outer model leaves the
 * tool's `contextEntries` arg empty, so without reading it here the render runs
 * with no catalog and produces invalid/misnamed components (no surface renders;
 * varies run to run; masked under aimock). Mirrors `readAgUiContext` in
 * `@ag-ui/mastra`'s `getA2UITools`. Degrades to `[]` for any unexpected shape.
 */
export function readForwardedA2uiContext(
  executionContext: unknown,
): Array<Record<string, unknown>> {
  const requestContext = (
    executionContext as { requestContext?: { get?: (key: string) => unknown } }
  )?.requestContext;
  const entry =
    typeof requestContext?.get === "function"
      ? requestContext.get("ag-ui")
      : undefined;
  const context = (entry as { context?: unknown } | undefined)?.context;
  return Array.isArray(context)
    ? (context as Array<Record<string, unknown>>)
    : [];
}

/**
 * Flatten forwarded context entries into the system prompt for the inner
 * `render_a2ui` call. Entries without a non-empty string `value` are dropped,
 * so an empty (ungrounded) prompt is `""` rather than a string of blanks.
 */
export function systemPromptFrom(
  contextEntries: Array<Record<string, unknown>> | undefined,
): string {
  return (contextEntries ?? [])
    .map((entry) => entry?.value)
    .filter((value): value is string => typeof value === "string" && !!value)
    .join("\n\n");
}

/**
 * A2UI v0.9 operations are NESTED (`{ createSurface: {...} }`), not flat
 * (`{ type: "create_surface", ... }`): a consumer dispatches on the operation
 * key, so a flat shape is silently ignored and the surface never paints.
 */
type A2UIOperation =
  | { version: "v0.9"; createSurface: { surfaceId: string; catalogId: string } }
  | {
      version: "v0.9";
      updateComponents: {
        surfaceId: string;
        components: Array<Record<string, unknown>>;
      };
    }
  | {
      version: "v0.9";
      updateDataModel: {
        surfaceId: string;
        path: string;
        value: Record<string, unknown>;
      };
    };

/**
 * Turn the inner model's `render_a2ui` arguments into the `a2ui_operations`
 * container the A2UI middleware detects in a tool result.
 */
function buildA2uiOperations(args: Record<string, unknown>): {
  a2ui_operations: A2UIOperation[];
} {
  const surfaceId = (args.surfaceId as string) ?? DEFAULT_SURFACE_ID;
  const catalogId = (args.catalogId as string) ?? DEFAULT_CATALOG_ID;
  const components = (args.components as Array<Record<string, unknown>>) ?? [];
  const data = args.data as Record<string, unknown> | undefined;

  if (components.length === 0) {
    console.warn("generate-a2ui: empty components for surface", surfaceId);
  }

  const operations: A2UIOperation[] = [
    { version: "v0.9", createSurface: { surfaceId, catalogId } },
    { version: "v0.9", updateComponents: { surfaceId, components } },
  ];

  // Emit `updateDataModel` only when there is data to seed. An empty object is
  // truthy in JS, so guard on key count to stay in step with the Python
  // reference (`if data:`), which skips the op for `{}`.
  if (
    data != null &&
    typeof data === "object" &&
    Object.keys(data).length > 0
  ) {
    operations.push({
      version: "v0.9",
      updateDataModel: { surfaceId, path: "/", value: data },
    });
  }

  return { a2ui_operations: operations };
}

/**
 * Normalize an incoming message role to the `user`/`assistant` pair
 * `generateText` accepts. An unsound `as "user" | "assistant"` cast would let a
 * `system`/`tool` role slip through mis-typed (a `??` only guards
 * null/undefined), so map explicitly: anything that is not `assistant`
 * collapses to `user`.
 */
function toRole(role: unknown): "user" | "assistant" {
  return role === "assistant" ? "assistant" : "user";
}

// The `generate-a2ui` tool runs a secondary LLM call with a forced
// `render_a2ui` tool, then converts that tool call's args into the
// A2UI `a2ui_operations` container that the middleware forwards to
// the frontend renderer. Mastra returns the operations as a JSON
// string from the tool body; the catalog resolves component names to
// React renderers on the client.
export const generateA2uiTool = createTool({
  id: "generate-a2ui",
  description: "Generate dynamic A2UI surface components",
  inputSchema: z.object({
    messages: z.array(z.record(z.unknown())).describe("Chat messages"),
    contextEntries: z
      .array(z.record(z.unknown()))
      .optional()
      .describe("Context entries"),
  }),
  execute: async ({ messages, contextEntries }, executionContext) => {
    // The outer model leaves `contextEntries` empty — it has no basis to hand
    // the catalog schema back through a tool arg — so on a live LLM the inner
    // `render_a2ui` subagent would run with an EMPTY system prompt: ungrounded,
    // it emits invalid/misnamed components (or none), and the surface fails to
    // render, varying run to run. (aimock hides it: the recorded fixture
    // returns a valid envelope regardless of the empty context.) The bridge
    // already forwards the catalog schema + generation guidelines onto the
    // request context, so read them server-side and ground the render there
    // rather than trusting the model-supplied arg.
    const forwardedContext = readForwardedA2uiContext(executionContext);
    const systemPrompt = systemPromptFrom(
      forwardedContext.length > 0 ? forwardedContext : contextEntries,
    );

    const result = await generateText({
      model: openai("gpt-5-mini"),
      system: systemPrompt,
      messages: messages.map((m) => ({
        role: toRole(m.role),
        content: (m.content as string) ?? "",
      })),
      tools: {
        render_a2ui: aiTool({
          description: "Render a dynamic A2UI v0.9 surface.",
          // AI SDK v5 renamed the tool schema key from `parameters` to
          // `inputSchema`; under v5 a `parameters` key is ignored, so the
          // render_a2ui schema would never reach the model.
          inputSchema: z.object({
            surfaceId: z.string().describe("Unique surface identifier."),
            catalogId: z.string().describe("The catalog ID."),
            components: z
              .array(z.record(z.unknown()))
              .describe("A2UI v0.9 component array."),
            data: z
              .record(z.unknown())
              .optional()
              .describe("Optional initial data model."),
          }),
        }),
      },
      toolChoice: { type: "tool", toolName: "render_a2ui" },
    });

    const toolCall = result.toolCalls?.[0];
    if (!toolCall) {
      // The forced `render_a2ui` tool was not called, so there are no
      // operations to forward. Returning a `{ error }` JSON string would look
      // like a successful tool result to the frontend/runtime, which cannot
      // then distinguish it from a real A2UI payload. Throw instead so the
      // Mastra runtime surfaces this as a genuine tool error.
      const message = "generate-a2ui: LLM did not call render_a2ui";
      console.error(message, { finishReason: result.finishReason });
      throw new Error(message);
    }

    // AI SDK v5 renamed the typed tool-call arguments from `.args` to
    // `.input` (the `ai` v4 shape was `toolCall.args`). Read `.input` so the
    // a2ui builder gets the render_a2ui arguments instead of `undefined`.
    return JSON.stringify(
      buildA2uiOperations(toolCall.input as Record<string, unknown>),
    );
  },
});

export { buildA2uiOperations };
// Runtime for the A2UI Fixed Schema demo.
//
// HARNESS GLUE: the published demo page points at
// `runtimeUrl="/api/copilotkit-a2ui-fixed-schema"`, but no such route ships on
// the page or in its demo Code tab. This file supplies it using only published
// pieces: the `CopilotRuntime` config is the "Registering the runtime" snippet
// from docs.copilotkit.ai/mastra/generative-ui/a2ui/fixed-schema, and the
// handler is the same shape as the published `api/copilotkit-ogui/route.ts`.

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  CopilotRuntime,
  createCopilotRuntimeHandler,
} from "@copilotkit/runtime/v2";
import { getLocalAgent } from "@ag-ui/mastra";
import { mastra } from "@/mastra";

const agent = getLocalAgent({
  mastra,
  agentId: "a2uiFixedSchemaAgent",
  resourceId: "mastra-a2ui-fixed-schema",
});

if (!agent) {
  throw new Error("getLocalAgent returned null for a2uiFixedSchemaAgent");
}

// From the page: the agent owns `generate_a2ui`, so the runtime must not
// inject a second copy — the middleware still detects the operations container.
const runtime = new CopilotRuntime({
  agents: { "a2ui-fixed-schema": agent },
  a2ui: { injectA2UITool: false, agents: ["a2ui-fixed-schema"] },
});

export const POST = async (req: NextRequest) => {
  try {
    const copilotHandler = createCopilotRuntimeHandler({
      runtime,
      basePath: "/api/copilotkit-a2ui-fixed-schema",
      mode: "single-route",
    });
    return await copilotHandler(req);
  } catch (error: unknown) {
    const e = error as { message?: string; stack?: string };
    return NextResponse.json(
      { error: e.message, stack: e.stack },
      { status: 500 },
    );
  }
};

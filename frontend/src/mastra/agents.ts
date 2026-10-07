import { Agent } from "@mastra/core/agent";
import { LibSQLStore } from "@mastra/libsql";
import { Memory } from "@mastra/memory";
import { z } from "zod";

import { model } from "./model";
import { addSearch, runDeepResearchTool, searchFlightsA2uiTool, weatherInfo } from "./tools";
import { openai } from "@ai-sdk/openai";
import type { RequestContext } from "@mastra/core/request-context";

import { generateA2uiTool } from "./a2ui/a2ui-generate";
import {
  critiqueAgentTool,
  researchAgentTool,
  writingAgentTool,
} from "./subagents";

/**
 * The agents this harness serves — one per documentation page that defines one.
 *
 * Nothing here was designed for this repo. Each agent's name, instructions,
 * tools, and working-memory schema are the doc's.
 *
 * Why several agents rather than one: in Mastra, shared state *is* working
 * memory, and working memory carries a single Zod schema per agent. The docs
 * define three different schemas — `language`, `document`, and `searches` — so
 * they cannot be merged without inventing a schema no page shows.
 *
 * Each agent gets its own in-memory LibSQL store, exactly as the docs do. That
 * means state is per-process and resets on restart, which is fine for a harness.
 */

const store = () => new LibSQLStore({ id: "mastra-storage", url: ":memory:" });

// #region my-agent
// Quickstart — docs.copilotkit.ai/mastra/quickstart?agent=bring-your-own
export const myAgent = new Agent({
  id: "myAgent",
  name: "My Agent",
  instructions: "You are a helpful assistant!",
  model: model(),
});
// #endregion

// #region weather-agent
// Tool Rendering
export const weatherAgent = new Agent({
  id: "weatherAgent",
  name: "Weather Agent",
  instructions:
    "You are a helpful assistant that provides current weather information. When asked about the weather, use the weather information tool to fetch the data.",
  model: model(),
  tools: {
    weatherInfo,
  },
});
// #endregion

// #region language-agent
// Shared State read + write — .../shared-state/in-app-agent-read and -write
export const AgentStateSchema = z.object({
  language: z.enum(["english", "spanish"]),
});

export type AgentState = z.infer<typeof AgentStateSchema>;

export const languageAgent = new Agent({
  id: "languageAgent",
  name: "Language Agent",
  model: model(),
  instructions:
    "Always communicate in the preferred language of the user as defined in your working memory. Do not communicate in any other language.",
  memory: new Memory({
    storage: store(),
    options: {
      workingMemory: {
        enabled: true,
        schema: AgentStateSchema,
      },
    },
  }),
});
// #endregion

// #region streaming-agent
// Predictive State Updates — .../shared-state/predictive-state-updates
export const StreamingAgentState = z.object({
  document: z.string().default(""),
});

export const streamingAgent = new Agent({
  id: "streamingAgent",
  name: "Streaming Agent",
  model: model(),
  // The prompt drives the model to write the full document straight into
  // working memory via the built-in updateWorkingMemory tool, rather than
  // pasting it into a chat message.
  instructions: `You are a collaborative writing assistant. Whenever the user asks you to write, draft, or revise anything, call the \`updateWorkingMemory\` tool with the FULL content under the \`document\` field. Never paste the document into a chat message — it belongs in shared state, and the UI renders it live as you stream it.`,
  memory: new Memory({
    storage: store(),
    options: {
      workingMemory: {
        enabled: true,
        schema: StreamingAgentState,
      },
    },
  }),
});
// #endregion

// #region search-agent
// State Rendering — .../generative-ui/state-rendering
const SearchAgentStateSchema = z.object({
  searches: z
    .array(
      z.object({
        query: z.string(),
        done: z.boolean(),
      }),
    )
    .default([]),
});

export type SearchAgentState = z.infer<typeof SearchAgentStateSchema>;

export const searchAgent = new Agent({
  id: "searchAgent",
  name: "Search Agent",
  model: model(),
  instructions: `
    You are a helpful assistant for storing searches.

    IMPORTANT:
    - Use the addSearch tool to add a search to the agent's state
    - ONLY USE THE addSearch TOOL ONCE FOR A GIVEN QUERY
  `,
  tools: {
    addSearch,
  },
  memory: new Memory({
    storage: store(),
    options: {
      workingMemory: {
        enabled: true,
        schema: SearchAgentStateSchema,
      },
    },
  }),
});
// #endregion

// #region colleagues-agent
// Readables — docs.copilotkit.ai/mastra/agent-app-context
//
// Note how context arrives: `instructions` is a function reading
// `requestContext.get('ag-ui')?.context`. Mastra injects what the frontend
// registered with `useAgentContext` there, so no tool is involved.
export const colleaguesContactAgent = new Agent({
  id: "colleague-agent",
  name: "Colleagues contact Agent",
  model: model(),
  instructions: ({ requestContext }) => {
    // `requestContext.get()` is typed as `{}` in @mastra/core 1.56, so the
    // doc's `?.context` access does not compile without this shape.
    const aguiContext = (
      requestContext.get("ag-ui") as
        | { context?: { description: string; value: unknown }[] }
        | undefined
    )?.context;
    const colleaguesContextItem = aguiContext?.find(
      (contextItem) =>
        contextItem.description === "The current user's colleagues",
    );

    const colleagues =
      typeof colleaguesContextItem?.value === "string"
        ? JSON.parse(colleaguesContextItem.value)
        : (colleaguesContextItem?.value ?? []);

    const colleagueList = colleagues
      .map((c) => `${c.name} (${c.role})`)
      .join(", ");

    return `
        You are a helpful assistant that can help emailing colleagues.
        The user's colleagues are: ${colleagueList}
    `;
  },
});
// #endregion

// #region background-agent
// Background Tasks — docs.copilotkit.ai/mastra/background-tasks
//
// `memory` is the one addition to the doc's agent, and it is not cosmetic.
// Mastra's idle loop — what `untilIdle: true` in the runtime route turns on —
// opens with `if (!deps.bgManager || !scope) return <plain single turn>`, and
// `scope` is null whenever `await agent.getMemory()` is falsy. The instance's
// `storage` does not satisfy that: `Agent#getMemory()` resolves the agent's own
// `memory`, and the inherited-memory path is only wired for sub-agents.
//
// Without it, `untilIdle` silently no-ops: nothing subscribes to the background
// task manager's event stream, so no `background-task-running`/`-completed`
// chunk ever reaches AG-UI, no ACTIVITY_DELTA is emitted, and the activity card
// is stuck on the single "running" snapshot forever. See the README's
// doc-vs-implementation section.
export const backgroundAgentsAgent = new Agent({
  id: "background-agents",
  name: "Background Agents Agent",
  tools: { runDeepResearchTool },
  model: model(),
  memory: new Memory({
  options: {
    observationalMemory: {
      scope: "thread",
      observation: { messageTokens: 600, bufferTokens: 300 },
      model: openai("gpt-4.1"),
    },
  },
}),
  instructions:
    "You are a research assistant that dispatches long-running work to the " +
    "background. When the user asks you to research a topic, call the " +
    "run_deep_research tool ONCE, then send a short message saying the work " +
    "is running in the background.",
});
// #endregion

// #region working-memory-db-url
// Published in the showcase agents/index.ts (Code tab on /mastra/human-in-the-loop/useInterrupt,
// /headless and /multi-agent/subagents). Used by the agents added below.
/**
 * Persistent SQLite URL for working-memory storage.
 *
 * Why not `file::memory:`: an in-memory store resets on every process
 * restart. For demos that surface user state to the UI (notes panel, agent
 * delegations, preferences), that is silent data loss — the user adds notes,
 * the dev hits save, Next.js HMR restarts the server, and the notes vanish
 * with no error.
 *
 * Tests can override via `MASTRA_WORKING_MEMORY_URL=file::memory:` to keep
 * fixture isolation. The default is a relative file path so the DB lives
 * next to the package and survives reloads.
 */
export const WORKING_MEMORY_DB_URL =
  process.env.MASTRA_WORKING_MEMORY_URL ?? "file:./mastra-memory.db";
// #endregion

// #region a2ui-agents
// A2UI — docs.copilotkit.ai/mastra/generative-ui/a2ui/{dynamic,fixed}-schema
//
// HARNESS: the showcase backs both A2UI demos with its shared `weatherAgent`,
// whose other tools depend on the unpublished `@copilotkit/showcase-shared-tools`.
// These two agents carry only that agent's published model + instructions.
//
// Dynamic schema follows the page's default path: no A2UI tool on the agent —
// the provider's catalog makes the runtime auto-inject `generate_a2ui`.
export const declarativeGenUiAgent = new Agent({
  id: "declarative-gen-ui-agent",
  name: "Declarative Gen UI Agent",
  model: openai("gpt-5-mini"),
  instructions: "You are a helpful assistant.",
});

// Fixed schema owns its tool, so its runtime sets `injectA2UITool: false`.
export const a2uiFixedSchemaAgent = new Agent({
  id: "a2ui-fixed-schema-agent",
  name: "A2UI Fixed Schema Agent",
  tools: { searchFlightsA2uiTool },
  model: openai("gpt-5-mini"),
  instructions: "You are a helpful assistant.",
});
// #endregion

// #region subagents-supervisor
// Sub-Agents — docs.copilotkit.ai/mastra/multi-agent/subagents (verbatim)
/**
 * Shared-state schema for the Sub-Agents demo.
 *
 * `delegations` is appended to by the supervisor as it fans out work to the
 * research / writing / critique sub-agents. The UI subscribes via
 * `useAgent({ updates: [OnStateChanged] })` and renders a live delegation
 * log.
 */
export const SubagentsAgentState = z.object({
  delegations: z
    .array(
      z.object({
        id: z.string(),
        sub_agent: z.enum([
          "research_agent",
          "writing_agent",
          "critique_agent",
        ]),
        task: z.string(),
        status: z.enum(["running", "completed", "failed"]),
        result: z.string(),
      }),
    )
    .default([]),
});

/**
 * Mastra agent backing the Sub-Agents demo.
 *
 * Supervisor pattern: this agent delegates to three specialized sub-agents
 * (research / writing / critique) exposed as tools. Each tool runs the
 * matching sub-agent under the hood and returns both its output and a
 * `delegation` entry the supervisor must append to working memory's
 * `delegations` array. The UI renders that array live as a delegation log.
 *
 * Sub-agents are defined alongside the tools in
 * `src/mastra/tools/subagents.ts` — they're full `Agent` instances with
 * their own system prompts and don't share memory with the supervisor.
 */
export const subagentsSupervisorAgent = new Agent({
  id: "subagents-supervisor",
  name: "Subagents Supervisor",
  tools: {
    researchAgentTool,
    writingAgentTool,
    critiqueAgentTool,
  },
  model: openai("gpt-5-mini"),
  instructions: `You are a supervisor agent that coordinates three specialized sub-agents to produce high-quality deliverables.

Available sub-agents (call them as tools):
  - research_agent: gathers facts on a topic.
  - writing_agent: turns facts + a brief into a polished draft.
  - critique_agent: reviews a draft and suggests improvements.

For most non-trivial user requests, delegate in sequence: research -> write -> critique. Pass the relevant facts/draft through the \`task\` argument of each tool. Keep your own messages short — explain the plan once, delegate, then return a concise summary once done.

DELEGATION LOG (working memory):
Each sub-agent tool returns a JSON payload of the form \`{ "result": <text>, "delegation": <Delegation> }\`. The tool itself appends the \`delegation\` object to the \`delegations\` array in working memory — you do NOT need to call \`updateWorkingMemory\` for delegations. Just keep delegating; the live log updates automatically.

If a delegation's \`status\` field is \`"failed"\`, treat it as a real error: do not pretend the sub-agent succeeded. Decide whether to retry, fall back to a different sub-agent, or summarize the failure to the user.`,
  memory: new Memory({
    storage: new LibSQLStore({
      id: "subagents-supervisor-memory",
      url: WORKING_MEMORY_DB_URL,
    }),
    options: {
      workingMemory: {
        enabled: true,
        schema: SubagentsAgentState,
      },
    },
  }),
});
// #endregion

// #region open-gen-ui-agents
// Open Generative UI — docs.copilotkit.ai/mastra/generative-ui/open-generative-ui (verbatim)
/**
 * Dedicated agents for the Open Generative UI demos (minimal + advanced).
 *
 * Parity target (gold = langgraph-python `open_gen_ui_agent.py` /
 * `open_gen_ui_advanced_agent.py`): each is a purpose-built agent whose
 * system prompt MANDATES a single `generateSandboxedUi` call producing a
 * polished (advanced: INTERACTIVE, host-function-wired) sandboxed UI, and
 * reads the design-skill + sandbox-function descriptors the
 * `CopilotKitProvider` injects as agent CONTEXT.
 *
 * Why NOT the shared `weatherAgent`: with only
 * `"You are a helpful assistant."` plus the tool description, a live LLM
 * emits STATIC HTML with no JS wiring — the calculator's buttons render
 * but nothing is interactive. aimock hid this because its replay fixture
 * ships a fully-wired UI, so the divergence only showed on a live endpoint.
 *
 * Why DYNAMIC instructions: on Mastra, `RunAgentInput.context` is a
 * read-channel (`requestContext.get("ag-ui").context`) — it is NOT
 * auto-injected into the LLM prompt (unlike the langgraph
 * `CopilotKitMiddleware`, which merges `copilotkit.context` into what the
 * LLM sees). So we read that context here and fold the design-skill +
 * sandbox-function descriptors into the system prompt, giving the Mastra
 * model the same knowledge the gold agent gets from its context.
 */
function foldHostContext(requestContext: RequestContext): string {
  const agui = requestContext.get("ag-ui") as
    | { context?: Array<{ description: string; value: string }> }
    | undefined;
  const items = agui?.context ?? [];
  if (items.length === 0) return "";
  const blocks = items
    .map((c) => `### ${c.description}\n${c.value}`)
    .join("\n\n");
  return `\n\n---\nHOST CONTEXT (provided by the application — read carefully and follow it):\n\n${blocks}`;
}

const OPEN_GEN_UI_BASE_PROMPT = `You are a UI-generating assistant for an Open Generative UI demo focused on intricate, educational visualisations (3D axes / rotations, neural-network activations, sorting-algorithm walkthroughs, Fourier series, wave interference, planetary orbits, etc.).

On every user turn you MUST call the \`generateSandboxedUi\` frontend tool exactly once. Design a visually polished, self-contained HTML + CSS + SVG widget that *teaches* the requested concept.

A detailed "design skill" describing the palette, typography, labelling, and motion conventions is provided in the host context below — follow it closely. Key invariants:
- Use inline SVG (or <canvas>) for geometric content, not stacks of <div>s.
- Every axis is labelled; every colour-coded series has a legend.
- Prefer CSS @keyframes / transitions over setInterval; loop cyclical concepts with animation-iteration-count: infinite.
- Motion must teach — animate the actual step of the concept, not decoration.
- No fetch / XHR / localStorage — the sandbox has no same-origin access.

Output order:
- \`initialHeight\` (typically 480-560 for visualisations) first.
- A short \`placeholderMessages\` array (2-3 lines describing the build).
- \`css\` (complete).
- \`html\` (streams live — keep it tidy). CDN <script> tags for Chart.js / D3 / etc. go inside the html.

Keep your own chat message brief (1 sentence) — the real output is the rendered visualisation.`;

const OPEN_GEN_UI_ADVANCED_BASE_PROMPT = `You are a UI-generating assistant for the Open Generative UI (Advanced) demo.

On every user turn you MUST call the \`generateSandboxedUi\` frontend tool exactly once. The generated UI must be INTERACTIVE and must invoke the available host-side sandbox functions described in the host context below in response to user interactions.

Sandbox-function calling contract (inside the generated iframe):
- Call a host function with:
      await Websandbox.connection.remote.<functionName>(args)
  The call returns a Promise; await it.
- Each handler returns a plain object. Read the return shape from the function's description in the context and use the EXACT field names it returns (e.g. if the description says the handler returns \`{ ok, value }\`, read \`res.value\` — not \`res.result\`).
- Descriptions, names, and JSON-schema parameter shapes for every available sandbox function are listed in the host context below. Read them carefully and wire at least one interactive UI element to call one.

Sandbox iframe restrictions (CRITICAL):
- The iframe runs with \`sandbox="allow-scripts"\` ONLY. Forms are NOT allowed. You MUST NOT use \`<form>\` elements or \`<button type="submit">\`. Clicking a submit button inside a sandboxed form is blocked by the browser BEFORE any onsubmit handler runs, so the sandbox-function call never fires.
- Use plain \`<button type="button">\` elements and wire them with \`addEventListener('click', ...)\`. For "Enter" keypresses on inputs, attach a \`keydown\` listener that checks \`e.key === 'Enter'\` and calls your handler directly — do NOT wrap inputs in a \`<form>\`.

Making the UI interactive (REQUIRED — static markup alone is NOT acceptable):
- The buttons/inputs MUST actually do something. Include the wiring JavaScript either as an inline \`<script>\` at the END of your \`html\`, or via the \`jsFunctions\` / \`jsExpressions\` parameters. A UI with no script is a bug.
- Always include a visible result element (e.g. an output div) that you UPDATE after the sandbox function resolves, so the user can SEE the round-trip: "interaction -> remote call -> visible result".

Generation guidance:
- Emit \`initialHeight\` and \`placeholderMessages\` first, then \`css\`, then \`html\` (put any wiring script at the end of the html), then \`jsFunctions\` / \`jsExpressions\` if helpful.
- Do NOT use fetch/XHR, localStorage, or document.cookie — the sandbox has no same-origin access. ONLY use \`Websandbox.connection.remote.*\` for host-page interactions.
- Keep your own chat message brief (1 sentence max); the rendered UI is the real output.`;

/**
 * Memory factory for the OGUI agents. Storage only (no working-memory
 * schema) — these agents are single-shot UI generators with no shared
 * state, matching gold's `tools=[]` agents. Storage keeps thread history
 * consistent with the bridge's send-only-new-turn contract.
 */
const openGenUiMemory = (id: string) =>
  new Memory({
    storage: new LibSQLStore({ id, url: WORKING_MEMORY_DB_URL }),
  });

export const openGenUiAgent = new Agent({
  id: "open-gen-ui-agent",
  name: "Open Generative UI Agent",
  model: openai("gpt-5-mini"),
  instructions: ({ requestContext }) =>
    OPEN_GEN_UI_BASE_PROMPT + foldHostContext(requestContext),
  memory: openGenUiMemory("open-gen-ui-agent-memory"),
});

export const openGenUiAdvancedAgent = new Agent({
  id: "open-gen-ui-advanced-agent",
  name: "Open Generative UI Advanced Agent",
  model: openai("gpt-5-mini"),
  instructions: ({ requestContext }) =>
    OPEN_GEN_UI_ADVANCED_BASE_PROMPT + foldHostContext(requestContext),
  memory: openGenUiMemory("open-gen-ui-advanced-agent-memory"),
});
// #endregion

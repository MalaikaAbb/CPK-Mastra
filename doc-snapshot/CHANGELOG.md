# Doc drift changelog

What the CopilotKit docs changed under this repo, written by the sync on
`/doc-sync`. Only pages that actually moved are recorded — a sync that finds
everything unchanged writes nothing here at all.

Holds the 3 most recent dated entries. When a change lands on a fourth
date, the oldest entry is dropped. Entries are counted, not aged, so a gap of
weeks between changes does not expire anything.

## 2026-11-11

### 14:10 UTC — 17 pages, highest severity high

**High — Agent App Context**

`/mastra/agent-app-context` · route `/agent-app-context` · under “Consume the data in your Mastra agent” · in a `tsx` block

2 code lines changed.

````diff
- model: openai("gpt-4o"),
+ model: openai("gpt-6-luna"),
````

**High — Background Tasks**

`/mastra/background-tasks` · route `/background-tasks` · under “Add the tool to your agent” · in a `typescript` block

4 code lines changed.

````diff
- model: openai("gpt-4.1"),
+ model: openai("gpt-6-luna"),
- model: openai("gpt-4.1"),
+ model: openai("gpt-6-luna"),
````

**High — A2UI · Dynamic Schema**

`/mastra/generative-ui/a2ui/dynamic-schema` · route `/generative-ui/a2ui/dynamic-schema` · under “Dynamic Schema A2UI”

6 code lines, 12 headings, 100 prose lines changed. The number of fenced code blocks changed.

````diff
- > LLM-generated A2UI. A secondary LLM creates both the schema and data from any prompt.
+ > Generate a Mastra dashboard from a client-side A2UI catalog.
- In the dynamic-schema approach, a secondary LLM generates the entire
- UI (schema, data, and layout) based on the conversation context.
- It's the most flexible A2UI flavor; the agent can render any UI for
- any request without pre-defined schemas.
- 
- ## How it works
````

**High — A2UI · Fixed Schema**

`/mastra/generative-ui/a2ui/fixed-schema` · route `/generative-ui/a2ui/fixed-schema` · under “Fixed Schema A2UI” · in a `typescript` block

49 code lines, 2 prose lines changed. The number of fenced code blocks changed.

````diff
+ ```typescript
+ // src/mastra/tools/a2ui-context.ts
+ /**
+ * Server-side read of the A2UI schema context the `@ag-ui/mastra` bridge
+ * forwards onto Mastra's request context.
+ *
+ * The bridge does `requestContext.set("ag-ui", { context })` with
+ * `RunAgentInput.context`, which carries the catalog schema + A2UI generation
````

**High — State Rendering**

`/mastra/generative-ui/state-rendering` · route `/generative-ui/state-rendering` · under “Set up your agent with working memory” · in a `ts` block

2 code lines changed.

````diff
- model: openai("gpt-5.4"),
+ model: openai("gpt-6-luna"),
````

**High — Tool Rendering**

`/mastra/generative-ui/tool-rendering` · route `/generative-ui/tool-rendering` · under “Give your agent a tool to call” · in a `ts` block

2 code lines changed.

````diff
- model: openai("gpt-5.4-mini"),
+ model: openai("gpt-6-luna"),
````

**High — HITL · useInterrupt**

`/mastra/human-in-the-loop/useInterrupt` · route `/human-in-the-loop/useInterrupt` · under “The backend: `interrupt()` inside a tool” · in a `typescript` block

2 code lines changed.

````diff
- model: openai("gpt-5-mini"),
+ model: openai("gpt-6-luna"),
````

**High — Sub-Agents**

`/mastra/multi-agent/subagents` · route `/multi-agent/subagents` · under “Setting up sub-agents”

46 code lines, 1 heading, 13 prose lines changed. The number of fenced code blocks changed.

````diff
- <!-- setup skipped: subagents-setup is not bundled for mastra -->
+ ### Mastra sub-agents setup
+ Save the complete helper below as `src/mastra/tools/working-memory.ts` next to
+ `subagents.ts`. The latter imports `writeDelegationsToWorkingMemory` from that
+ file. The three chat cards render from sub-agent tool calls; the separate
+ delegation log reads `agent.state.delegations` from working memory.
+ 
+ The demo's `subagents.ts` also imports `@/mastra/_header_forwarding` to pass
````

**High — Quickstart** · _local snapshot edit, not an upstream change_

`/mastra/quickstart` · route `/quickstart` · under “Create your Mastra agent” · in a `ts` block

2 code lines, 2 prose lines changed.

````diff
- model: openai("gpt-5.4"),
+ model: openai("gpt-6-luna"),
- This example uses OpenAI's `gpt-5.4`. For Claude, install
+ This example uses OpenAI's `gpt-6-luna`. For Claude, install
````

**High — Reading agent state**

`/mastra/shared-state/in-app-agent-read` · route `/shared-state/in-app-agent-read` · under “Define the Agent State” · in a `ts` block

2 code lines changed.

````diff
- model: openai("gpt-5.4"),
+ model: openai("gpt-6-luna"),
````

**High — Writing agent state**

`/mastra/shared-state/in-app-agent-write` · route `/shared-state/in-app-agent-write` · under “Define the Agent State” · in a `ts` block

2 code lines changed.

````diff
- model: openai("gpt-5.4"),
+ model: openai("gpt-6-luna"),
````

**High — Predictive State Updates**

`/mastra/shared-state/predictive-state-updates` · route `/shared-state/predictive-state-updates` · under “Define the streamed state” · in a `ts` block

2 code lines changed.

````diff
- model: openai("gpt-4o"),
+ model: openai("gpt-6-luna"),
````

**Medium — Slots** · _local snapshot edit, not an upstream change_

`/mastra/custom-look-and-feel/slots` · route `/custom-look-and-feel/slots` · under “`messageView` sub-slots”

1 heading, 10 prose lines changed.

````diff
+ | `workSummary`      | The "Working… / Worked for 9s" line when `toolCallDisplay` is `"turn"`.     |
- | `toolCallsView`    | Tool call visualization.           |
+ | `toolCallsView`    | Tool call visualization. Has its own sub-slot (see below). |
+ 
+ ### `toolCallsView` sub-slots
+ 
+ Available via `messageView={{ assistantMessage: { toolCallsView: { ... } } }}`:
+ 
````

**Low — Copilot Runtime**

`/mastra/copilot-runtime` · route `/copilot-runtime` · under “CopilotKit Intelligence”

4 prose lines changed.

````diff
- Features like [threads](/mastra/threads) and the [inspector](/mastra/inspector) are provided through the runtime and CopilotKit Intelligence. These give you conversation persistence and debugging capabilities out of the box.
+ Features like [threads](/mastra/AG-UI-Streams) and the [inspector](/mastra/inspector) are provided through the runtime and CopilotKit Intelligence. These give you conversation persistence and debugging capabilities out of the box.
- 2. **Many ecosystem features won't work.** The AG-UI protocol supports a middleware layer designed to run on the backend. Many features in the CopilotKit ecosystem depend on this server-side middleware. Without the runtime, these features — including [threads](/mastra/threads) and other capabilities — will not be available.
+ 2. **Many ecosystem features won't work.** The AG-UI protocol supports a middleware layer designed to run on the backend. Many features in the CopilotKit ecosystem depend on this server-side middleware. Without the runtime, these features — including [threads](/mastra/AG-UI-Streams) and other capabilities — will not be available.
````

**Low — Open Generative UI**

`/mastra/generative-ui/open-generative-ui` · route `/generative-ui/open-generative-ui` · under “Minimal setup”

24 prose lines changed.

````diff
- auto-registered by `CopilotKit`, so no extra wiring is needed.
+ auto-registered by `CopilotKit`, so no extra frontend wiring is needed. Your
+ agent must still give the run's frontend tools to its model (see the warning
+ below).
+ 
+ <Callout type="warn" title="Your agent must pass frontend tools to its model">
+ `generateSandboxedUi` reaches the agent as a frontend tool in the run input.
+ The agent calls it only if it gives the run's frontend tools to its model.
````

**Low — Inspector**

`/mastra/inspector` · route `/inspector` · under “Follow and reproduce a run”

2 prose lines changed.

````diff
- [Thread](/mastra/threads) and choose **Try from here**. Inspector copies its
+ [Thread](/mastra/AG-UI-Streams) and choose **Try from here**. Inspector copies its
````

**Info — Threads Drawer**

`/mastra/prebuilt-components/copilot-threads-drawer` · route `/prebuilt-components/copilot-threads-drawer`

Now tracked for the first time.

---

## 2026-10-07

### 04:32 UTC — 7 pages, highest severity none

**Info — A2UI · Dynamic Schema**

`/mastra/generative-ui/a2ui/dynamic-schema` · route `/generative-ui/a2ui/dynamic-schema`

Now tracked for the first time.

**Info — A2UI · Fixed Schema**

`/mastra/generative-ui/a2ui/fixed-schema` · route `/generative-ui/a2ui/fixed-schema`

Now tracked for the first time.

**Info — Open Generative UI**

`/mastra/generative-ui/open-generative-ui` · route `/generative-ui/open-generative-ui`

Now tracked for the first time.

**Info — HITL · Governed Actions**

`/mastra/human-in-the-loop/governed-actions` · route `/human-in-the-loop/governed-actions`

Now tracked for the first time.

**Info — HITL · Headless Interrupts**

`/mastra/human-in-the-loop/headless` · route `/human-in-the-loop/headless`

Now tracked for the first time.

**Info — HITL · useInterrupt**

`/mastra/human-in-the-loop/useInterrupt` · route `/human-in-the-loop/useInterrupt`

Now tracked for the first time.

**Info — Sub-Agents**

`/mastra/multi-agent/subagents` · route `/multi-agent/subagents`

Now tracked for the first time.

---

---

## 2026-10-05

### 06:14 UTC — 9 pages, highest severity high

**High — Agent App Context**

`/mastra/agent-app-context` · route `/agent-app-context` · under “Implementation”

9 code lines, 17 prose lines changed.

````diff
+ 
+ <Callout type="warn" title="Context values arrive as JSON strings">
+ The AG-UI protocol defines a context value as a string. Therefore
+ `useAgentContext` calls `JSON.stringify` on any `value` that is not already a
+ string, and your agent receives the JSON text instead of the object or the
+ array.
+ 
+ Parse the value before you read a field from it. Use `json.loads(item["value"])`
````

**High — Background Tasks**

`/mastra/background-tasks` · route `/background-tasks` · under “Render the activity card in your frontend” · in a `tsx` block

3 code lines changed.

````diff
- agent="background-agents"
+ agent="backgroundAgentsAgent"
+ resourceId: "user-1",
````

**High — Copilot Runtime**

`/mastra/copilot-runtime` · route `/copilot-runtime` · under “Copilot Runtime”

16 code lines, 2 headings, 62 prose lines changed. The number of fenced code blocks changed.

````diff
+ 
+ ## Runtime languages
+ 
+ **TypeScript is the default and most fully featured runtime. It is the only runtime that can run without CopilotKit Intelligence.** Use it for an open-source setup, or connect it to Intelligence when you need its services.
+ 
+ Python, Go, Ruby, and C#/.NET runtimes require an Intelligence project and server-side API key. They work with both [cloud-hosted](/mastra/intelligence/managed-intelligence-platform) and [self-hosted](/mastra/intelligence/self-hosting) Intelligence; they do not provide an in-memory or SQLite runner.
+ 
+ | Language | Host | Without Intelligence |
````

**High — State Rendering**

`/mastra/generative-ui/state-rendering` · route `/generative-ui/state-rendering` · under “Set up your agent with working memory” · in a `ts` block

1 code line changed.

````diff
+ id: "search-agent",
````

**High — Tool Rendering**

`/mastra/generative-ui/tool-rendering` · route `/generative-ui/tool-rendering` · under “Give your agent a tool to call” · in a `ts` block

1 code line changed.

````diff
+ id: "weather-agent",
````

**High — Reading agent state**

`/mastra/shared-state/in-app-agent-read` · route `/shared-state/in-app-agent-read` · under “What is this?” · in a `ts` block

32 code lines, 2 headings, 7 prose lines changed.

````diff
- agents: MastraAgent.getLocalAgents({ mastra }),
+ agents: MastraAgent.getLocalAgents({ mastra, resourceId: "user-1" }),
+ id: "language-agent",
- optionally provide an initial state.
+ initialize missing UI-owned state after the connected agent is ready.
+ import { useEffect } from "react";
- const { agent } = useAgent({
+ const { agent, isReady } = useAgent({
````

**High — Writing agent state**

`/mastra/shared-state/in-app-agent-write` · route `/shared-state/in-app-agent-write` · under “What is this?” · in a `ts` block

16 code lines changed.

````diff
- agents: MastraAgent.getLocalAgents({ mastra }),
+ agents: MastraAgent.getLocalAgents({ mastra, resourceId: "user-1" }),
+ id: "language-agent",
+ import { useEffect } from "react";
- const { agent } = useAgent({
+ const { agent, isReady } = useAgent({
- // optionally provide a type-safe initial state
- initialState: { language: "english" }
````

**High — Predictive State Updates**

`/mastra/shared-state/predictive-state-updates` · route `/shared-state/predictive-state-updates` · under “How it works” · in a `ts` block

5 code lines changed.

````diff
- agents: MastraAgent.getLocalAgents({ mastra }),
+ agents: MastraAgent.getLocalAgents({ mastra, resourceId: "user-1" }),
+ id: "streaming-agent",
- import { useAgent, UseAgentUpdate } from "@copilotkit/react-core"; // [!code highlight]
+ import { useAgent, UseAgentUpdate } from "@copilotkit/react-core/v2"; // [!code highlight]
````

**Low — AG-UI**

`/mastra/ag-ui` · route `/ag-ui` · under “How agents slot into the runtime”

3 prose lines changed.

````diff
+ To write the custom implementation yourself, and keep its own fields through
+ the clone in step 2, see [Write your own AG-UI agent](/mastra/backend/custom-ag-ui-agent).
+ 
````

---

---

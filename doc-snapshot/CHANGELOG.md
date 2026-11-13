# Doc drift changelog

What the CopilotKit docs changed under this repo, written by the sync on
`/doc-sync`. Only pages that actually moved are recorded — a sync that finds
everything unchanged writes nothing here at all.

Holds the 3 most recent dated entries. When a change lands on a fourth
date, the oldest entry is dropped. Entries are counted, not aged, so a gap of
weeks between changes does not expire anything.

## 2026-11-13

### 11:10 UTC — 20 pages, highest severity high

**High — A2UI · Dynamic Schema**

`/mastra/generative-ui/a2ui/dynamic-schema` · route `/generative-ui/a2ui/dynamic-schema` · under “Frontend catalog” · in a `typescript` block

4 code lines changed.

````diff
- ? "text-emerald-600"
+ ? "text-emerald-600 dark:text-emerald-400"
- ? "text-rose-600"
+ ? "text-rose-600 dark:text-rose-400"
````

**High — A2UI · Fixed Schema**

`/mastra/generative-ui/a2ui/fixed-schema` · route `/generative-ui/a2ui/fixed-schema` · under “Implement the React renderers” · in a `typescript` block

16 code lines changed.

````diff
- <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-neutral-500">
+ <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-neutral-500 dark:text-muted-foreground">
- <h3 className="text-base font-semibold leading-none tracking-tight text-neutral-900">
+ <h3 className="text-base font-semibold leading-none tracking-tight text-neutral-900 dark:text-foreground">
- <span className="font-mono text-2xl font-semibold tracking-wider text-neutral-900">
+ <span className="font-mono text-2xl font-semibold tracking-wider text-neutral-900 dark:text-foreground">
- <Separator className="flex-1 bg-neutral-200" />
+ <Separator className="flex-1 bg-neutral-200 dark:bg-border" />
````

**High — HITL · Headless Interrupts**

`/mastra/human-in-the-loop/headless` · route `/human-in-the-loop/headless` · under “The primitives” · in a `typescript` block

4 code lines changed.

````diff
- <div className="grid h-screen grid-cols-[1fr_420px] bg-[#FAFAFC]">
+ <div className="grid h-screen grid-cols-[1fr_420px] bg-[#FAFAFC] dark:bg-background">
- <div className="border-l border-[#DBDBE5] bg-white">
+ <div className="border-l border-[#DBDBE5] bg-white dark:border-border dark:bg-background">
````

**High — Sub-Agents**

`/mastra/multi-agent/subagents` · route `/multi-agent/subagents` · under “Rendering a live delegation log” · in a `typescript` block

30 code lines changed.

````diff
- className="w-full h-full flex flex-col bg-white rounded-2xl shadow-sm border border-[#DBDBE5] overflow-hidden"
+ className="w-full h-full flex flex-col bg-white rounded-2xl shadow-sm border border-[#DBDBE5] overflow-hidden dark:bg-card dark:border-border"
- <div className="flex items-center justify-between px-6 py-3 border-b border-[#E9E9EF] bg-[#FAFAFC]">
+ <div className="flex items-center justify-between px-6 py-3 border-b border-[#E9E9EF] bg-[#FAFAFC] dark:border-border dark:bg-muted">
- <span className="text-lg font-semibold text-[#010507]">
+ <span className="text-lg font-semibold text-[#010507] dark:text-foreground">
- className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-[#BEC2FF] bg-[#BEC2FF1A] text-[#010507] text-[10px] font-semibold uppercase tracking-[0.12em]"
+ className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-[#BEC2FF] bg-[#BEC2FF1A] text-[#010507] text-[10px] font-semibold uppercase tracking-[0.12em] dark:text-foreground"
````

**Info — A2UI**

`/mastra/generative-ui/a2ui` · route `/generative-ui/a2ui`

Now tracked for the first time.

**Info — Components and surfaces**

`/mastra/generative-ui/components` · route `/generative-ui/components`

Now tracked for the first time.

**Info — Catalogs**

`/mastra/generative-ui/components/catalogs` · route `/generative-ui/components/catalogs`

Now tracked for the first time.

**Info — Adopt from A2UI**

`/mastra/generative-ui/components/from-a2ui` · route `/generative-ui/components/from-a2ui`

Now tracked for the first time.

**Info — Markdown mode**

`/mastra/generative-ui/components/markdown-mode` · route `/generative-ui/components/markdown-mode`

Now tracked for the first time.

**Info — Standard catalog**

`/mastra/generative-ui/components/standard-catalog` · route `/generative-ui/components/standard-catalog`

Now tracked for the first time.

**Info — State and actions**

`/mastra/generative-ui/components/state-and-actions` · route `/generative-ui/components/state-and-actions`

Now tracked for the first time.

**Info — Surfaces**

`/mastra/generative-ui/components/surfaces` · route `/generative-ui/components/surfaces`

Now tracked for the first time.

**Info — Theming**

`/mastra/generative-ui/components/theming` · route `/generative-ui/components/theming`

Now tracked for the first time.

**Info — Transports**

`/mastra/generative-ui/components/transports` · route `/generative-ui/components/transports`

Now tracked for the first time.

**Info — Hashbrown**

`/mastra/generative-ui/hashbrown` · route `/generative-ui/hashbrown`

Now tracked for the first time.

**Info — JSON Render**

`/mastra/generative-ui/json-render` · route `/generative-ui/json-render`

Now tracked for the first time.

**Info — MCP Apps**

`/mastra/generative-ui/mcp-apps` · route `/generative-ui/mcp-apps`

Now tracked for the first time.

**Info — Components as Tools**

`/mastra/generative-ui/tool-based` · route `/generative-ui/tool-based`

Now tracked for the first time.

**Info — Headless Threads**

`/mastra/headless-threads` · route `/headless-threads`

Now tracked for the first time.

**Info — WebMCP**

`/mastra/webmcp` · route `/webmcp`

Now tracked for the first time.

---

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

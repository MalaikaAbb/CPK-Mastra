# Doc drift changelog

What the CopilotKit docs changed under this repo, written by the sync on
`/doc-sync`. Only pages that actually moved are recorded — a sync that finds
everything unchanged writes nothing here at all.

Holds the 3 most recent dated entries. When a change lands on a fourth
date, the oldest entry is dropped. Entries are counted, not aged, so a gap of
weeks between changes does not expire anything.

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

## 2026-08-26

### 10:39 UTC — 4 pages, highest severity high

**High — Copilot Runtime**

`/mastra/copilot-runtime` · route `/copilot-runtime` · under “Setting Up the Runtime”

59 code lines, 4 headings, 55 prose lines changed. The number of fenced code blocks changed.

````diff
- The runtime is a lightweight server endpoint that you add to your backend. Here's a minimal example using Next.js:
+ The runtime is a lightweight server endpoint that you add to your backend:
- ```ts title="app/api/copilotkit/route.ts"
+ ```npm
+ npm install @copilotkit/runtime
+ ```
+ 
+ Here's a minimal example using Next.js. `createCopilotRuntimeHandler` returns a
````

**High — Quickstart**

`/mastra/quickstart` · route `/quickstart` · under “Quickstart”

53 code lines, 2 headings, 68 prose lines changed. The number of fenced code blocks changed.

````diff
+ 
- body="Add persistent threads and the inspector with the Enterprise Intelligence Platform."
+ body="Add persistent threads and the inspector with CopilotKit Intelligence."
- <SignupLink surface="docs_mastra_quickstart_step1">Sign up for a free developer account</SignupLink> on our Enterprise Intelligence Platform to get a license key. You'll use it later to enable persistent threads and the inspector.
+ <SignupLink surface="docs_mastra_quickstart_step1">Sign up for a free developer account</SignupLink> for CopilotKit Intelligence to get a license key. You'll use it later to enable persistent threads and the inspector.
- - **Enterprise Intelligence Platform** — persistent threads and the inspector. Choose **Yes** to scaffold a project pre-wired for the platform (the CLI walks you through sign-up, or you can [create an account](https://dashboard.operations.copilotkit.ai/?utm_source=docs&utm_medium=cta&utm_campaign=intelligence&utm_content=docs_cli_prompt) first), or **No** for a standard Mastra setup.
+ - **CopilotKit Intelligence** — persistent threads and the inspector. Choose **Yes** to scaffold a project pre-wired for the platform (the CLI walks you through sign-up, or you can [create an account](https://dashboard.operations.copilotkit.ai/?utm_source=docs&utm_medium=cta&utm_campaign=intelligence&utm_content=docs_cli_prompt) first), or **No** for a standard Mastra setup.
+ ### Start your agent
````

**Low — AG-UI**

`/mastra/ag-ui` · route `/ag-ui` · under “The proxy pattern”

2 prose lines changed.

````diff
- routing, and CopilotKit Enterprise Intelligence without changing how the
+ routing, and CopilotKit Intelligence without changing how the
````

**Low — Inspector**

`/mastra/inspector` · route `/inspector` · under “What it shows”

21 prose lines changed.

````diff
- The CopilotKit Inspector is a built-in debugging tool that overlays on your app, giving you full visibility into what's happening between your frontend and your agents in real time.
+ The CopilotKit Inspector is a built-in debugging tool that overlays on your app.
+ The first open lands on **Home**. Later opens return to the last pane you used.
+ | **Home** | Project, runtime, services, and CopilotKit news. |
+ | **Memory** | Inspect long-term memory when Intelligence exposes it. |
- The primary navigation groups the Inspector into **Threads**, **Agents**, and
- **Learning**. Threads is the default. Open a real Thread to inspect its
+ The sidebar has three groups: **Home**, **Workbench** (Threads, Memory), and
````

---

---

## 2026-08-17

### 13:44 UTC — 2 pages, highest severity high

**High — Copilot Runtime** · _local snapshot edit, not an upstream change_

`/mastra/copilot-runtime` · route `/copilot-runtime` · under “Setting Up the Runtime” · in a `ts` block

6 code lines changed.

````diff
- 
+ const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
+ runtime,
+ serviceAdapter,
+ endpoint: "/api/copilotkit",
+ });
````

**Low — Inspector** · _local snapshot edit, not an upstream change_

`/mastra/inspector` · route `/inspector` · under “Navigation and Threads”

3 prose lines changed.

````diff
+ When Threads has no real rows, or when Threads is locked, the Inspector keeps
+ the overview video, three local example threads, their detail tabs, and the
+ guided tour. The examples do not send real Thread requests. With reduced motion
````

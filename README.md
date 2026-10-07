# CopilotKit + Mastra Test Suite

A navigable, working test harness for the CopilotKit Mastra integration — each doc page is a route that actually runs the thing it describes.

| | |
|---|---|
| **Doc sync date** | Machine-maintained — `doc-snapshot/manifest.json` → `syncedAt`, rewritten on every sync |
| **CopilotKit packages** | `@copilotkit/react-core` 1.77.0 · `@copilotkit/runtime` 1.77.0 · `@copilotkit/a2ui-renderer` 1.77.0 |
| **AG-UI packages** | `@ag-ui/mastra` 1.1.2 · `@ag-ui/client` 1.0.1 |
| **Mastra packages** | `@mastra/core` 1.74.0 · `@mastra/memory` 1.28.2 · `@mastra/libsql` 1.22.3 |
| **AI SDK** | `ai` 7.0.128 (direct — see discrepancy 17) · `@ai-sdk/openai` 4.0.57 |
| **zod** | 3.25.76, pinned exactly to match `@copilotkit/a2ui-renderer` (discrepancy 16) |
| **Frontend** | Next.js 16.3.0 (App Router) · React 19.2 · TypeScript · Tailwind 4 |
| **Build status** | No CI. Typecheck (2026-10-07, ~15 s): every route added in the 2026-10-06 round is clean with no suppressions; 6 errors remain from the 1.77 bump, in `slots/demo-chat`, `providers.tsx` (`event.code`) and `agents.ts`. The new routes have not been run against a live model. |

---

## 2. Overview

[Mastra](https://mastra.ai) is a TypeScript agent framework with native AG-UI support, which is what lets a React app drive it with streaming, tool calls, shared state, and generative UI.

This repo covers a **scoped set of 26 doc pages** (§8). Each route implements what its page teaches and shows the exact source that makes it work.

**Everything comes from the documentation** — the doc pages and, where a page has one, its demo **Code** tab. Where a page imports code it never publishes, the route says so in a warning panel and §9 records it. A handful of pieces are harness-written and labelled as such in the file and on the route (the two `a2ui-context` helpers, two A2UI runtime routes, the two minimal A2UI agents); everything else that is missing is left missing, and those routes are marked Partial or Broken rather than filled in.

Tracks: **<https://docs.copilotkit.ai/mastra>**

---

## 3. Architecture

```
Browser (React 19)
  │  @copilotkit/react-core/v2 — CopilotKitProvider, CopilotChat, hooks
  │  POST /api/copilotkit
  ▼
Next.js 16 App Router  ·  localhost:3000
  │  Copilot Runtime  (@copilotkit/runtime)
  │  agents: MastraAgent.getLocalAgents({ mastra, resourceId, untilIdle })
  ▼
Mastra  —  in the same process
  │  src/mastra/index.ts → 13 agents; the original 7 keep in-memory LibSQL,
  │  the 4 newer doc agents use the doc's file-backed WORKING_MEMORY_DB_URL
  ▼
OpenAI  (gpt-4o by default)
```

Three pages need a runtime configured differently from the main one, and their published demos call dedicated endpoints, so those exist alongside `/api/copilotkit` (all `@copilotkit/runtime/v2` + `createCopilotRuntimeHandler`, single-route):

| Endpoint | Config | Used by |
|---|---|---|
| `/api/copilotkit-ogui` | `openGenerativeUI: { agents: [...] }` | Open Generative UI (published) |
| `/api/copilotkit-a2ui-fixed-schema` | `a2ui: { injectA2UITool: false }` | A2UI Fixed Schema (harness glue — the page's runtime snippet) |
| `/api/copilotkit-declarative-gen-ui` | no `a2ui` block (auto-inject) | A2UI Dynamic Schema (harness glue) |

The demo pages for those routes, and for Sub-Agents, mount their own `<CopilotKit>` as published. Exactly one Inspector may exist per page (two lit instances loop and can take the machine down), so `src/lib/inspector.ts` makes the root provider stand down on those routes.

**There is no separate agent server.** Mastra is TypeScript, and the Quickstart's bring-your-own path imports the Mastra instance directly into the runtime route via `getLocalAgents` — so agents run inside the Next app. One command, one port, and no `backend/` directory.

That is required rather than merely convenient: the Shared State pages state that reading working memory does **not** work against a remote Mastra agent, and four routes here depend on working memory.

### The agents

| Agent id | Tools / state | Used by |
|---|---|---|
| `myAgent` | — | Quickstart, Prebuilt Components, Slots, Headless UI, Programmatic Control, Inspector, Display-only, Frontend Tools, HITL, AG-UI |
| `weatherAgent` | `weatherInfo` | Tool Rendering |
| `languageAgent` | working memory: `language` | Shared State read + write |
| `streamingAgent` | working memory: `document` | Predictive State Updates |
| `searchAgent` | `addSearch` · working memory: `searches` | State Rendering |
| `colleaguesContactAgent` | reads `ag-ui` request context | Readables |
| `backgroundAgentsAgent` | `run_deep_research` (background) | Background Tasks |
| `subagents` (`subagentsSupervisorAgent`) | `research_agent` · `writing_agent` · `critique_agent` (each wraps its own sub-agent) · working memory: `delegations` | Sub-Agents |
| `openGenUiAgent` / `openGenUiAdvancedAgent` | none — prompt folds `ag-ui` context in | Open Generative UI (via `/api/copilotkit-ogui`) |
| `declarativeGenUiAgent` | none — runtime auto-injects `generate_a2ui` | A2UI Dynamic Schema |
| `a2uiFixedSchemaAgent` | `generate_a2ui` | A2UI Fixed Schema |

Several rather than one because working memory takes a **single Zod schema per agent**, and the docs define several different ones. The newer agents use the model ids their pages hard-code (`gpt-5-mini`), **not** `OPENAI_MODEL`. Agent ids come from the keys in the Mastra instance's `agents: { … }` object, not from each agent's `name` — that is what routes pass as `agentId`.

---

## 4. Prerequisites

| Requirement | Version | Notes |
|---|---|---|
| Node.js | 20+ | Next.js 16 requires 20+. |
| npm | 10+ | Or pnpm/yarn/bun. |
| OpenAI API key | — | Required. Needs access to `gpt-5-mini` for the Open Gen UI, A2UI, and Sub-Agents routes. |

No Python, no second runtime, no separate agent process.

---

## 5. Setup

```bash
git clone <this-repo> mastra && cd mastra
cd frontend && npm install
cp ../.env.example .env.local
```

Then edit `frontend/.env.local`:

| Variable | What it does |
|---|---|
| `OPENAI_API_KEY` | **Required.** Read server-side by the Mastra agents; never exposed to the browser. |
| `OPENAI_MODEL` | Model for the original seven agents. Defaults to `gpt-4o`. The Open Gen UI, A2UI, and Sub-Agents agents use the published `gpt-5-mini` literal regardless. |
| `MASTRA_WORKING_MEMORY_URL` | Optional. Storage for the newer doc agents' memory; defaults to `file:./mastra-memory.db` (in `frontend/`, gitignored). |
| `NEXT_PUBLIC_COPILOTKIT_LICENSE_KEY` | Optional; no route here needs it. |

**Default port:** **3000** — the only one.

---

## 6. Running the project

One process, one terminal.

```bash
cd frontend
npm run dev
```

Success looks like:

```
▲ Next.js 16.3.0
- Local:   http://localhost:3000
✓ Ready in 1.2s
```

Open **<http://localhost:3000>**. If chats fail, the usual cause is a missing `OPENAI_API_KEY` — Next reads `.env.local` at startup, so restart after setting it.

---

## 7. What to expect — walkthrough per section

### How each route is split

| | |
|---|---|
| **`<route>`** | Notes, pass/fail criteria, and **the exact source**, read off disk at render time. No live chat. |
| **`<route>/demo-chat`** | Just the running feature, no chrome — built for screen recording. Reached via **Open demo ↗**, which always opens a new tab. |

Code on a page is never a re-typed approximation: each page reads real files via `src/lib/source.ts` and syntax-highlights them with Shiki at build time. Excerpts use `#region` markers, which stay visible in the source and are labelled with line numbers.

### Getting Started

**`/`** — Orientation and the agent roster.

**`/quickstart`** — Mastra instance bound with `getLocalAgents`. **Try:** `What tools do you have access to?` **Pass:** tokens stream. **Fail:** an error banner — check `OPENAI_API_KEY`.

### Basics

**`/prebuilt-components`** — `CopilotChat`, `CopilotSidebar`, `CopilotPopup` in tabs. **Pass:** all three drive the same agent and the conversation survives tab switches.

### Custom Look and Feel

**`/custom-look-and-feel/slots`** *(live but absent from the doc sidebar)* — Three override levels. **Pass:** level 1 tints the message area, level 2 auto-focuses the input, level 3 shows a custom header, layout, and cursor.

**`/custom-look-and-feel/headless-ui`** *(live but absent from the sidebar)* — A chat with zero CopilotKit chrome. **Pass:** messages stream into hand-written bubbles.

**`/programmatic-control`** — Drives the agent with no chat component. **Pass:** status flips to Running, the transcript grows, Stop halts it.

**`/inspector`** — The debugging overlay, mounted by the provider. **Pass:** the event list fills and Available Agents lists all seven.

### Generative UI

**`/generative-ui/your-components/display-only`** — `useComponent`. **Try:** `Show the weather card for Tokyo: 77 degrees, clear`. **Pass:** a card renders inline.

**`/generative-ui/your-components/interactive`** — `useHumanInTheLoop` approval gate. **Try:** `Run the command rm -rf /tmp/cache`. **Pass:** an approval card renders with the command in a code block and **nothing further streams** until you click Approve or Deny; the agent's next message reflects your choice. **Fail:** plain text with no buttons, or it continues without waiting. Distinct from Human in the Loop below — that one asks you to *choose* between two values, this one asks you to *authorise* an action.

**`/generative-ui/tool-rendering`** — Named renderer for `weatherInfo` plus a wildcard. **Try:** `What's the weather in Tokyo?` **Pass:** "Calling weather API..." becomes "Called the weather API for Tokyo."

**`/generative-ui/state-rendering`** — `searches` working memory. **Try:** `Add a search for the tallest mountains`, then another. **Pass:** items accumulate in the left pane.

**`/generative-ui/a2ui/dynamic-schema`** ⚠️ — A component catalog on the provider; the runtime injects `generate_a2ui` and a second model call designs the whole surface. **Try:** `Show me my sales dashboard for this quarter.` **Pass:** a progress indicator, then a surface built from Metric / DataTable / Pie or Bar chart inside Cards. **Fail:** plain text, an empty surface, or raw operations JSON.

**`/generative-ui/a2ui/fixed-schema`** ⚠️ — A fixed flight-card catalog; the agent's own `generate_a2ui` returns the operations container, runtime injection off. **Try:** `Find me a flight from SFO to JFK on United for $289.` **Pass:** a card with SFO → JFK, a United badge, $289 and a Book button that flips to "Booked". **Fail:** no card; React error #31 (`object with keys {path}`) means a binding reached a renderer unresolved (discrepancy 16); `UnsupportedModelVersionError` means `ai` resolved to v6 (discrepancy 17).

**`/generative-ui/open-generative-ui`** ⚠️ — The agent writes HTML/CSS/JS into a sandboxed iframe. **Try (minimal):** `Quicksort visualization`. **Pass:** placeholder lines, then an animated, labelled visualisation builds up in an iframe. **Try (advanced, second demo link on the page):** `Calculator (calls evaluateExpression)`. **Pass:** pressing = shows the host-computed result and the browser console logs `[open-gen-ui/advanced] evaluateExpression`. **Fail:** text only, a blank iframe, or buttons that do nothing.

### App Control

**`/frontend-tools`** — `sayHello` executing in the browser. **Try:** `Say hello to Malaika`. **Pass:** a browser alert appears, then the agent confirms.

**`/human-in-the-loop/tool-based`** — `offerOptions`. **Try:** `Can you show me two good options for a restaurant name?` **Pass:** two buttons render and **nothing further streams** until you click one.

**`/human-in-the-loop/useInterrupt`** ❌ *reference-only* — No live demo: the backend `suspend()` tool is never published (discrepancy 13). **Pass:** the page shows the published agent, demo page, time-picker card and snippets, with the gap panel above them.

**`/human-in-the-loop/headless`** ❌ *reference-only* — Same unpublished backend, plus snippets that use an undefined `useHeadlessInterrupt` and `SLOTS` (discrepancy 14). **Pass:** as above.

**`/human-in-the-loop/governed-actions`** ⚠️ — The page's `useHumanInTheLoop` variant, live on `myAgent`; the `useInterrupt` variant is reference-only (discrepancy 15). **Try:** `Email the Q3 report to finance@example.com, but get my approval first.` **Pass:** if the model sends verdict `require_approval`, a card with summary, tool, reference, JSON arguments and Approve / Reject appears and the run waits; with `allow`/`deny` the card resolves itself. **Fail:** the agent answers in text without calling `approve_governed_action` — nothing in `myAgent`'s prompt steers it there, so this is model-dependent.

**`/background-tasks`** — A background tool surfaced as AG-UI activity events. **Try:** `Research the history of the Dutch East India Company`. **Pass:** a short reply plus an activity card that shows "Working…" with a stage line that advances (`Gathering sources (1/4)` → … → `Writing the summary (4/4)`) over roughly six seconds, then flips to `Completed` on its own, with no further input from you. **Fail:** the card stays on "Working…" — open the Inspector and look for an `ACTIVITY_DELTA` after the `ACTIVITY_SNAPSHOT`; if there is none, the agent lost its `memory` and `untilIdle` is inert (discrepancy 7).

### Shared State

**`/shared-state/in-app-agent-read`** — Reading working memory. **Try:** `Switch to Spanish`. **Pass:** the Language line updates and the agent starts replying in Spanish.

**`/shared-state/in-app-agent-write`** — `agent.setState`. **Try:** press Toggle Language, then `tell me a joke`. **Pass:** the reply comes back in the new language — the toggle changed behaviour, not just the panel.

**`/shared-state/predictive-state-updates`** — A document streamed into working memory. **Try:** `Write a short blog post about otters`. **Pass:** the left pane fills progressively with a LIVE badge, and the document never appears as a chat message.

**`/agent-app-context`** — `useAgentContext` read back through `requestContext`. **Try:** `Who are my colleagues?` **Pass:** the agent answers from the list on the left.

### Multi-Agent

**`/multi-agent/subagents`** ⚠️ — A supervisor whose tools are research / writing / critique sub-agents. **Try:** `Produce a short blog post about the benefits of cold exposure training. Research first, then write, then critique.` **Pass (as published):** in the Inspector, `TOOL_CALL_START` for `researchAgentTool` → `writingAgentTool` → `critiqueAgentTool`, each followed by a `TOOL_CALL_RESULT` with the sub-agent's text, then a chat summary. **No cards, no banner and an empty delegation log are expected** — the renderers listen for different tool names (discrepancy 18) and the log's writer is unpublished. **Fail:** no tool calls at all, or a result containing `[sub-agent error] …`.

### Backend

**`/copilot-runtime`** — Routing across all seven agents, and the local-vs-remote tradeoff. **Pass:** all seven stream, each with its own conversation.

**`/ag-ui`** — Live AG-UI event capture. **Try:** `Hello`. **Pass:** `RUN_STARTED` → `TEXT_MESSAGE_CONTENT` burst → `RUN_FINISHED`.

**`/status`** — Every route in one table.

---

## 8. Testing checklist / current status

| Doc page | Route | Status | Notes |
|---|---|---|---|
| `/mastra` | `/` | 📖 Reference | Orientation + agent roster. |
| `/mastra/quickstart?agent=bring-your-own` | `/quickstart` | ✅ Working | |
| `/mastra/prebuilt-components` | `/prebuilt-components` | ✅ Working | Doc page is a 145-byte component stub. |
| `/mastra/custom-look-and-feel/slots` | `/custom-look-and-feel/slots` | ✅ Working | **Not in the doc sidebar**; resolves. |
| `/mastra/custom-look-and-feel/headless-ui` | `/custom-look-and-feel/headless-ui` | ✅ Working | **Not in the doc sidebar**; resolves. |
| `/mastra/programmatic-control` | `/programmatic-control` | ✅ Working | |
| `/mastra/inspector` | `/inspector` | ✅ Working | Dev-only by design. |
| `/mastra/generative-ui/your-components/display-only` | `/generative-ui/your-components/display-only` | ✅ Working | Needs no Mastra-side declaration. |
| `/mastra/generative-ui/your-components/interactive` | `/generative-ui/your-components/interactive` | ✅ Working | `useHumanInTheLoop` approval gate. Code is in the rendered page, not the raw markdown. |
| `/mastra/generative-ui/tool-rendering` | `/generative-ui/tool-rendering` | ✅ Working | |
| `/mastra/generative-ui/state-rendering` | `/generative-ui/state-rendering` | ✅ Working | |
| `/mastra/frontend-tools` | `/frontend-tools` | ✅ Working | |
| `/mastra/shared-state/in-app-agent-read` | `/shared-state/in-app-agent-read` | ✅ Working | |
| `/mastra/shared-state/in-app-agent-write` | `/shared-state/in-app-agent-write` | ✅ Working | |
| `/mastra/shared-state/predictive-state-updates` | `/shared-state/predictive-state-updates` | ✅ Working | Re-checked 2026-10-06: page unchanged since snapshot. |
| `/mastra/agent-app-context` | `/agent-app-context` | ✅ Working | |
| `/mastra/human-in-the-loop/tool-based` | `/human-in-the-loop/tool-based` | ✅ Working | Re-checked 2026-10-06: page unchanged since snapshot. |
| `/mastra/human-in-the-loop/useInterrupt` | `/human-in-the-loop/useInterrupt` | ❌ Broken | Reference-only: the `suspend()` tool is unpublished (13). |
| `/mastra/human-in-the-loop/headless` | `/human-in-the-loop/headless` | ❌ Broken | Reference-only: same backend gap, plus undefined symbols in snippets (14). |
| `/mastra/human-in-the-loop/governed-actions` | `/human-in-the-loop/governed-actions` | ⚠️ Partial | HITL variant live; interrupt variant reference-only (15). Not yet run against a live model. |
| `/mastra/generative-ui/a2ui/dynamic-schema` | `/generative-ui/a2ui/dynamic-schema` | ⚠️ Partial | Harness-supplied runtime route; needs root zod pinned to 3.25.76 (16). Not yet run against a live model. |
| `/mastra/generative-ui/a2ui/fixed-schema` | `/generative-ui/a2ui/fixed-schema` | ⚠️ Partial | Harness-written `a2ui-context` helpers + runtime route; root zod pinned to 3.25.76 (16); needs `ai` 7 (17). Not yet run against a live model. |
| `/mastra/generative-ui/open-generative-ui` | `/generative-ui/open-generative-ui` | ⚠️ Partial | Published code minus the aimock header wrapper. Not yet run against a live model. |
| `/mastra/generative-ui/mcp-apps` | — | 🚧 Not started | Skipped by decision (2026-10-06). The page shows only a BuiltInAgent + local ext-apps server, no Mastra code. |
| `/mastra/multi-agent/subagents` | `/multi-agent/subagents` | ⚠️ Partial | Delegation runs, but no UI shows it: tool-name mismatch hides cards/banner, and the log's writer is unpublished (18). Not yet run against a live model. |
| `/mastra/background-tasks` | `/background-tasks` | ✅ Working | |
| `/mastra/copilot-runtime` | `/copilot-runtime` | ✅ Working | |
| `/mastra/ag-ui` | `/ag-ui` | ✅ Working | |

**Legend:** ✅ Working · ⚠️ Partial · 📖 Reference · 🚧 Not started · ❌ Broken

> **Caveat on "Working":** every route typechecks, lints, and renders, and the dev server boots with all seven agents registered. Individual agent *behaviours* — particularly Background Tasks and Predictive State Updates, which depend on Mastra internals — have not each been driven end-to-end against a live model.

---

## 9. Known issues / doc-vs-implementation discrepancies

Found against `@mastra/core` 1.56.0, `@ag-ui/mastra` 1.1.1, and `@copilotkit/react-core` 1.66.2.

**1. `new Agent(...)` requires an `id`**
The Quickstart, Tool Rendering, and Shared State pages all construct agents with only `{ name, instructions, model }`. `AgentConfig` requires `id` — omitting it is a type error. Every agent here has one.

**2. `getLocalAgents` requires a `resourceId`**
Every page shows `MastraAgent.getLocalAgents({ mastra })`. `GetLocalAgentsOptions` requires `resourceId`, which scopes working memory. A real app would pass the signed-in user's id.

**3. `useAgent` has no `initialState`**
Both Shared State pages seed with `useAgent({ agentId, initialState })`. `UseAgentProps` has no such field. The read page also passes a `render` function to `useAgent`, likewise absent from the shipped type.

**4. `useRenderTool` sample does not compile**
Tool Rendering writes `render: ({ status, args })` with no `parameters` schema. The shipped named overload requires the schema and names the prop `parameters`.

**5. `requestContext.get()` is typed `{}`**
The Readables page reads `requestContext.get('ag-ui')?.context`. That property does not exist on the return type, and the `.find()` callback below it has an implicit `any`. This repo names the shape explicitly.

**6. `useRenderActivityMessage` does not take a renderer**
The Background Tasks page implies a page-level registration. The shipped hook takes **no arguments** — it is a consumer that returns `renderActivityMessage`/`findRenderer`. Renderers register on the provider via `renderActivityMessages`, which is where this repo puts it.

**7. `untilIdle` is not mentioned on the Background Tasks page — and it silently no-ops without agent `memory`**
Enabling `background` on the tool and `backgroundTasks` on the instance is not sufficient for the frontend to see progress — `getLocalAgents` also needs `untilIdle`, which is documented only on `GetLocalAgentsOptions`.

`untilIdle` is the switch that matters, because it is the only thing that subscribes to Mastra's background task manager stream. Everything except `background-task-started` is emitted there, so without it the frontend receives exactly one activity event and never hears about the task again; the run also ends after the first turn, so the model never reacts to the result and the bridge's tool-result suppression is bypassed. The tool's `background` flag decides *where* work runs and the instance's `storage` decides whether it *persists* — neither makes it observable, and `observationalMemory` is an unrelated subsystem, not a substitute. See [`docs/background-tasks-stuck-on-working.md` §1.4](docs/background-tasks-stuck-on-working.md#14-why-untilidle-is-the-switch-that-matters).

`untilIdle` in turn does nothing unless the agent configures its own `memory`. Mastra's idle loop opens with `if (!deps.bgManager || !scope) return <plain single turn>`, and `scope` is null whenever `await agent.getMemory()` is falsy. The instance-level `storage` the page does show does not satisfy it: `Agent#getMemory()` resolves only the agent's own `memory` (the inherited-memory path is wired for sub-agents only). The doc's `backgroundAgentsAgent` has no `memory`, so as published the run never subscribes to the background task manager's event stream: no `background-task-running`/`-completed` chunk reaches AG-UI, no `ACTIVITY_DELTA` is ever emitted, and the activity card sits on its single `status: "running"` snapshot forever while the run finishes normally. The completion still arrives — as a bare `TOOL_CALL_RESULT`, because `@ag-ui/mastra` suppresses only the *first* tool result for a background call (the `Background task started. Task ID: …` placeholder) and drops its toolCallId→taskId mapping in the process.

This repo's `backgroundAgentsAgent` therefore carries a `Memory` the doc's version does not. It is the only deliberate deviation from published agent code in this repo. Full write-up, including how it was traced and how to verify the fix: [`docs/background-tasks-stuck-on-working.md`](docs/background-tasks-stuck-on-working.md).

**7b. The Background Tasks page elides the tool body**
`runDeepResearchTool` is published as `execute: async ({ topic }) => { /* ... */ }`, so the work itself is unspecified. A body that returns immediately makes the route untestable — the card is already `completed` on its first paint and no intermediate state is ever observable. This repo's tool runs four ~1.4s stages and reports each through the tool-execution context's `writer` (a `ToolStream`), which Mastra turns into `task.output` → `background-task-output` → an ACTIVITY_DELTA appending to the activity message's `outputs`. Runtime is kept short because the *model* chooses the timeout: Mastra injects a `_background` override into every background-eligible tool's schema, and `resolveBackgroundConfig` ranks the LLM's `timeoutMs` above the tool's and above the manager default of 300 000 ms. In the run that exposed this bug, gpt-4o sent `timeoutMs: 10000` unprompted.

**8. `UseAgentUpdate` imported from the v1 entrypoint**
Predictive State Updates imports it from `@copilotkit/react-core` while importing everything else from `/v2`. Both live in `/v2`.

**9. Four different model ids**
Across these pages the docs specify `gpt-5.4`, `gpt-5.4-mini`, `gpt-4o`, and `gpt-4.1` — and the Quickstart's callout says GPT-4o while its code says otherwise. All agents here read one `OPENAI_MODEL`, defaulting to `gpt-4o`.

**10. `useHumanInTheLoop` does not infer its arg type**
Unlike `useRenderTool`, it defaults to `Record<string, unknown>`, so the HITL page's `args.option_1` is `unknown` and unusable in JSX. The generic is supplied explicitly.

**11. Some pages' `.md` is a stub while the rendered page has the code**
`generative-ui/your-components/interactive.md` is 152 bytes — a bare `<Interactive components={…} />` placeholder. The **rendered** page carries a full `useHumanInTheLoop` sample. Anything reading the markdown (including the `.md` suffix trick this repo used for Step 0) will conclude the page is empty. Worth fetching the rendered HTML for any page whose markdown looks like a component stub. The same is true of `prebuilt-components.md` (145 bytes).

**12. `@copilotkit/react-ui` in the install line**
The Quickstart installs it; it is the v1 package and nothing on that page uses it. Not a dependency here.

*Items 13–19 were found 2026-10-06 against `@copilotkit/*` 1.77.0, `@ag-ui/mastra` 1.1.2, `@mastra/core` 1.74.0, zod 4.5.4. Full inventory of unrunnable published code: [`docs-verbatim/README.md`](docs-verbatim/README.md).*

**13. useInterrupt: the tool that pauses is never published** — [page](https://docs.copilotkit.ai/mastra/human-in-the-loop/useInterrupt)
The demo's `interruptAgent` gets `schedule_meeting: scheduleMeetingInterruptTool` from `@/mastra/tools`, which re-exports it from `./interrupt`. That module is on neither the page nor its Code tab, and it is the only code that calls `suspend()`. The demo page also imports `generateFallbackSlots` from an unpublished `../_shared/interrupt-fallback-slots`, and the `enabled` / `handler` snippets render undefined `AskCard`, `ApproveCard`, `RequestAccessCard` and call an undefined `lookupUserDepartment`. Route is reference-only. When it is buildable, note that `@ag-ui/mastra` 1.1.2 emits the suspend *both* as the legacy `on_interrupt` custom event (`event.value`, JSON-stringified `mastra_suspend` wrapper — what the published render reads) *and* as a standard `RUN_FINISHED` interrupt with the payload at `interrupt.metadata.mastra.suspendPayload`.

**14. Headless interrupts: snippets reference symbols that do not exist** — [page](https://docs.copilotkit.ai/mastra/human-in-the-loop/headless)
Same unpublished backend as 13. In addition, `HeadlessInterruptPanelRaw` calls `useHeadlessInterrupt`, "defined above", but it is defined nowhere on the page; both plain-UI panels map over an undefined `SLOTS`. Route is reference-only.

**15. Governed actions: interrupt variant reads a channel the Mastra bridge does not fill** — [page](https://docs.copilotkit.ai/mastra/human-in-the-loop/governed-actions)
No agent, backend or demo is published. The `useInterrupt` variant reads `interrupt?.metadata?.action`; `@ag-ui/mastra` puts a suspend payload at `metadata.mastra.suspendPayload`, so even with a suspending backend the card would render `null` unless the tool suspended *into* that shape — and no such tool is shown. `handleApproval` calls `executeSideEffect`, never defined. The `useHumanInTheLoop` variant is self-contained and is live here on `myAgent`, whose prompt says nothing about approvals, so whether the model calls the tool is up to it. `z.record(z.unknown())` there needs a `@ts-expect-error` (see 19).

**16. A2UI definitions use zod 4; the A2UI renderer only understands zod 3** — [dynamic](https://docs.copilotkit.ai/mastra/generative-ui/a2ui/dynamic-schema) · [fixed](https://docs.copilotkit.ai/mastra/generative-ui/a2ui/fixed-schema)
Both pages' `definitions.ts` import `z` from `"zod"`, and the page's install line is `npm install @copilotkit/a2ui-renderer zod`, which today gives zod 4. `@copilotkit/a2ui-renderer` 1.77.0 is built on zod `^3.25`: it serialises catalogs with `zod-to-json-schema` 3, and its binder (`@a2ui/web_core` `generic-binder.js`) classifies each prop by `_def.typeName`. Measured here with zod 4.5.4:
- every custom component serialises to just `{"$schema": …}`, so the model is told nothing about its props;
- `_def.typeName` is `undefined` on every schema, so no prop is recognised as a binding or an action. Literal values still pass through, but `{ path }` bindings reach the renderer raw (React #31, the failure the fixed-schema page warns about), and the Button's `{ event }` action is never turned into a callable, so **Book flight does nothing**.

`import { z } from "zod/v3"` fixes the runtime but not the types, because zod 4's bundled v3 and the renderer's own zod 3.25.76 are separate copies. That needed ~20 `@ts-expect-error`s and stretched `tsc` to about 12 minutes. **Current fix (2026-10-07):** the root `zod` is pinned to exactly `3.25.76`, the same copy the renderer uses, so both `definitions.ts` files keep the published `from "zod"` import byte-for-byte and need no suppressions. Every other package accepts zod 3; `@mastra/memory` (which depends on `^4.4.3`) gets its own nested zod 4.

**17. A2UI fixed-schema: `generateText` from `ai` 6 rejects `@ai-sdk/openai` 4 models** — [page](https://docs.copilotkit.ai/mastra/generative-ui/a2ui/fixed-schema)
The published tool calls `generateText({ model: openai("gpt-5-mini") })`. `@ai-sdk/openai` 4.x returns a `specificationVersion: "v4"` model; `ai` 6 (what resolved transitively before) accepts only v2/v3 and throws `UnsupportedModelVersionError`. `ai@^7` is now a direct dependency. Dynamic schema is unaffected — its auto-injected tool runs through a Mastra `Agent`, which handles v4 models.

Also on these pages: the dynamic-schema demo file's header says its route sets `injectA2UITool: false` with a backend-owned tool, contradicting the page prose (catalog → auto-inject, "no `a2ui` block"); this repo follows the prose. The fixed-schema tool's fallback `catalogId` is `copilotkit://app-dashboard-catalog` while the page's catalog is `copilotkit://flight-fixed-catalog`. Both A2UI demo pages point at runtime routes (`/api/copilotkit-a2ui-fixed-schema`, `/api/copilotkit-declarative-gen-ui`) that are not published, and the main published route maps both aliases to a `weatherAgent` whose tools use the unpublished `@copilotkit/showcase-shared-tools`; this repo supplies the two routes and two minimal agents. The `a2ui-generate` tool's `./a2ui-context` import (`readForwardedA2uiContext`, `systemPromptFrom`) is unpublished and was written here — it reads the same `ag-ui` request-context key and uses the same `### description\nvalue` format as the published `foldHostContext`.

**18. Sub-Agents: tool names never match the renderers, and the log's writer is never published** — [page](https://docs.copilotkit.ai/mastra/multi-agent/subagents)
*Names.* The supervisor registers `tools: { researchAgentTool, writingAgentTool, critiqueAgentTool }`. Mastra (`@mastra/core` 1.74, `Agent#listAssignedTools` → `makeCoreTool(tool, { name: k })`) exposes each tool to the model under its **object key**, not its `createTool({ id })`, so the model calls `researchAgentTool` etc. The page's three `useRenderTool({ name: "research_agent" | "writing_agent" | "critique_agent" })` and `inferActiveSubAgent`'s name set never match: no in-chat cards and no banner. The supervisor prompt also tells the model to call `research_agent`, a name that is not registered. Kept as published.

*Log.* All three tools call `writeDelegationsToWorkingMemory` from `./working-memory`, which is not on the page or its Code tab. The import and calls are commented out (not reimplemented), so `state.delegations` is never written and the log stays empty; the in-chat cards are unaffected. Separately, `delegation-log.tsx` types `status` as `"completed"` only, though the tools emit `"failed"` and the schema allows `"running"`, and every status renders in the same green.

**19. Published code shared across these pages**
- *Showcase plumbing.* `@/mastra/_header_forwarding` (aimock header forwarding) is imported by the OGUI route, `a2ui-generate.ts` and `subagents.ts` and never published. The fixed-schema page's own comment names `import { openai } from "@ai-sdk/openai"` as the real-app equivalent, which is what these files use; the OGUI route's `withForwardedHeaders` wrapper is removed with its handler body unchanged.
- *zod typing.* `z.record(valueSchema)` with one argument is a type error under zod 4. With root zod pinned to 3.25.76 (item 16) it is valid again, so `a2ui-generate.ts` and the governed-actions demo carry it unchanged and unsuppressed.
- *Model ids.* These pages hard-code `openai("gpt-5-mini")`; kept as published, so they ignore `OPENAI_MODEL`.
- *Storage.* The published agents use `WORKING_MEMORY_DB_URL` (`file:./mastra-memory.db` unless `MASTRA_WORKING_MEMORY_URL` is set) rather than the in-memory store the older pages use.

---

## 10. Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| Every chat errors immediately | No `OPENAI_API_KEY` | Set it in `frontend/.env.local` and restart — Next reads env at startup. |
| Tool runs but custom UI never renders | Renderer name ≠ tool `id` | `useRenderTool({ name })` must equal the Mastra tool's `id` exactly. |
| Working-memory panel stays empty | Reading state from a remote agent | Working memory only works with `getLocalAgents`. |
| State resets on restart | In-memory LibSQL | `url: ":memory:"` is the doc's config. Point it at a file or database to persist. |
| No activity card on Background Tasks | Missing one of three switches | Tool needs `background`, instance needs `backgroundTasks` + `storage`, runtime needs `untilIdle`. |
| Activity card appears but never leaves "Working…" | Agent has no `memory`, so `untilIdle` no-ops | Give the agent its own `Memory`. Confirm in the Inspector: a run with no `ACTIVITY_DELTA` after the snapshot is this. See discrepancy 7. |
| Model-not-found errors | A `gpt-5.4*` id from the docs | Set `OPENAI_MODEL` to something your account has. |
| Model-not-found on Open Gen UI / A2UI / Sub-Agents | Those agents hard-code `gpt-5-mini` as published | Use a key with `gpt-5-mini` access; `OPENAI_MODEL` does not apply to them. |
| A2UI card throws React #31 `object with keys {path}`, or Book flight does nothing | Root `zod` resolved to 4.x | `npm ls zod` must show 3.25.76 at the root (discrepancy 16). Re-pin with `npm install zod@3.25.76 --save-exact`. |
| Fixed Schema: `UnsupportedModelVersionError` | `ai` resolved to v6 | `ai@^7` must be a direct dependency (discrepancy 17). |
| Page freezes / dev server spins after opening a demo | Two Inspectors on one page | Any new route that mounts its own `<CopilotKit>` must be added to `NESTED_PROVIDER_ROUTES` in `src/lib/inspector.ts`. |

---

## Doc drift detection

`/doc-sync` keeps this repo honest about the docs it mirrors. Press **Sync docs now** (on the landing page or on `/doc-sync`) and it fetches the markdown source behind all 20 tracked doc pages, diffs each against the copy stored in `doc-snapshot/`, replaces that copy, and reports what moved — ranked by whether the change can actually break an implementation.

Doc pages are fetched by appending `.md` to their URL, which returns the authored MDX rather than 250 KB of rendered HTML. Every response is checked for `text/markdown` before it is allowed near the snapshot: a URL that misses the markdown handler still answers `200` with the HTML app shell, and writing that in would destroy the baseline and report the whole corpus as rewritten on the next run. A run commits all pages or none.

**Severity is decided by where the edit landed**, not how big it was:

| Level | Trigger |
|---|---|
| **High** | a changed line inside a fenced code block, a changed fence count, or a page that now 404s and is gone from the sitemap |
| **Medium** | a changed heading, changed frontmatter `title`/`description`, or prose in the same section as changed code |
| **Low** | other prose |

**Sections checked** lists every tracked page in nav order with a mark — `✓` unchanged, `!` changed, `+` stored, `✗` 404, `~` unstable, `·` not checked. Expanding a row shows the comparison: for a changed page the diff (`−` existing snapshot, `+` newly fetched), and for an unchanged one the two matching hashes, which is the evidence the check ran.

**`doc-snapshot/CHANGELOG.md`** is the record that survives a re-sync. Because syncing replaces the copy it just compared against, the run *after* a change reports nothing — so the changelog is written at the moment of discovery and never rewritten later. Only changed pages are recorded; a clean run does not touch the file. It keeps the three most recent dated entries, counted rather than aged, so a change from six weeks ago still shows if nothing has happened since.

**One sync date.** `syncedAt` in `doc-snapshot/manifest.json`, rewritten on every run and shown on `/`, `/status` and `/doc-sync`. There is no hand-maintained date to keep in step with it.

**To test it**, edit any `doc-snapshot/pages/*.md` file and press the button — a line inside a code fence for High, a `##` heading for Medium, a sentence for Low. The comparison reads the stored file itself, so nothing else needs changing. Both `/doc-sync` and the changelog label the result as a local snapshot edit rather than upstream drift.

Commit `doc-snapshot/` — `pages/`, `manifest.json` and `CHANGELOG.md` are the baseline every diff is taken against. `reports/` is gitignored derived data.

---

## 11. Project structure

```
mastra/
├── CLAUDE.md
├── README.md
├── .env.example
│
├── docs-verbatim/             # published code that is shown but never compiled (gaps inventoried in its README)
│
└── frontend/                  # the whole app — Next.js + Mastra in one process
    └── src/
        ├── mastra/
        │   ├── index.ts               # ★ Mastra instance: 7 agents, storage, backgroundTasks
        │   ├── agents.ts              # ★ the 7 doc-defined agents + working-memory schemas
        │   ├── tools.ts               # ★ the 3 doc-defined tools
        │   ├── subagents.ts           # ★ sub-agents exposed as tools (published)
        │   ├── a2ui/
        │   │   ├── a2ui-generate.ts   # ★ generate_a2ui tool (published)
        │   │   └── a2ui-context.ts    #   its two helpers (harness-written)
        │   └── model.ts               # model id for the original seven agents
        ├── app/
        │   ├── layout.tsx
        │   ├── page.tsx               # / — orientation + agent roster
        │   ├── status/page.tsx
        │   ├── api/copilotkit/route.ts   # ★ CopilotRuntime + getLocalAgents
        │   ├── api/copilotkit-ogui/       # ★ openGenerativeUI runtime (published)
        │   ├── api/copilotkit-a2ui-fixed-schema/   # a2ui injectA2UITool:false (glue)
        │   ├── api/copilotkit-declarative-gen-ui/  # a2ui auto-inject (glue)
        │   └── <doc route>/
        │       ├── page.tsx           # notes + exact source (server component)
        │       └── demo-chat/page.tsx # ★ the running feature, chrome-free
        ├── components/
        │   ├── providers.tsx          # ★ provider, inspector, activity renderers
        │   ├── background-task-activity.tsx  # ★ AG-UI activity renderer
        │   ├── source-code.tsx        # renders a repo file verbatim
        │   ├── code-figure.tsx        # shared, Shiki-highlighted code block
        │   ├── app-chrome.tsx         # sidebar layout, skipped on /demo-chat
        │   ├── demo-frame.tsx         # thin bar + back link for demo routes
        │   ├── nav-sidebar.tsx
        │   ├── route-header.tsx
        │   └── ui.tsx                 # Panel, Callout, CodeBlock, TryIt
        └── lib/
            ├── nav-config.ts          # ★ single source of truth: routes, docs, status
            ├── inspector.ts           # ★ which provider owns the single Inspector
            ├── source.ts              # server-only file reader
            └── highlight.ts           # server-only Shiki wrapper
```

---

## 12. References

**Getting Started** — [Quickstart (bring your own agent)](https://docs.copilotkit.ai/mastra/quickstart?agent=bring-your-own)

**Basics** — [Prebuilt Components](https://docs.copilotkit.ai/mastra/prebuilt-components)

**Custom Look and Feel** — [Slots](https://docs.copilotkit.ai/mastra/custom-look-and-feel/slots) † · [Headless UI](https://docs.copilotkit.ai/mastra/custom-look-and-feel/headless-ui) † · [Programmatic Control](https://docs.copilotkit.ai/mastra/programmatic-control) · [Inspector](https://docs.copilotkit.ai/mastra/inspector)

**Generative UI** — [Display-only](https://docs.copilotkit.ai/mastra/generative-ui/your-components/display-only) · [Interactive](https://docs.copilotkit.ai/mastra/generative-ui/your-components/interactive) · [Tool Rendering](https://docs.copilotkit.ai/mastra/generative-ui/tool-rendering) · [State Rendering](https://docs.copilotkit.ai/mastra/generative-ui/state-rendering) · [A2UI Dynamic Schema](https://docs.copilotkit.ai/mastra/generative-ui/a2ui/dynamic-schema) · [A2UI Fixed Schema](https://docs.copilotkit.ai/mastra/generative-ui/a2ui/fixed-schema) · [Open Generative UI](https://docs.copilotkit.ai/mastra/generative-ui/open-generative-ui) · [MCP Apps](https://docs.copilotkit.ai/mastra/generative-ui/mcp-apps) (not implemented)

**App Control** — [Frontend Tools](https://docs.copilotkit.ai/mastra/frontend-tools) · [Human in the Loop](https://docs.copilotkit.ai/mastra/human-in-the-loop/tool-based) · [useInterrupt](https://docs.copilotkit.ai/mastra/human-in-the-loop/useInterrupt) · [Headless Interrupts](https://docs.copilotkit.ai/mastra/human-in-the-loop/headless) · [Governed Actions](https://docs.copilotkit.ai/mastra/human-in-the-loop/governed-actions) · [Background Tasks](https://docs.copilotkit.ai/mastra/background-tasks)

**Multi-Agent** — [Sub-Agents](https://docs.copilotkit.ai/mastra/multi-agent/subagents)

**Shared State** — [Reading agent state](https://docs.copilotkit.ai/mastra/shared-state/in-app-agent-read) · [Writing agent state](https://docs.copilotkit.ai/mastra/shared-state/in-app-agent-write) · [Predictive State Updates](https://docs.copilotkit.ai/mastra/shared-state/predictive-state-updates) · [Readables](https://docs.copilotkit.ai/mastra/agent-app-context)

**Backend** — [Copilot Runtime](https://docs.copilotkit.ai/mastra/copilot-runtime) · [AG-UI](https://docs.copilotkit.ai/mastra/ag-ui)

**External** — [Mastra docs](https://mastra.ai/en/docs) · [Mastra working memory](https://mastra.ai/en/docs/memory/working-memory) · [AG-UI protocol](https://ag-ui.com)

† Resolves but is absent from the doc sidebar as of the sync date.

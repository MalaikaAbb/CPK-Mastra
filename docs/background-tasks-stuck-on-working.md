# Why the background-task card never left "Working…"

A complete walkthrough of one bug in this repo's `/background-tasks` route: what
broke, how the pieces fit together, how the cause was found, and what was
changed. Written to be readable with no prior exposure to CopilotKit, AG-UI, or
Mastra internals.

**One-sentence version:** the agent had no `memory`, which silently disabled the
only code path that reports background-task progress to the browser, so the UI
card was painted once as "Working…" and never heard anything again.

---

## 1. What this feature is supposed to do

Three separate systems have to cooperate for the Background Tasks page to work.
Here they are from the bottom up.

### 1.1 Mastra background tasks

Normally an agent's tool call blocks the run: the model calls the tool, waits
for the return value, then keeps talking. A tool marked as a **background task**
does not block. Mastra enqueues it, hands the model a placeholder immediately
("Background task started. Task ID: …"), and lets the conversation continue
while a worker runs the real thing.

Turning it on takes three switches ([Mastra docs](https://mastra.ai/docs/harness/background-tasks)):

```ts
// 1. the tool opts in
export const runDeepResearchTool = createTool({
  id: "run_deep_research",
  background: { enabled: true },
  execute: async ({ topic }) => { /* … */ },
});

// 2. the instance enables the subsystem and gives it somewhere to persist tasks
export const mastra = new Mastra({
  agents: { backgroundAgentsAgent },
  storage: new LibSQLStore({ id: "mastra-storage", url: ":memory:" }),
  backgroundTasks: { enabled: true },
});
```

As a task moves through its life, Mastra emits chunk events. **Where each one
comes from matters more than anything else in this document**, and Mastra's own
docs spell it out:

| Event | Source | Meaning |
|---|---|---|
| `background-task-started` | **Agent stream** | Task enqueued, has a `taskId` |
| `background-task-running` | **Manager stream** | Execution begun |
| `background-task-output` | **Manager stream** | A streamed progress chunk |
| `background-task-completed` | **Manager stream** | Finished successfully |
| `background-task-failed` | **Manager stream** | Threw or timed out |
| `background-task-suspended` | **Manager stream** | Paused via `suspend()` |
| `background-task-resumed` | **Manager stream** | Resumed after suspension |

Exactly one event — `started` — is emitted inline by the agent's own stream.
**Every event that reports a status change comes from a different stream**, the
background task manager's, which somebody has to explicitly subscribe to.

That subscription is what `untilIdle` does. Mastra's docs:

> When a background task completes, the result is injected into the agent
> memory, `stream()` re-enters the agentic loop so the LLM can react to it.

```ts
const stream = await agent.stream("Research solana", {
  memory: { thread: "t1", resource: "u1" },
  untilIdle: true,
});
```

Note the shape of that call — `memory` is in every one of the docs' examples.
Hold that thought; it turns out to be load-bearing.

### 1.2 AG-UI: how the browser hears about any of it

CopilotKit does not talk to Mastra directly. Both sides speak **AG-UI**, a
protocol of discrete events streamed over SSE: `RUN_STARTED`,
`TEXT_MESSAGE_CONTENT`, `TOOL_CALL_RESULT`, `RUN_FINISHED`, and so on. The
adapter `@ag-ui/mastra` translates Mastra's chunk types into AG-UI events.

Background tasks map onto a pair of AG-UI event types:

- **`ACTIVITY_SNAPSHOT`** — "here is an activity, in full." Sent once, when the
  task starts.
- **`ACTIVITY_DELTA`** — "here is a [JSON Patch](https://jsonpatch.com/) to
  apply to that activity." Sent on every subsequent change.

The translation table inside `@ag-ui/mastra`:

| Mastra chunk | AG-UI event emitted |
|---|---|
| `background-task-started` | `ACTIVITY_SNAPSHOT`, `status` hardcoded to `"running"` |
| `background-task-running` | `ACTIVITY_DELTA` → `/status` = `running` |
| `background-task-output` | `ACTIVITY_DELTA` → append to `/outputs` |
| `background-task-completed` | `ACTIVITY_DELTA` → `/status` = `completed`, `/result` |
| `background-task-failed` | `ACTIVITY_DELTA` → `/status` = `failed`, `/error` |

**The snapshot is never re-sent.** After the first paint, the card's status can
only ever change through an `ACTIVITY_DELTA`.

### 1.3 The React side

The frontend registers an *activity renderer* on the provider — a component
plus a schema, keyed by activity type:

```tsx
// components/providers.tsx
<CopilotKitProvider renderActivityMessages={[backgroundTaskActivityRenderer]} …>
```

```tsx
// components/background-task-activity.tsx
export const backgroundTaskActivityRenderer = {
  activityType: "mastra-background-task",
  content: contentSchema,
  render: ({ content }) => /* the card */,
};
```

CopilotKit keeps an activity *message* in the chat's message list, applies each
incoming patch to its `content`, and re-renders the card.

### 1.4 Why `untilIdle` is the switch that matters

Of the switches in this feature, `untilIdle` is the one that is easiest to omit
and hardest to notice missing, so it deserves its own explanation.

`background: { enabled: true }` and `backgroundTasks: { enabled: true }` are
enough to *run* work in the background. The task is enqueued, a worker executes
it, the result is persisted, lifecycle events are published. All of that happens
whether or not you pass `untilIdle`. What you do **not** get is any of it
reaching the run the browser is listening to.

`untilIdle` is Mastra's run mode that keeps a stream open past the model's first
turn. Concretely, `runIdleLoop` does four things:

1. **Subscribes to `bgManager.stream({ agentId, threadId, resourceId })`** and
   pipes those chunks into the same `fullStream` the AG-UI bridge is reading.
   This is the only subscription in the codebase, and per the table in §1.1 it
   is the source of *every* event except `background-task-started`. No
   subscription → no `running`, no `output`, no `completed`, no `failed`.
2. **Queues terminal completions and runs a continuation turn** —
   `agent.stream([])` with an injected directive naming the tool-call ids that
   just finished, so the model can react to a result that arrived after it had
   already stopped talking. This is what Mastra's docs mean by "`stream()`
   re-enters the agentic loop."
3. **Holds the run open** with an idle timer instead of closing when the first
   turn ends, so a task finishing seconds or minutes later still has a live
   stream to arrive on. The timer defaults to `5 * 60_000` ms and force-closes
   the run when nothing has happened for that long.
4. **Replays in-flight tasks on connect.** When the subscription opens it lists
   tasks already in `running` state for that agent/thread/resource and emits a
   `background-task-running` chunk for each, so a task started in an earlier run
   still produces a card in the current one.

Without it, everything still "works" in the sense that nothing errors: the task
runs, the model answers, the run finishes green. Three things are silently lost.

| Lost | Visible consequence |
|---|---|
| Manager-stream chunks | No `ACTIVITY_DELTA` → the card is frozen on the snapshot's `"running"` |
| The continuation turn | The model never gets to react to the result — it only ever says "I've started researching…" |
| The bridge's tool-result suppression | The raw result escapes as a plain `TOOL_CALL_RESULT` (§4.5) |

Things `untilIdle` is often confused with, none of which substitute for it:

- **`observationalMemory`** — the other flag on `getLocalAgents`. Unrelated
  subsystem: it surfaces Mastra's Observational Memory work (observer/reflector
  agents compressing the conversation, streamed as `data-om-*` chunks) as
  activity events of type `mastra-observational-memory`. It never touches
  `bgManager.stream()`. Swapping one for the other reproduces this bug exactly.
  They are independent and can both be passed.
- **Instance `storage`** — makes tasks *persistable*, not *observable*.
- **The tool's `background` flag** — decides where the work runs, not who hears
  about it.
- **Agent `memory`** — a *prerequisite* of `untilIdle`, not a replacement (§4.2).
  Both are required; either one missing produces the identical symptom.

Two limitations worth knowing:

- `getLocalAgents` accepts `untilIdle?: boolean | string[]` and forwards a bare
  `true` to Mastra, so the `{ maxIdleMs }` form Mastra's own docs show is not
  reachable through the CopilotKit bridge — you get the 5-minute default.
- The idle loop registers one active stream per `threadId|resourceId` and aborts
  the previous one when a new run starts on the same scope. Sending another
  message therefore closes the earlier run's idle window; an unfinished task
  re-surfaces through the replay in point 4 rather than on its original run.

---

## 2. The symptom

Ask the agent to research something. You get:

- a chat reply — "The research … is now running in the background. I'll let you
  know once it's complete!"
- a card reading **Deep research — history of the Dutch East India Company ·
  Working…**

The card stays on "Working…" forever. The run itself ends cleanly: no error, no
red banner, nothing in the browser console.

---

## 3. Reading the event log

CopilotKit's Inspector (bottom-right on localhost) dumps every AG-UI event. Here
is the entire run, oldest first, trimmed of the per-token text deltas:

| Time | Event | Notes |
|---|---|---|
| 12:04:53 | `RUN_STARTED` | |
| 12:04:55 | `ACTIVITY_SNAPSHOT` | `status: "running"`, `taskId: aaa997a2…` |
| 12:04:55 | `TOOL_CALL_RESULT` | the **real** research result |
| 12:04:57 | `TEXT_MESSAGE_START` … `END` | "…running in the background…" |
| 12:04:57 | `RUN_FINISHED` | with token usage |

Two things stand out.

**There is no `ACTIVITY_DELTA` anywhere.** Not the `running` one, not the
`completed` one. Per §1.2 the card's status can *only* move via a delta, so this
alone explains the stuck badge. The React renderer, its schema, and the provider
registration were all fine — nothing ever arrived for them to react to.

**A raw `TOOL_CALL_RESULT` appeared, carrying the real result.** That is not
supposed to happen for a background tool. `@ag-ui/mastra` deliberately hides
tool results for background calls, because the activity card is meant to be the
UI for them. Its presence says the completion *did* happen and *did* reach the
browser — just through the wrong channel.

Also worth noting what is **absent**: no `TOOL_CALL_START` / `TOOL_CALL_ARGS` /
`TOOL_CALL_END`. That is correct and expected — the adapter withholds those for
background tools so the card can stand in for them.

---

## 4. Root cause

### 4.1 Following the missing delta backwards

Deltas come from manager-stream chunks (§1.1). Manager-stream chunks reach the
run only if something subscribed to `bgManager.stream(...)`. In
`@mastra/core@1.64`, exactly one place does that: the idle loop, i.e. the
machinery behind `untilIdle`.

This repo passes `untilIdle: true`:

```ts
// app/api/copilotkit/route.ts
const runtime = new CopilotRuntime({
  agents: MastraAgent.getLocalAgents({
    mastra,
    resourceId: "copilotkit-harness",
    untilIdle: true,
  }),
});
```

So the subscription should exist. It did not.

### 4.2 The bail-out

`runIdleLoop` opens with this (`@mastra/core/dist/agent-*.js`):

```js
async function runIdleLoop(agent, streamOptions, deps, firstTurn, …) {
  const scope = await resolveScope(agent, /* merged options */);
  if (!deps.bgManager || !scope)
    return buildResult(await firstTurn(restStreamOptions), null);
  …
  const bgReader = deps.bgManager.stream({ agentId, threadId, resourceId, … });
```

If `scope` is null it returns a plain, single-turn stream: no subscription, no
continuation, no idle timer. And `resolveScope` is:

```js
async function resolveScope(agent, mergedOptions) {
  const requestContext = mergedOptions?.requestContext ?? new RequestContext();
  if (!(await agent.getMemory({ requestContext }))) return null;   // ← here
  …
}
```

**No memory on the agent → no scope → `untilIdle` quietly does nothing.** No
warning is logged. The option is accepted and ignored.

### 4.3 Why the instance's `storage` did not count

The natural objection: the Mastra instance *does* have `storage`, and the docs
say storage is what background tasks require. True — but storage and memory are
different things, and `Agent#getMemory()` does not bridge them:

```js
async getMemory({ requestContext = new RequestContext() } = {}) {
  const memoryConfig = this.#memory ?? this.#inheritedMemory(requestContext);
  if (!memoryConfig) return;            // ← returns undefined
  …
  // instance storage is only ever attached to an already-resolved Memory:
  if (!resolvedMemory.hasOwnStorage) resolvedMemory.setStorage(storage);
}

#inheritedMemory(requestContext) {
  const inherited = requestContext?.getRaw(MASTRA_INHERITED_MEMORY_KEY);
  return inherited?.agentId === this.id ? inherited.memory : void 0;
}
```

The agent resolves **its own** `memory` or an inherited one — and the inherited
path is only ever populated for sub-agents (an agent calling another agent as a
tool). A top-level agent with no `memory` gets `undefined`, whatever the
instance's `storage` says. Instance storage makes tasks *persistable*; agent
memory makes the run *resumable*. Background tasks need both.

The agent this repo took verbatim from CopilotKit's page has no `memory`:

```ts
export const backgroundAgentsAgent = new Agent({
  id: "background-agents",
  name: "Background Agents Agent",
  tools: { runDeepResearchTool },
  model: model(),
  instructions: "You are a research assistant that …",
});
```

Which is the whole bug.

### 4.4 Why memory is required by design, not by accident

Re-read the Mastra sentence from §1.1:

> the result is injected into **the agent memory**, `stream()` re-enters the
> agentic loop

The completion path is *defined* as: write the result into the thread, then run
another turn so the model can react to it. There is no thread to write into
without memory, so the idle loop has nothing to stand on and declines to start.
The gate is coherent. It just fails silently, which is what made this expensive
to find.

### 4.5 Why the run still looked healthy

If the manager stream was never subscribed, how did the real result reach the
browser at all?

Mastra registers a **per-task context** when it enqueues a background task, and
that context's `onChunk` hook runs in-process regardless of `untilIdle`. Its job
is to keep the model's transcript honest, and it does so by translating the
completion into an ordinary tool result:

```js
onChunk: (chunk) => {
  …
  if (chunk.type === "background-task-completed")
    safeEnqueue(controller, await transformChunk({
      type: "tool-result",                       // ← not an activity event
      payload: { toolCallId, toolName, result: chunk.payload.result, … },
    }, "output-available", { output: chunk.payload.result }));
```

So a `tool-result` chunk landed on the still-open first turn. Now the adapter's
suppression logic:

```js
case `tool-result`:
  if (i.has(toolCallId)) { i.delete(toolCallId); break; }
  if (w.has(toolCallId)) { w.delete(toolCallId); break; }   // ← one-shot
  onToolResultPart({ … });                                   // ← emits TOOL_CALL_RESULT
```

`w` maps `toolCallId → taskId` and is populated when the task starts. The
*first* tool result for a background call is the placeholder ("Background task
started. Task ID: …") — correctly swallowed, but the mapping is **deleted in the
process**. The second tool result for the same call — the real one — no longer
matches, falls through, and is emitted as a plain `TOOL_CALL_RESULT`.

That is the 12:04:55 event in the log: the completion arriving on the tool-call
channel because the activity channel was never wired up. The model got its
answer, the run finished normally, and the only casualty was the UI.

### 4.6 The causal chain, end to end

```
Agent has no `memory`
        │
        ▼
resolveScope() → null
        │
        ▼
runIdleLoop() bails to a plain single-turn stream        (silently)
        │
        ▼
nothing subscribes to bgManager.stream()
        │
        ▼
no background-task-running / -completed chunks in the run
        │
        ▼
@ag-ui/mastra emits no ACTIVITY_DELTA
        │
        ├──────────────► card keeps the ACTIVITY_SNAPSHOT's hardcoded
        │                "running" forever  →  "Working…"
        ▼
completion instead leaks out through the per-task onChunk hook
as a plain tool-result → visible TOOL_CALL_RESULT
```

---

## 5. The fix

Give the agent its own memory:

```diff
 export const backgroundAgentsAgent = new Agent({
   id: "background-agents",
   name: "Background Agents Agent",
   tools: { runDeepResearchTool },
   model: model(),
+  memory: new Memory({ storage: store() }),
   instructions: "You are a research assistant that …",
 });
```

`store()` is the same `new LibSQLStore({ url: ":memory:" })` helper the other
agents in this repo already use, so this adds no new dependency and no new
configuration.

With memory present, `resolveScope` returns a scope, `untilIdle` installs the
`bgManager.stream()` subscription, and the events described in §1.1 flow into
the run. The card now moves.

**Note this is a deliberate deviation from CopilotKit's published sample**,
whose agent has no `memory`. It is recorded as discrepancy 7 in the repo README.
The nearby comment in `mastra/agents.ts` explains why it must not be "cleaned
up" back to matching the doc.

### 5.1 Second problem: the task finished too fast to see

With deltas flowing, the card flipped from "Working…" to "Completed" instantly —
because the tool did no work:

```ts
execute: async ({ topic }) => {
  return JSON.stringify({ topic, summary: `Deep research on "${topic}" completed.` });
},
```

CopilotKit's page elides this body (`execute: async ({ topic }) => { /* ... */ }`),
so whatever is here is the harness's own. A body that returns in ~0 ms makes the
route untestable: the card is already terminal on its first paint and no
intermediate state is ever observable.

The tool now does staged work and reports each stage:

```ts
execute: async ({ topic }, { writer }) => {
  for (const [index, stage] of STAGES.entries()) {
    await wait(1400);
    await writer?.write({ stage, step: index + 1, totalSteps: STAGES.length });
  }
  return JSON.stringify({ topic, summary: `Deep research on "${topic}" completed.` });
},
```

`writer` is a `ToolStream` on the tool-execution context. Each `write` travels:

```
writer.write({ stage, step, totalSteps })
   → outputWriter({ type: "tool-output", payload: { output: <your data>, … } })
   → manager publishes lifecycle event "task.output"
   → manager stream emits chunk "background-task-output"
   → @ag-ui/mastra emits ACTIVITY_DELTA: append to /outputs
   → card renders the newest stage
```

Each `outputs` entry therefore looks like `{ output: { stage, step, totalSteps },
toolCallId, toolName }` — your payload is one level down, under `output`.

**Keep the total short.** Mastra injects a `_background` override into every
background-eligible tool's JSON schema so the model can tune execution per call,
and `resolveBackgroundConfig` ranks those overrides *above* the tool's own
config and above the manager default of 300 000 ms:

> 1. LLM per-call override (`_background` field in tool args)
> 2. Agent-level `backgroundTasks.tools` config
> 3. Tool-level `background` config
> 4. Default: foreground

In the run that exposed this bug, gpt-4o sent `"_background": { "enabled": true,
"timeoutMs": 10000, "maxRetries": 3 }` entirely on its own initiative. Work
longer than the model's chosen timeout ends as `failed`/`timed_out`, so the four
stages total ≈ 5.6 s.

### 5.2 The card also lied about non-terminal states

The original renderer computed:

```tsx
const working = content.status !== "completed" && content.status !== "failed";
```

Anything that is not those two — including `suspended`, `cancelled`, and a
missing status — rendered as "Working…". The card now matches statuses
explicitly, so a suspended or cancelled task is visibly different from a running
one, and shows the newest progress stage underneath while it runs.

---

## 6. How to verify

Open `/background-tasks`, open the Inspector, and send:

> Research the history of the Dutch East India Company

**Expected event sequence:**

```
RUN_STARTED
ACTIVITY_SNAPSHOT      status: running
ACTIVITY_DELTA         /status → running, /args, /startedAt
ACTIVITY_DELTA         /outputs/- → { stage: "Gathering sources", step: 1, … }
ACTIVITY_DELTA         /outputs/- → …                              (×4 total)
ACTIVITY_DELTA         /status → completed, /result, /completedAt
TEXT_MESSAGE_*         the continuation turn's reply
RUN_FINISHED
```

**Expected UI:** the card shows "Working…" with a stage line that advances
`Gathering sources (1/4)` → `Writing the summary (4/4)` over roughly six
seconds, then flips to **Completed** on its own.

**Failure signatures:**

| What you see | What it means |
|---|---|
| Snapshot only, no deltas, card stuck on "Working…" | The agent lost its `memory`, or `untilIdle` was dropped from `getLocalAgents` |
| No `ACTIVITY_SNAPSHOT` at all | The task never started — check `background: { enabled: true }` on the tool and `backgroundTasks: { enabled: true }` plus `storage` on the instance |
| Status deltas but no `/outputs` deltas | The tool is not calling `writer.write()`, or its second `execute` argument was dropped |
| Card ends on **Failed** | Usually the model's `_background.timeoutMs` being shorter than the work (§5.1) |
| A raw tool-result bubble beside the card | Expected today — the adapter's one-shot suppression (§4.5) |

---

## 7. Files touched

| File | Change |
|---|---|
| `frontend/src/mastra/agents.ts` | `memory: new Memory({ storage: store() })` on `backgroundAgentsAgent`, with the rationale inline |
| `frontend/src/mastra/tools.ts` | Staged work + `writer.write()` progress in `runDeepResearchTool` |
| `frontend/src/components/background-task-activity.tsx` | Explicit status matching; renders the latest stage |
| `frontend/src/app/api/copilotkit/route.ts` | Comment corrected — `untilIdle` alone is not sufficient |
| `README.md` | Discrepancies 7 and 7b; troubleshooting rows; walkthrough expectations |

---

## 8. Upstream issues worth filing

1. **Mastra** — `runIdleLoop` silently degrades to a plain stream when the agent
   has no memory. The `bgManager.stream()` filters are `agentId` / `runId` /
   `threadId` / `resourceId` / `taskId`; none of them need a `Memory`. At
   minimum this should log a warning; arguably the subscription should be
   installed regardless and only the continuation turn should require memory.
2. **`@ag-ui/mastra`** — the per-task `onChunk` path already observes
   `background-task-completed` and synthesizes a `tool-result` from it. It could
   emit the activity delta there too, making the card correct even without
   `untilIdle`.
3. **`@ag-ui/mastra`** — deleting the `toolCallId → taskId` entry when
   suppressing the placeholder result means the real result later escapes as a
   visible `TOOL_CALL_RESULT` (§4.5). Suppression should be keyed on the task's
   lifecycle, not consumed by the first result.
4. **CopilotKit docs** — the Background Tasks page shows an agent with no
   `memory` and does not mention `untilIdle` at all, so the published sample
   cannot report progress as written.
5. **Mastra docs** — worth stating outright that `untilIdle` requires agent-level
   memory, and that the `_background` schema injection lets the model override
   your timeout.

---

## 9. Versions this was traced against

| Package | Version |
|---|---|
| `@mastra/core` | 1.64.0 |
| `@ag-ui/mastra` | 1.1.2 |
| `@ag-ui/client`, `@ag-ui/core` | 0.0.59 (pinned via `overrides`) |
| `@copilotkit/react-core`, `@copilotkit/runtime` | ^1.70.0 |

Line numbers in `node_modules` shift between patch releases; the quoted function
names (`runIdleLoop`, `resolveScope`, `#inheritedMemory`, `resolveBackgroundConfig`,
`ToolStream._write`) are stable enough to grep for.

## 10. References

- [Mastra — Background Tasks](https://mastra.ai/docs/harness/background-tasks)
- [CopilotKit — Background Tasks (Mastra)](https://docs.copilotkit.ai/mastra/background-tasks)
- [AG-UI protocol](https://docs.copilotkit.ai/mastra/ag-ui) — the event stream the Inspector displays
- This repo's README, section 9 (doc-vs-implementation discrepancies 7 and 7b)

# Pausing the Agent for Input

> Pause an agent run mid-tool, hand control to a custom React component, and resume with the user's answer.


<!-- interactive demo: gen-ui-interrupt -->


## What is this?

`useInterrupt` lets your agent pause mid-run, hand control to the user
through a custom React component, and resume with whatever the user
returns. How that pause is implemented depends on the framework's
runtime.



This framework ships a first-class interrupt primitive that lets running
work suspend itself and hand control to the client
([LangGraph](https://docs.langchain.com/oss/python/langgraph/interrupts),
[AWS Strands](https://strandsagents.com/docs/user-guide/concepts/interrupts/)).
The run is frozen server-side until the client resolves the interrupt with a
payload, at which point execution resumes as if the interrupt call had simply
returned that payload.

CopilotKit's `useInterrupt` is the frontend half of that contract: it
subscribes to the paused run, renders whatever component you give it,
and calls the agent back with the user's answer.







## When should I use this?

Reach for `useInterrupt` when the pause is a **graph-enforced
checkpoint** where the code path _must_ stop and wait for a human,
not an LLM-initiated tool call. Typical cases:

- A sensitive action (payments, irreversible writes) must be approved
- A required piece of state isn't known and can only be collected from the user
- The agent explicitly reaches an approval node in a longer workflow
- You want the server-side contract to be `interrupt(...)` and resume with a payload

For LLM-initiated pauses where the model decides on the fly to ask
the user, prefer [`useHumanInTheLoop`](../human-in-the-loop).



## The backend: `interrupt()` inside a tool

<!-- setup skipped: human-in-the-loop-setup is not bundled for mastra -->

The example agent exposes a `schedule_meeting` tool. When the model
calls it, the tool interrupts itself with the meeting context. The run
freezes here until the client resolves; the resolution becomes the return
value of the interrupt call, which the tool then turns into a final string
for the model:

```typescript
// src/mastra/agents/index.ts
/**
 * Scheduling agent for the interrupt-adapted demos (gen-ui-interrupt,
 * interrupt-headless).
 *
 * This agent powers the NATIVE interrupt path (OSS-383). The backend
 * `schedule_meeting` tool `suspend()`s with a time-picker payload; the
 * @ag-ui/mastra v1 bridge maps that to an AG-UI interrupt (legacy
 * `on_interrupt` CUSTOM event + the standard `RUN_FINISHED` interrupt-outcome,
 * on by default). The frontend `useInterrupt` (gen-ui-interrupt, in-chat) /
 * hand-rolled headless subscription (interrupt-headless, app-surface) renders
 * the picker and resolves it, which resumes the run — re-invoking the tool's
 * `execute` with `resumeData`. Replaces the prior `useHumanInTheLoop`
 * frontend-tool workaround.
 *
 * Resume requires instance `storage` (see src/mastra/index.ts) so the
 * suspended agentic-loop snapshot can be reloaded.
 */
export const interruptAgent = new Agent({
  id: "interrupt-agent",
  name: "Interrupt Agent",
  tools: { schedule_meeting: scheduleMeetingInterruptTool },
  model: openai("gpt-5-mini"),
  instructions: `You are a scheduling assistant. Whenever the user asks you to book a call or schedule a meeting, you MUST call the \`schedule_meeting\` tool. Pass a short \`topic\` describing the purpose of the meeting and, if known, an \`attendee\` describing who the meeting is with.

The \`schedule_meeting\` tool surfaces an interactive time-picker to the user and pauses until they pick a slot (or cancel), then returns their selection to you. After it returns, briefly confirm whether the meeting was scheduled and at what time, or note that the user cancelled. Do NOT ask for approval yourself — always call the tool and let the picker handle the decision.

Keep responses short and friendly. After you finish executing tools, always send a brief final assistant message summarizing what happened so the message persists.`,
  memory: new Memory({
    storage: new LibSQLStore({
      id: "interrupt-agent-memory",
      url: WORKING_MEMORY_DB_URL,
    }),
    options: {
      workingMemory: {
        enabled: true,
        schema: AgentState,
      },
    },
  }),
});
```

Two things to note:

- The payload (`{"topic": topic, "attendee": attendee}`) is what the
  frontend reads off the interrupt. Keep it a plain, serializable object.
  It's the "pause-time context" the UI needs to render. Where it lands
  depends on the bridge: LangGraph hands it to `render` as `event.value`,
  while a standard AG-UI interrupt carries it on the interrupt itself, either
  under `metadata` or JSON-encoded into `message`. Read the channels your
  bridge uses rather than assuming one.
- The return-side contract (`{chosen_label, chosen_time}` or
  `{cancelled: true}`) is entirely yours. The client can send anything
  as the resolve payload; the tool is the one that gives it meaning.

## The frontend: `useInterrupt` render prop

On the client you register a `useInterrupt` hook per agent. When the
paused run arrives, `render` receives both the raw `event` and the
`interrupt` itself, and `resolve(...)` is how you resume the run. Where the
payload sits depends on how the framework pauses: a legacy custom-event
interrupt carries it on `event.value`, while a standard AG-UI interrupt
carries it on the `interrupt` (its `metadata`, or a JSON-encoded `message`,
depending on the bridge). Read the channel your framework uses:

```typescript
// src/app/demos/gen-ui-interrupt/page.tsx
import {
  CopilotKit,
  CopilotChat,
  useInterrupt,
} from "@copilotkit/react-core/v2";
import type { TimeSlot } from "./_components/time-picker-card";
import { TimePickerCard } from "./_components/time-picker-card";
import { generateFallbackSlots } from "../_shared/interrupt-fallback-slots";
import { useGenUiInterruptSuggestions } from "./suggestions";

export default function GenUiInterruptDemo() {
  return (
    <CopilotKit runtimeUrl="/api/copilotkit" agent="gen-ui-interrupt">
      <div className="flex justify-center items-center h-screen w-full">
        <div className="h-full w-full max-w-4xl">
          <Chat />
        </div>
      </div>
    </CopilotKit>
  );
}

// Shape the backend `schedule_meeting` tool suspends with (its suspendSchema),
// wrapped by the @ag-ui/mastra bridge under `mastra_suspend`.
type SuspendPayload = {
  topic?: string;
  attendee?: string;
  slots?: TimeSlot[];
};

function Chat() {
  useGenUiInterruptSuggestions();

  // Native interrupt path (OSS-383). The backend `schedule_meeting` tool
  // `suspend()`s; the @ag-ui/mastra bridge surfaces that as an AG-UI interrupt
  // and `useInterrupt` renders the picker inline. `resolve(...)` resumes the
  // Mastra run (re-invoking the tool's `execute` with the selection as
  // `resumeData`).
  useInterrupt({
    agentId: "gen-ui-interrupt",
    renderInChat: true,
    render: ({ event, resolve }) => {
      // Mastra wraps the suspend value as
      // `{ type: "mastra_suspend", toolName, suspendPayload, ... }` and the
      // AG-UI adapter JSON-stringifies it — parse, then read `suspendPayload`
      // (NOT the raw value, which is the wrapper).
      const raw = event.value ?? {};
      const parsed = (typeof raw === "string" ? JSON.parse(raw) : raw) as {
        suspendPayload?: SuspendPayload;
      } & SuspendPayload;
      const payload: SuspendPayload = parsed.suspendPayload ?? parsed;
      const slots =
        payload.slots && payload.slots.length > 0
          ? payload.slots
          : generateFallbackSlots();
      return (
        <TimePickerCard
          topic={payload.topic ?? "a call"}
          attendee={payload.attendee}
          slots={slots}
          onSubmit={(result) => {
            // Defer resolve so React commits the picked/cancelled badge before
            // useInterrupt clears the interrupt element (a single rAF is not
            // reliable — it can fire before React's commit).
            setTimeout(() => resolve(result), 500);
          }}
        />
      );
    },
  });
```

Whatever you pass to `resolve` is round-tripped back to the agent as
the return value of the matching `interrupt(...)` call.







### Key props

- **`agentId`** — must match a runtime-registered agent. If omitted, the
  hook assumes `"default"`. A mismatch means the interrupt never fires.
- **`render`** — receives `{ event, interrupt, resolve }`. The payload you
  passed to `interrupt(...)` on the server arrives on `event.value` for a
  legacy custom-event interrupt and on the `interrupt` for a standard one.
- **`renderInChat`** — when `true` (as above), the picker appears inline
  in the chat transcript, between the paused assistant turn and the
  still-pending continuation.

## Multiple interrupts? Add a type and gate with `enabled`

If your graph issues more than one kind of interrupt (e.g. `"ask"` vs
`"approval"`), tag each with a `type` field on the payload and install
one `useInterrupt` per shape, each gated by an `enabled` predicate:

```tsx
useInterrupt({
  agentId: "gen-ui-interrupt",
  enabled: (event) => event.value.type === "ask",
  render: ({ event, resolve }) => (
    <AskCard question={event.value.content} onAnswer={resolve} />
  ),
});

useInterrupt({
  agentId: "gen-ui-interrupt",
  enabled: (event) => event.value.type === "approval",
  render: ({ event, resolve }) => (
    <ApproveCard content={event.value.content} onAnswer={resolve} />
  ),
});
```

## Preprocess with `handler`

For cases where the interrupt can sometimes be resolved _without_ user
input (e.g. the current user already has permission), pass a `handler`
that runs before `render`. The handler can call `resolve(...)` itself
to resume the agent early — the interrupt card unmounts when the resume
run starts. Or return a value that `render` receives as `result`:

```tsx
useInterrupt({
  agentId: "gen-ui-interrupt",
  handler: async ({ event, resolve }) => {
    const dept = await lookupUserDepartment();
    if (event.value.accessDepartment === dept || dept === "admin") {
      resolve({ code: "AUTH_BY_DEPARTMENT" });
      return; // agent will resume; card unmounts when the run starts
    }
    return { dept };
  },
  render: ({ result, event, resolve }) => (
    <RequestAccessCard
      dept={result?.dept}
      onRequest={() => resolve({ code: "REQUEST_AUTH" })}
      onCancel={() => resolve({ code: "CANCEL" })}
    />
  ),
});
```



## AG-UI standard interrupt flow vs. legacy

`useInterrupt` supports two interrupt transports. Understanding which one your
agent uses helps you write the right `render` code.

### Standard flow (`RUN_FINISHED` with `outcome.type === "interrupt"`)

When the agent backend conforms to the AG-UI protocol, it signals an interrupt
by emitting a `RUN_FINISHED` event whose outcome carries the interrupts array:

```
outcome.type === "interrupt"
outcome.interrupts  // Interrupt[]
```

The hook detects this on `onRunFinishedEvent` and exposes the interrupts on the
render props **after** `onRunFinalized` fires. Your `render` function receives:

- **`interrupt`** — the primary `Interrupt` (`interrupts[0]`), with shape
  `{ id, reason, message?, toolCallId?, responseSchema?, expiresAt?, metadata? }`.
- **`interrupts`** — the full open set (usually one, but multi-interrupt is
  supported — see below).
- **`resolve(payload?, interruptId?)`** — records `{ status: "resolved", payload }`
  for the targeted interrupt (defaults to the primary). The agent run resumes
  once every open interrupt has a response.
- **`cancel(interruptId?)`** — records `{ status: "cancelled" }` for the
  targeted interrupt. Same accumulate-then-submit logic applies.

### Legacy flow (`on_interrupt` custom event)

Older agents (or agents not yet migrated to the AG-UI interrupt spec) emit a
custom `on_interrupt` event. The hook detects this on `onCustomEvent` and sets
`interrupt` to `null` and `interrupts` to `[]`. The payload is in
`event.value`. Calling `resolve(payload)` resumes via `forwardedProps.command`
(the legacy resume mechanism). `cancel()` dismisses the interrupt without
resuming — the agent never receives a response.

### Priority

If both signals appear on the same run (unlikely but possible during migration),
the standard flow wins.

### Approve / Cancel example

```tsx
function ApprovalInterrupt() {
  useInterrupt({
    render: ({ interrupt, resolve, cancel }) => (
      <div className="p-3 border rounded">
        <p>{interrupt?.message ?? "Approve this action?"}</p>
        <div className="mt-2 flex gap-2">
          <button onClick={() => resolve({ approved: true })}>Approve</button>
          <button onClick={() => cancel()}>Cancel</button>
        </div>
      </div>
    ),
  });
  return null;
}
```

`resolve({ approved: true })` records a resolved entry and submits the `resume`
array to the agent. `cancel()` records a cancelled entry and does the same.
Both return the `RunAgentResult` once the run restarts.

### Multi-interrupt behavior

Some agents issue more than one interrupt in a single run (e.g. two independent
approvals). Each interrupt has its own `id`. Address them individually:

```tsx
useInterrupt({
  render: ({ interrupts, resolve, cancel }) => (
    <ul>
      {interrupts.map((i) => (
        <li key={i.id}>
          {i.message}
          <button onClick={() => resolve({ ok: true }, i.id)}>Approve</button>
          <button onClick={() => cancel(i.id)}>Cancel</button>
        </li>
      ))}
    </ul>
  ),
});
```

The agent run only resumes once **every** open interrupt has been addressed.
Calling `resolve` or `cancel` with a specific `interruptId` marks that interrupt
done; the hook auto-submits the accumulated responses when the last one is
addressed. If you omit `interruptId`, the primary interrupt (`interrupts[0]`)
is targeted.

### `responseSchema` — surface only, no client-side validation

The `Interrupt` type exposes a `responseSchema` field (a JSON Schema object)
that the agent can use to describe the expected payload shape. `useInterrupt`
surfaces this field on `interrupt.responseSchema` for your UI to read
(e.g. to drive a form), but it does **not** validate `resolve` payloads against
it. Validation is the agent's responsibility on resume.

## Going further

- [Tool-based HITL with `useHumanInTheLoop`](../human-in-the-loop) — for
  LLM-initiated pauses.
- [Headless interrupts](./headless) — compose the lower-level primitives
  (`useAgent`, `agent.subscribe`, `copilotkit.runAgent`) to resolve
  interrupts outside a chat surface.

# Sub-Agents

> Decompose work across multiple specialized agents with a visible delegation log.


<!-- interactive demo: subagents -->


## What is this?

Sub-agents are the canonical multi-agent pattern: a top-level
**supervisor** LLM orchestrates one or more specialized **sub-agents**
by exposing each of them as a tool. The supervisor decides what to
delegate, the sub-agents do their narrow job, and their results flow
back up to the supervisor's next step.

This is fundamentally the same shape as tool-calling, but each "tool"
is itself a full-blown agent with its own system prompt and (often) its
own tools, memory, and model.

## When should I use this?

Reach for sub-agents when a task has distinct specialized sub-tasks
that each benefit from their own focus:

- **Research → Write → Critique** pipelines, where each stage needs a
  different system prompt and temperature.
- **Router + specialists**, where one agent classifies the request and
  dispatches to the right expert.
- **Divide-and-conquer** — any problem that fits cleanly into parallel
  or sequential sub-problems.

The example below uses the Research → Write → Critique shape as the
canonical example.

## Setting up sub-agents

<!-- setup skipped: subagents-setup is not bundled for mastra -->

Each sub-agent is an isolated agent call with its own model, system
prompt, and optional tools. They don't share memory or tools with the
supervisor; the supervisor only ever sees what the sub-agent returns.

```typescript
// src/mastra/tools/subagents.ts
import { createTool } from "@mastra/core/tools";
import { z } from "zod";
// Use the header-forwarding `openai` so subagents' internal LLM calls
// carry the inbound `x-aimock-context` / `x-aimock-strict` headers. Without
// this, sub-agent calls return 404 from aimock under strict mode. See
// `_header_forwarding.ts` for the ALS-bound fetch wrapper.
import { openai } from "@/mastra/_header_forwarding";
import { Agent } from "@mastra/core/agent";
import crypto from "node:crypto";
import { writeDelegationsToWorkingMemory } from "./working-memory";

// Each sub-agent is a full Mastra `Agent` with its own system prompt. They
// don't share memory or tools with the supervisor — the supervisor only sees
// their final text output via the tools below. Mirrors the LangGraph-Python
// `subagents.py` reference where each sub-agent is a `create_agent(...)`.
const SUBAGENT_MODEL = openai("gpt-5-mini");

const researchSubAgent = new Agent({
  id: "research-subagent",
  name: "Research Subagent",
  model: SUBAGENT_MODEL,
  instructions:
    "You are a research sub-agent. Given a topic, produce a concise " +
    "bulleted list of 3-5 key facts. No preamble, no closing.",
});

const writingSubAgent = new Agent({
  id: "writing-subagent",
  name: "Writing Subagent",
  model: SUBAGENT_MODEL,
  instructions:
    "You are a writing sub-agent. Given a brief and optional source " +
    "facts, produce a polished 1-paragraph draft. Be clear and concrete. " +
    "No preamble.",
});

const critiqueSubAgent = new Agent({
  id: "critique-subagent",
  name: "Critique Subagent",
  model: SUBAGENT_MODEL,
  instructions:
    "You are an editorial critique sub-agent. Given a draft, give 2-3 " +
    "crisp, actionable critiques. No preamble.",
});
```

Keep sub-agent system prompts narrow and focused. The point of this pattern
is that each one does one thing well. If a sub-agent needs to know
the whole user context to do its job, that's a signal the boundary is
wrong.

## Exposing sub-agents as tools

The supervisor delegates by calling tools. Each delegation tool is a thin
wrapper around a specialized agent call that:

1. Runs the sub-agent on the supplied `task` string.
2. Records the delegation into a `delegations` slot in shared agent
   state (so the UI can render a live log).
3. Returns the sub-agent's final message as the tool result, which the
   supervisor sees on its next turn.

```typescript
// src/mastra/tools/subagents.ts
import { createTool } from "@mastra/core/tools";
import { z } from "zod";
// Use the header-forwarding `openai` so subagents' internal LLM calls
// carry the inbound `x-aimock-context` / `x-aimock-strict` headers. Without
// this, sub-agent calls return 404 from aimock under strict mode. See
// `_header_forwarding.ts` for the ALS-bound fetch wrapper.
import { openai } from "@/mastra/_header_forwarding";
import { Agent } from "@mastra/core/agent";
import crypto from "node:crypto";
import { writeDelegationsToWorkingMemory } from "./working-memory";

// Each sub-agent is a full Mastra `Agent` with its own system prompt. They
// don't share memory or tools with the supervisor — the supervisor only sees
// their final text output via the tools below. Mirrors the LangGraph-Python
// `subagents.py` reference where each sub-agent is a `create_agent(...)`.
const SUBAGENT_MODEL = openai("gpt-5-mini");

const researchSubAgent = new Agent({
  id: "research-subagent",
  name: "Research Subagent",
  model: SUBAGENT_MODEL,
  instructions:
    "You are a research sub-agent. Given a topic, produce a concise " +
    "bulleted list of 3-5 key facts. No preamble, no closing.",
});

const writingSubAgent = new Agent({
  id: "writing-subagent",
  name: "Writing Subagent",
  model: SUBAGENT_MODEL,
  instructions:
    "You are a writing sub-agent. Given a brief and optional source " +
    "facts, produce a polished 1-paragraph draft. Be clear and concrete. " +
    "No preamble.",
});

const critiqueSubAgent = new Agent({
  id: "critique-subagent",
  name: "Critique Subagent",
  model: SUBAGENT_MODEL,
  instructions:
    "You are an editorial critique sub-agent. Given a draft, give 2-3 " +
    "crisp, actionable critiques. No preamble.",
});

/**
 * Result of invoking a sub-agent. Discriminated so the wrapping tools can map
 * success/failure into the correct delegation `status` for the UI without
 * relying on string-matching the `result` field. We deliberately do NOT
 * surface raw `err.message` to the LLM/UI: error messages from upstream APIs
 * routinely leak api keys, file paths, and prompt contents. Mirror the
 * agno / claude-sdk-python pattern of redacting to the error class name.
 */
type SubAgentResult = { ok: true; text: string } | { ok: false; error: string };

async function invokeSubAgent(
  agent: Agent,
  task: string,
): Promise<SubAgentResult> {
  // Mastra Agent.generate returns an object with a `.text` field for the
  // final assistant text. We catch internally so a sub-agent failure becomes
  // a visible failed delegation entry rather than crashing the supervisor.
  try {
    const result = await agent.generate(task);
    const text = (result as { text?: unknown }).text;
    return {
      ok: true,
      text: typeof text === "string" && text.length > 0 ? text : "",
    };
  } catch (err) {
    // Redact: only the error class name reaches the LLM and the UI. The full
    // `err.message` (which can contain provider keys, file paths, or echoed
    // prompts) stays in the server log below.
    const errorClass =
      err instanceof Error ? err.constructor.name : "UnknownError";
    console.error(
      JSON.stringify({
        at: new Date().toISOString(),
        level: "error",
        component: "subagents",
        agentId: agent.id,
        errorClass,
        message: err instanceof Error ? err.message : String(err),
        stack: err instanceof Error ? err.stack : undefined,
      }),
    );
    return { ok: false, error: errorClass };
  }
}

/**
 * Delegate a research task to the research sub-agent.
 *
 * The supervisor LLM "calls" this tool to fan a research subtask out. The
 * tool synchronously runs the matching Mastra sub-agent and returns a
 * `Delegation` entry. The supervisor is instructed to APPEND this entry to
 * the `delegations` array in working memory so the UI's live delegation log
 * picks it up via the AG-UI state-snapshot channel.
 */
type SubAgentName = "research_agent" | "writing_agent" | "critique_agent";

/**
 * Build the delegation entry + tool-result payload from a SubAgentResult.
 *
 * Status mapping rules (the whole point of `SubAgentResult`):
 *   - ok: true  → status = "completed", result = sub-agent text output
 *   - ok: false → status = "failed",    result = "[sub-agent error] <ErrorClass>"
 *
 * Without this discrimination, a sub-agent that throws renders as a green
 * "completed" entry in the UI's delegation log — a UX lie the supervisor LLM
 * cannot detect either, since it sees the same green payload. Surfacing the
 * redacted error class through the `result` field lets the supervisor decide
 * to retry or fall back, without leaking provider-side internals.
 */
function buildDelegationPayload(
  subAgentName: SubAgentName,
  task: string,
  result: SubAgentResult,
): { delegation: Record<string, unknown>; resultText: string } {
  const resultText = result.ok
    ? result.text
    : `[sub-agent error] ${result.error}`;
  const delegation = {
    id: crypto.randomUUID(),
    sub_agent: subAgentName,
    task,
    status: result.ok ? ("completed" as const) : ("failed" as const),
    result: resultText,
  };
  return { delegation, resultText };
}

export const researchAgentTool = createTool({
  id: "research_agent",
  description:
    "Delegate a research task to the research sub-agent. Use for: " +
    "gathering facts, background, definitions, statistics. Returns a " +
    "bulleted list of key facts. The delegation is also recorded directly " +
    "in working memory by the tool itself — you do not need to (and " +
    "should not) re-emit the delegation object.",
  inputSchema: z.object({
    task: z.string().describe("The research task / topic to investigate."),
  }),
  execute: async (inputData, executionContext) => {
    const task = inputData.task ?? "";
    const result = await invokeSubAgent(researchSubAgent, task);
    const { delegation, resultText } = buildDelegationPayload(
      "research_agent",
      task,
      result,
    );
    await writeDelegationsToWorkingMemory(executionContext, delegation);
    return JSON.stringify({ result: resultText, delegation });
  },
});

export const writingAgentTool = createTool({
  id: "writing_agent",
  description:
    "Delegate a drafting task to the writing sub-agent. Use for: producing " +
    "a polished paragraph, draft, or summary. Pass relevant facts from " +
    "prior research inside `task`. Returns the draft. The delegation is " +
    "also recorded directly in working memory by the tool itself.",
  inputSchema: z.object({
    task: z
      .string()
      .describe(
        "The drafting brief, including any facts the writer should incorporate.",
      ),
  }),
  execute: async (inputData, executionContext) => {
    const task = inputData.task ?? "";
    const result = await invokeSubAgent(writingSubAgent, task);
    const { delegation, resultText } = buildDelegationPayload(
      "writing_agent",
      task,
      result,
    );
    await writeDelegationsToWorkingMemory(executionContext, delegation);
    return JSON.stringify({ result: resultText, delegation });
  },
});

export const critiqueAgentTool = createTool({
  id: "critique_agent",
  description:
    "Delegate a critique task to the critique sub-agent. Use for: " +
    "reviewing a draft and suggesting concrete improvements. Returns the " +
    "critique. The delegation is also recorded directly in working memory " +
    "by the tool itself.",
  inputSchema: z.object({
    task: z
      .string()
      .describe(
        "The draft to critique, plus any specific critique focus you want.",
      ),
  }),
  execute: async (inputData, executionContext) => {
    const task = inputData.task ?? "";
    const result = await invokeSubAgent(critiqueSubAgent, task);
    const { delegation, resultText } = buildDelegationPayload(
      "critique_agent",
      task,
      result,
    );
    await writeDelegationsToWorkingMemory(executionContext, delegation);
    return JSON.stringify({ result: resultText, delegation });
  },
});
```

This is where CopilotKit's shared-state channel earns its keep: the
supervisor's tool calls mutate `delegations` as they happen, and the
frontend renders every new entry live.

<Callout type="warn">
  Give every delegation a stable `id` and merge new entries by that `id`. The
  client sends its copy of shared state back as run input on every run, so a
  slot that blindly appends whatever it receives — a LangGraph
  `Annotated[list, operator.add]` reducer, for example — concatenates the
  entries the client just echoed onto the ones the agent already has, and the
  log doubles when a thread is continued.
</Callout>

## Rendering a live delegation log

On the frontend, the delegation log is a reactive render of the
`delegations` slot.


Subscribe with `useAgent({ updates:
[UseAgentUpdate.OnStateChanged, UseAgentUpdate.OnRunStatusChanged] })`,
read `agent.state.delegations`, and render one card per entry.

```typescript
// src/app/demos/subagents/delegation-log.tsx
/**
 * Live delegation log — renders the `delegations` slot of agent state.
 *
 * Each entry corresponds to one invocation of a sub-agent. The list
 * grows in real time as the supervisor fans work out to its children.
 * The parent header shows how many sub-agents have been called and
 * whether the supervisor is still running.
 */
// Fixed list of the three sub-agent roles the supervisor can call.
// Rendered as always-visible indicator chips at the top of the log
// (regardless of whether the supervisor has delegated yet) so the user
// — and the e2e suite — can see at a glance which sub-agents exist and
// which are currently active.
const INDICATOR_ROLES: ReadonlyArray<{
  role: "researcher" | "writer" | "critic";
  subAgent: SubAgentName;
}> = [
  { role: "researcher", subAgent: "research_agent" },
  { role: "writer", subAgent: "writing_agent" },
  { role: "critic", subAgent: "critique_agent" },
];

export function DelegationLog({ delegations, isRunning }: DelegationLogProps) {
  const calledRoles = new Set<SubAgentName>(
    delegations.map((d) => d.sub_agent),
  );

  return (
    <div
      data-testid="delegation-log"
      className="w-full h-full flex flex-col bg-white rounded-2xl shadow-sm border border-[#DBDBE5] overflow-hidden"
    >
      <div className="flex items-center justify-between px-6 py-3 border-b border-[#E9E9EF] bg-[#FAFAFC]">
        <div className="flex items-center gap-3">
          <span className="text-lg font-semibold text-[#010507]">
            Sub-agent delegations
          </span>
          {isRunning && (
            <span
              data-testid="supervisor-running"
              className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-[#BEC2FF] bg-[#BEC2FF1A] text-[#010507] text-[10px] font-semibold uppercase tracking-[0.12em]"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#010507] animate-pulse" />
              Supervisor running
            </span>
          )}
        </div>
        <span
          data-testid="delegation-count"
          className="text-xs font-mono text-[#838389]"
        >
          {delegations.length} calls
        </span>
      </div>

      <div
        data-testid="subagent-indicators"
        className="flex items-center gap-2 border-b border-[#E9E9EF] bg-white px-6 py-2"
      >
        {INDICATOR_ROLES.map(({ role, subAgent }) => {
          const style = SUB_AGENT_STYLE[subAgent];
          const fired = calledRoles.has(subAgent);
          return (
            <span
              key={role}
              data-testid={`subagent-indicator-${role}`}
              data-role={role}
              data-fired={fired ? "true" : "false"}
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-[0.1em] border ${style.color} ${
                fired ? "" : "opacity-60"
              }`}
            >
              <span aria-hidden>{style.emoji}</span>
              <span>{style.label}</span>
            </span>
          );
        })}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {delegations.length === 0 ? (
          <p className="text-[#838389] italic text-sm">
            Ask the supervisor to complete a task. Every sub-agent it calls will
            appear here.
          </p>
        ) : (
          delegations.map((d, idx) => {
            const style = SUB_AGENT_STYLE[d.sub_agent];
            return (
              <div
                key={d.id}
                data-testid="delegation-entry"
                className="border border-[#E9E9EF] rounded-xl p-3 bg-[#FAFAFC]"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-[#AFAFB7]">
                      #{idx + 1}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-[0.1em] border ${style.color}`}
                    >
                      <span>{style.emoji}</span>
                      <span>{style.label}</span>
                    </span>
                  </div>
                  <span className="text-[10px] uppercase tracking-[0.12em] font-semibold text-[#189370]">
                    {d.status}
                  </span>
                </div>
                <div className="text-xs text-[#57575B] mb-2">
                  <span className="font-semibold text-[#010507]">Task: </span>
                  {d.task}
                </div>
                <div className="text-sm text-[#010507] whitespace-pre-wrap bg-white rounded-lg p-2.5 border border-[#E9E9EF]">
                  {d.result}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
```




The result: as the supervisor fans work out to its sub-agents, the log
grows in real time, giving the user visibility into a process that
would otherwise be a long opaque spinner.

## Related

- **[Shared State](/mastra/shared-state)** — the channel that makes the
  delegation log live.
- **[State streaming](/mastra/shared-state/streaming)** — stream
  *individual* sub-agent outputs token-by-token inside each log entry.

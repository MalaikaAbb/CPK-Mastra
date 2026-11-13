// Sub-Agents — docs.copilotkit.ai/mastra/multi-agent/subagents (verbatim).
// The page prints this delegation-state helper as the complete
// `src/mastra/tools/working-memory.ts`; this repo keeps it next to subagents.ts.

/**
 * Shape of the slice of `ToolExecutionContext` we actually consume. We keep
 * this typed loosely (Record<string, unknown>) so we don't pin to the exact
 * Mastra tool-context internal shape — the bits we need (`agent.threadId`,
 * `agent.resourceId`, `mastra`) are stable but adjacent fields in
 * `ToolExecutionContext` change between Mastra beta releases.
 */
export interface MaybeToolExecutionContext {
  agent?: {
    agentId?: string;
    threadId?: string;
    resourceId?: string;
  };
  mastra?: {
    getAgentById?: (id: string) => unknown;
    getAgent?: (id: string) => unknown;
  };
  threadId?: string;
  resourceId?: string;
}

interface MemoryLike {
  getWorkingMemory?: (args: {
    threadId?: string;
    resourceId?: string;
  }) => Promise<unknown>;
  updateWorkingMemory: (args: {
    threadId?: string;
    resourceId?: string;
    workingMemory: string;
  }) => Promise<unknown>;
}

interface AgentLike {
  getMemory?: () => unknown;
}

function logWorkingMemoryFailure(
  component: string,
  reason: string,
  err?: unknown,
): void {
  console.error(
    JSON.stringify({
      at: new Date().toISOString(),
      level: "error",
      component,
      message: `working-memory write failed: ${reason}`,
      errorClass:
        err instanceof Error
          ? err.constructor.name
          : err
            ? "UnknownError"
            : undefined,
      detail:
        err instanceof Error ? err.message : err ? String(err) : undefined,
    }),
  );
}

async function resolveMemoryAndIds(
  ctx: MaybeToolExecutionContext,
  agentId: string,
  component: string,
): Promise<{
  memory: MemoryLike;
  threadId?: string;
  resourceId?: string;
} | null> {
  const threadId = ctx.agent?.threadId ?? ctx.threadId;
  const resourceId = ctx.agent?.resourceId ?? ctx.resourceId;
  if (!threadId && !resourceId) {
    logWorkingMemoryFailure(
      component,
      "no threadId or resourceId on tool execution context",
    );
    return null;
  }
  const mastra = ctx.mastra;
  if (!mastra) {
    logWorkingMemoryFailure(component, "no mastra on tool execution context");
    return null;
  }
  let agent: unknown;
  try {
    if (typeof mastra.getAgentById === "function") {
      agent = mastra.getAgentById(agentId);
    } else if (typeof mastra.getAgent === "function") {
      agent = mastra.getAgent(agentId);
    } else {
      logWorkingMemoryFailure(
        component,
        "mastra has no getAgentById/getAgent method",
      );
      return null;
    }
  } catch (err) {
    logWorkingMemoryFailure(component, "mastra.getAgentById threw", err);
    return null;
  }
  const a = agent as AgentLike | undefined;
  if (!a || typeof a.getMemory !== "function") {
    logWorkingMemoryFailure(
      component,
      `agent ${agentId} has no getMemory method`,
    );
    return null;
  }
  let memory: unknown;
  try {
    // `Agent.getMemory` is async in current @mastra/core (returns a Promise) —
    // it must be awaited, or `memory.updateWorkingMemory` reads off the Promise
    // as undefined and the write silently no-ops ("memory has no
    // updateWorkingMemory method"). await is safe if a sync value is returned.
    memory = await a.getMemory();
  } catch (err) {
    logWorkingMemoryFailure(component, "agent.getMemory threw", err);
    return null;
  }
  if (
    !memory ||
    typeof (memory as MemoryLike).updateWorkingMemory !== "function"
  ) {
    logWorkingMemoryFailure(
      component,
      `agent ${agentId} memory has no updateWorkingMemory method`,
    );
    return null;
  }
  return { memory: memory as MemoryLike, threadId, resourceId };
}

async function readExistingWorkingMemory(
  memory: MemoryLike,
  threadId: string | undefined,
  resourceId: string | undefined,
): Promise<Record<string, unknown>> {
  if (typeof memory.getWorkingMemory !== "function") {
    return {};
  }
  let raw: unknown;
  try {
    raw = await memory.getWorkingMemory({ threadId, resourceId });
  } catch {
    return {};
  }
  if (!raw) return {};
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);
      return typeof parsed === "object" && parsed !== null
        ? (parsed as Record<string, unknown>)
        : {};
    } catch {
      return {};
    }
  }
  if (typeof raw === "object") {
    return raw as Record<string, unknown>;
  }
  return {};
}

/**
 * Append a delegation entry to the supervisor agent's `delegations` array in
 * working memory. Determinism guarantee: this is what drives the UI's live
 * delegation log — it MUST run on every supervisor tool call, regardless of
 * whether the LLM remembers to mention the delegation in its next turn.
 */
export async function writeDelegationsToWorkingMemory(
  ctx: MaybeToolExecutionContext,
  newDelegation: Record<string, unknown>,
): Promise<void> {
  const component = "subagents";
  const agentId = ctx.agent?.agentId ?? "subagentsSupervisorAgent";
  const resolved = await resolveMemoryAndIds(ctx, agentId, component);
  if (!resolved) return;
  try {
    const existing = await readExistingWorkingMemory(
      resolved.memory,
      resolved.threadId,
      resolved.resourceId,
    );
    const existingDelegations = Array.isArray(existing.delegations)
      ? (existing.delegations as unknown[])
      : [];
    const merged: Record<string, unknown> = {
      ...existing,
      delegations: [...existingDelegations, newDelegation],
    };
    await resolved.memory.updateWorkingMemory({
      threadId: resolved.threadId,
      resourceId: resolved.resourceId,
      workingMemory: JSON.stringify(merged),
    });
  } catch (err) {
    logWorkingMemoryFailure(component, "updateWorkingMemory threw", err);
  }
}

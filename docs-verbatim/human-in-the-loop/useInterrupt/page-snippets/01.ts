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

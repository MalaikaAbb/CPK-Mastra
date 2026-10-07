// Verbatim from docs.copilotkit.ai/mastra/human-in-the-loop/governed-actions — the resume-side check.
// REFERENCE ONLY: `executeSideEffect` is called but never defined on the page.

type ApprovalResponse = {
  approved: boolean;
  actionId: string;
  reference: string;
};

async function handleApproval(action: GovernedAction, response: ApprovalResponse) {
  if (
    response.approved &&
    response.actionId === action.id &&
    response.reference === action.reference
  ) {
    return executeSideEffect(action.tool, action.arguments);
  }

  return {
    skipped: true,
    reason: "The user did not approve this action.",
  };
}

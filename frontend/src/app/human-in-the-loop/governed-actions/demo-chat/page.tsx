"use client";

/**
 * The "Tool-call approval with useHumanInTheLoop" snippet from
 * docs.copilotkit.ai/mastra/human-in-the-loop/governed-actions, verbatim below
 * `GovernedActionTool`'s imports.
 *
 * The page ships no agent, backend, or demo for this — so the tool is mounted
 * next to a plain chat on the harness's existing `myAgent`, whose prompt is
 * unchanged. The model calls `approve_governed_action` because the tool is
 * forwarded to it with its description; nothing else steers it there.
 *
 * Harness additions: the imports for DemoFrame / GovernedActionCard, and the
 * default-export page at the bottom.
 */
import { CopilotChat } from "@copilotkit/react-core/v2";
import { ToolCallStatus, useHumanInTheLoop } from "@copilotkit/react-core/v2";
import { z } from "zod";

import { DemoFrame } from "@/components/demo-frame";

import { GovernedActionCard } from "../governed-action-card";

const governedActionSchema = z.object({
  id: z.string(),
  summary: z.string(),
  tool: z.string(),
  reference: z.string(),
  verdict: z.enum(["allow", "deny", "require_approval"]),
  arguments: z.record(z.unknown()),
});

function GovernedActionTool() {
  useHumanInTheLoop(
    {
      name: "approve_governed_action",
      description:
        "Ask the user to approve a governed side-effect action before it runs.",
      parameters: governedActionSchema,
      render: ({ args, status, respond }) => {
        if (status !== ToolCallStatus.Executing || !respond) {
          return null;
        }

        return (
          <GovernedActionCard
            action={args}
            onApprove={() =>
              respond({
                approved: true,
                actionId: args.id,
                reference: args.reference,
              })
            }
            onReject={() =>
              respond({
                approved: false,
                actionId: args.id,
                reference: args.reference,
              })
            }
            onBlock={() =>
              respond({
                approved: false,
                actionId: args.id,
                reference: args.reference,
              })
            }
          />
        );
      },
    },
    [],
  );

  return null;
}

export default function Page() {
  return (
    <DemoFrame
      parentPath="/human-in-the-loop/governed-actions"
      subtitle="approve_governed_action · useHumanInTheLoop · myAgent"
    >
      <GovernedActionTool />
      <CopilotChat
        agentId="myAgent"
        labels={{
          welcomeMessageText:
            'Try "Email the Q3 report to finance@example.com, but get my approval first."',
        }}
      />
    </DemoFrame>
  );
}

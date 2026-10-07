"use client";

/**
 * The published demo page (Code tab: src/app/demos/subagents/page.tsx) on
 * docs.copilotkit.ai/mastra/multi-agent/subagents. Its own `<CopilotKit>` is
 * kept as published (same runtime URL as the root provider).
 *
 * Harness changes only: sibling-module imports re-pointed one level up, the
 * provider wrapped in `DemoFrame`, and `enableInspector` so exactly one
 * inspector mounts (see lib/inspector.ts).
 */

import React from "react";
import {
  CopilotKit,
  useAgent,
  UseAgentUpdate,
  useRenderTool,
} from "@copilotkit/react-core/v2";
import { z } from "zod";

import { DemoFrame } from "@/components/demo-frame";
import { nestedInspectorSetting } from "@/lib/inspector";

import { Delegation } from "../delegation-log";
import {
  SubAgentActivityCard,
  type SubAgentToolStatus,
} from "../subagent-activity-card";
import { DemoLayout } from "../demo-layout";
import { inferActiveSubAgent } from "../active-subagent";
import { useSubagentsSuggestions } from "../suggestions";

interface SubagentsAgentState {
  delegations?: Delegation[];
}

export default function SubagentsDemo() {
  return (
    <DemoFrame
      parentPath="/multi-agent/subagents"
      subtitle="agent: subagents · research → write → critique"
    >
      <CopilotKit
        runtimeUrl="/api/copilotkit"
        agent="subagents"
        enableInspector={nestedInspectorSetting}
      >
        <DemoContent />
      </CopilotKit>
    </DemoFrame>
  );
}

function DemoContent() {
  const { agent } = useAgent({
    agentId: "subagents",
    updates: [UseAgentUpdate.OnStateChanged, UseAgentUpdate.OnRunStatusChanged],
  });

  useSubagentsSuggestions();

  // Per-tool renderers — one for each sub-agent tool the supervisor can
  // call. These surface "Researcher is running task Y" inline in the
  // chat stream so the user can see what is happening without staring
  // at the side panel. Each tool's `render` receives streaming
  // parameters + the eventual result + a status that walks
  // inProgress → executing → complete.
  useRenderTool(
    {
      name: "research_agent",
      parameters: z.object({ task: z.string() }),
      render: ({ parameters, status, result }) => (
        <SubAgentActivityCard
          subAgent="research_agent"
          task={parameters?.task}
          status={status as SubAgentToolStatus}
          result={typeof result === "string" ? result : undefined}
        />
      ),
    },
    [],
  );

  useRenderTool(
    {
      name: "writing_agent",
      parameters: z.object({ task: z.string() }),
      render: ({ parameters, status, result }) => (
        <SubAgentActivityCard
          subAgent="writing_agent"
          task={parameters?.task}
          status={status as SubAgentToolStatus}
          result={typeof result === "string" ? result : undefined}
        />
      ),
    },
    [],
  );

  useRenderTool(
    {
      name: "critique_agent",
      parameters: z.object({ task: z.string() }),
      render: ({ parameters, status, result }) => (
        <SubAgentActivityCard
          subAgent="critique_agent"
          task={parameters?.task}
          status={status as SubAgentToolStatus}
          result={typeof result === "string" ? result : undefined}
        />
      ),
    },
    [],
  );

  const agentState = agent.state as SubagentsAgentState | undefined;
  const delegations = agentState?.delegations ?? [];
  const isRunning = agent.isRunning;
  const activeSubAgent = isRunning
    ? inferActiveSubAgent(delegations, agent.messages)
    : null;

  return (
    <DemoLayout
      delegations={delegations}
      isRunning={isRunning}
      activeSubAgent={activeSubAgent}
    />
  );
}

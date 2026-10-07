"use client";

/**
 * The published minimal demo (Code tab: src/app/demos/open-gen-ui/page.tsx) on
 * docs.copilotkit.ai/mastra/generative-ui/open-generative-ui.
 *
 * Its own `<CopilotKit>` because `openGenerativeUI` is a provider prop, and it
 * talks to the dedicated `api/copilotkit-ogui` runtime that enables the
 * Open Generative UI middleware for this agent.
 *
 * Harness changes only: wrapped in `DemoFrame`, `h-screen` → `h-full` so it fits
 * under the frame bar, and `enableInspector` so exactly one inspector mounts
 * (see lib/inspector.ts). The provider props are as published.
 */

import React from "react";
import { CopilotKit } from "@copilotkit/react-core/v2";

import { DemoFrame } from "@/components/demo-frame";
import { nestedInspectorSetting } from "@/lib/inspector";

import { VISUALIZATION_DESIGN_SKILL } from "../_minimal/design-skill";
import { Chat } from "../_minimal/chat";

export default function OpenGenUiDemo() {
  // Minimal Open Generative UI frontend: the built-in activity renderer is
  // registered by CopilotKitProvider, so a plain <CopilotChat /> is enough —
  // no custom tool renderers, no activity-renderer registration.
  // We DO pass `openGenerativeUI.designSkill` to swap in visualisation-tuned
  // guidance in place of the default shadcn design skill.
  return (
    <DemoFrame
      parentPath="/generative-ui/open-generative-ui"
      subtitle="minimal · agent: open-gen-ui · design skill: visualisation"
    >
      <CopilotKit
        runtimeUrl="/api/copilotkit-ogui"
        agent="open-gen-ui"
        openGenerativeUI={{ designSkill: VISUALIZATION_DESIGN_SKILL }}
        enableInspector={nestedInspectorSetting}
      >
        <div className="flex justify-center items-center h-full w-full">
          <div className="h-full w-full max-w-4xl flex flex-col p-3">
            <Chat />
          </div>
        </div>
      </CopilotKit>
    </DemoFrame>
  );
}

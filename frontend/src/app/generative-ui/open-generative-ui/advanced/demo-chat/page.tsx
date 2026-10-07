"use client";

/**
 * The published advanced demo (Code tab: src/app/demos/open-gen-ui-advanced/page.tsx)
 * on docs.copilotkit.ai/mastra/generative-ui/open-generative-ui.
 *
 * Same runtime as the minimal cell; the only difference is the
 * `sandboxFunctions` array on the provider, which the generated iframe can call
 * back into via `Websandbox.connection.remote.<name>(args)`.
 *
 * Harness changes only: wrapped in `DemoFrame`, `h-screen` → `h-full` so it fits
 * under the frame bar, and `enableInspector` so exactly one inspector mounts
 * (see lib/inspector.ts). The provider props are as published.
 */

import React from "react";
import {
  CopilotKit,
  CopilotChat,
  useConfigureSuggestions,
} from "@copilotkit/react-core/v2";

import { DemoFrame } from "@/components/demo-frame";
import { nestedInspectorSetting } from "@/lib/inspector";

import { openGenUiSandboxFunctions } from "../../_advanced/sandbox-functions";
import { openGenUiSuggestions } from "../../_advanced/suggestions";

export default function OpenGenUiAdvancedDemo() {
  return (
    <DemoFrame
      parentPath="/generative-ui/open-generative-ui"
      subtitle="advanced · agent: open-gen-ui-advanced · sandbox functions: evaluateExpression, notifyHost"
    >
      {/* Pass the sandbox-function array on the `openGenerativeUI` provider prop.
          The built-in `OpenGenerativeUIActivityRenderer` wires these as callable
          remotes inside the agent-authored iframe. */}
      <CopilotKit
        runtimeUrl="/api/copilotkit-ogui"
        agent="open-gen-ui-advanced"
        openGenerativeUI={{ sandboxFunctions: openGenUiSandboxFunctions }}
        enableInspector={nestedInspectorSetting}
      >
        <div className="flex justify-center items-center h-full w-full">
          <div className="h-full w-full max-w-4xl">
            <Chat />
          </div>
        </div>
      </CopilotKit>
    </DemoFrame>
  );
}

function Chat() {
  useConfigureSuggestions({
    suggestions: openGenUiSuggestions,
    available: "always",
  });

  return (
    <div className="flex h-full w-full flex-col p-3">
      <CopilotChat
        agentId="open-gen-ui-advanced"
        className="flex-1 rounded-2xl"
      />
    </div>
  );
}

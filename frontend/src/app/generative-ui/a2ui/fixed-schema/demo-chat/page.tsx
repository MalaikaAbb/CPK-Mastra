"use client";

/**
 * The published demo page (Code tab: src/app/demos/a2ui-fixed-schema/page.tsx)
 * on docs.copilotkit.ai/mastra/generative-ui/a2ui/fixed-schema.
 *
 * Its own `<CopilotKit>` because A2UI is configured per provider. The matching
 * runtime (`api/copilotkit-a2ui-fixed-schema`) sets `injectA2UITool: false`:
 * the agent owns `generate_a2ui`, which returns the operations container itself.
 *
 * Harness changes only: wrapped in `DemoFrame`, `h-screen` → `h-full` so it fits
 * under the frame bar, and `enableInspector` so exactly one inspector mounts
 * (see lib/inspector.ts). The provider props are as published.
 */

import React from "react";
import { CopilotKit } from "@copilotkit/react-core/v2";

import { DemoFrame } from "@/components/demo-frame";
import { nestedInspectorSetting } from "@/lib/inspector";

import { catalog } from "../a2ui/catalog";
import { Chat } from "../chat";

export default function A2UIFixedSchemaDemo() {
  return (
    <DemoFrame
      parentPath="/generative-ui/a2ui/fixed-schema"
      subtitle="agent: a2ui-fixed-schema · catalog: copilotkit://flight-fixed-catalog"
    >
      {/* `a2ui.catalog` wires the fixed catalog into the A2UI activity renderer. */}
      <CopilotKit
        runtimeUrl="/api/copilotkit-a2ui-fixed-schema"
        agent="a2ui-fixed-schema"
        a2ui={{ catalog: catalog }}
        enableInspector={nestedInspectorSetting}
      >
        <div className="flex justify-center items-center h-full w-full bg-neutral-50">
          <div className="h-full w-full max-w-4xl border-x border-neutral-200 bg-white">
            <Chat />
          </div>
        </div>
      </CopilotKit>
    </DemoFrame>
  );
}

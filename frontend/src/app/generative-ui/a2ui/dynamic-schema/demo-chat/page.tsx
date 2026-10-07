"use client";

/**
 * The published demo page (Code tab: src/app/demos/declarative-gen-ui/page.tsx)
 * on docs.copilotkit.ai/mastra/generative-ui/a2ui/dynamic-schema.
 *
 * Its own `<CopilotKit>` because A2UI is configured per provider:
 * `a2ui={{ catalog }}` is what registers the component vocabulary and, on the
 * page's default path, makes the runtime auto-inject `generate_a2ui`.
 *
 * Harness changes only: wrapped in `DemoFrame`, `h-screen` → `h-full` so it fits
 * under the frame bar, and `enableInspector` so exactly one inspector mounts
 * (see lib/inspector.ts). The provider props are as published.
 */

import React from "react";
import { CopilotKit } from "@copilotkit/react-core/v2";

import { DemoFrame } from "@/components/demo-frame";
import { nestedInspectorSetting } from "@/lib/inspector";

import { myCatalog } from "../a2ui/catalog";
import { Chat } from "../chat";

export default function DeclarativeGenUIDemo() {
  return (
    <DemoFrame
      parentPath="/generative-ui/a2ui/dynamic-schema"
      subtitle="agent: declarative-gen-ui · catalog: declarative-gen-ui-catalog"
    >
      <CopilotKit
        runtimeUrl="/api/copilotkit-declarative-gen-ui"
        agent="declarative-gen-ui"
        a2ui={{ catalog: myCatalog }}
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

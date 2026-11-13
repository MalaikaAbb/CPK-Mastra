"use client";

/**
 * The A2UI overview page's "Frontend" snippet —
 * docs.copilotkit.ai/mastra/generative-ui/a2ui — mounted around a chat.
 *
 * Verbatim: the `A2UITheme` import, the empty `myCustomTheme`, and
 * `<CopilotKit ... a2ui={{ theme: myCustomTheme }}>`.
 * Harness changes only: `runtimeUrl` → `/api/copilotkit-a2ui` (the page's
 * runtime snippet, on its own path here), `{children}` → a plain
 * `<CopilotChat />` (the page renders none), `DemoFrame`, and
 * `enableInspector` so exactly one inspector mounts (see lib/inspector.ts).
 */

import {
  CopilotChat,
  CopilotKit,
  type A2UITheme,
} from "@copilotkit/react-core/v2";

import { DemoFrame } from "@/components/demo-frame";
import { nestedInspectorSetting } from "@/lib/inspector";

// Your own theme object — the renderer reads the keys it understands.
// Leave the `a2ui` prop off entirely to keep the built-in theme.
const myCustomTheme: A2UITheme = {
  // ...your theme keys
};

export default function Page() {
  return (
    <DemoFrame
      parentPath="/generative-ui/a2ui"
      subtitle="agent: default (myAgent) · runtime a2ui: {}"
    >
      <CopilotKit
        runtimeUrl="/api/copilotkit-a2ui"
        a2ui={{ theme: myCustomTheme }}
        enableInspector={nestedInspectorSetting}
      >
        <div className="h-full">
          <CopilotChat className="h-full" />
        </div>
      </CopilotKit>
    </DemoFrame>
  );
}

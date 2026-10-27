"use client";

/**
 * The second sample on docs.copilotkit.ai/mastra/prebuilt-components/copilot-threads-drawer:
 * the same drawer hosted by `<CopilotSidebar>` instead of `<CopilotChat>`.
 *
 * Harness changes only: wrapped in `DemoFrame`, `100dvh` → `100%`, the same
 * runtime props as the CopilotChat demo (`runtimeUrl`, `useSingleEndpoint`,
 * `enableInspector`), and a `YourMainContent` stand-in — see below.
 */

import {
  CopilotKitProvider,
  CopilotChatConfigurationProvider,
  CopilotSidebar,
  CopilotThreadsDrawer,
} from "@copilotkit/react-core/v2";
import "@copilotkit/react-core/v2/styles.css";

import { DemoFrame } from "@/components/demo-frame";
import { nestedInspectorSetting } from "@/lib/inspector";

// HARNESS: the sample renders `<YourMainContent />` but never defines it — it
// stands for the host app's own content. This placeholder only fills that spot.
function YourMainContent() {
  return (
    <div className="flex h-full items-center justify-center p-6 text-center text-sm text-slate-500">
      Your main content. The sidebar chat is docked at the right edge.
    </div>
  );
}

export default function Page() {
  return (
    <DemoFrame
      parentPath="/prebuilt-components/copilot-threads-drawer"
      subtitle="Drawer + CopilotSidebar · shared chat configuration"
    >
      <CopilotKitProvider
        runtimeUrl="/api/copilotkit-threads"
        useSingleEndpoint={false}
        enableInspector={nestedInspectorSetting}
      >
        <CopilotChatConfigurationProvider>
          <div style={{ display: "flex", height: "100%" }}>
            <CopilotThreadsDrawer />
            <main style={{ flex: 1 }}>
              <YourMainContent />
              <CopilotSidebar defaultOpen={true} />
            </main>
          </div>
        </CopilotChatConfigurationProvider>
      </CopilotKitProvider>
    </DemoFrame>
  );
}

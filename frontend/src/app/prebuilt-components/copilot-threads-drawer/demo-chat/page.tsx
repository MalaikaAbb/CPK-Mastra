"use client";

/**
 * The first sample on docs.copilotkit.ai/mastra/prebuilt-components/copilot-threads-drawer:
 * `<CopilotThreadsDrawer>` beside `<CopilotChat>`, both inside one
 * `<CopilotChatConfigurationProvider>`, with no thread state of our own.
 *
 * The "Header slot" tab mounts the page's slot snippet in the drawer's place.
 * `CopilotThreadsDrawerProps` has no `children` in @copilotkit/react-core
 * 1.79.1 and the component never renders them, so the snippet is kept as
 * published behind a `@ts-expect-error` — see README §9.
 *
 * Harness changes only: wrapped in `DemoFrame` with a tab bar, `100dvh` →
 * `100%` so it fits under the frame bar, `runtimeUrl` → the dedicated
 * Intelligence runtime (`api/copilotkit-threads`), `useSingleEndpoint={false}`
 * because that runtime is multi-route (from the Intelligence quickstart), and
 * `enableInspector` so exactly one inspector mounts (see lib/inspector.ts).
 */

import {
  CopilotKitProvider,
  CopilotChatConfigurationProvider,
  CopilotChat,
  CopilotThreadsDrawer,
} from "@copilotkit/react-core/v2";
import "@copilotkit/react-core/v2/styles.css";
import { useState } from "react";

import { DemoFrame } from "@/components/demo-frame";
import { nestedInspectorSetting } from "@/lib/inspector";

type Variant = "published" | "slot";

const TABS: { id: Variant; label: string; blurb: string }[] = [
  {
    id: "published",
    label: "As published",
    blurb: "Drawer + CopilotChat · shared chat configuration",
  },
  {
    id: "slot",
    label: "Header slot",
    blurb: 'slot="header" child · expect "My conversations"',
  },
];

export default function Page() {
  const [variant, setVariant] = useState<Variant>("published");
  const active = TABS.find((t) => t.id === variant)!;

  return (
    <DemoFrame
      parentPath="/prebuilt-components/copilot-threads-drawer"
      subtitle={active.blurb}
    >
      <div className="flex h-full flex-col">
        <div className="flex shrink-0 flex-wrap gap-2 border-b border-slate-200 p-3 dark:border-slate-800">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setVariant(tab.id)}
              className={`rounded-md border px-3 py-1.5 text-sm font-medium transition-colors ${
                variant === tab.id
                  ? "border-[var(--accent)] text-[var(--accent)]"
                  : "border-slate-300 text-slate-600 hover:border-slate-400 dark:border-slate-600 dark:text-slate-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="min-h-0 flex-1">
          <CopilotKitProvider
            runtimeUrl="/api/copilotkit-threads"
            useSingleEndpoint={false}
            enableInspector={nestedInspectorSetting}
          >
            <CopilotChatConfigurationProvider>
              <div style={{ display: "flex", height: "100%" }}>
                {variant === "published" && <CopilotThreadsDrawer />}
                {variant === "slot" && (
                  // @ts-expect-error -- published slot snippet; the drawer's props have no `children` in 1.79.1
                  <CopilotThreadsDrawer>
                    <span slot="header">My conversations</span>
                  </CopilotThreadsDrawer>
                )}
                <CopilotChat />
              </div>
            </CopilotChatConfigurationProvider>
          </CopilotKitProvider>
        </div>
      </div>
    </DemoFrame>
  );
}

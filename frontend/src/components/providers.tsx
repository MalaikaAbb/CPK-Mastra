"use client";

import { CopilotKit } from "@copilotkit/react-core/v2";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { rootInspectorSetting } from "@/lib/inspector";

import { backgroundTaskActivityRenderer } from "./background-task-activity";

/**
 * One provider for the whole app, so chat state survives navigation between
 * test routes.
 *
 * The Inspector is controlled by `enableInspector` only (on by default in dev
 * on localhost); `showDevConsole` no longer affects it in 1.77. Routes that
 * mount their own `<CopilotKit>` get `false` here so only one Inspector
 * exists per page — see `lib/inspector.ts`. Never mount
 * `<CopilotKitInspector />` by hand: it forwards `core ?? null`, so a bare
 * instance reports "CopilotKit core not attached".
 */

const RUNTIME_URL = "/api/copilotkit";

const LICENSE_KEY = process.env.NEXT_PUBLIC_COPILOTKIT_LICENSE_KEY;

const ACTIVITY_RENDERERS = [backgroundTaskActivityRenderer];

export function Providers({ children }: { children: React.ReactNode }) {
  // Routes that mount their own <CopilotKit> own the inspector there — two on
  // one page is fatal. `lib/inspector.ts` holds the list and the reasoning.
  const pathname = usePathname();

  return (
    <CopilotKit
      runtimeUrl={RUNTIME_URL}
      {...(LICENSE_KEY ? { publicLicenseKey: LICENSE_KEY } : {})}
      enableInspector={rootInspectorSetting(pathname)}
      // Activity renderers are provider-level, not page-level — this is what
      // makes the Background Tasks route show progress cards.
      renderActivityMessages={ACTIVITY_RENDERERS}
      onError={(event) => {
        console.error(`[CopilotKit ${event.code}]`, event.error);
      }}
    >
      {children}
    </CopilotKit>
  );
}

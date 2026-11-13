"use client";

/**
 * MCP Apps — docs.copilotkit.ai/mastra/generative-ui/mcp-apps.
 *
 * The page's `providers.tsx` (`<CopilotKit runtimeUrl useSingleEndpoint={false}>`)
 * and `page.tsx` (`<main><h1>Your App</h1><CopilotSidebar /></main>`), verbatim
 * except: `runtimeUrl` → `/api/copilotkit-mcp-apps` (the page's runtime, on its
 * own path here), `DemoFrame`, and `enableInspector` so exactly one inspector
 * mounts (see lib/inspector.ts). The page's layout.tsx only imports the
 * stylesheet, which is imported here.
 */

import { CopilotKit, CopilotSidebar } from "@copilotkit/react-core/v2";
import "@copilotkit/react-core/v2/styles.css";

import { DemoFrame } from "@/components/demo-frame";
import { nestedInspectorSetting } from "@/lib/inspector";

function YourPage() {
  return (
    <main>
      <h1>Your App</h1>
      <CopilotSidebar />
    </main>
  );
}

export default function Page() {
  return (
    <DemoFrame
      parentPath="/generative-ui/mcp-apps"
      subtitle="agent: default (mcpAppsAgent) · MCP server: http://localhost:3108/mcp"
    >
      <CopilotKit
        runtimeUrl="/api/copilotkit-mcp-apps"
        useSingleEndpoint={false}
        enableInspector={nestedInspectorSetting}
      >
        <YourPage />
      </CopilotKit>
    </DemoFrame>
  );
}

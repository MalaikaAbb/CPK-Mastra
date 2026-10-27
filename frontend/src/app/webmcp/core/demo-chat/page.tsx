"use client";

import { DemoFrame } from "@/components/demo-frame";

import { copilotkit } from "../../webmcp";
import { WebMCPStatus } from "../../webmcp-status";

// Keeps the module — and so the core instance — in use for as long as the page
// is open, as the guide asks.
void copilotkit;

/**
 * docs.copilotkit.ai/mastra/webmcp — Add WebMCP manually, WebMCP only, with no
 * agent.
 *
 * Importing `../../webmcp` creates the guide's `CopilotKitCore` with
 * `searchOrders`, which registers it on `document.modelContext`. No runtime,
 * no agent, no chat: only a WebMCP browser agent can call it.
 *
 * A separate page from the React demo because both register a tool named
 * `searchOrders`, and WebMCP rejects a duplicate name.
 */
export default function Page() {
  return (
    <DemoFrame parentPath="/webmcp" subtitle="CopilotKitCore only · no runtime, no agent">
      <div className="mx-auto max-w-xl space-y-4 p-6">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          There is no chat here. Open the Model Context Tool Inspector
          extension on this tab, find <code>searchOrders</code>, and call it
          with <code>{'{ "status": "open" }'}</code> — the call shows up
          below.
        </p>
        <WebMCPStatus />
      </div>
    </DemoFrame>
  );
}

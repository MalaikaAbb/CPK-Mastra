"use client";

import { CopilotChat } from "@copilotkit/react-core/v2";

import { DemoFrame } from "@/components/demo-frame";

import { OrderSearch } from "../order-search";
import { WebMCPStatus } from "../webmcp-status";

/**
 * docs.copilotkit.ai/mastra/webmcp — Add WebMCP manually, React frontend tool.
 *
 * `<OrderSearch />` registers `searchOrders` with `webmcp` on the app's
 * existing `CopilotKitProvider` (the root one, `/api/copilotkit`). The same
 * handler then serves two callers:
 *  - the CopilotKit agent in the chat (`myAgent`), and
 *  - a WebMCP browser agent, via `document.modelContext` (Chrome 149+).
 */
export default function Page() {
  return (
    <DemoFrame parentPath="/webmcp" subtitle="searchOrders · webmcp readOnlyHint">
      <OrderSearch />
      <div className="grid h-full grid-cols-1 lg:grid-cols-[1fr_22rem]">
        <div className="min-h-0">
          <CopilotChat
            agentId="myAgent"
            labels={{
              welcomeMessageText:
                'Try "Which of my orders are still open?" — the agent calls searchOrders.',
            }}
          />
        </div>
        <aside className="overflow-y-auto border-t border-slate-200 p-4 lg:border-l lg:border-t-0 dark:border-slate-800">
          <WebMCPStatus />
        </aside>
      </div>
    </DemoFrame>
  );
}

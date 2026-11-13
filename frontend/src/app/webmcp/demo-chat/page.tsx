"use client";

import { CopilotChat } from "@copilotkit/react-core/v2";

import { DemoFrame } from "@/components/demo-frame";

import { OrderSearch } from "../OrderSearch";

/**
 * Mounts the page's `OrderSearch` inside the app's root `CopilotKitProvider`
 * (the page says it must run inside an existing provider), next to a chat on
 * the Quickstart agent so the same tool can also be called by a CopilotKit
 * agent. Harness scaffolding only; the tool itself is verbatim.
 */
export default function Page() {
  return (
    <DemoFrame
      parentPath="/webmcp"
      subtitle="searchOrders · webmcp: { annotations: { readOnlyHint: true } }"
    >
      <OrderSearch />
      <CopilotChat
        agentId="myAgent"
        labels={{
          welcomeMessageText:
            'Try "Find my shipped orders" — or call searchOrders from a WebMCP browser agent.',
        }}
      />
    </DemoFrame>
  );
}

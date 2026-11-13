"use client";

// WebMCP — docs.copilotkit.ai/mastra/webmcp ("React frontend tool"), verbatim.
// `searchOrders` is never defined on the page. It is NOT stubbed here: the
// line keeps a @ts-expect-error and a call throws a ReferenceError at runtime
// (README §9, 28).

import { useFrontendTool } from "@copilotkit/react-core/v2";
import { z } from "zod";

export function OrderSearch() {
  useFrontendTool({
    name: "searchOrders",
    description: "Search the signed-in user's orders by status",
    parameters: z.object({
      status: z.enum(["open", "shipped", "delivered"]),
    }),
    handler: async ({ status }) => {
      // @ts-expect-error -- published: `searchOrders` is never defined on the page
      const orders = await searchOrders(status);
      return JSON.stringify(orders);
    },
    webmcp: {
      annotations: {
        readOnlyHint: true,
      },
    },
  });

  return null;
}

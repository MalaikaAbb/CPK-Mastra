import { CopilotKitCore } from "@copilotkit/core";
import { z } from "zod";

export const copilotkit = new CopilotKitCore({
  tools: [
    {
      name: "searchOrders",
      description: "Search the signed-in user's orders by status",
      parameters: z.object({
        status: z.enum(["open", "shipped", "delivered"]),
      }),
      handler: async ({ status }) => {
        const orders = await searchOrders(status);
        return JSON.stringify(orders);
      },
      webmcp: {
        annotations: {
          readOnlyHint: true,
        },
      },
    },
  ],
});

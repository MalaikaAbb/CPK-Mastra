// Runtime for MCP Apps — docs.copilotkit.ai/mastra/generative-ui/mcp-apps
//
// The page's `app/api/copilotkit/[[...slug]]/route.ts`, verbatim except:
//  - FRAMEWORK SWAP: step 1 builds a CopilotKit `BuiltInAgent`; here `agent`
//    is this repo's Mastra `mcpAppsAgent` (same model and prompt), reached
//    with `getLocalAgent` like the other dedicated routes.
//  - `basePath` is `/api/copilotkit-mcp-apps`, because `/api/copilotkit` is
//    the shared runtime every other route uses.
// The MCP server at http://localhost:3108/mcp is not part of this repo; start
// one of the ext-apps demo servers the page links to (see README).

import {
  CopilotRuntime,
  createCopilotRuntimeHandler,
  InMemoryAgentRunner,
} from "@copilotkit/runtime/v2";
import { getLocalAgent } from "@ag-ui/mastra";
import { mastra } from "@/mastra";

// 1. Create your agent
// HARNESS: Mastra agent in place of the page's BuiltInAgent (see header).
const agent = getLocalAgent({
  mastra,
  agentId: "mcpAppsAgent",
  resourceId: "mastra-mcp-apps",
});

if (!agent) {
  throw new Error("getLocalAgent returned null for mcpAppsAgent");
}

// 2. Create a service adapter, empty if not relevant

// 3. Create the runtime with mcpApps configured
const runtime = new CopilotRuntime({
  agents: {
    default: agent,
  },
  mcpApps: {
    servers: [
      {
        type: "http",
        url: "http://localhost:3108/mcp",
        serverId: "my-server", // Recommended: stable identifier
      },
    ],
  },
  runner: new InMemoryAgentRunner(),
});

// 4. Create the API route
const handler = createCopilotRuntimeHandler({
  runtime,
  basePath: "/api/copilotkit-mcp-apps",
});

export const GET = handler;
export const POST = handler;

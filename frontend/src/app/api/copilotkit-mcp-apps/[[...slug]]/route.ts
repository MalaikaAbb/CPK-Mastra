// Step 3 — Configure your agent
// docs.copilotkit.ai/mastra/generative-ui/mcp-apps
//
// The page's runtime, built twice — once per MCP server the demo lets you
// pick — and served under `/api/copilotkit-mcp-apps/<server>`:
//  - `local`: the page's own server, `http://localhost:3108/mcp` (an ext-apps
//    example you run yourself; see the route's notes page).
//  - `live`: the public Excalidraw MCP App server, the one CopilotKit's own
//    showcase uses, so the route works without running anything locally.
// Apart from the server and `basePath`, each runtime is the page's code. The
// page puts it at `app/api/copilotkit/[[...slug]]/route.ts`, which would
// collide with this repo's main `/api/copilotkit` runtime.
//
// The page's agent is CopilotKit's `BuiltInAgent`, not a Mastra agent — the
// page shows no Mastra code.

import {
  CopilotRuntime,
  createCopilotRuntimeHandler,
  InMemoryAgentRunner,
} from "@copilotkit/runtime/v2";
import { BuiltInAgent } from "@copilotkit/runtime/v2";

const MCP_SERVERS = {
  local: {
    type: "http",
    url: "http://localhost:3108/mcp",
    serverId: "my-server", // Recommended: stable identifier
  },
  live: {
    type: "http",
    url: "https://mcp.excalidraw.com/mcp",
    serverId: "excalidraw",
  },
} as const;

type ServerKey = keyof typeof MCP_SERVERS;

function createHandler(server: ServerKey) {
  // 1. Create your agent
  const agent = new BuiltInAgent({
    model: "openai/gpt-5.4",
    prompt: "You are a helpful assistant.",
  });

  // 2. Create a service adapter, empty if not relevant

  // 3. Create the runtime with mcpApps configured
  const runtime = new CopilotRuntime({
    agents: {
      default: agent,
    },
    mcpApps: {
      servers: [MCP_SERVERS[server]],
    },
    runner: new InMemoryAgentRunner(),
  });

  // 4. Create the API route
  return createCopilotRuntimeHandler({
    runtime,
    basePath: `/api/copilotkit-mcp-apps/${server}`,
  });
}

const handlers: Record<ServerKey, (request: Request) => Promise<Response>> = {
  local: createHandler("local"),
  live: createHandler("live"),
};

// `/api/copilotkit-mcp-apps/<server>/...` → that server's runtime.
function handler(request: Request) {
  const server = new URL(request.url).pathname.split("/")[3];
  if (server !== "local" && server !== "live") {
    return Response.json(
      { error: "Use /api/copilotkit-mcp-apps/local or /api/copilotkit-mcp-apps/live" },
      { status: 404 },
    );
  }
  return handlers[server](request);
}

export const GET = handler;
export const POST = handler;

import {
  CopilotRuntime,
  createCopilotRuntimeHandler,
  InMemoryAgentRunner,
} from "@copilotkit/runtime/v2";
import { getLocalAgent } from "@ag-ui/mastra";

import { mastra } from "@/mastra";

/**
 * https://docs.copilotkit.ai/mastra/generative-ui/components ("Add the
 * runtime and an agent"): `new CopilotRuntime({ agents: { default: agent },
 * runner: new InMemoryAgentRunner() })`, served multi-route at `[[...slug]]`,
 * as published. Mounted at `/api/copilotkit-genui`, not `/api/copilotkit`, so
 * the catalogs these demos send never reach the other routes' agents.
 *
 * `agent` is this repo's `componentsAgent` (src/mastra/agents.ts), reached
 * with `getLocalAgent` like `/api/copilotkit-ogui` reaches its agents,
 * instead of the section's TanStack `BuiltInAgent` (framework-own-agents).
 */
const agent = getLocalAgent({
  mastra,
  agentId: "componentsAgent",
  resourceId: "mastra-components",
});

if (!agent) {
  throw new Error("getLocalAgent returned null for componentsAgent");
}

const runtime = new CopilotRuntime({
  agents: { default: agent },
  runner: new InMemoryAgentRunner(),
});

const handler = createCopilotRuntimeHandler({ runtime, basePath: "/api/copilotkit-genui" });

export const GET = handler;
export const POST = handler;

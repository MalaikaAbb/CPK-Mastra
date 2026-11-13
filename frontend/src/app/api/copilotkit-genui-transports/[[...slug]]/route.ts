import {
  CopilotRuntime,
  createCopilotRuntimeHandler,
} from "@copilotkit/runtime/v2";
import { getLocalAgent } from "@ag-ui/mastra";

import { mastra } from "@/mastra";

/**
 * https://docs.copilotkit.ai/mastra/generative-ui/components/transports prints
 * `new CopilotRuntime({ agents: { default: agent }, generativeUI: true })`
 * (verbatim below), mounted at `/api/copilotkit-genui-transports` so
 * `generativeUI: true` stays on this page. The page's "Only some agents"
 * sample names a `shop` agent; no page publishes one, so none is registered.
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
  generativeUI: true,
});

const handler = createCopilotRuntimeHandler({ runtime, basePath: "/api/copilotkit-genui-transports" });

export const GET = handler;
export const POST = handler;

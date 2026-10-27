// Runtime for the Threads Drawer demos.
//
// HARNESS GLUE: both samples on docs.copilotkit.ai/mastra/prebuilt-components/copilot-threads-drawer
// point at `runtimeUrl="/api/copilotkit"` and show no runtime config — the page
// only says threads need CopilotKit Intelligence. In this repo `/api/copilotkit`
// is the single-route SSE runtime every other route runs on, so turning
// Intelligence on there would change all of them. This dedicated route carries
// the Intelligence setup instead.
//
// `CopilotKitIntelligence`, `identifyUser`, and the multi-route catch-all
// handler are the TypeScript tab of docs.copilotkit.ai/mastra/intelligence/quickstart.
// Two harness choices on top of it:
//  - `identifyUser` returns a fixed user. That page allows a fixed identity for a
//    local, single-user demo only; this harness has no auth to verify against.
//  - With no `CPK_INTELLIGENCE_API_KEY` the runtime is built without
//    `intelligence` (SSE mode), rather than letting `CopilotKitIntelligence`
//    throw on a blank key. That keeps the drawer's documented locked view
//    testable on a machine without a project key.

import {
  CopilotKitIntelligence,
  CopilotRuntime,
  createCopilotRuntimeHandler,
} from "@copilotkit/runtime/v2";
import { getLocalAgent } from "@ag-ui/mastra";
import { mastra } from "@/mastra";

// Registered as `default`: the published samples render `<CopilotChat />` and
// `<CopilotThreadsDrawer />` with no `agentId`, so they resolve the default
// agent. `myAgent` is the Quickstart's agent.
const agent = getLocalAgent({
  mastra,
  agentId: "myAgent",
  resourceId: "copilotkit-harness",
});

if (!agent) {
  throw new Error("getLocalAgent returned null for myAgent");
}

const agents = { default: agent };

const apiKey = process.env.CPK_INTELLIGENCE_API_KEY;

const runtime = apiKey
  ? new CopilotRuntime({
      agents,
      // Pass the Intelligence client to the runtime
      intelligence: new CopilotKitIntelligence({ apiKey }),
      // Fixed identity — single-user local harness (see header).
      identifyUser: async () => ({
        id: "copilotkit-harness",
        name: "Harness user",
      }),
    })
  : new CopilotRuntime({ agents });

const handler = createCopilotRuntimeHandler({
  runtime,
  basePath: "/api/copilotkit-threads",
});

export const GET = handler;
export const POST = handler;
export const PATCH = handler;
export const DELETE = handler;

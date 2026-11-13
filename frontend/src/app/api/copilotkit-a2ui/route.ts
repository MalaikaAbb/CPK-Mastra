// Runtime for the A2UI overview page — docs.copilotkit.ai/mastra/generative-ui/a2ui
//
// The page's "Backend" snippet, verbatim except:
//  - `myAgent` is undefined in the snippet; here it is this repo's Quickstart
//    Mastra agent (`myAgent`), reached with `getLocalAgent` like the other
//    dedicated runtime routes.
//  - `basePath` is `/api/copilotkit-a2ui`, because `/api/copilotkit` is the
//    shared runtime every other route uses.

import {
  CopilotRuntime,
  createCopilotRuntimeHandler,
} from "@copilotkit/runtime/v2";
import { getLocalAgent } from "@ag-ui/mastra";
import { mastra } from "@/mastra";

// HARNESS: the snippet's `myAgent` (never defined on the page).
const myAgent = getLocalAgent({
  mastra,
  agentId: "myAgent",
  resourceId: "mastra-a2ui-overview",
});

if (!myAgent) {
  throw new Error("getLocalAgent returned null for myAgent");
}

const runtime = new CopilotRuntime({
  agents: { default: myAgent },
  a2ui: {},
});

// Single-route: only POST needed, no catch-all [...path] required
const handler = createCopilotRuntimeHandler({
  runtime,
  basePath: "/api/copilotkit-a2ui",
  mode: "single-route",
});

export { handler as POST };

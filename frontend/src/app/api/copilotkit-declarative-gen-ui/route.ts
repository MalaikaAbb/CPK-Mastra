// Runtime for the A2UI Dynamic Schema demo.
//
// HARNESS GLUE: the published demo page points at
// `runtimeUrl="/api/copilotkit-declarative-gen-ui"`, but no such route ships on
// the page or in its demo Code tab. This file supplies it with the handler
// shape of the published `api/copilotkit-ogui/route.ts`.
//
// PROSE-ONLY CONFIG: the page describes (but prints no code for) a same-process
// route that sets `injectA2UITool: false` and pins `defaultCatalogId`, because
// "its agent already supplies its own generate_a2ui". That agent is not
// printed either, and is not filled in here, so this route has no A2UI tool
// at all and renders nothing. Broken by design until the page prints the agent.

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  CopilotRuntime,
  createCopilotRuntimeHandler,
} from "@copilotkit/runtime/v2";
import { getLocalAgent } from "@ag-ui/mastra";
import { mastra } from "@/mastra";

const agent = getLocalAgent({
  mastra,
  agentId: "declarativeGenUiAgent",
  resourceId: "mastra-declarative-gen-ui",
});

if (!agent) {
  throw new Error("getLocalAgent returned null for declarativeGenUiAgent");
}

const runtime = new CopilotRuntime({
  agents: { "declarative-gen-ui": agent },
  a2ui: {
    injectA2UITool: false,
    defaultCatalogId: "declarative-gen-ui-catalog",
  },
});

export const POST = async (req: NextRequest) => {
  try {
    const copilotHandler = createCopilotRuntimeHandler({
      runtime,
      basePath: "/api/copilotkit-declarative-gen-ui",
      mode: "single-route",
    });
    return await copilotHandler(req);
  } catch (error: unknown) {
    const e = error as { message?: string; stack?: string };
    return NextResponse.json(
      { error: e.message, stack: e.stack },
      { status: 500 },
    );
  }
};

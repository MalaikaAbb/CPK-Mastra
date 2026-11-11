// Runtime for the A2UI Dynamic Schema demo.
//
// HARNESS GLUE: the published demo page points at
// `runtimeUrl="/api/copilotkit-declarative-gen-ui"`, but no such route ships on
// the page or in its demo Code tab. This file supplies it with the handler
// shape of the published `api/copilotkit-ogui/route.ts`.
//
// The `a2ui` block follows the page's "Mastra in the same process" prose: the
// agent owns `generate_a2ui`, so injection is off, and `defaultCatalogId` is
// pinned to the catalog the demo page registers. The page describes this route
// but prints no code for it; the option names match its printed separate-
// process `registerCopilotKit` snippet.

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

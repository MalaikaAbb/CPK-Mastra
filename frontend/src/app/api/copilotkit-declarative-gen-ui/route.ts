// Runtime for the A2UI Dynamic Schema demo.
//
// HARNESS GLUE: the published demo page points at
// `runtimeUrl="/api/copilotkit-declarative-gen-ui"`, but no such route ships on
// the page or in its demo Code tab. This file supplies it with the handler
// shape of the published `api/copilotkit-ogui/route.ts`.
//
// Deliberately NO `a2ui` block: per the page's default path, passing a catalog
// to the provider auto-enables A2UI and injects `generate_a2ui`, "so the
// runtime needs no `a2ui` block". (The demo page's own header comment claims
// this route sets `injectA2UITool: false` with a backend-owned tool — that is
// the opt-out path, and contradicts the page prose; see README §9.)

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

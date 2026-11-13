"use client";

/**
 * The published demo page (Code tab: src/app/demos/gen-ui-tool-based/page.tsx)
 * on docs.copilotkit.ai/mastra/generative-ui/tool-based.
 *
 * Harness changes only: sibling imports re-pointed one level up, the
 * provider wrapped in `DemoFrame`, `h-screen` → `h-full` so it fits under the
 * frame bar, `enableInspector` so exactly one inspector mounts (see
 * lib/inspector.ts), and the showcase-only `useSuggestions` (./suggestions,
 * not printed) commented out. `./bar-chart` and `./pie-chart` are not printed
 * either; they are borrowed from the agno harness (labelled in each file).
 */

import React from "react";
import {
  CopilotChat,
  CopilotKit,
  useComponent,
} from "@copilotkit/react-core/v2";

import { DemoFrame } from "@/components/demo-frame";
import { nestedInspectorSetting } from "@/lib/inspector";

import { BarChart, barChartPropsSchema } from "../bar-chart";
import { PieChart, pieChartPropsSchema } from "../pie-chart";
// HARNESS: showcase suggestion chips, not printed on the page — left out.
// import { useSuggestions } from "./suggestions";

function Chat() {
  useComponent({
    name: "render_bar_chart",
    description: "Display a bar chart with labeled numeric values.",
    parameters: barChartPropsSchema,
    render: BarChart,
  });

  useComponent({
    name: "render_pie_chart",
    description: "Display a pie chart with labeled numeric values.",
    parameters: pieChartPropsSchema,
    render: PieChart,
  });

  // useSuggestions(); // HARNESS: see import

  return (
    <div className="flex justify-center items-center h-full w-full">
      <div className="h-full w-full max-w-4xl">
        <CopilotChat
          agentId="gen-ui-tool-based"
          className="h-full rounded-2xl"
        />
      </div>
    </div>
  );
}

export default function ControlledGenUiDemo() {
  return (
    <DemoFrame
      parentPath="/generative-ui/tool-based"
      subtitle="agent: gen-ui-tool-based · useComponent render_bar_chart / render_pie_chart"
    >
      <CopilotKit
        runtimeUrl="/api/copilotkit"
        agent="gen-ui-tool-based"
        enableInspector={nestedInspectorSetting}
      >
        <Chat />
      </CopilotKit>
    </DemoFrame>
  );
}

"use client";

import { standardUI } from "@copilotkit/react-core/v2/generative-ui";

import { DemoFrame } from "@/components/demo-frame";

import { GenUIDemo } from "../_shared/genui-demo";

/**
 * The page's step 3: a provider given `generativeUI={{ ui: standardUI }}` and a
 * plain chat. Harness change: the provider's `runtimeUrl` is
 * `/api/copilotkit-genui` (the page's runtime, mounted beside the main one),
 * whose agent is this repo's `componentsAgent` Mastra agent standing in for
 * the page's TanStack `BuiltInAgent`, with the same prompt.
 *
 * The model gets `render_ui` with its full schema but not its guide: Mastra
 * puts the run's context on `requestContext`, not in the prompt (README
 * Known issues). Not yet checked in a browser.
 */
export default function DemoPage() {
  return (
    <DemoFrame parentPath="/generative-ui/components" subtitle="standardUI · agent: componentsAgent (Mastra)">
      <GenUIDemo
        variants={[
          {
            id: "overview",
            label: "standardUI",
            generativeUI: { ui: standardUI },
            welcome: "Try: Compare the Starter, Team, and Enterprise plans in a table",
          },
        ]}
      />
    </DemoFrame>
  );
}

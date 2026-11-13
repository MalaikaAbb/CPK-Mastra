import { RouteHeader } from "@/components/route-header";
import { SourceCode, SourceCodeGroup } from "@/components/source-code";
import { Callout, Panel } from "@/components/ui";

const V = "docs-verbatim/generative-ui/hashbrown/page-snippets";

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/hashbrown" />

      <Callout tone="warn" title="Reference-only: the agent and the renderer's imports are never printed">
        <p>
          The page prints <code>page.tsx</code>, <code>chat.tsx</code> and{" "}
          <code>hashbrown-renderer.tsx</code> plus an example assistant
          message. It has no Code tab. Not printed anywhere: the Mastra agent
          and prompt that stream the <code>{"{ ui: [...] }"}</code> envelope
          (the renderer&apos;s comment points at a Python file,{" "}
          <code>src/agents/byoc_hashbrown_agent.py</code>), the{" "}
          <code>/api/copilotkit-declarative-hashbrown</code> route,{" "}
          <code>./charts/pie-chart</code>, <code>./charts/bar-chart</code>,{" "}
          <code>./metric-card</code>, <code>./types</code> and{" "}
          <code>./suggestions</code>.
        </p>
        <p className="mt-2">
          Without the agent nothing streams a UI envelope, so there is no live
          demo. The code also needs <code>@hashbrownai/core</code> /{" "}
          <code>@hashbrownai/react</code> (the page names{" "}
          <code>0.5.0-beta.4</code>), which this repo does not install. Shown
          as published, not compiled. Inventory:{" "}
          <code>docs-verbatim/README.md</code>.
        </p>
      </Callout>

      <Panel title="What it would demonstrate">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          A dashboard that paints while the reply is still streaming. A
          provider builds a Hashbrown UI kit (metric, pie and bar charts, a deal
          card, Markdown) once; the custom <code>assistantMessage</code> slot
          feeds the streaming text to Hashbrown&apos;s JSON parser against the
          kit&apos;s schema and renders whatever part of the{" "}
          <code>ui</code> array is complete so far.
        </p>
      </Panel>

      <Panel title="Frontend (verbatim, not compiled)">
        <SourceCodeGroup
          files={[
            { file: `${V}/01.tsx` },
            { file: `${V}/02.tsx` },
            { file: `${V}/03.tsx` },
          ]}
        />
      </Panel>

      <Panel title="Example assistant message (verbatim)">
        <SourceCode file={`${V}/04.json`} />
      </Panel>
    </>
  );
}

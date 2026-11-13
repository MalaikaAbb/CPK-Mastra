import { RouteHeader } from "@/components/route-header";
import { SourceCode, SourceCodeGroup } from "@/components/source-code";
import { Callout, Panel } from "@/components/ui";

const V = "docs-verbatim/generative-ui/json-render/page-snippets";

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/json-render" />

      <Callout tone="warn" title="Reference-only: the agent and most of the demo are never printed">
        <p>
          The page prints four frontend files (<code>chat.tsx</code>,{" "}
          <code>json-render-renderer.tsx</code>, <code>catalog.ts</code>,{" "}
          <code>registry.tsx</code>) and an example of the agent&apos;s output.
          It has no Code tab. Not printed anywhere: the Mastra agent and the
          prompt that makes it answer in <code>{"{ root, elements }"}</code>{" "}
          JSON, the runtime route, <code>page.tsx</code> (the provider), the{" "}
          <code>JsonRenderSpec</code> type (<code>./types</code>), and the
          components the registry imports (<code>./metric-card</code>,{" "}
          <code>./charts/bar-chart</code>, <code>./charts/pie-chart</code>),
          plus the showcase&apos;s <code>./suggestions</code>.
        </p>
        <p className="mt-2">
          Without the agent nothing emits a spec, so there is no live demo. The
          printed code also needs <code>@json-render/react</code> /{" "}
          <code>@json-render/core</code> 0.18.0 and a <code>zod4</code> alias,
          none of which this repo installs. The code is shown below as
          published, not compiled. Inventory:{" "}
          <code>docs-verbatim/README.md</code>.
        </p>
      </Callout>

      <Panel title="What it would demonstrate">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Bring-your-own components driven by a JSON contract. The agent replies
          with a <code>{"{ root, elements }"}</code> object; a custom{" "}
          <code>assistantMessage</code> slot parses it out of the reply (code
          fences and prose tolerated), checks each element type against an
          allowlist, and hands it to <code>@json-render/react</code>&apos;s{" "}
          <code>Renderer</code>, which maps types to React components through a
          registry built from a Zod catalog. Until a spec parses, the normal
          assistant bubble shows.
        </p>
      </Panel>

      <Panel title="Frontend (verbatim, not compiled)">
        <SourceCodeGroup
          files={[
            { file: `${V}/01.tsx` },
            { file: `${V}/02.tsx` },
            { file: `${V}/03.ts` },
            { file: `${V}/04.tsx` },
          ]}
        />
      </Panel>

      <Panel title="Example agent output (verbatim)">
        <SourceCode file={`${V}/05.json`} />
      </Panel>
    </>
  );
}

import { RouteHeader } from "@/components/route-header";
import { SourceCodeGroup } from "@/components/source-code";
import { Callout, Panel } from "@/components/ui";

const V = "docs-verbatim/generative-ui/components/from-a2ui";

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/components/from-a2ui" />

      <Callout tone="warn" title="Reference-only: needs a newer CopilotKit than this repo pins">
        <p>
          Components and surfaces live in{" "}
          <code>@copilotkit/react-core/v2/generative-ui</code>, which first
          ships in 1.81.0. This repo pins <code>^1.77.0</code> (lockfile
          1.79.1), so none of this page&apos;s code can compile here yet. It is
          shown as published, not compiled. See README §9 (26) and{" "}
          <code>docs-verbatim/README.md</code>.
        </p>
        <p className="mt-2"><code>myCatalog</code>, <code>agents</code>, <code>Airport</code>, <code>Arrow</code> are referenced without definitions.</p>
      </Callout>

      <Panel title="What it would demonstrate">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          A migration guide: <code>a2ui={"{"}{"{"} catalog {"}"}{"}"}</code> becomes <code>generativeUI={"{"}{"{"} ui {"}"}{"}"}</code>, <code>createCatalog</code> definitions become <code>createGenerativeUI</code> components, and the runtime&apos;s <code>a2ui</code> block is no longer needed. This repo&apos;s A2UI Dynamic/Fixed Schema routes are the "before" side.
        </p>
      </Panel>

      <Panel title="Page snippets (verbatim, React tabs, not compiled)">
        <p className="mb-3 text-xs text-slate-500"><code>01.tsx</code> Provider, before; <code>02.tsx</code> Provider, after; <code>03.ts</code> Runtime, before; <code>04.ts</code> Runtime, after; <code>05.ts</code> Catalog, before; <code>06.ts</code> Catalog, after</p>
        <SourceCodeGroup
          files={[
            { file: `${V}/01.tsx` },
            { file: `${V}/02.tsx` },
            { file: `${V}/03.ts` },
            { file: `${V}/04.ts` },
            { file: `${V}/05.ts` },
            { file: `${V}/06.ts` },
          ]}
        />
      </Panel>
    </>
  );
}

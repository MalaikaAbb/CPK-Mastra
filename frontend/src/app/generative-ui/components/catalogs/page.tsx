import { RouteHeader } from "@/components/route-header";
import { SourceCodeGroup } from "@/components/source-code";
import { Callout, Panel } from "@/components/ui";

const V = "docs-verbatim/generative-ui/components/catalogs";

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/components/catalogs" />

      <Callout tone="warn" title="Reference-only: needs a newer CopilotKit than this repo pins">
        <p>
          Components and surfaces live in{" "}
          <code>@copilotkit/react-core/v2/generative-ui</code>, which first
          ships in 1.81.0. This repo pins <code>^1.77.0</code> (lockfile
          1.79.1), so none of this page&apos;s code can compile here yet. It is
          shown as published, not compiled. See README §9 (26) and{" "}
          <code>docs-verbatim/README.md</code>.
        </p>
        <p className="mt-2"><code>cartUI</code>, <code>Hero</code>, <code>Panel</code> and <code>fs</code> are used without being defined; the Valibot example needs <code>valibot</code> and <code>@valibot/to-json-schema</code>, which this repo does not install.</p>
      </Callout>

      <Panel title="What it would demonstrate">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          <code>createGenerativeUI</code> pairs each component with a props schema (zod, Valibot via Standard JSON Schema, …), slots and descriptions; component props are typed from the catalog, catalogs can extend each other, and <code>exportA2UICatalog</code> writes the catalog out for other A2UI tools.
        </p>
      </Panel>

      <Panel title="Page snippets (verbatim, React tabs, not compiled)">
        <p className="mb-3 text-xs text-slate-500"><code>01.tsx</code> app/catalog.tsx; <code>02.tsx</code> Provider; <code>03.tsx</code> Typed props; <code>04.ts</code> zod; <code>05.ts</code> Valibot; <code>06.ts</code> Combine catalogs; <code>07.ts</code> Export for A2UI tools; <code>08.tsx</code> Positional parameter order</p>
        <SourceCodeGroup
          files={[
            { file: `${V}/01.tsx` },
            { file: `${V}/02.tsx` },
            { file: `${V}/03.tsx` },
            { file: `${V}/04.ts` },
            { file: `${V}/05.ts` },
            { file: `${V}/06.ts` },
            { file: `${V}/07.ts` },
            { file: `${V}/08.tsx` },
          ]}
        />
      </Panel>
    </>
  );
}

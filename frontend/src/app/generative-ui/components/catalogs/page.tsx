import { RouteHeader } from "@/components/route-header";
import { SourceCodeGroup } from "@/components/source-code";
import { Callout, Panel } from "@/components/ui";

const V = "docs-verbatim/generative-ui/components/catalogs";

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/components/catalogs" />

      <Callout tone="info" title="How this route is wired">
        <p>
          The demo runs the page&apos;s provider config on{" "}
          <code>/api/copilotkit-genui</code>. The agent is this
          repo&apos;s <code>componentsAgent</code>, a Mastra agent standing in
          for the section&apos;s TanStack <code>BuiltInAgent</code> (same
          prompt, no tools). CopilotKit is 1.87 (was 1.79.1, which has no{" "}
          <code>v2/generative-ui</code>).
        </p>
        <p className="mt-2">
          The run&apos;s <code>render_ui</code> tool reaches the model with its
          full schema, but its guide does not: <code>@ag-ui/mastra</code> puts the
          run&apos;s context entries on Mastra&apos;s <code>requestContext</code>,
          not in the prompt, and the page shows no Mastra code to read them, so
          none is added. Expect UI that may be rejected or incomplete until
          checked in a browser (README Known issues).
        </p>
      </Callout>

      <Panel title="What it demonstrates">
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

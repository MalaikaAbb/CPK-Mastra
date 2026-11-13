import { RouteHeader } from "@/components/route-header";
import { SourceCodeGroup } from "@/components/source-code";
import { Callout, Panel } from "@/components/ui";

const V = "docs-verbatim/generative-ui/components/from-a2ui";

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/components/from-a2ui" />

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

import { RouteHeader } from "@/components/route-header";
import { SourceCodeGroup } from "@/components/source-code";
import { Callout, Panel } from "@/components/ui";

const V = "docs-verbatim/generative-ui/components/standard-catalog";

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/components/standard-catalog" />

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
          <code>standardUI</code> is the ready-made catalog. You extend it with your own components, drop the ones you don&apos;t want with <code>standardUI.omit([...])</code>, or replace one (for example <code>Card</code>) through <code>overrides</code>.
        </p>
      </Panel>

      <Panel title="Page snippets (verbatim, React tabs, not compiled)">
        <p className="mb-3 text-xs text-slate-500"><code>01.tsx</code> Provider; <code>02.ts</code> Add your own components; <code>03.ts</code> Drop components; <code>04.tsx</code> Replace a component</p>
        <SourceCodeGroup
          files={[
            { file: `${V}/01.tsx` },
            { file: `${V}/02.ts` },
            { file: `${V}/03.ts` },
            { file: `${V}/04.tsx` },
          ]}
        />
      </Panel>
    </>
  );
}

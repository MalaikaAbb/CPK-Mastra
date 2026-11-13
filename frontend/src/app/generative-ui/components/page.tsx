import { RouteHeader } from "@/components/route-header";
import { SourceCodeGroup } from "@/components/source-code";
import { Callout, Panel } from "@/components/ui";

const V = "docs-verbatim/generative-ui/components";

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/components" />

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
          The quick start: give the provider the standard catalog with <code>generativeUI={"{"}{"{"} ui: standardUI {"}"}{"}"}</code>, and every run that carries it gets a <code>render_ui</code> tool plus a guide listing the components. The agent answers visual questions (a plan comparison, say) with a live table that fills in as it streams and can be edited by follow-ups.
        </p>
      </Panel>

      <Panel title="Page snippets (verbatim, React tabs, not compiled)">
        <p className="mb-3 text-xs text-slate-500"><code>01.sh</code> Install; <code>02.sh</code> .env.local; <code>03.ts</code> Runtime + agent; <code>04.tsx</code> Provider; <code>05.tsx</code> Layout; <code>06.tsx</code> Page; <code>07.txt</code> Prompt to try</p>
        <SourceCodeGroup
          files={[
            { file: `${V}/01.sh` },
            { file: `${V}/02.sh` },
            { file: `${V}/03.ts` },
            { file: `${V}/04.tsx` },
            { file: `${V}/05.tsx` },
            { file: `${V}/06.tsx` },
            { file: `${V}/07.txt` },
          ]}
        />
      </Panel>
    </>
  );
}

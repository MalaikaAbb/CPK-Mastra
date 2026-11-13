import { RouteHeader } from "@/components/route-header";
import { SourceCodeGroup } from "@/components/source-code";
import { Callout, Panel } from "@/components/ui";

const V = "docs-verbatim/generative-ui/components/theming";

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/components/theming" />

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
          A <code>theme</code> on the provider&apos;s <code>generativeUI</code> config sets the components&apos; CSS variables; dark mode follows a <code>dark</code> class on <code>&lt;html&gt;</code>, colors can differ per mode, and the same variables can be set in CSS on <code>.a2ui-surface</code>.
        </p>
      </Panel>

      <Panel title="Page snippets (verbatim, React tabs, not compiled)">
        <p className="mb-3 text-xs text-slate-500"><code>01.tsx</code> Provider theme; <code>02.ts</code> GenerativeUITheme; <code>03.html</code> Dark class; <code>04.tsx</code> Color-scheme script; <code>05.tsx</code> Theme per mode; <code>06.tsx</code> Theme map; <code>07.css</code> CSS variables</p>
        <SourceCodeGroup
          files={[
            { file: `${V}/01.tsx` },
            { file: `${V}/02.ts` },
            { file: `${V}/03.html` },
            { file: `${V}/04.tsx` },
            { file: `${V}/05.tsx` },
            { file: `${V}/06.tsx` },
            { file: `${V}/07.css` },
          ]}
        />
      </Panel>
    </>
  );
}

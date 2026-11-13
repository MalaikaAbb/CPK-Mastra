import { RouteHeader } from "@/components/route-header";
import { SourceCodeGroup } from "@/components/source-code";
import { Callout, Panel } from "@/components/ui";

const V = "docs-verbatim/generative-ui/components/surfaces";

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/components/surfaces" />

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
          A surface is a named slot on your page (not just the chat) that the agent can render into. <code>GenerativeUISurface</code> takes an id, a description the agent reads, an optional component allowlist and a fallback; the page also covers per-item surfaces, scroll behaviour and an error boundary on the provider.
        </p>
      </Panel>

      <Panel title="Page snippets (verbatim, React tabs, not compiled)">
        <p className="mb-3 text-xs text-slate-500"><code>01.tsx</code> Page target; <code>02.tsx</code> Limit the components; <code>03.tsx</code> Scroll; <code>04.css</code> Scroll margin; <code>05.tsx</code> One target per item; <code>06.tsx</code> Error boundary</p>
        <SourceCodeGroup
          files={[
            { file: `${V}/01.tsx` },
            { file: `${V}/02.tsx` },
            { file: `${V}/03.tsx` },
            { file: `${V}/04.css` },
            { file: `${V}/05.tsx` },
            { file: `${V}/06.tsx` },
          ]}
        />
      </Panel>
    </>
  );
}

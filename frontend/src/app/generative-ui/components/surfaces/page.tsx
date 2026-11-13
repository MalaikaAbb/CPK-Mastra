import { RouteHeader } from "@/components/route-header";
import { SourceCodeGroup } from "@/components/source-code";
import { Callout, Panel } from "@/components/ui";


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

      <Panel title="The demo's code" description="The page's code as mounted in the demo (labelled where the harness adds an import, a runtime URL or a borrowed component). Snippets that cannot run are listed in the status note and README item 26, and are not copied here.">
        <SourceCodeGroup
          files={[
            { file: "frontend/src/app/generative-ui/components/surfaces/demo-chat/page.tsx" },
            { file: "frontend/src/app/generative-ui/components/surfaces/demo-chat/targets.tsx" },
            { file: "frontend/src/app/generative-ui/components/surfaces/demo-chat/surfaces.css" },
          ]}
        />
      </Panel>
    </>
  );
}

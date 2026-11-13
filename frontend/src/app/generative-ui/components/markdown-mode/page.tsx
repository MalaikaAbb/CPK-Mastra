import { RouteHeader } from "@/components/route-header";
import { SourceCodeGroup } from "@/components/source-code";
import { Callout, Panel } from "@/components/ui";


export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/components/markdown-mode" />

      <Callout tone="warn" title="How this route is wired">
        <p>
          The demo runs the page&apos;s provider config on{" "}
          <code>/api/copilotkit-genui</code>. The agent is this
          repo&apos;s <code>componentsAgent</code>, a Mastra agent standing in
          for the section&apos;s TanStack <code>BuiltInAgent</code> (same
          prompt, no tools). CopilotKit is 1.87 (was 1.79.1, which has no{" "}
          <code>v2/generative-ui</code>).
        </p>
        <p className="mt-2">
          Expect no UI. Markdown mode sends the component schema and the fence
          guide only as context entries; <code>@ag-ui/mastra</code> puts them on
          Mastra&apos;s <code>requestContext</code>, and the agent&apos;s
          instructions do not read it (the page shows no Mastra code for that),
          so the model never learns the format (README Known issues).
        </p>
      </Callout>

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          With <code>transport: "markdown"</code> the agent embeds <code>a2ui</code> code blocks in its reply and they render where they appear, streaming as they&apos;re written. <code>sendContext: false</code> turns off the automatic guide so you can build your own prompt from the catalog the run forwards.
        </p>
      </Panel>

      <Panel title="The demo's code" description="The page's code as mounted in the demo (labelled where the harness adds an import, a runtime URL or a borrowed component). Snippets that cannot run are listed in the status note and README item 26, and are not copied here.">
        <SourceCodeGroup
          files={[
            { file: "frontend/src/app/generative-ui/components/markdown-mode/demo-chat/page.tsx" },
          ]}
        />
      </Panel>
    </>
  );
}

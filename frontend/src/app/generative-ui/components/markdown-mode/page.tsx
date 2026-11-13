import { RouteHeader } from "@/components/route-header";
import { SourceCodeGroup } from "@/components/source-code";
import { Callout, Panel } from "@/components/ui";

const V = "docs-verbatim/generative-ui/components/markdown-mode";

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

      <Panel title="Page snippets (verbatim, React tabs, not compiled)">
        <p className="mb-3 text-xs text-slate-500"><code>01.md</code> Example reply; <code>02.tsx</code> Turn it on; <code>03.tsx</code> sendContext: false; <code>04.json</code> Forwarded catalog; <code>05.py</code> Build your own prompt (Python)</p>
        <SourceCodeGroup
          files={[
            { file: `${V}/01.md` },
            { file: `${V}/02.tsx` },
            { file: `${V}/03.tsx` },
            { file: `${V}/04.json` },
            { file: `${V}/05.py` },
          ]}
        />
      </Panel>
    </>
  );
}

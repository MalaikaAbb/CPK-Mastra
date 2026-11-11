import { RouteHeader } from "@/components/route-header";
import { SourceCodeGroup } from "@/components/source-code";
import { Callout, Panel } from "@/components/ui";

const V = "docs-verbatim/generative-ui/components/markdown-mode";

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/components/markdown-mode" />

      <Callout tone="warn" title="Reference-only: needs a newer CopilotKit than this repo pins">
        <p>
          Components and surfaces live in{" "}
          <code>@copilotkit/react-core/v2/generative-ui</code>, which first
          ships in 1.81.0. This repo pins <code>^1.77.0</code> (lockfile
          1.79.1), so none of this page&apos;s code can compile here yet. It is
          shown as published, not compiled. See README §9 (26) and{" "}
          <code>docs-verbatim/README.md</code>.
        </p>
        <p className="mt-2">The "build your own prompt" example is Python (<code>input.forwarded_props</code>, <code>MY_PROMPT</code>), not Mastra code.</p>
      </Callout>

      <Panel title="What it would demonstrate">
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

import { RouteHeader } from "@/components/route-header";
import { SourceCodeGroup } from "@/components/source-code";
import { Callout, Panel } from "@/components/ui";

const V = "docs-verbatim/generative-ui/components/transports";

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/components/transports" />

      <Callout tone="warn" title="Reference-only: needs a newer CopilotKit than this repo pins">
        <p>
          Components and surfaces live in{" "}
          <code>@copilotkit/react-core/v2/generative-ui</code>, which first
          ships in 1.81.0. This repo pins <code>^1.77.0</code> (lockfile
          1.79.1), so none of this page&apos;s code can compile here yet. It is
          shown as published, not compiled. See README §9 (26) and{" "}
          <code>docs-verbatim/README.md</code>.
        </p>
        <p className="mt-2">The runtime fragment uses an undefined <code>agent</code> (in this harness it would be a Mastra agent).</p>
      </Callout>

      <Panel title="What it would demonstrate">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Two ways for UI to reach the browser: the default tool transport (<code>render_ui</code>), or <code>transport: "markdown"</code> where the agent writes UI in its reply. <code>agentIds</code> on the provider (or <code>generativeUI</code> on the runtime) limits which agents get it.
        </p>
      </Panel>

      <Panel title="Page snippets (verbatim, React tabs, not compiled)">
        <p className="mb-3 text-xs text-slate-500"><code>01.tsx</code> Tool transport; <code>02.ts</code> Runtime; <code>03.tsx</code> Markdown transport; <code>04.tsx</code> Only some agents</p>
        <SourceCodeGroup
          files={[
            { file: `${V}/01.tsx` },
            { file: `${V}/02.ts` },
            { file: `${V}/03.tsx` },
            { file: `${V}/04.tsx` },
          ]}
        />
      </Panel>
    </>
  );
}

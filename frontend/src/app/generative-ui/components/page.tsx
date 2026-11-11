import { RouteHeader } from "@/components/route-header";
import { SourceCodeGroup } from "@/components/source-code";
import { Callout, Panel } from "@/components/ui";

const V = "docs-verbatim/generative-ui/components";

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/components" />

      <Callout tone="warn" title="Reference-only: needs a newer CopilotKit than this repo pins">
        <p>
          Components and surfaces live in{" "}
          <code>@copilotkit/react-core/v2/generative-ui</code>, which first
          ships in 1.81.0. This repo pins <code>^1.77.0</code> (lockfile
          1.79.1), so none of this page&apos;s code can compile here yet. It is
          shown as published, not compiled. See README §9 (26) and{" "}
          <code>docs-verbatim/README.md</code>.
        </p>
        <p className="mt-2">The page&apos;s agent is a TanStack <code>BuiltInAgent</code> (factory mode). In this harness it would be swapped for a Mastra agent with the snippet&apos;s prompt; the page also requires the agent to pass the run&apos;s tools <em>and</em> its system-prompt guide to the model, and <code>@ag-ui/mastra</code> forwards tools as client tools but puts run context on Mastra&apos;s request context, not in the prompt — unverified until the package bump lands.</p>
      </Callout>

      <Panel title="What it would demonstrate">
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

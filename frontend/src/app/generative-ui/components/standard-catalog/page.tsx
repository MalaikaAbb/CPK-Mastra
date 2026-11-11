import { RouteHeader } from "@/components/route-header";
import { SourceCodeGroup } from "@/components/source-code";
import { Callout, Panel } from "@/components/ui";

const V = "docs-verbatim/generative-ui/components/standard-catalog";

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/components/standard-catalog" />

      <Callout tone="warn" title="Reference-only: needs a newer CopilotKit than this repo pins">
        <p>
          Components and surfaces live in{" "}
          <code>@copilotkit/react-core/v2/generative-ui</code>, which first
          ships in 1.81.0. This repo pins <code>^1.77.0</code> (lockfile
          1.79.1), so none of this page&apos;s code can compile here yet. It is
          shown as published, not compiled. See README §9 (26) and{" "}
          <code>docs-verbatim/README.md</code>.
        </p>
        <p className="mt-2"><code>ProductCard</code> and <code>productSchema</code> are used without being defined.</p>
      </Callout>

      <Panel title="What it would demonstrate">
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

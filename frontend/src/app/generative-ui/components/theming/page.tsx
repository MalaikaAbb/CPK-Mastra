import { RouteHeader } from "@/components/route-header";
import { SourceCodeGroup } from "@/components/source-code";
import { Callout, Panel } from "@/components/ui";

const V = "docs-verbatim/generative-ui/components/theming";

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/components/theming" />

      <Callout tone="warn" title="Reference-only: needs a newer CopilotKit than this repo pins">
        <p>
          Components and surfaces live in{" "}
          <code>@copilotkit/react-core/v2/generative-ui</code>, which first
          ships in 1.81.0. This repo pins <code>^1.77.0</code> (lockfile
          1.79.1), so none of this page&apos;s code can compile here yet. It is
          shown as published, not compiled. See README §9 (26) and{" "}
          <code>docs-verbatim/README.md</code>.
        </p>
        <p className="mt-2">Fragments only (theme objects and a provider fragment); nothing beyond the package bump is missing.</p>
      </Callout>

      <Panel title="What it would demonstrate">
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

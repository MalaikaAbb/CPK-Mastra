import { RouteHeader } from "@/components/route-header";
import { SourceCodeGroup } from "@/components/source-code";
import { Callout, Panel } from "@/components/ui";

const V = "docs-verbatim/generative-ui/components/surfaces";

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/components/surfaces" />

      <Callout tone="warn" title="Reference-only: needs a newer CopilotKit than this repo pins">
        <p>
          Components and surfaces live in{" "}
          <code>@copilotkit/react-core/v2/generative-ui</code>, which first
          ships in 1.81.0. This repo pins <code>^1.77.0</code> (lockfile
          1.79.1), so none of this page&apos;s code can compile here yet. It is
          shown as published, not compiled. See README §9 (26) and{" "}
          <code>docs-verbatim/README.md</code>.
        </p>
        <p className="mt-2">Fragments only: <code>Product</code>, <code>ProductRow</code>, <code>product</code> and <code>shopUI</code> (defined on the Catalogs page) are referenced but not defined here.</p>
      </Callout>

      <Panel title="What it would demonstrate">
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

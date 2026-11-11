import { RouteHeader } from "@/components/route-header";
import { SourceCodeGroup } from "@/components/source-code";
import { Callout, Panel } from "@/components/ui";

const V = "docs-verbatim/generative-ui/components/state-and-actions";

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/components/state-and-actions" />

      <Callout tone="warn" title="Reference-only: needs a newer CopilotKit than this repo pins">
        <p>
          Components and surfaces live in{" "}
          <code>@copilotkit/react-core/v2/generative-ui</code>, which first
          ships in 1.81.0. This repo pins <code>^1.77.0</code> (lockfile
          1.79.1), so none of this page&apos;s code can compile here yet. It is
          shown as published, not compiled. See README §9 (26) and{" "}
          <code>docs-verbatim/README.md</code>.
        </p>
        <p className="mt-2"><code>Cart</code>, <code>cart.addItem</code> and the full <code>shopUI</code> are referenced but the snippets are fragments of it (object members out of context).</p>
      </Callout>

      <Panel title="What it would demonstrate">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Catalog-level <code>state</code> plus <code>bind</code> feed live app data into props (<code>useGenerativeUIState</code> publishes it); <code>functions</code> with <code>useGenerativeUIFunction</code> run your code from a click or the agent, with caller rules; <code>events</code> go back to the agent; <code>writable</code> props keep what the user types.
        </p>
      </Panel>

      <Panel title="Page snippets (verbatim, React tabs, not compiled)">
        <p className="mb-3 text-xs text-slate-500"><code>01.tsx</code> State + bind; <code>02.tsx</code> useGenerativeUIState; <code>03.tsx</code> Functions + events; <code>04.tsx</code> useGenerativeUIFunction; <code>05.tsx</code> Event result in a component; <code>06.ts</code> Who may call a function; <code>07.ts</code> Events to the agent; <code>08.tsx</code> Writable prop; <code>09.tsx</code> Keep what the user types</p>
        <SourceCodeGroup
          files={[
            { file: `${V}/01.tsx` },
            { file: `${V}/02.tsx` },
            { file: `${V}/03.tsx` },
            { file: `${V}/04.tsx` },
            { file: `${V}/05.tsx` },
            { file: `${V}/06.ts` },
            { file: `${V}/07.ts` },
            { file: `${V}/08.tsx` },
            { file: `${V}/09.tsx` },
          ]}
        />
      </Panel>
    </>
  );
}

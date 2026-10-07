import { RouteHeader } from "@/components/route-header";
import { SourceCode, SourceCodeGroup } from "@/components/source-code";
import { Callout, Panel, TryIt } from "@/components/ui";

const DIR = "frontend/src/app/generative-ui/a2ui/dynamic-schema";

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/a2ui/dynamic-schema" />

      <Callout tone="warn" title="Harness-supplied: the runtime route">
        The published demo page points at{" "}
        <code>/api/copilotkit-declarative-gen-ui</code>, which neither the page
        nor its Code tab ships. This repo supplies it with no <code>a2ui</code>{" "}
        block, as the page&apos;s default path says. The demo file&apos;s own
        header comment describes the opposite (an opt-out route with a
        backend-owned tool), so the two disagree; see README §9.
      </Callout>

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The frontend registers a catalog of branded components (cards,
          metrics, tables, charts) as Zod schemas plus React renderers. Passing
          it to the provider is the whole opt-in: the runtime sees the catalog,
          gives the agent a <code>generate_a2ui</code> tool, and a secondary
          model call designs the surface (layout, components and data) for
          whatever was asked.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The Mastra agent here has no A2UI tool of its own. The bridge&apos;s
          auto-injection is what adds one.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={[
              "Show me my sales dashboard for this quarter.",
              "How are our sales reps performing against quota?",
            ]}
            expect="A progress indicator, then a composed surface in the chat built from catalog components: Metric tiles, a DataTable, a Pie or Bar chart inside Cards."
            fail="A plain-text answer, a tool call that renders nothing, or the raw JSON of the operations."
          />
        </div>
      </Panel>

      <Panel title="Provider + catalog (published)">
        <SourceCodeGroup
          files={[
            { file: `${DIR}/demo-chat/page.tsx` },
            { file: `${DIR}/a2ui/catalog.ts` },
            { file: `${DIR}/a2ui/definitions.ts` },
          ]}
        />
      </Panel>

      <Panel title="Renderers (published)">
        <SourceCode file={`${DIR}/a2ui/renderers.tsx`} />
      </Panel>

      <Panel title="Agent and runtime">
        <SourceCodeGroup
          files={[
            { file: "frontend/src/mastra/agents.ts", region: "a2ui-agents" },
            { file: "frontend/src/app/api/copilotkit-declarative-gen-ui/route.ts" },
          ]}
        />
      </Panel>
    </>
  );
}

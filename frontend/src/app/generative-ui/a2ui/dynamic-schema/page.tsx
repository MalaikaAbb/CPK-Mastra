import { RouteHeader } from "@/components/route-header";
import { SourceCode, SourceCodeGroup } from "@/components/source-code";
import { Callout, Panel, TryIt } from "@/components/ui";

const DIR = "frontend/src/app/generative-ui/a2ui/dynamic-schema";

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/a2ui/dynamic-schema" />

      <Callout tone="warn" title="Broken: the route and the agent that owns generate_a2ui are not printed">
        The page now says the demo&apos;s same-process route sets{" "}
        <code>injectA2UITool: false</code> and pins <code>defaultCatalogId</code>{" "}
        because its agent supplies its own <code>generate_a2ui</code>. Neither
        that route nor that agent is printed. The route here carries only the
        described config (labelled prose-only); the agent has no A2UI tool, so
        nothing can render. The separate-process{" "}
        <code>registerCopilotKit</code> example is not built (Mastra runs
        in-process). See README §9.
      </Callout>

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The frontend registers a catalog of branded components (cards,
          metrics, tables, charts) as Zod schemas plus React renderers. Passing
          it to the provider registers the vocabulary; per the page, an
          agent-owned <code>generate_a2ui</code> tool then runs a secondary
          model call that designs the surface for whatever was asked.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Here the route turns injection off and the agent has no tool (not
          printed), so no <code>generate_a2ui</code> exists. A finished <code>render_a2ui</code>{" "}
          call alone is not a pass: the result must carry non-empty{" "}
          <code>a2ui_operations</code> and the surface must leave
          &ldquo;Building Interface&rdquo;.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={[
              "Show me my sales dashboard for this quarter.",
              "How are our sales reps performing against quota?",
            ]}
            expect="As published here: a plain-text reply and no surface — the agent has no generate_a2ui tool and injection is off."
            fail="A request error. If a surface renders, something injected a tool the page does not print — re-check."
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

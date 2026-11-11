import { RouteHeader } from "@/components/route-header";
import { SourceCode, SourceCodeGroup } from "@/components/source-code";
import { Callout, Panel, TryIt } from "@/components/ui";

const DIR = "frontend/src/app/generative-ui/a2ui/dynamic-schema";

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/a2ui/dynamic-schema" />

      <Callout tone="warn" title="Harness-supplied: the runtime route and the agent's tool wiring">
        The demo page points at <code>/api/copilotkit-declarative-gen-ui</code>,
        which the page describes (injection off, <code>defaultCatalogId</code>{" "}
        pinned, the agent owning <code>generate_a2ui</code>) but never prints.
        This repo writes that route from the description, and attaches the{" "}
        <code>generateA2uiTool</code> published on the Fixed Schema page under
        the <code>generate_a2ui</code> key the showcase <code>weatherAgent</code>{" "}
        uses (Code tab <code>agents/index.ts</code>). The page&apos;s
        separate-process <code>registerCopilotKit</code> example is not built:
        Mastra runs in-process here. See README §9.
      </Callout>

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The frontend registers a catalog of branded components (cards,
          metrics, tables, charts) as Zod schemas plus React renderers. Passing
          it to the provider registers the vocabulary; the agent&apos;s own{" "}
          <code>generate_a2ui</code> tool runs a secondary model call that
          designs the surface (layout, components and data) for whatever was
          asked.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The runtime route turns injection off, so the agent&apos;s tool is the
          only <code>generate_a2ui</code>. A finished <code>render_a2ui</code>{" "}
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
            expect="A progress indicator, then a composed surface in the chat built from catalog components: Metric tiles, a DataTable, a Pie or Bar chart inside Cards."
            fail="A plain-text answer, a tool call that renders nothing, a surface stuck on “Building Interface”, or the raw JSON of the operations. A model-not-found error means the account lacks the published gpt-6-luna."
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

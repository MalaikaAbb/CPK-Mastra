import { RouteHeader } from "@/components/route-header";
import { SourceCode, SourceCodeGroup } from "@/components/source-code";
import { Callout, Panel, TryIt } from "@/components/ui";

const DIR = "frontend/src/app/generative-ui/tool-based";

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/tool-based" />

      <Callout tone="warn" title="Not on the page: the two chart components">
        The demo page imports <code>BarChart</code> / <code>barChartPropsSchema</code>{" "}
        and <code>PieChart</code> / <code>pieChartPropsSchema</code> from files
        the page never prints. Both are borrowed from the agno harness (minimal
        Recharts components, labelled in each file). The showcase-only{" "}
        <code>useSuggestions</code> is left out.
      </Callout>

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          A React component <em>is</em> the tool. <code>useComponent</code>{" "}
          registers each chart with a Zod schema; the Mastra adapter forwards
          those registrations as client tools on every run, so the agent
          declares no tools and only its prompt tells it when to call{" "}
          <code>render_bar_chart</code>. The arguments arrive as the
          component&apos;s props.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={[
              "Chart the populations of the five largest US cities.",
              "Show my monthly spending split as a pie chart: rent 1200, food 450, travel 300.",
            ]}
            expect="A bar chart with a title and five bars renders inline in the chat, with a short reply. The pie request may draw a pie chart (the tool is registered) or a bar chart, since the published prompt only names render_bar_chart."
            fail="A prose answer with no chart, a chart with no data, or a model-not-found error (the agent uses the published gpt-6-luna)."
          />
        </div>
      </Panel>

      <Callout tone="info" title="Wiring">
        The page&apos;s <code>chartAgent</code> is registered on the Mastra
        instance under the demo&apos;s agent id <code>gen-ui-tool-based</code>{" "}
        and served by the main <code>/api/copilotkit</code> route, as the demo
        page expects. The page prints the prompt after the agent that reads it;
        the file places it first so the module loads. The headless{" "}
        <code>CopilotChatToolCallsView</code> fragment uses undefined{" "}
        <code>assistantMessage</code> / <code>allMessages</code> and is not
        built.
      </Callout>

      <Panel title="Agent (published)">
        <SourceCode file="frontend/src/mastra/chart-agent.ts" region="chart-agent" />
      </Panel>

      <Panel title="Frontend (published demo page + borrowed charts)">
        <SourceCodeGroup
          files={[
            { file: `${DIR}/demo-chat/page.tsx` },
            { file: `${DIR}/bar-chart.tsx` },
            { file: `${DIR}/pie-chart.tsx` },
          ]}
        />
      </Panel>
    </>
  );
}

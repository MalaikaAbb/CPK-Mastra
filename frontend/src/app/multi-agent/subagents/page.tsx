import { RouteHeader } from "@/components/route-header";
import { SourceCode, SourceCodeGroup } from "@/components/source-code";
import { Callout, Panel, TryIt } from "@/components/ui";

const DIR = "frontend/src/app/multi-agent/subagents";

export default function Page() {
  return (
    <>
      <RouteHeader path="/multi-agent/subagents" />

      <Callout tone="info" title="Delegation log writer now published">
        The page now prints the <code>working-memory.ts</code> helper, so the
        three sub-agent tools call <code>writeDelegationsToWorkingMemory</code>{" "}
        again and the supervisor&apos;s working memory is thread-scoped as
        published. The left-hand log should fill as delegations complete. The
        page&apos;s optional New chat control and separate-server
        (<code>registerCopilotKit</code>) setup are not used here: this repo
        runs Mastra in-process, the page&apos;s own default.
      </Callout>

      <Callout tone="warn" title="Published bug: tool names don't match the renderers">
        Mastra names each tool by its <strong>key</strong> in the agent&apos;s{" "}
        <code>tools</code> object, not its <code>createTool</code> id. The
        supervisor registers them by shorthand (
        <code>{"{ researchAgentTool, writingAgentTool, critiqueAgentTool }"}</code>
        ), so the model calls <code>researchAgentTool</code> and so on. The
        page&apos;s <code>useRenderTool</code> renderers listen for{" "}
        <code>research_agent</code> / <code>writing_agent</code> /{" "}
        <code>critique_agent</code>, and so does{" "}
        <code>inferActiveSubAgent</code>, so no card and no banner ever match.
        The supervisor&apos;s prompt also names tools that do not exist under
        those names. Kept as published; see README §9.
      </Callout>

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          A supervisor agent whose tools are other agents. The research, writing
          and critique sub-agents each have their own prompt and no shared
          memory. The supervisor only sees what each returns. The page intends
          each delegation to render in the chat as a live card through{" "}
          <code>useRenderTool</code>, with a banner naming the running
          sub-agent; the warning above explains why neither appears here.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={[
              "Produce a short blog post about the benefits of cold exposure training. Research first, then write, then critique.",
            ]}
            expect="As published, here: the supervisor delegates (in the Inspector, TOOL_CALL_START events named researchAgentTool → writingAgentTool → critiqueAgentTool, each with a TOOL_CALL_RESULT holding the sub-agent's text) and then summarises in chat. No sub-agent cards and no banner, because of the name mismatch above; the delegation log on the left should gain one entry per delegation."
            fail="No tool calls at all (the supervisor answered alone), or a result containing “[sub-agent error] …” (also check the model id: the sub-agents and supervisor use the published gpt-6-luna), or an empty log with a “working-memory write failed” line in the server log. If cards do appear, the name mismatch has been fixed upstream and this route should be re-checked."
          />
        </div>
      </Panel>

      <Callout tone="info" title="Published type narrower than published data">
        The tools build delegations with <code>status</code> set to{" "}
        <code>&quot;completed&quot;</code> or <code>&quot;failed&quot;</code>,
        and the agent&apos;s state schema allows <code>&quot;running&quot;</code>{" "}
        too. But <code>delegation-log.tsx</code> types it as{" "}
        <code>&quot;completed&quot;</code> only, and the log paints every status
        in the same green. Kept as published.
      </Callout>

      <Panel title="Sub-agents as tools (published)">
        <SourceCode file="frontend/src/mastra/subagents.ts" />
      </Panel>

      <Panel title="Delegation-log writer (published)">
        <SourceCode file="frontend/src/mastra/working-memory.ts" />
      </Panel>

      <Panel title="Supervisor (published)">
        <SourceCode file="frontend/src/mastra/agents.ts" region="subagents-supervisor" />
      </Panel>

      <Panel title="Frontend (published)">
        <SourceCodeGroup
          files={[
            { file: `${DIR}/demo-chat/page.tsx` },
            { file: `${DIR}/delegation-log.tsx` },
          ]}
        />
      </Panel>
    </>
  );
}

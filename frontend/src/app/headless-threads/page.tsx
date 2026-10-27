import { RouteHeader } from "@/components/route-header";
import { SourceCode } from "@/components/source-code";
import { Callout, Panel, TryIt } from "@/components/ui";

const DEMO = "frontend/src/app/headless-threads/demo-chat/page.tsx";

export default function Page() {
  return (
    <>
      <RouteHeader path="/headless-threads" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The do-it-yourself alternative to the Threads Drawer. A plain list
          built on <code>useThreads</code> shows the user&apos;s saved
          conversations with rename and archive buttons and cursor-based
          pagination, and the chosen conversation reaches{" "}
          <code>CopilotChat</code> as a <code>threadId</code> prop instead of
          through a shared configuration provider.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={["Hello", "Tell me a fun fact about octopuses"]}
            expect={
              <>
                The sidebar lists this project&apos;s threads (the Threads
                Drawer&apos;s show up too — same agent). After a reply, the new
                conversation appears as a row, named automatically. Click a
                row: it highlights and the chat replays that conversation.{" "}
                <em>Rename</em> changes the row to &quot;Renamed&quot;;{" "}
                <em>Archive</em> removes it. With more than 20 threads,{" "}
                <em>Load more</em> appears at the bottom.
              </>
            }
            fail="The list stays empty after a reply, clicking a row does not change the chat, or Rename/Archive have no effect."
          />
        </div>
      </Panel>

      <Callout tone="premium" title="Requires CopilotKit Intelligence">
        Set <code>CPK_INTELLIGENCE_API_KEY</code> in{" "}
        <code>frontend/.env.local</code> and restart. Without it the runtime
        runs in SSE mode and falls back to listing its in-memory threads.
      </Callout>

      <Callout tone="warn" title="Where the published code differs">
        <p>
          <strong>Wrong agent id (Steps 2 and 4).</strong> The page calls{" "}
          <code>useThreads({"{ agentId: \"my-agent\" }"})</code>, but its own
          Step 1 runtime registers its only agent as <code>default</code>,
          which is also what <code>CopilotChat</code> runs on. Threads are
          stored per agent, so the published list is always empty. Verified
          2026-10-27: <code>?agentId=my-agent</code> returned <code>[]</code>,{" "}
          <code>?agentId=default</code> returned the project&apos;s threads.
          This demo uses <code>default</code>.
        </p>
        <p className="mt-2">
          <strong>No way to select a thread (Step 3).</strong> The page&apos;s{" "}
          <code>App</code> passes <code>onSelectThread</code> to a{" "}
          <code>ThreadSidebar</code> that takes no props (a type error) and has
          no row click handler, so the chat&apos;s <code>threadId</code> never
          changes. This demo adds the prop and a row click.
        </p>
        <p className="mt-2">
          Beyond that, only layout and styling are added. The route stays{" "}
          <strong>Broken</strong> because the page&apos;s code, as published,
          does not work.
        </p>
      </Callout>

      <Callout tone="info" title="Step 1 uses the existing Intelligence runtime">
        The page&apos;s runtime snippet resolves the user with{" "}
        <code>verifyAppSession</code>, which it never defines. It also says
        apps that already use Intelligence should keep their existing runtime,
        so this route reuses <code>/api/copilotkit-threads</code> (fixed
        identity, <code>myAgent</code> as <code>default</code>).
      </Callout>

      <Callout tone="info" title="Not exercised: one agent per thread">
        The page&apos;s closing section about the{" "}
        <code>{"useAgent({ agentId, runtimeAgentId, threadId })"}</code> shape
        is not part of its steps and has no demo here. Its claim that partial
        combinations fail to compile matches the{" "}
        <code>UseAgentProps</code> type shipped in{" "}
        <code>@copilotkit/react-core</code> 1.80.0.
      </Callout>

      <Panel title="Step 1 — Configure your Runtime with CopilotKit Intelligence">
        <SourceCode file="frontend/src/app/api/copilotkit-threads/[[...slug]]/route.ts" />
      </Panel>

      <Panel
        title="Step 2 — List and manage threads with useThreads"
        description="Step 4 (pagination) is merged into this component."
      >
        <SourceCode file={DEMO} region="thread-sidebar" />
      </Panel>

      <Panel title="Step 3 — Switch between threads">
        <SourceCode file={DEMO} region="app" />
      </Panel>

      <Panel title="Whole demo file">
        <SourceCode file={DEMO} />
      </Panel>
    </>
  );
}

import { RouteHeader } from "@/components/route-header";
import { SourceCode } from "@/components/source-code";
import { Callout, Panel, TryIt } from "@/components/ui";

const DIR = "frontend/src/app/headless-threads";

export default function Page() {
  return (
    <>
      <RouteHeader path="/headless-threads" />

      <Callout tone="warn" title="Published bugs: no way to select a thread, and the list watches another agent">
        <p>
          The page&apos;s <code>App</code> renders{" "}
          <code>{"<ThreadSidebar onSelectThread={setActiveThreadId} />"}</code>,
          but its <code>ThreadSidebar</code> takes no props and its rows have
          no click handler, so <code>activeThreadId</code> never changes and
          switching threads cannot happen. Kept as published behind a{" "}
          <code>@ts-expect-error</code>.
        </p>
        <p className="mt-2">
          The sidebar calls <code>useThreads({"{ agentId: \"my-agent\" }"})</code>,
          while the page&apos;s runtime snippet registers only{" "}
          <code>default</code> (the agent <code>CopilotChat</code> uses). So the
          list asks about an agent the chat never writes to. Kept as published;
          see README §9.
        </p>
      </Callout>

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          A thread list you draw yourself. <code>useThreads</code> returns the
          conversations stored in CopilotKit Intelligence plus rename, archive,
          delete and cursor-paging helpers; the chat is meant to follow
          whichever thread you pick by receiving its <code>threadId</code>.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={["Hello"]}
            expect="As published, with CPK_INTELLIGENCE_API_KEY set: the chat replies, but the list on the left stays empty or shows only threads of an agent called my-agent (none in this runtime); nothing in the list can be clicked to switch the chat. Without a key: the list stays empty, chat still works."
            fail="The chat itself fails to reply (runtime or key problem). If rows appear for the chat's own threads and clicking one replays it, the page has been fixed upstream and this route should be re-checked."
          />
        </div>
      </Panel>

      <Callout tone="premium" title="Requires CopilotKit Intelligence">
        Threads are stored in CopilotKit Intelligence. Set{" "}
        <code>CPK_INTELLIGENCE_API_KEY</code> in <code>frontend/.env.local</code>{" "}
        and restart. Without it the dedicated runtime runs in SSE mode and
        there is nothing to list.
      </Callout>

      <Callout tone="info" title="Harness glue: provider and runtime">
        The page prints no provider. The demo mounts a{" "}
        <code>CopilotKitProvider</code> on the existing Intelligence runtime{" "}
        <code>/api/copilotkit-threads</code> (shared with Threads Drawer), whose{" "}
        <code>identifyUser</code> returns a fixed user instead of the
        page&apos;s undefined <code>verifyAppSession</code> helper. The
        page&apos;s &ldquo;one agent per thread&rdquo; <code>useAgent</code>{" "}
        fragment is not built: it relies on a <code>threadId</code> the page
        never defines.
      </Callout>

      <Panel title="ThreadSidebar + App (published)">
        <SourceCode file={`${DIR}/demo-chat/page.tsx`} />
      </Panel>

      <Panel title="Runtime (harness glue, shared with Threads Drawer)">
        <SourceCode file="frontend/src/app/api/copilotkit-threads/[[...slug]]/route.ts" />
      </Panel>
    </>
  );
}

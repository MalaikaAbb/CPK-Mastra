import { RouteHeader } from "@/components/route-header";
import { SourceCode } from "@/components/source-code";
import { Callout, Panel, TryIt } from "@/components/ui";

const DIR = "frontend/src/app/prebuilt-components/copilot-threads-drawer";

export default function Page() {
  return (
    <>
      <RouteHeader path="/prebuilt-components/copilot-threads-drawer" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          A prebuilt conversation list that sits next to the chat. The drawer
          and the chat never pass a <code>threadId</code> to each other — both
          read and write it through the{" "}
          <code>CopilotChatConfigurationProvider</code> that wraps them, so
          picking a row is enough to load that conversation.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Thread storage lives in CopilotKit Intelligence, not in Mastra. The
          drawer asks the runtime whether threads are licensed; if they are
          not, it renders a locked state and makes no thread requests.
        </p>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <TryIt
            prompts={["Hello", "Tell me a fun fact about octopuses"]}
            expect={
              <>
                With a key: send <em>Hello</em>, and a row appears in the
                drawer. Click <strong>New Conversation</strong>, send the second
                prompt, then click the first row: the chat replays the{" "}
                <em>Hello</em> exchange. A row&apos;s kebab menu offers Archive
                and Delete. Without a key: a locked view with an Upgrade link
                in place of the list, while chat still works.
              </>
            }
            fail="The drawer stays empty after a reply, selecting a row does not change the chat, or the locked view shows even though CPK_INTELLIGENCE_API_KEY is set."
          />
          <TryIt
            prompts={["Hello"]}
            expect={
              <>
                Sidebar host (
                <a
                  href="/prebuilt-components/copilot-threads-drawer/sidebar/demo-chat"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[var(--accent)] underline underline-offset-4"
                >
                  open ↗
                </a>
                ): the same drawer drives a <code>CopilotSidebar</code> that
                opens docked on the right. Switching rows switches the
                sidebar&apos;s conversation.
              </>
            }
            fail="The sidebar ignores row selection, or it keeps one conversation regardless of the row picked."
          />
        </div>
        <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
          On a desktop-width window the drawer is always open and the chat
          header has no launcher for it. That is intended; the launcher only
          appears on narrow viewports.
        </p>
      </Panel>

      <Callout tone="premium" title="Requires CopilotKit Intelligence">
        Set <code>CPK_INTELLIGENCE_API_KEY</code> in{" "}
        <code>frontend/.env.local</code> (from{" "}
        <code>npx copilotkit@latest project select</code>) and restart. Without
        it the dedicated runtime starts in SSE mode and only the locked view is
        testable locally.
      </Callout>

      <Callout tone="warn" title="Known gap: the header slot snippet does nothing">
        The page&apos;s slot example passes a <code>slot=&quot;header&quot;</code>{" "}
        child. In <code>@copilotkit/react-core</code> 1.79.1 the drawer&apos;s
        props have no <code>children</code> and the component never renders
        them, so the <strong>Header slot</strong> tab should look identical to{" "}
        <strong>As published</strong>. If <em>My conversations</em> does show
        up, the package has caught up with the doc — update README §9.
      </Callout>

      <Callout tone="info" title="Harness glue: a dedicated runtime">
        Both samples point at <code>/api/copilotkit</code>, and the page shows
        no runtime setup. Here that path is the SSE runtime every other route
        uses, so the Intelligence setup from the{" "}
        <a
          href="https://docs.copilotkit.ai/mastra/intelligence/quickstart"
          target="_blank"
          rel="noreferrer"
          className="underline underline-offset-4"
        >
          Intelligence quickstart
        </a>{" "}
        lives on <code>/api/copilotkit-threads</code>, with{" "}
        <code>myAgent</code> registered as <code>default</code> so the
        samples&apos; agent-less components resolve it.
      </Callout>

      <Panel title="Drawer + CopilotChat (published)">
        <SourceCode file={`${DIR}/demo-chat/page.tsx`} />
      </Panel>

      <Panel title="Drawer + CopilotSidebar (published)">
        <SourceCode file={`${DIR}/sidebar/demo-chat/page.tsx`} />
      </Panel>

      <Panel title="Runtime (harness glue)">
        <SourceCode file="frontend/src/app/api/copilotkit-threads/[[...slug]]/route.ts" />
      </Panel>
    </>
  );
}

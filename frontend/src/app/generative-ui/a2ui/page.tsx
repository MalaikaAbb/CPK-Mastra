import { RouteHeader } from "@/components/route-header";
import { SourceCode } from "@/components/source-code";
import { Callout, Panel, TryIt } from "@/components/ui";

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/a2ui" />

      <Callout tone="warn" title="Harness swaps: the snippet's agent and path">
        The page&apos;s runtime snippet registers <code>default: myAgent</code>{" "}
        without defining <code>myAgent</code>; here it is this repo&apos;s
        Quickstart Mastra agent, reached with <code>getLocalAgent</code>. The
        snippet&apos;s <code>/api/copilotkit</code> path is this repo&apos;s
        shared runtime, so the snippet runs at{" "}
        <code>/api/copilotkit-a2ui</code>. That agent has no A2UI tool of its
        own; whether anything renders depends on what <code>a2ui: {"{}"}</code>{" "}
        adds by itself. See README §9.
      </Callout>

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The minimum A2UI switch: <code>a2ui: {"{}"}</code> on the runtime puts
          the A2UI middleware in front of every agent, and the v2 provider
          renders A2UI surfaces with no extra frontend code. The optional{" "}
          <code>a2ui={"{{ theme }}"}</code> prop swaps the renderer&apos;s theme;
          the page&apos;s example theme is empty.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={["Show me a contact card for Ada Lovelace with an email button."]}
            expect="The chat replies. If the middleware gives the agent a generate_a2ui tool on its own, a surface renders in the chat; if not, the reply is plain text, because the page's agent emits no A2UI. Record which one you see."
            fail="The request errors (runtime or agent wiring), or raw A2UI JSON is shown as text."
          />
        </div>
      </Panel>

      <Panel title="Runtime (published snippet + labelled swaps)">
        <SourceCode file="frontend/src/app/api/copilotkit-a2ui/route.ts" />
      </Panel>

      <Panel title="Provider with theme (published snippet)">
        <SourceCode file="frontend/src/app/generative-ui/a2ui/demo-chat/page.tsx" />
      </Panel>
    </>
  );
}

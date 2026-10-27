import { RouteHeader } from "@/components/route-header";
import { SourceCode } from "@/components/source-code";
import { Callout, Panel, TryIt } from "@/components/ui";

const DIR = "frontend/src/app/webmcp";

export default function Page() {
  return (
    <>
      <RouteHeader path="/webmcp" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          One frontend tool, two kinds of caller. Adding <code>webmcp</code> to
          a <code>useFrontendTool</code> registration also publishes the tool
          on the browser&apos;s <code>document.modelContext</code>, so a
          WebMCP-aware browser agent can discover it and run the same handler
          the CopilotKit agent uses — directly in the page, without going
          through the runtime.
        </p>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <TryIt
            prompts={["Which of my orders are still open?", "Show my delivered orders"]}
            expect={
              <>
                React frontend tool demo, any browser: the agent calls{" "}
                <code>searchOrders</code>, the call appears in the side panel
                (<em>status: open → 2 orders</em>), and the reply lists those
                orders.
              </>
            }
            fail="The agent answers without calling the tool, or the side panel stays at “None yet” after a tool call."
          />
          <TryIt
            prompts={['{ "status": "shipped" }']}
            expect={
              <>
                Chrome 149+ with WebMCP enabled: the side panel says{" "}
                <code>document.modelContext</code> is available. In the Model
                Context Tool Inspector, <code>searchOrders</code> is listed with
                a <code>status</code> enum and <code>readOnlyHint</code>;
                calling it returns the shipped order and adds a row to the side
                panel. Same on the{" "}
                <a
                  href="/webmcp/core/demo-chat"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[var(--accent)] underline underline-offset-4"
                >
                  no-agent demo ↗
                </a>
                .
              </>
            }
            fail="document.modelContext is available but searchOrders is missing from the inspector, or calling it does not add a row."
          />
        </div>
      </Panel>

      <Callout tone="warn" title="Experimental browser API">
        WebMCP needs Chrome 149+ with the origin trial or{" "}
        <code>chrome://flags/#enable-webmcp-testing</code>. In any other browser{" "}
        <code>document.modelContext</code> is missing and CopilotKit skips the
        WebMCP registration silently — the tool still works for the CopilotKit
        agent. The browser half has not yet been run in a WebMCP-enabled Chrome
        here; it was checked against a stand-in <code>document.modelContext</code>{" "}
        (see README §9 item 22).
      </Callout>

      <Callout tone="warn" title="Where the published code differs">
        <p>
          <strong><code>searchOrders</code> is never defined.</strong> Both
          samples call <code>await searchOrders(status)</code>; the page does
          not show it. <code>search-orders.ts</code> supplies sample orders
          (and records each call for the side panel).
        </p>
        <p className="mt-2">
          <strong><code>@copilotkit/core</code> has no install step.</strong>{" "}
          The no-agent sample imports it, but the page gives no install line.
          It resolves here because <code>@copilotkit/react-core</code> 1.80.0
          depends on the same version; a standalone app would need to install
          it.
        </p>
        <p className="mt-2">
          <strong>Two demos, not one.</strong> Both samples register a tool
          named <code>searchOrders</code>, and WebMCP rejects a second tool
          with the same name, so the no-agent sample has its own page.
        </p>
      </Callout>

      <Panel title="Add WebMCP manually — React frontend tool">
        <SourceCode file={`${DIR}/order-search.tsx`} region="order-search" />
      </Panel>

      <Panel
        title="Add WebMCP manually — WebMCP only, with no agent"
        description="Imported by /webmcp/core/demo-chat; no runtime, no agent."
      >
        <SourceCode file={`${DIR}/webmcp.ts`} region="webmcp-core" />
      </Panel>

      <Panel title="Test the complete path">
        <ol className="list-decimal space-y-1.5 pl-5 text-sm text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1</strong> — Open Chrome 149+ and enable{" "}
            <code>chrome://flags/#enable-webmcp-testing</code>, then relaunch.
          </li>
          <li>
            <strong>Step 2</strong> — Load the demo from{" "}
            <code>http://localhost:3000</code> as the top-level page (not in an
            iframe).
          </li>
          <li>
            <strong>Step 3</strong> — The demo&apos;s side panel reports
            whether <code>document.modelContext</code> exists.
          </li>
          <li>
            <strong>Step 4</strong> — In the Model Context Tool Inspector
            extension, check that <code>searchOrders</code> has the{" "}
            <code>status</code> enum and <code>readOnlyHint</code>, call it with{" "}
            <code>{'{ "status": "open" }'}</code>, and check the result.
          </li>
          <li>
            <strong>Step 5</strong> — Ask the inspector&apos;s agent “which of
            my orders are still open?” and confirm it picks{" "}
            <code>searchOrders</code>.
          </li>
        </ol>
      </Panel>

      <Panel title="Demo pages">
        <SourceCode file={`${DIR}/demo-chat/page.tsx`} />
        <div className="mt-4">
          <SourceCode file={`${DIR}/core/demo-chat/page.tsx`} />
        </div>
      </Panel>

      <Panel title="searchOrders (not on the page)">
        <SourceCode file={`${DIR}/search-orders.ts`} />
      </Panel>
    </>
  );
}

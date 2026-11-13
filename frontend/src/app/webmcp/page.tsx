import { RouteHeader } from "@/components/route-header";
import { SourceCode } from "@/components/source-code";
import { Callout, Panel, TryIt } from "@/components/ui";

export default function Page() {
  return (
    <>
      <RouteHeader path="/webmcp" />

      <Callout tone="warn" title="Published gap: searchOrders is never defined">
        Both snippets call <code>searchOrders(status)</code>, which the page
        never defines or imports. It is not stubbed here: the call keeps a{" "}
        <code>@ts-expect-error</code>, and invoking the tool (from the chat or
        a browser agent) throws <code>ReferenceError: searchOrders is not
        defined</code>. The registration itself still happens, so discovery
        can be tested. See README §9.
      </Callout>

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          A frontend tool published twice: to the CopilotKit agent as usual, and,
          with <code>webmcp</code> set, to the browser&apos;s{" "}
          <code>document.modelContext</code> so WebMCP-aware browser agents can
          discover and call the same handler directly in the page, with no
          runtime or backend agent in between. Without WebMCP support in the
          browser, registration is a silent no-op.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={["Find my shipped orders."]}
            expect="In Chrome 149+ with the WebMCP flag or origin trial: document.modelContext exists and the Model Context Tool Inspector lists searchOrders with its status enum and readOnlyHint. Calling it (inspector or chat) fails with “searchOrders is not defined” — the published gap. In other browsers: no WebMCP registration and no error."
            fail="With WebMCP enabled, searchOrders is not listed in the inspector, or the page throws on load."
          />
        </div>
      </Panel>

      <Callout tone="info" title="Not compiled: the core-only variant">
        The &ldquo;WebMCP only, with no agent&rdquo; snippet builds a separate
        module-level <code>CopilotKitCore</code> from <code>@copilotkit/core</code>{" "}
        with the same undefined <code>searchOrders</code>. It is shown below
        verbatim rather than run, so the page does not mount a second core
        beside the app&apos;s provider.
      </Callout>

      <Panel title="React frontend tool (published)">
        <SourceCode file="frontend/src/app/webmcp/OrderSearch.tsx" />
      </Panel>

      <Panel title="Core only, no agent (verbatim, not compiled)">
        <SourceCode file="docs-verbatim/webmcp/page-snippets/02.ts" />
      </Panel>
    </>
  );
}

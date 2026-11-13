import { RouteHeader } from "@/components/route-header";
import { SourceCode, SourceCodeGroup } from "@/components/source-code";
import { Callout, Panel, TryIt } from "@/components/ui";

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/mcp-apps" />

      <Callout tone="warn" title="Framework swap: a Mastra agent in place of BuiltInAgent">
        The page&apos;s runtime builds a CopilotKit <code>BuiltInAgent</code>.
        This harness runs a Mastra agent with the same model and prompt and no
        tools; everything else in the runtime (<code>mcpApps</code>,{" "}
        <code>InMemoryAgentRunner</code>, the multi-route handler) is as
        published, on <code>/api/copilotkit-mcp-apps</code> instead of the
        shared <code>/api/copilotkit</code>. The <code>.use(MCPAppsMiddleware)</code>{" "}
        alternative needs <code>@ag-ui/mcp-apps-middleware</code>, which is not
        installed; it is shown below, not compiled.
      </Callout>

      <Callout tone="info" title="Needs an MCP Apps server on port 3108">
        The runtime points at <code>http://localhost:3108/mcp</code>, which
        this repo does not provide. Run one of the demo servers from{" "}
        <a
          href="https://github.com/modelcontextprotocol/ext-apps"
          target="_blank"
          rel="noreferrer"
          className="underline underline-offset-4"
        >
          modelcontextprotocol/ext-apps
        </a>{" "}
        on that port first (README §7 has the steps).
      </Callout>

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          UI that ships with an MCP server. The runtime&apos;s{" "}
          <code>mcpApps</code> option connects to the server, offers its tools
          to the agent on each run, and when a tool with a UI resource is
          called, the chat fetches that resource and renders it in a sandboxed
          iframe, proxying the iframe&apos;s calls back to the server. No
          frontend code beyond a chat.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={["What tools do you have? Use one that shows a UI."]}
            expect="With an ext-apps demo server on :3108: the agent calls one of its tools and an interactive iframe (e.g. a budget allocator or chart) renders in the sidebar chat. Without a server: a plain reply, or an error from the MCP connection in the dev-server log."
            fail="A server is running on :3108 but the agent lists no tools, or calls a UI tool and nothing renders. A model-not-found error means the account lacks the published gpt-6-luna."
          />
        </div>
      </Panel>

      <Panel title="Runtime + agent (published, Mastra swap labelled)">
        <SourceCodeGroup
          files={[
            { file: "frontend/src/app/api/copilotkit-mcp-apps/[[...slug]]/route.ts" },
            { file: "frontend/src/mastra/mcp-apps-agent.ts", region: "mcp-apps-agent" },
          ]}
        />
      </Panel>

      <Panel title="Provider + page (published)">
        <SourceCode file="frontend/src/app/generative-ui/mcp-apps/demo-chat/page.tsx" />
      </Panel>

      <Panel title="Per-agent middleware alternative (verbatim, not compiled)">
        <SourceCode file="docs-verbatim/generative-ui/mcp-apps/page-snippets/06.ts" />
      </Panel>
    </>
  );
}

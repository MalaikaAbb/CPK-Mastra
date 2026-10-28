import { RouteHeader } from "@/components/route-header";
import { CodeBlock, Callout, Panel, TryIt } from "@/components/ui";
import { SourceCode } from "@/components/source-code";

const DEMO = "frontend/src/app/generative-ui/mcp-apps/demo-chat/page.tsx";

const EXT_APPS_REPO = "https://github.com/modelcontextprotocol/ext-apps";
const BUDGET_EXAMPLE = `${EXT_APPS_REPO}/tree/main/examples/budget-allocator-server`;
const GUIDE_SERVERS =
  "https://docs.copilotkit.ai/mastra/generative-ui/mcp-apps#example-mcp-servers";

const linkClass = "text-[var(--accent)] underline underline-offset-4";

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/mcp-apps" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          UI that comes from an MCP server, not from this app. The runtime is
          told about an MCP server; when the agent calls one of that
          server&apos;s tools that has a UI resource attached, CopilotKit
          fetches the resource and renders it in a sandboxed iframe inside the
          chat. The app itself contains no component for it.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The demo has a switch for the MCP server: <strong>Live server</strong>{" "}
          (the public Excalidraw MCP App, nothing to run) or{" "}
          <strong>Local server</strong> (the page&apos;s own{" "}
          <code>http://localhost:3108/mcp</code>, which you start yourself —
          see below). Switching starts a fresh chat.
        </p>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <TryIt
            prompts={[
              "Draw a simple diagram: a box labelled Browser with an arrow to a box labelled Server.",
            ]}
            expect={
              <>
                <strong>Live server:</strong> the status line says{" "}
                <em>reachable</em>. The agent calls Excalidraw&apos;s{" "}
                <code>read_me</code> and <code>create_view</code> tools, and a
                hand-drawn diagram appears inside the sidebar chat, its shapes
                drawing in one by one.
              </>
            }
            fail="The status line says reachable but the agent answers in plain text with no embedded diagram, or the app frame stays blank."
          />
          <TryIt
            prompts={["Help me allocate a $100K budget"]}
            expect={
              <>
                <strong>Local server</strong> (budget-allocator example
                running): the status line says <em>reachable</em>, and an
                interactive budget allocator (sliders, donut chart, stage
                selector) appears inside the chat; moving a slider updates the
                chart.
              </>
            }
            fail="The status line says reachable but no app appears. If it says not reachable, the local server is not running — the agent then just answers in text."
          />
        </div>
      </Panel>

      <Panel title="Set up the local server">
        <div className="space-y-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          <p>
            The page&apos;s{" "}
            <a href={GUIDE_SERVERS} target="_blank" rel="noreferrer" className={linkClass}>
              Example MCP Servers
            </a>{" "}
            section points to the{" "}
            <a href={EXT_APPS_REPO} target="_blank" rel="noreferrer" className={linkClass}>
              modelcontextprotocol/ext-apps
            </a>{" "}
            repo, whose README lists the example servers and how to run them.
            Each Node example is also published on npm as{" "}
            <code>@modelcontextprotocol/server-&lt;name&gt;</code>; without{" "}
            <code>--stdio</code> it serves HTTP at <code>/mcp</code> on{" "}
            <code>PORT</code> (default 3001). This route&apos;s local option
            expects port 3108, so set it explicitly.
          </p>
          <ol className="list-decimal space-y-1.5 pl-5">
            <li>Install Node.js 20+.</li>
            <li>
              In a second terminal, start the{" "}
              <a href={BUDGET_EXAMPLE} target="_blank" rel="noreferrer" className={linkClass}>
                budget-allocator example
              </a>{" "}
              on port 3108 (leave it running):
            </li>
          </ol>
          <CodeBlock
            language="bash"
            code={
              "# PowerShell\n$env:PORT=3108; npx -y @modelcontextprotocol/server-budget-allocator@2.0.4\n\n# bash / macOS / Linux\nPORT=3108 npx -y @modelcontextprotocol/server-budget-allocator@2.0.4"
            }
          />
          <ol start={3} className="list-decimal space-y-1.5 pl-5">
            <li>
              Open the demo, pick <strong>Local server</strong>, and wait for
              the status line to say <em>reachable</em>.
            </li>
            <li>
              Ask <em>Help me allocate a $100K budget</em>.
            </li>
          </ol>
          <p>
            Any other ext-apps example works the same way — swap the package
            name and keep <code>PORT=3108</code>. The server listens on{" "}
            <code>0.0.0.0</code>, so it is reachable from your network while it
            runs; stop it with <kbd>Ctrl</kbd>+<kbd>C</kbd>.
          </p>
        </div>
      </Panel>

      <Callout tone="warn" title="Where the published code differs">
        <p>
          <strong>No Mastra code (Step 3).</strong> This is a Mastra page, but
          its agent is CopilotKit&apos;s <code>BuiltInAgent</code>; a callout
          says the same process works with any agent. Kept as published, so
          Mastra is not involved in this route.
        </p>
        <p className="mt-2">
          <strong>Which server, which port (Step 3).</strong> The runtime
          points at <code>localhost:3108</code>, but the page does not say
          which example to run or that the examples default to port 3001. The
          demo&apos;s Live option uses the public Excalidraw server instead.
        </p>
        <p className="mt-2">
          <strong>File path (Step 3).</strong> It says{" "}
          <code>touch app/api/copilotkit/route.ts</code>, but the code is titled{" "}
          <code>app/api/copilotkit/[[...slug]]/route.ts</code>. The catch-all
          is the one that works (the runtime is multi-route). Here it lives at{" "}
          <code>/api/copilotkit-mcp-apps/&lt;server&gt;</code> so it does not
          replace the main runtime.
        </p>
        <p className="mt-2">
          <strong>Model (Step 4).</strong> The callout says the example uses
          GPT-4o; the code uses <code>openai/gpt-5.4</code>. Kept as
          published; it worked with this repo&apos;s key on 2026-10-28.
        </p>
        <p className="mt-2">
          <strong>Server down fails silently.</strong> With nothing on the
          configured URL a run still succeeds; the agent just has no MCP tools.
          The demo adds a status line for that.
        </p>
      </Callout>

      <Panel title="Step 2 — Add the dependencies">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Nothing to install here: <code>@copilotkit/react-core</code> and{" "}
          <code>@copilotkit/runtime</code> are already dependencies, and{" "}
          <code>@ag-ui/mcp-apps-middleware</code> comes with{" "}
          <code>@copilotkit/runtime</code> 1.80.0. Only the alternative{" "}
          <code>MCPAppsMiddleware</code> snippet imports it directly, and that
          snippet is not exercised here.
        </p>
      </Panel>

      <Panel
        title="Step 3 — Configure your agent"
        description="The page's runtime, built once per server (local / live)."
      >
        <SourceCode file="frontend/src/app/api/copilotkit-mcp-apps/[[...slug]]/route.ts" />
      </Panel>

      <Panel title="Step 4 — Configure environment">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          <code>OPENAI_API_KEY</code> in <code>frontend/.env.local</code>, the
          same key every other route uses.
        </p>
      </Panel>

      <Panel title="Step 5 — Configure CopilotKit Provider">
        <SourceCode file={DEMO} region="providers" />
      </Panel>

      <Panel title="Step 6 — Add the chat interface">
        <SourceCode file={DEMO} region="page" />
      </Panel>

      <Panel title="Whole demo file">
        <SourceCode file={DEMO} />
      </Panel>
    </>
  );
}

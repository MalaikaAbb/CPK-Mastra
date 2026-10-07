import { RouteHeader } from "@/components/route-header";
import { SourceCode, SourceCodeGroup } from "@/components/source-code";
import { Callout, Panel, TryIt } from "@/components/ui";

const DIR = "frontend/src/app/generative-ui/open-generative-ui";

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/open-generative-ui" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          No component catalog at all. The agent writes the UI itself (HTML,
          CSS and JS) as one <code>generateSandboxedUi</code> tool call. The
          runtime middleware turns that streaming call into activity events,
          and the built-in renderer builds it live inside a sandboxed iframe:
          styles first, then markup, then scripts.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The advanced cell adds <em>sandbox functions</em>: host-page handlers
          the generated iframe can call through{" "}
          <code>Websandbox.connection.remote.*</code>. On Mastra the agent
          reads the design skill and sandbox-function descriptions from request
          context and folds them into its own prompt (<code>foldHostContext</code>),
          because the bridge does not inject context into the model for you.
        </p>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <TryIt
            prompts={["Quicksort visualization", "How a neural network works"]}
            expect="Minimal cell: placeholder lines, then an animated, labelled SVG visualisation builds up in an iframe inside the chat."
            fail="A text-only reply, or an empty or blank iframe."
          />
          <TryIt
            prompts={["Calculator (calls evaluateExpression)"]}
            expect={
              <>
                Advanced cell (
                <a
                  href="/generative-ui/open-generative-ui/advanced/demo-chat"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[var(--accent)] underline underline-offset-4"
                >
                  open ↗
                </a>
                ): a working calculator. Pressing = shows the host&apos;s result,
                and the browser console logs{" "}
                <code>[open-gen-ui/advanced] evaluateExpression</code>.
              </>
            }
            fail="Buttons render but do nothing, or nothing is logged on the host."
          />
        </div>
      </Panel>

      <Callout tone="info" title="Removed: the aimock header wrapper">
        The published runtime route wraps its handler in{" "}
        <code>withForwardedHeaders</code> from the unpublished{" "}
        <code>@/mastra/_header_forwarding</code> (it forwards the
        showcase&apos;s test-fixture headers). Here the wrapper is removed and
        the handler inside it is unchanged.
      </Callout>

      <Panel title="Runtime (published)">
        <SourceCode file="frontend/src/app/api/copilotkit-ogui/route.ts" />
      </Panel>

      <Panel title="Minimal cell (published)">
        <SourceCodeGroup
          files={[
            { file: `${DIR}/demo-chat/page.tsx` },
            { file: `${DIR}/_minimal/design-skill.ts` },
          ]}
        />
      </Panel>

      <Panel title="Advanced cell (published)">
        <SourceCodeGroup
          files={[
            { file: `${DIR}/advanced/demo-chat/page.tsx` },
            { file: `${DIR}/_advanced/sandbox-functions.ts` },
          ]}
        />
      </Panel>

      <Panel title="The agents (published)">
        <SourceCode file="frontend/src/mastra/agents.ts" region="open-gen-ui-agents" />
      </Panel>
    </>
  );
}

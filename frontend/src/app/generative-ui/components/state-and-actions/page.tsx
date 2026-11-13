import { RouteHeader } from "@/components/route-header";
import { Callout, Panel } from "@/components/ui";


export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/components/state-and-actions" />

      <Callout tone="warn" title="Broken: reference only">
        <p>
          Nothing on this page is mounted. Its samples need a <code>Cart</code>{" "}
          type and a <code>cart</code> instance, and a <code>ProductCard</code>,
          that the page never defines, or are fragments (<code>events</code>,{" "}
          <code>writable</code>, function declarations) with no catalog around
          them. Nothing is written in their place, so it has no demo and no
          backend of its own. CopilotKit is now 1.87, so the version is no
          longer the blocker.
        </p>
      </Callout>

      <Panel title="What it would demonstrate">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Catalog-level <code>state</code> plus <code>bind</code> feed live app data into props (<code>useGenerativeUIState</code> publishes it); <code>functions</code> with <code>useGenerativeUIFunction</code> run your code from a click or the agent, with caller rules; <code>events</code> go back to the agent; <code>writable</code> props keep what the user types.
        </p>
      </Panel>

      <Panel title="Page snippets (verbatim, React tabs, not      <Panel title="The page's code">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Not copied into this repo: nothing on this page can run here, so its
          snippets are left on the{" "}
          <a className="text-[var(--accent)] underline underline-offset-4" href="https://docs.copilotkit.ai/mastra/generative-ui/components/state-and-actions">
            doc page
          </a>
          . The missing pieces are listed above and in README item 26.
        </p>
      </Panel>
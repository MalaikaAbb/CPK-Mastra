import { RouteHeader } from "@/components/route-header";
import { SourceCode, SourceCodeGroup } from "@/components/source-code";
import { Callout, Panel, TryIt } from "@/components/ui";

const DIR = "frontend/src/app/human-in-the-loop/governed-actions";
const V = "docs-verbatim/human-in-the-loop/governed-actions";

export default function Page() {
  return (
    <>
      <RouteHeader path="/human-in-the-loop/governed-actions" />

      <Callout tone="warn" title="Partial: only the useHumanInTheLoop variant can run">
        <p>
          The page publishes no agent, backend or demo. Its{" "}
          <code>useInterrupt</code> variant needs a backend that suspends with
          an action envelope on <code>interrupt.metadata.action</code>. None is
          published, and <code>@ag-ui/mastra</code> puts its suspend payload
          under <code>metadata.mastra.suspendPayload</code> instead. The
          resume-side <code>handleApproval</code> calls{" "}
          <code>executeSideEffect</code>, which is never defined. Both are shown
          below as reference.
        </p>
        <p className="mt-2">
          The live demo mounts the published <code>GovernedActionTool</code>{" "}
          next to the existing <code>myAgent</code> with its prompt unchanged.
          Nothing on the page tells an agent when to call the tool, so the
          model decides from the tool&apos;s description alone.
        </p>
      </Callout>

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          A checkpoint in front of side effects. The agent proposes an action as
          a small envelope (id, summary, tool, policy reference, verdict,
          arguments). The card then acts on the verdict: <code>allow</code>{" "}
          approves itself, <code>deny</code> blocks itself, and{" "}
          <code>require_approval</code> waits for a click. The decision returns
          to the agent as the tool result, keyed by the same id and reference.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={[
              "Email the Q3 report to finance@example.com, but get my approval first.",
              "Apply a 50% discount to order 1182 — this needs policy approval.",
            ]}
            expect="With verdict require_approval: a card shows the summary, tool, reference and JSON arguments, plus Approve / Reject buttons, and the run waits for the click. With allow or deny, the card resolves itself immediately."
            fail="The agent answers in text without calling approve_governed_action, or the card never renders (the render returns null unless the status is Executing)."
          />
        </div>
      </Panel>

      <Panel title="Live: useHumanInTheLoop variant (published)">
        <SourceCodeGroup
          files={[
            { file: `${DIR}/demo-chat/page.tsx` },
            { file: `${DIR}/governed-action-card.tsx` },
          ]}
        />
      </Panel>

      <Panel title="Reference: useInterrupt variant + resume check (verbatim, not compiled)">
        <SourceCodeGroup
          files={[
            { file: `${V}/governed-action-approval.tsx` },
            { file: `${V}/handle-approval.ts` },
          ]}
        />
      </Panel>
    </>
  );
}

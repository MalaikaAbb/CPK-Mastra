import { RouteHeader } from "@/components/route-header";
import { SourceCode, SourceCodeGroup } from "@/components/source-code";
import { Callout, Panel } from "@/components/ui";

const V = "docs-verbatim/human-in-the-loop/useInterrupt";

export default function Page() {
  return (
    <>
      <RouteHeader path="/human-in-the-loop/useInterrupt" />

      <Callout tone="warn" title="Reference-only: the backend half is never published">
        <p>
          The flow depends on a <code>schedule_meeting</code> tool that calls
          Mastra&apos;s <code>suspend()</code>. The agent imports it as{" "}
          <code>scheduleMeetingInterruptTool</code> from{" "}
          <code>@/mastra/tools</code>, which re-exports it from{" "}
          <code>./interrupt</code>. That module is not on the page or in its
          demo Code tab. Without it nothing ever pauses, so there is no live
          demo here.
        </p>
        <p className="mt-2">
          Also unpublished: <code>generateFallbackSlots</code> (
          <code>../_shared/interrupt-fallback-slots</code>), the{" "}
          <code>@/mastra/_header_forwarding</code> model wrapper, and the
          components the <code>enabled</code> and <code>handler</code> examples
          render (<code>AskCard</code>, <code>ApproveCard</code>,{" "}
          <code>RequestAccessCard</code>, <code>lookupUserDepartment</code>).
          Inventory: <code>docs-verbatim/README.md</code>.
        </p>
      </Callout>

      <Panel title="What it would demonstrate">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          A pause the backend enforces rather than one the model chooses. The
          tool suspends the run with a payload (<code>topic</code>,{" "}
          <code>attendee</code>, <code>slots</code>). The bridge surfaces that
          as an AG-UI interrupt, both as the legacy <code>on_interrupt</code>{" "}
          custom event and as a <code>RUN_FINISHED</code> interrupt outcome.{" "}
          <code>useInterrupt</code> renders a time picker in the chat, and{" "}
          <code>resolve(...)</code> resumes the run with the pick as the
          tool&apos;s <code>resumeData</code>.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Worth knowing when the backend does exist: the published render reads{" "}
          <code>event.value</code> and JSON-parses the{" "}
          <code>mastra_suspend</code> wrapper. In <code>@ag-ui/mastra</code> 1.1.2
          the same payload is also on the standard interrupt at{" "}
          <code>interrupt.metadata.mastra.suspendPayload</code>.
        </p>
      </Panel>

      <Panel title="Demo Code tab (verbatim, not compiled)">
        <SourceCodeGroup
          files={[
            { file: `${V}/demo-code-tab/interrupt-agent.ts` },
            { file: `${V}/demo-code-tab/page.tsx` },
            { file: `${V}/demo-code-tab/time-picker-card.tsx` },
          ]}
        />
      </Panel>

      <Panel title="Page snippets (verbatim, not compiled)">
        <SourceCodeGroup
          files={[
            { file: `${V}/page-snippets/03.tsx` },
            { file: `${V}/page-snippets/04.tsx` },
            { file: `${V}/page-snippets/06.tsx` },
            { file: `${V}/page-snippets/07.tsx` },
          ]}
        />
        <div className="mt-4">
          <SourceCode file={`${V}/page-snippets/05.txt`} />
        </div>
      </Panel>
    </>
  );
}

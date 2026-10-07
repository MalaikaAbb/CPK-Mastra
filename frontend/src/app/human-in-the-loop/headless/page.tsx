import Link from "next/link";

import { RouteHeader } from "@/components/route-header";
import { SourceCode, SourceCodeGroup } from "@/components/source-code";
import { Callout, Panel } from "@/components/ui";

const V = "docs-verbatim/human-in-the-loop/headless";

export default function Page() {
  return (
    <>
      <RouteHeader path="/human-in-the-loop/headless" />

      <Callout tone="warn" title="Reference-only: same unpublished backend as useInterrupt">
        <p>
          The demo runs on the same <code>interruptAgent</code> whose{" "}
          <code>schedule_meeting</code> suspend tool is never published (see{" "}
          <Link href="/human-in-the-loop/useInterrupt" className="underline underline-offset-4">
            useInterrupt
          </Link>
          ), so nothing can pause and there is no live demo.
        </p>
        <p className="mt-2">
          The page&apos;s own snippets have further gaps.{" "}
          <code>generateFallbackSlots</code> / <code>TimeSlot</code> are
          imported from an unpublished module. The &ldquo;raw&rdquo; panel calls{" "}
          <code>useHeadlessInterrupt</code>, which it says is &ldquo;defined
          above&rdquo;, but it is not defined anywhere on the page. Both
          plain-UI panels map over an undefined <code>SLOTS</code>.
        </p>
      </Callout>

      <Panel title="What it would demonstrate">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The interrupt from useInterrupt, resolved outside the chat transcript.
          With <code>renderInChat: false</code> the hook returns the element
          instead of publishing it into <code>CopilotChat</code>, so the page
          can place the picker anywhere. In the demo it goes in an app-surface
          pane beside the chat. The page also names the primitives underneath:{" "}
          <code>agent.subscribe</code> for the interrupt signal, and{" "}
          <code>copilotkit.runAgent</code> with a <code>resume</code> payload to
          continue.
        </p>
      </Panel>

      <Panel title="Demo Code tab (verbatim, not compiled)">
        <SourceCode file={`${V}/demo-code-tab/page.tsx`} />
      </Panel>

      <Panel title="Page snippets (verbatim, not compiled)">
        <SourceCodeGroup
          files={[
            { file: `${V}/page-snippets/01.tsx` },
            { file: `${V}/page-snippets/03.tsx` },
            { file: `${V}/page-snippets/04.tsx` },
          ]}
        />
      </Panel>
    </>
  );
}

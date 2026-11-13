import Link from "next/link";

import { RouteHeader } from "@/components/route-header";
import { Callout, Panel } from "@/components/ui";

const ROUTES = [
  {
    href: "/human-in-the-loop/tool-based",
    label: "Tool-based (useHumanInTheLoop)",
    note: "The path the overview calls supported for Mastra. Live here.",
  },
  {
    href: "/human-in-the-loop/useInterrupt",
    label: "useInterrupt",
    note: "Interrupt-based. Reference-only here: its suspend() tool is never published.",
  },
  {
    href: "/human-in-the-loop/headless",
    label: "Headless interrupts",
    note: "Interrupt-based, headless variant.",
  },
  {
    href: "/human-in-the-loop/governed-actions",
    label: "Governed actions",
    note: "useHumanInTheLoop variant live; interrupt variant reference-only.",
  },
];

export default function Page() {
  return (
    <>
      <RouteHeader path="/human-in-the-loop" />

      <Panel title="What the overview covers">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          An orientation page with no code: human-in-the-loop lets an agent
          stop for a person&apos;s input or approval mid-run. For Mastra it
          points to two approaches — frontend tools registered with{" "}
          <code>useHumanInTheLoop</code> that render a UI and wait for an
          answer (marked supported), and native interrupts (marked not
          supported).
        </p>
      </Panel>

      <Callout tone="warn" title="Doc inconsistency: interrupts are 'not supported', yet documented">
        The overview labels interrupt-based HITL &ldquo;Not Supported&rdquo; for
        Mastra and links to <code>/human-in-the-loop/interrupt-flow</code>,
        while the Mastra sidebar also carries <code>useInterrupt</code> and
        headless-interrupt pages built on Mastra&apos;s <code>suspend()</code>.
        Its two cards also link without the <code>/mastra</code> prefix. See
        README §9.
      </Callout>

      <Panel title="HITL routes in this harness">
        <ul className="space-y-2 text-sm">
          {ROUTES.map((r) => (
            <li key={r.href}>
              <Link
                href={r.href}
                className="font-medium text-[var(--accent)] underline underline-offset-4"
              >
                {r.label}
              </Link>
              <span className="text-slate-600 dark:text-slate-400"> — {r.note}</span>
            </li>
          ))}
        </ul>
      </Panel>
    </>
  );
}

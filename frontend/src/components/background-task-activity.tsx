"use client";

import type { ReactActivityMessageRenderer } from "@copilotkit/react-core/v2";
import { z } from "zod";

/**
 * Renders Mastra's background-task activity events.
 *
 * Activity messages are a separate AG-UI channel from tool calls, so this is
 * not a `useRenderTool` renderer. A renderer declares the `activityType` it
 * handles plus a Zod schema for the payload, and CopilotKit routes matching
 * events to it.
 *
 * It lives here rather than on the Background Tasks page because activity
 * renderers register on the provider — `renderActivityMessages` is a
 * provider-level array, and `useRenderActivityMessage()` is a *consumer* hook
 * that takes no arguments.
 *
 * `activityType` must match what Mastra emits. `@ag-ui/mastra` exports the same
 * string as `MASTRA_BACKGROUND_TASK_ACTIVITY_TYPE`; the doc writes the literal,
 * which is kept here.
 *
 * The content arrives as one ACTIVITY_SNAPSHOT (always `status: "running"`,
 * hardcoded by `@ag-ui/mastra`) followed by ACTIVITY_DELTA JSON-Patches that
 * move `/status` and append to `/outputs`. Statuses are matched explicitly:
 * treating everything non-terminal as "working" hides `suspended` and
 * `cancelled`, which look identical to a task that is still running.
 */

const outputSchema = z.object({
  // Each entry wraps whatever the tool passed to `writer.write()`.
  output: z
    .object({
      stage: z.string().optional(),
      step: z.number().optional(),
      totalSteps: z.number().optional(),
    })
    .passthrough()
    .optional(),
});

const contentSchema = z
  .object({
    status: z.string().optional(),
    args: z.record(z.string(), z.unknown()).optional(),
    outputs: z.array(outputSchema.passthrough()).optional(),
  })
  .passthrough();

const BADGE: Record<string, { label: string; className: string }> = {
  completed: {
    label: "Completed",
    className:
      "bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200",
  },
  failed: {
    label: "Failed",
    className: "bg-red-100 text-red-900 dark:bg-red-950 dark:text-red-200",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  },
  suspended: {
    label: "Suspended",
    className: "bg-sky-100 text-sky-900 dark:bg-sky-950 dark:text-sky-200",
  },
};

const WORKING = {
  label: "Working…",
  className:
    "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200",
};

export const backgroundTaskActivityRenderer: ReactActivityMessageRenderer<
  z.infer<typeof contentSchema>
> = {
  activityType: "mastra-background-task",
  content: contentSchema,
  render: ({ content }) => {
    const status = content.status ?? "running";
    const badge = BADGE[status] ?? WORKING;
    const topic = (content.args?.topic as string | undefined) ?? "task";
    const latest = content.outputs?.at(-1)?.output;
    const progress =
      latest?.stage && latest.step && latest.totalSteps
        ? `${latest.stage} (${latest.step}/${latest.totalSteps})`
        : undefined;

    return (
      <div
        data-status={status}
        className="my-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
      >
        <div className="flex flex-wrap items-center gap-2">
          <strong className="text-slate-800 dark:text-slate-100">
            Deep research
          </strong>
          <span className="text-slate-500">— {topic}</span>
          <span
            className={`ml-auto rounded px-2 py-0.5 text-xs font-medium ${badge.className}`}
          >
            {badge.label}
          </span>
        </div>
        {progress && badge === WORKING ? (
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {progress}
          </p>
        ) : null}
      </div>
    );
  },
};

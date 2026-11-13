# Dynamic Schema A2UI

> Generate a Mastra dashboard from a client-side A2UI catalog.


<!-- interactive demo: declarative-gen-ui -->


Dynamic Schema A2UI lets an agent draw a surface from the conversation. The
frontend supplies the allowed components and their props through a catalog;
the agent generates the component tree and data for each request.

## Frontend catalog

Define your components, renderers, and catalog in the demo source. The same
catalog works whether Mastra runs with the CopilotKit route or in a separate
process.

```typescript
// src/app/demos/declarative-gen-ui/a2ui/definitions.ts
import { z } from "zod";
import type { CatalogDefinitions } from "@copilotkit/a2ui-renderer";

export const myDefinitions = {
  Card: {
    description:
      "A titled card container with an optional subtitle and a single child slot. Use it to group related content (metrics, rows, buttons).",
    props: z.object({
      title: z.string(),
      subtitle: z.string().optional(),
      child: z.string().optional(),
    }),
  },

  StatusBadge: {
    description:
      "A small coloured pill communicating the state of something (healthy/degraded/down, online/offline, open/closed). Choose `variant` to match the intent.",
    props: z.object({
      text: z.string(),
      variant: z.enum(["success", "warning", "error", "info"]).optional(),
    }),
  },

  Metric: {
    description:
      "A key/value KPI display with an optional trend indicator. Ideal for dashboards (e.g. 'Revenue • $12.4k • up').",
    props: z.object({
      label: z.string(),
      value: z.string(),
      trend: z.enum(["up", "down", "neutral"]).optional(),
    }),
  },

  InfoRow: {
    description:
      "A compact two-column 'label: value' row. Good for stacks of facts inside a Card (owner, region, last updated, etc.).",
    props: z.object({
      label: z.string(),
      value: z.string(),
    }),
  },

  DataTable: {
    description:
      "A data table with column headers and rows. Ideal for rankings and per-person/per-item breakdowns (rep performance vs quota, deal lists). Each row's keys MUST appear in `columns[].key`; unknown row keys render as blank cells and indicate model/schema drift.",
    props: z.object({
      columns: z.array(z.object({ key: z.string(), label: z.string() })),
      // Cells may be strings or numbers — the renderer stringifies at render
      // time, but accepting both lets the LLM emit raw numerics (e.g.
      // attainment 124) instead of being forced to stringify.
      rows: z.array(z.record(z.union([z.string(), z.number()]))),
    }),
  },

  PrimaryButton: {
    description:
      "A styled primary call-to-action button. Attach an optional `action` that will be dispatched back to the agent when the user clicks it.",
    props: z.object({
      label: z.string(),
      action: z.any().optional(),
    }),
  },

  PieChart: {
    description:
      "A pie/donut chart with a brand-coloured legend. Provide `title`, `description`, and `data` as an array of `{ label, value }` objects. Great for part-of-whole breakdowns (sales by region, traffic sources, portfolio allocation).",
    props: z.object({
      title: z.string(),
      description: z.string(),
      data: z.array(
        z.object({
          label: z.string(),
          value: z.number(),
        }),
      ),
    }),
  },

  BarChart: {
    description:
      "A vertical bar chart built on Recharts. Provide `title`, `description`, and `data` as an array of `{ label, value }` objects. Great for comparing series across categories (quarterly revenue, headcount by team, signups per month).",
    props: z.object({
      title: z.string(),
      description: z.string(),
      data: z.array(
        z.object({
          label: z.string(),
          value: z.number(),
        }),
      ),
    }),
  },
} satisfies CatalogDefinitions;
```

```typescript
// src/app/demos/declarative-gen-ui/a2ui/renderers.tsx
export const myRenderers: CatalogRenderers<MyDefinitions> = {
  Card: ({ props, children }) => (
    <Card
      className="w-full min-w-0 overflow-hidden"
      data-testid="declarative-card"
    >
      <CardHeader>
        <CardTitle>{props.title}</CardTitle>
        {props.subtitle && <CardDescription>{props.subtitle}</CardDescription>}
      </CardHeader>
      {props.child && (
        <CardContent className="flex flex-col gap-4">
          {children(props.child)}
        </CardContent>
      )}
    </Card>
  ),

  StatusBadge: ({ props }) => (
    <Badge
      variant={props.variant ?? "info"}
      data-testid="declarative-status-badge"
    >
      {props.text}
    </Badge>
  ),

  Metric: ({ props }) => {
    const trend = props.trend ?? "neutral";
    const arrow = trend === "up" ? "↑" : trend === "down" ? "↓" : "";
    const trendClass =
      trend === "up"
        ? "text-emerald-600"
        : trend === "down"
          ? "text-rose-600"
          : "text-[var(--foreground)]";
    return (
      // `flex-1 min-w-[120px]` lets a row of Metrics distribute evenly
      // inside the basic catalog's gap-less Row — 3 metrics in a 600px
      // card column get ~200px each instead of squishing to content width.
      <div
        data-testid="declarative-metric"
        className="flex flex-1 min-w-[120px] flex-col gap-1"
      >
        <div className="text-xs font-medium uppercase tracking-wider text-[var(--muted-foreground)]">
          {props.label}
        </div>
        <div
          className={`flex items-baseline gap-1.5 text-2xl font-semibold tabular-nums ${trendClass}`}
        >
          <span>{props.value}</span>
          {arrow && <span className="text-base">{arrow}</span>}
        </div>
      </div>
    );
  },

  InfoRow: ({ props }) => (
    // Divider via `border-b last:border-b-0` so the final row doesn't dangle
    // a trailing line, regardless of whether the agent wraps these in a
    // Column or drops them directly into a Card's child slot.
    <div
      data-testid="declarative-info-row"
      className="flex items-baseline justify-between gap-4 py-2 border-b border-[var(--border)] last:border-b-0 last:pb-0 first:pt-0"
    >
      <span className="text-sm text-[var(--muted-foreground)]">
        {props.label}
      </span>
      <span className="text-sm font-medium text-[var(--foreground)] text-right tabular-nums">
        {props.value}
      </span>
    </div>
  ),

  DataTable: ({ props }) => {
    const cols = Array.isArray(props.columns) ? props.columns : [];
    const rows = Array.isArray(props.rows) ? props.rows : [];
    return (
      <div
        data-testid="declarative-data-table"
        className="w-full overflow-x-auto"
      >
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              {cols.map((col) => (
                <th
                  key={col.key}
                  className="border-b-2 border-[var(--border)] px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => {
              // Stable row key: prefer the first column's value (primary-key-ish),
              // suffix with index in case values repeat, fall back to a JSON
              // stringify of the row when columns is empty. Stable keys prevent
              // React from re-mounting every row when the agent re-emits a
              // slightly different table.
              const pk = cols.length > 0 ? row[cols[0].key] : undefined;
              const rowKey =
                pk !== undefined ? `${pk}-${i}` : JSON.stringify(row);
              return (
                <tr
                  key={rowKey}
                  className="border-b border-[var(--border)] last:border-b-0"
                >
                  {cols.map((col) => (
                    <td
                      key={col.key}
                      className="px-3 py-2 tabular-nums text-[var(--foreground)]"
                    >
                      {String(row[col.key] ?? "")}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  },

  PrimaryButton: ({ props, dispatch }) => (
    <Button
      onClick={() => {
        if (props.action && dispatch) dispatch(props.action);
      }}
    >
      {props.label}
    </Button>
  ),

  PieChart: ({ props }) => {
    const data = props.data ?? [];
    const safeData = Array.isArray(data) ? data : [];
    const total = safeData.reduce((sum, d) => sum + (Number(d.value) || 0), 0);

    return (
      // `flex-1 min-w-0` so multiple charts in a basic-catalog Row
      // distribute the available width evenly instead of each insisting
      // on its content size and overflowing.
      <Card
        className="w-full flex-1 min-w-0 overflow-hidden"
        data-testid="declarative-pie-chart"
      >
        <CardHeader>
          <CardTitle>{props.title}</CardTitle>
          <CardDescription>{props.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {safeData.length === 0 ? (
            <div className="py-8 text-center text-sm text-[var(--muted-foreground)]">
              No data available
            </div>
          ) : (
            <>
              <DonutChart data={safeData} />
              <div className="flex flex-col gap-2 pt-2">
                {safeData.map((item, index) => {
                  const val = Number(item.value) || 0;
                  const pct =
                    total > 0 ? ((val / total) * 100).toFixed(0) : "0";
                  return (
                    <div
                      key={index}
                      className="flex items-center gap-3 text-sm"
                    >
                      <span
                        className="inline-block h-2.5 w-2.5 shrink-0 rounded-sm"
                        style={{
                          backgroundColor:
                            CHART_COLORS[index % CHART_COLORS.length],
                        }}
                      />
                      <span className="flex-1 truncate text-[var(--foreground)]">
                        {item.label}
                      </span>
                      <span className="tabular-nums text-[var(--muted-foreground)]">
                        {val.toLocaleString()}
                      </span>
                      <span className="w-10 text-right tabular-nums text-[var(--muted-foreground)]">
                        {pct}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    );
  },

  BarChart: ({ props }) => {
    const { isNew } = useSeenIndices();
    const data = props.data ?? [];
    const safeData = Array.isArray(data) ? data : [];

    return (
      <Card
        className="w-full flex-1 min-w-0 overflow-hidden"
        data-testid="declarative-bar-chart"
      >
        {/* Scoped keyframe — no globals.css needed */}
        <style>{`
          @keyframes barSlideIn {
            from { transform: translateY(40px); opacity: 0; }
            20% { opacity: 1; }
            to { transform: translateY(0); opacity: 1; }
          }
        `}</style>
        <CardHeader>
          <CardTitle>{props.title}</CardTitle>
          <CardDescription>{props.description}</CardDescription>
        </CardHeader>
        <CardContent>
          {safeData.length === 0 ? (
            <div className="py-8 text-center text-sm text-[var(--muted-foreground)]">
              No data available
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <RechartsBarChart
                data={safeData}
                margin={{ top: 12, right: 12, bottom: 4, left: -8 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--border)"
                  vertical={false}
                />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                  stroke="var(--border)"
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                  stroke="var(--border)"
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={CHART_TOOLTIP_STYLE}
                  cursor={{ fill: "var(--muted)", opacity: 0.5 }}
                />
                <Bar
                  isAnimationActive={false}
                  dataKey="value"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={48}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  shape={
                    ((barProps: any) => (
                      <AnimatedBar
                        {...barProps}
                        isNew={isNew(barProps.index as number)}
                      />
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    )) as any
                  }
                >
                  {safeData.map((_, index) => (
                    <Cell
                      key={index}
                      fill={CHART_COLORS[index % CHART_COLORS.length]}
                    />
                  ))}
                </Bar>
              </RechartsBarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    );
  },
};
```

```typescript
// src/app/demos/declarative-gen-ui/a2ui/catalog.ts
import { createCatalog } from "@copilotkit/a2ui-renderer";

import { myDefinitions } from "./definitions";
import { myRenderers } from "./renderers";

export const myCatalog = createCatalog(myDefinitions, myRenderers, {
  catalogId: "declarative-gen-ui-catalog",
  includeBasicCatalog: true,
});
```

Pass the catalog to the provider. Its `runtimeUrl` must point to a **CopilotKit
endpoint**, and its `agent` must match a key returned by that endpoint.

```typescript
// src/app/demos/declarative-gen-ui/page.tsx
import React from "react";
import { CopilotKit } from "@copilotkit/react-core/v2";

import { myCatalog } from "./a2ui/catalog";
import { Chat } from "./chat";

export default function DeclarativeGenUIDemo() {
  return (
    <CopilotKit
      runtimeUrl="/api/copilotkit-declarative-gen-ui"
      agent="declarative-gen-ui"
      a2ui={{ catalog: myCatalog }}
    >
      <div className="flex justify-center items-center h-screen w-full">
        <div className="h-full w-full max-w-4xl">
          <Chat />
        </div>
      </div>
    </CopilotKit>
```

## Mastra in the same process

The live demo uses a dedicated CopilotKit runtime route and a local Mastra
agent. Its agent already supplies its own `generate_a2ui` tool, so the route
sets `injectA2UITool: false` to avoid registering the tool twice. The route
also pins `defaultCatalogId` to the catalog registered by the page.

Use this layout when the Mastra instance is imported into the same process as
the runtime route. See the [Copilot Runtime guide](/mastra/copilot-runtime)
for the local agent bridge.

## Mastra in a separate process

When Mastra runs as its own service, register a CopilotKit endpoint **on that
service**. This keeps the Mastra agent local to the endpoint that injects and
executes `generate_a2ui`, while the browser reaches it over HTTP. The example
below is a runnable Mastra fixture under
`showcase/integrations/mastra/tests/fixtures/remote-a2ui/mastra/index.ts`:

Use `@ag-ui/mastra` 1.1.4 or later with compatible `@ag-ui/core` and
`@ag-ui/client` versions. The Showcase fixture uses 1.1.4 and 0.0.58.

```ts title="src/mastra/index.ts"
import { Mastra } from "@mastra/core/mastra";
import { Agent } from "@mastra/core/agent";
import { getLocalAgent } from "@ag-ui/mastra";
import { registerCopilotKit } from "@ag-ui/mastra/copilotkit";

const dashboardAgent = new Agent({
  id: "declarative-gen-ui",
  name: "Dashboard",
  model: yourModel,
  instructions: "Call generate_a2ui for dashboard requests.",
});

export const mastra = new Mastra({
  agents: { dashboardAgent },
  server: {
    apiRoutes: [
      registerCopilotKit({
        path: "/copilotkit",
        resourceId: "demo-user",
        agents: () => {
          const agent = getLocalAgent({
            mastra,
            agentId: "dashboardAgent",
            resourceId: "demo-user",
          });
          if (!agent) throw new Error("dashboardAgent is not registered");
          return { "declarative-gen-ui": agent, default: agent };
        },
        a2ui: {
          injectA2UITool: true,
          defaultCatalogId: "declarative-gen-ui-catalog",
        },
        cors: { origin: "http://localhost:3000" },
      }),
    ],
  },
});
```

Set the provider's `runtimeUrl` to your Mastra service's `/copilotkit` URL (or
proxy that path through your frontend). Keep the provider's agent name
`declarative-gen-ui` and catalog ID `declarative-gen-ui-catalog` aligned with
the route. Use the frontend origin in `cors.origin` when calling the service
directly from the browser. In production, derive `resourceId` from the
authenticated caller instead of using the fixed example value.

The generic `MastraAgent.getRemoteAgents()` bridge described in the
[runtime guide](/mastra/copilot-runtime) serves ordinary remote agent runs. For
this A2UI configuration, use the registered endpoint so the A2UI tool runs
beside the Mastra agent. A completed `render_a2ui` tool call alone does not
prove that a surface rendered: check that the response contains nonempty
`a2ui_operations` for components and data, and that the dashboard appears in
the browser rather than remaining at “Building Interface.”

## When to use dynamic schemas

Use this approach when the user can ask for different layouts and data. If the
shape is known ahead of time, use a [fixed schema](./fixed-schema).

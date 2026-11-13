// Borrowed from the agno harness (frontend/src/app/generative-ui/tool-based/_demo/gen-ui-tool-based/bar-chart.tsx), not the doc page.
// Not from the doc page. The page's Code tab imports `BarChart` and
// `barChartPropsSchema` from "./bar-chart" but does not print the file, so
// this is a minimal stand-in: the schema the tool advertises (from the Agno
// showcase demo) and a plain Recharts bar chart.
import React from "react";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { z } from "zod";

export const barChartPropsSchema = z.object({
  title: z.string().describe("Chart title"),
  description: z.string().describe("Brief description or subtitle"),
  data: z.array(
    z.object({
      label: z.string(),
      value: z.number(),
    }),
  ),
});

export type BarChartProps = z.infer<typeof barChartPropsSchema>;

export function BarChart({ title, description, data }: BarChartProps) {
  return (
    <div className="my-4 rounded border p-4">
      <div className="font-semibold">{title}</div>
      <div className="text-sm">{description}</div>
      <ResponsiveContainer width="100%" height={240}>
        <RechartsBarChart data={Array.isArray(data) ? data : []}>
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#8884d8" />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}

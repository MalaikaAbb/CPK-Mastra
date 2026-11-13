// Borrowed from the agno harness (frontend/src/app/generative-ui/tool-based/_demo/gen-ui-tool-based/pie-chart.tsx), not the doc page.
// Not from the doc page. The page's Code tab imports `PieChart` and
// `pieChartPropsSchema` from "./pie-chart" but does not print the file, so
// this is a minimal stand-in: the schema the tool advertises (from the Agno
// showcase demo) and a plain Recharts pie chart.
import React from "react";
import {
  PieChart as RechartsPieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { z } from "zod";

export const pieChartPropsSchema = z.object({
  title: z.string().describe("Chart title"),
  description: z.string().describe("Brief description or subtitle"),
  data: z.array(
    z.object({
      label: z.string(),
      value: z.number(),
    }),
  ),
});

export type PieChartProps = z.infer<typeof pieChartPropsSchema>;

export function PieChart({ title, description, data }: PieChartProps) {
  return (
    <div className="my-4 rounded border p-4">
      <div className="font-semibold">{title}</div>
      <div className="text-sm">{description}</div>
      <ResponsiveContainer width="100%" height={240}>
        <RechartsPieChart>
          <Pie
            data={Array.isArray(data) ? data : []}
            dataKey="value"
            nameKey="label"
            fill="#8884d8"
            label
          />
          <Tooltip />
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
}

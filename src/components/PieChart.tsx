"use client";

import { TrendingUp } from "lucide-react";
import { Label, Pie, PieChart, Sector } from "recharts";
import { PieSectorDataItem } from "recharts/types/polar/Pie";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/src/shadcn/components/ui/chart";
import { deviceT } from "@/types";

export const description = "A donut chart with an active sector";

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  Up: {
    label: "UP",
    color: "var(--chart-1)",
  },
  Down: {
    label: "UP",
    color: "var(--chart-2)",
  },
  firefox: {
    label: "Firefox",
    color: "var(--chart-3)",
  },
  edge: {
    label: "Edge",
    color: "var(--chart-4)",
  },
  other: {
    label: "Other",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig;

export function DeviceSensorsChart({ device }: { device: deviceT }) {
  const sensors = device.sensor;
  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square  max-h-[160px] border"
    >
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Pie
          data={sensors.map((item) => ({
            ...item,
            fill:
              item.status === "Up"
                ? "green"
                : item.status === "Down"
                ? "red"
                : "yellow",
            active: item.status_raw,
          }))}
          dataKey="active"
          nameKey="name"
          innerRadius={50}
          strokeWidth={10}
          outerRadius={60}
          activeShape={({ outerRadius = 0, ...props }: PieSectorDataItem) => (
            <Sector {...props} outerRadius={outerRadius + 10} />
          )}
        />
        <Label
          content={({ viewBox }) => {
            return (
              <text x={80} y={80} textAnchor="middle" dominantBaseline="middle">
                <tspan className="fill-foreground text-sm font-bold">
                  {device.name}
                </tspan>
                {/* <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 24}
                        className="fill-muted-foreground"
                      >
                        Visitors
                      </tspan> */}
              </text>
            );
          }}
        />
      </PieChart>
    </ChartContainer>
  );
}

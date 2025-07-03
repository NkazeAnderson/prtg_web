"use client";

import { TrendingUp } from "lucide-react";
import { Label, Pie, PieChart, Sector } from "recharts";
import { PieSectorDataItem } from "recharts/types/polar/Pie";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/shadcn/components/ui/card";
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
      className="mx-auto aspect-square max-h-[100px]"
    >
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Pie
          data={sensors.map((item) => ({
            ...item,
            fill: item.active ? "green" : "red",
            active: item.active ? 1 : 0,
          }))}
          dataKey="active"
          nameKey="name"
          innerRadius={20}
          strokeWidth={10}
          outerRadius={40}
          activeShape={({ outerRadius = 0, ...props }: PieSectorDataItem) => (
            <Sector {...props} outerRadius={outerRadius + 10} fill="blue" />
          )}
        />
      </PieChart>
    </ChartContainer>
  );
}

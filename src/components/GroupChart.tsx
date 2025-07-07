"use client";

import { TrendingUp } from "lucide-react";
import { Cell, Label, LabelList, Pie, PieChart, Sector } from "recharts";
import { PieSectorDataItem } from "recharts/types/polar/Pie";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/src/shadcn/components/ui/chart";
import { deviceT, groupT, sensorStatusT } from "@/types";
import { parseItemToArray } from "../utils";
import { groupSchema, probeSchema } from "@/schemas";

export const description = "A donut chart with an active sector";

export function GroupDeviceChart({
  group,
  depth,
  width = 160,
  filters = [],
}: {
  group: groupT;
  depth?: number;
  width?: number;
  filters?: sensorStatusT[];
}) {
  if (!group.device || !group.device.length) {
    return null;
  }
  const chartConfig: ChartConfig = {};
  const outerRadius = width / 4 - 15;

  const data = group.device
    ?.filter((item) => {
      if (filters.length) {
        return item.sensor.some((sensor) => filters.includes(sensor.status));
      }
      return true;
    })
    .map((item) => {
      chartConfig[item.name] = {
        label: item.name,
        color: "black",
      };
      return {
        ...item,
        fill: item.sensor.some((item) => item.status === "Down")
          ? "red"
          : item.sensor.some((item) => item.status !== "Up")
          ? "yellow"
          : "green",
        active: 1,
        outerRadius: item.sensor.some((item) => item.status === "Down")
          ? 65
          : 60,
      };
    });

  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square border"
      style={{ maxWidth: group.name === "Root" ? width : width / 2 }}
    >
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent labelKey="name" hidden />}
        />
        <Pie
          data={data}
          dataKey="active"
          nameKey="name"
          innerRadius={outerRadius - 20}
          outerRadius={outerRadius}
          activeShape={({ outerRadius = 0, ...props }: PieSectorDataItem) => (
            <Sector {...props} outerRadius={outerRadius + 10} />
          )}
          paddingAngle={3}
        ></Pie>
        <Label
          content={() => {
            return (
              <text
                x={"50%"}
                y={"50%"}
                textAnchor="middle"
                dominantBaseline="middle"
              >
                <tspan className="fill-foreground text-sm font-bold">
                  {group.name}
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

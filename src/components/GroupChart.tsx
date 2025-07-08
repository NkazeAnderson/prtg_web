"use client";

import { TrendingUp } from "lucide-react";
import { Cell, Label, LabelList, Pie, PieChart, Sector } from "recharts";
import { PieSectorDataItem } from "recharts/types/polar/Pie";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/src/shadcn/components/ui/chart";
import { deviceT, groupT, sensorStatusT } from "@/types";
import { parseItemToArray } from "../utils";
import { groupSchema, probeSchema } from "@/schemas";
import { DeviceSensorsChart } from "./DeviceChart";
import { useState } from "react";

export const description = "A donut chart with an active sector";

export function GroupDeviceChart({
  group,
  depth,
  width = 160,
  filters = [],
  showLegend,
  activeDevice,
  setActiveDevice,
}: {
  group: groupT;
  depth?: number;
  width?: number;
  filters?: sensorStatusT[];
  showLegend?: boolean;
  activeDevice?: deviceT;
  setActiveDevice: (device?: deviceT) => void;
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

  if (activeDevice) {
    return (
      <>
        <DeviceSensorsChart device={activeDevice} width={width - 20} />
      </>
    );
  }

  return (
    <>
      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square border relative"
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
              <Sector
                {...props}
                outerRadius={outerRadius + 10}
                onClick={(e) => {
                  e.stopPropagation();
                  showLegend && setActiveDevice(props.payload);
                }}
              />
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
                </text>
              );
            }}
          />
        </PieChart>
      </ChartContainer>
      {showLegend && (
        <div className="">
          <h4 className=" text-center">Devices</h4>
          <div className="flex-wrap gap-2 *:basis-1/4 *:justify-center top-full w-full my-4 border-y-2 py-4 border-gray-300 flex">
            {data.map((item, index) => (
              <div
                className=" flex flex-row items-center gap-3 hover:cursor-pointer"
                onClick={() => {
                  setActiveDevice(group.device?.[index]);
                }}
              >
                <div
                  className="size-4"
                  style={{ backgroundColor: item.fill }}
                ></div>
                <p>{item.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

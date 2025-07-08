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
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../shadcn/components/ui/table";
import { useState } from "react";

export const description = "A donut chart with an active sector";

export function DeviceSensorsChart({
  device,
  depth,
  width = 160,
  filters = [],
}: {
  device: deviceT;
  depth?: number;
  width?: number;
  filters?: sensorStatusT[];
}) {
  console.log(device.sensor);

  if (!device || !device.sensor.length) {
    return null;
  }
  const chartConfig: ChartConfig = {};
  const outerRadius = width / 4 - 15;
  const [hoveredLegend, setHoveredLegend] = useState<number>();

  const data = device.sensor
    ?.filter((item) => {
      if (filters.length) {
        return filters.includes(item.status);
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
        fill:
          item.status === "Down"
            ? "red"
            : item.status !== "Up"
            ? "yellow"
            : "green",
        active: 1,
      };
    });

  return (
    <>
      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square border relative"
        style={{ maxWidth: width }}
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
            order={"name"}
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
                    {device.name}
                  </tspan>
                </text>
              );
            }}
          />
        </PieChart>
      </ChartContainer>
      <div className="">
        <h4 className=" text-center">Sensors</h4>
        <div className="flex-wrap gap-2 *:basis-1/4 *:justify-center top-full w-full my-4 border-y-2 py-4 border-gray-300">
          {data.map((item, index) => (
            <div
              className=" flex flex-row items-center gap-3"
              onClick={() => {}}
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
      <div className="">
        <h4 className=" text-center">Device Data</h4>
        <Table className=" px-4">
          <TableCaption>List of device properties</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="font-semibold capitalize w-24 border-r">
                Property
              </TableHead>
              <TableHead className="font-semibold capitalize">Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.keys(device).map((item) =>
              ["string", "number", "bigint", "boolean"].includes(
                typeof item
              ) ? (
                <TableRow key={item}>
                  <TableCell className="font-semibold capitalize border-r">
                    {item}
                  </TableCell>
                  <TableCell className=" capitalize">
                    {
                      //@ts-ignore
                      String(device[item])
                    }
                  </TableCell>
                </TableRow>
              ) : null
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

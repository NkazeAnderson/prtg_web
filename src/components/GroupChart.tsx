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
import {
  deviceSchema,
  groupSchema,
  probeSchema,
  sensorSchema,
} from "@/schemas";
import { DeviceSensorsChart } from "./DeviceChart";
import { useEffect, useRef, useState } from "react";

export const description = "A donut chart with an active sector";

export function GroupDeviceChart({
  group,
  depth,
  width = 500,
  filters = [],
  showLegend = true,
  activeDevice,
  setActiveDevice,
}: {
  group: groupT;
  depth?: number;
  width?: number;
  filters?: sensorStatusT[];
  showLegend?: boolean;
  activeDevice?: deviceT;
  activeGroup?: groupT;
  setActiveDevice: (device?: deviceT) => void;
}) {
  const [finalData, setFinalData] = useState(group);
  const [hardRefresh, setHardRefresh] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const prev = useRef<groupT | deviceT | undefined>(undefined);

  const chartConfig: ChartConfig = {};
  const outerRadius = width / 2 - 15;

  function getGroupState(group: groupT, isdevice?: boolean) {
    //@ts-ignore
    if (isdevice || group.sensor) {
      const device = group as deviceT;
      const base = parseItemToArray(device.sensor, sensorSchema);
      return base.some((item) => item.status === "Down")
        ? "red"
        : base.some((item) => item.status !== "Up")
        ? "yellow"
        : "green";
    }
    if (group.device) {
      const base = parseItemToArray(group.device, deviceSchema);
      return base.some((groupItem) => {
        const sensors = parseItemToArray(groupItem?.sensor, sensorSchema);
        return sensors.some((item) => item.status === "Down");
      })
        ? "red"
        : base.some((groupItem) => {
            const sensors = parseItemToArray(groupItem?.sensor, sensorSchema);
            return sensors.some((item) => item.status !== "Up");
          })
        ? "yellow"
        : "green";
    }

    if (group.group) {
      parseItemToArray(group.group, groupSchema)?.forEach((item) => {
        getGroupState(item);
      });
    }
  }

  function prepareData(data: groupT | deviceT) {
    const groupData =
      //@ts-ignore
      data.group?.map((item) => {
        chartConfig[item.name] = {
          label: item.name,
          color: "green",
        };
        return {
          ...item,
          fill: getGroupState(item),
          active: 1,
        };
      }) ?? [];

    const deviceData =
      //@ts-ignore
      data.device?.map((item) => {
        chartConfig[item.name] = {
          label: item.name,
          color: "black",
        };
        return {
          ...item,
          fill: getGroupState(item, true),
          active: 1,
        };
      }) ?? [];
    const sensorData =
      //@ts-ignore
      data.sensor?.map((item) => {
        chartConfig[item.name] = {
          label: item.name,
          color: "black",
        };
        return {
          ...item,
          fill: getGroupState(item, true),
          active: 1,
        };
      }) ?? [];

    return [...groupData, ...deviceData, ...sensorData];
  }

  useEffect(() => {
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      setHardRefresh(true);
    }
  }, [finalData]);

  const data = prepareData(finalData).flatMap((item) => item);
  return (
    <>
      {prev.current && (
        <div
          className=" absolute z-50"
          onClick={() => {
            //@ts-ignore
            setFinalData(prev.current);
            console.log(prev.current);
          }}
        >
          <img src="/arrow-left.svg" width={50} height={50} />
        </div>
      )}
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
            innerRadius={outerRadius - 40}
            outerRadius={outerRadius}
            activeShape={({ outerRadius = 0, ...props }: PieSectorDataItem) => (
              <Sector
                {...props}
                outerRadius={outerRadius + 10}
                onClick={(e) => {
                  e.stopPropagation();
                  //@ts-ignore
                  if (finalData.device || finalData.sensor || finalData.group) {
                    prev.current = finalData;
                    setFinalData(props.payload);
                  }
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
                  <tspan className="fill-foreground text-3xl font-bold capitalize">
                    {prev.current ? finalData.name : group.classification}
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
          <div className="flex-wrap gap-6 top-full w-full my-4 border-y-2 py-4 border-gray-300 flex">
            {data.map((item, index) => (
              <div
                key={index}
                className=" flex flex-row items-center gap-1 hover:cursor-pointer"
                onClick={() => {
                  setActiveDevice(group.device?.[index]);
                }}
              >
                <div
                  className="size-4 rounded-full"
                  style={{ backgroundColor: item.fill ?? "black" }}
                ></div>
                <p className=" text-nowrap">{item.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

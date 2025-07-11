"use client";

import { deviceT, groupT, sensorStatusT } from "@/types";
import React, { Ref, RefObject, useEffect, useRef, useState } from "react";
import { useDataContext } from "./DataContextProvider";
import { GroupDeviceChart } from "./GroupChart";
import { Checkbox } from "../shadcn/components/ui/checkbox";
import { sensorStatus } from "../constants.ts";
import { parseItemToArray } from "../utils";
import { groupSchema } from "@/schemas";

function HomePageDashboard() {
  const groups = useDataContext();
  const [activeMain, setActiveMain] = useState<groupT>();
  console.log(groups);

  const [activeDevice, setActiveDevice] = useState<deviceT>();
  const [mainSectionWidth, setMainSectionWidth] = useState(0);
  const [sensorStatusFilters, setSensorStatusFilters] = useState<
    sensorStatusT[]
  >([]);
  const mainSection = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mainSection.current) {
      setMainSectionWidth(mainSection.current.offsetWidth);
    }
  }, []);

  const mains = groups.filter((item) => item.classification === "main");
  const vsats = groups.filter((item) => item.classification === "vsat");
  const connects = groups.filter((item) => item.classification === "connect");
  const main: groupT = {
    ...mains[0],
    group: mains
      .filter((item) => !item.name.toLowerCase().includes("vsat"))
      .filter((item) => !item.name.toLowerCase().includes("connect")),
  };
  const vsat: groupT = {
    ...mains[0],
    group: mains.filter((item) => item.name.toLowerCase().includes("vsat")),
    classification: "vsat",
  };

  const connect: groupT = {
    ...connects[0],
    group: [
      ...connects,
      ...mains.filter((item) => item.name.toLowerCase().includes("connect")),
    ],
  };

  return (
    <div className=" grid grid-cols-3 gap-10 h-full p-10">
      {/* <div className=" flex-1 shadow-2xl h-full overflow-y-scroll">
        {groups.map((item) => (
          <div
            className={`p-2 border bg-gray-50 hover:bg-gray-300 my-1 hover:cursor-pointer ${
              activeGroup?.id === item.id && "bg-gray-800 text-white"
            }`}
            onClick={(e) => {
              e.stopPropagation();
              setActiveGroup(item);
              setActiveDevice(undefined);
            }}
          >
            <h4 className=" capitalize">{item.name}</h4>
          </div>
        ))}
      </div> */}
      <div className=" col-span-1 relative" ref={mainSection}>
        <div>
          <GroupDeviceChart
            group={main}
            depth={1}
            width={mainSectionWidth}
            filters={sensorStatusFilters}
            showLegend={true}
            activeDevice={activeDevice}
            setActiveDevice={setActiveDevice}
          />
        </div>
      </div>
      <div className=" col-span-1 relative">
        <div>
          <GroupDeviceChart
            group={connect}
            depth={1}
            width={mainSectionWidth}
            filters={sensorStatusFilters}
            showLegend={true}
            activeDevice={activeDevice}
            setActiveDevice={setActiveDevice}
          />
        </div>
      </div>
      <div className=" col-span-1 relative">
        <div>
          <GroupDeviceChart
            group={vsat}
            depth={1}
            width={mainSectionWidth}
            filters={sensorStatusFilters}
            showLegend={true}
            activeDevice={activeDevice}
            setActiveDevice={setActiveDevice}
          />
        </div>
      </div>

      {/* <div className=" flex-1  px-2">
        <h1>Filters</h1>
        {sensorStatus.map((status) => (
          <div className="flex flex-row gap-4 p-2 items-center">
            <Checkbox
              checked={sensorStatusFilters.includes(status)}
              onCheckedChange={(checked) => {
                setSensorStatusFilters((prev) => {
                  if (checked && !sensorStatusFilters.includes(status)) {
                    return [...prev, status];
                  } else if (!checked && sensorStatusFilters.includes(status)) {
                    return prev.filter((item) => item !== status);
                  }
                  return prev;
                });
              }}
            />
            <p className=" font-semibold">{status}</p>
          </div>
        ))}
      </div> */}
    </div>
  );
}

export default HomePageDashboard;

/**
 *
 */

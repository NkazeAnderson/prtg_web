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
  const [activeGroup, setActiveGroup] = useState<groupT>();
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
    groups?.length && setActiveGroup(groups[0]);
  }, []);

  return (
    <div className=" container p-4 flex flex-row h-full">
      <div className=" flex-1 shadow-2xl h-full overflow-y-scroll">
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
      </div>
      <div
        className=" flex-[2] border rounded-r-3xl h-[85vh] "
        ref={mainSection}
      >
        <div className="flex flex-row gap-2 items-center p-4">
          {activeDevice && (
            <div
              onClick={() => {
                setActiveDevice(undefined);
              }}
            >
              <img className=" size-12" src={"/arrow-left.svg"} />
            </div>
          )}

          <h1 className=" text-center capitalize">
            {activeDevice
              ? activeDevice.name
              : activeGroup
              ? activeGroup.name
              : "Root"}
          </h1>
        </div>
        <div className="overflow-y-scroll overflow-x-hidden">
          <div
            className="flex flex-wrap gap-4 w-full h-[80vh] justify-center items-center relative"
            ref={mainSection}
          >
            {activeGroup?.group && (
              <div className="absolute  right-2 top-2  border">
                <div className=" bg-gray-600 text-white">
                  <h4>Sub Groups</h4>
                </div>
                <div className="p-4">
                  {parseItemToArray(activeGroup.group, groupSchema).map(
                    (subgroup) => {
                      return (
                        <p
                          key={subgroup.id}
                          className=" capitalize font-bold hover:cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveGroup(subgroup);
                          }}
                        >
                          * {subgroup.name}
                        </p>
                      );
                    }
                  )}
                </div>
              </div>
            )}
            {groups
              .filter((item) =>
                activeGroup
                  ? activeGroup.id === item.id || activeGroup.name === "Root"
                  : true
              )
              .map((item, index) => (
                <div
                  key={index}
                  className={`rounded-2xl my-2 gap-4 `}
                  style={{
                    width:
                      activeGroup?.name === "Root"
                        ? mainSectionWidth / 3
                        : mainSectionWidth,
                  }}
                  onClick={(e) => {
                    activeGroup &&
                      activeGroup.id !== item.id &&
                      setActiveGroup(item);
                    e.stopPropagation();
                  }}
                >
                  <GroupDeviceChart
                    group={item}
                    depth={1}
                    width={
                      activeGroup?.name === "Root"
                        ? mainSectionWidth / 3
                        : mainSectionWidth
                    }
                    filters={sensorStatusFilters}
                    showLegend={activeGroup?.name !== "Root"}
                    activeDevice={activeDevice}
                    setActiveDevice={setActiveDevice}
                  />
                </div>
              ))}
          </div>
        </div>
      </div>
      <div className=" flex-1  px-2">
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
      </div>
    </div>
  );
}

export default HomePageDashboard;

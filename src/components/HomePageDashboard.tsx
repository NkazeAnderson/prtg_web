"use client";

import { groupT } from "@/types";
import React, { Ref, RefObject, useEffect, useRef, useState } from "react";
import { useDataContext } from "./DataContextProvider";
import { GroupDeviceChart } from "./GroupChart";
import { Checkbox } from "../shadcn/components/ui/checkbox";
import { sensorStatus } from "../constants.ts";

function HomePageDashboard() {
  const groups = useDataContext();
  const [activeGroup, setActiveGroup] = useState<groupT>();
  const [mainSectionWidth, setMainSectionWidth] = useState(0);
  const [sensorStatusFilters, setSensorStatusFilters] = useState([]);
  const mainSection = useRef<HTMLDivElement>(null);

  useEffect(() => {}, []);

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
            }}
          >
            <h4 className=" capitalize">{item.name}</h4>
          </div>
        ))}
      </div>
      <div
        className=" flex-[2] border rounded-r-3xl h-[80vh] overflow-y-scroll"
        ref={mainSection}
      >
        <h1 className=" text-center capitalize">
          {activeGroup ? activeGroup.name : "Root"}
        </h1>
        <div
          className="flex flex-wrap gap-4 w-full h-[80vh] justify-center items-center"
          ref={mainSection}
        >
          {groups
            .filter((item) =>
              activeGroup
                ? activeGroup.id === item.id || activeGroup.name === "Root"
                : true
            )
            .map((item, index) => (
              <div>
                <div
                  key={index}
                  className={`rounded-2xl my-2 gap-4 min-w-[170px] `}
                  //   style={{ paddingLeft: depth * 10 }}
                >
                  <GroupDeviceChart group={item} depth={1} />
                </div>
              </div>
            ))}
        </div>
      </div>
      <div className=" flex-1  px-2">
        <h1>Filters</h1>
        {sensorStatus.map((item) => (
          <div className="flex flex-row gap-4 p-2">
            <Checkbox />
            <p className=" font-semibold">{item}</p>
          </div>
        ))}
        <Checkbox />
      </div>
    </div>
  );
}

export default HomePageDashboard;

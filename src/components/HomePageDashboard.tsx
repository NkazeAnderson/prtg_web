"use client";

import { groupT } from "@/types";
import React, { useState } from "react";
import { useDataContext } from "./DataContextProvider";
import { GroupDeviceChart } from "./GroupChart";

function HomePageDashboard() {
  const groups = useDataContext();
  const [activeGroup, setActiveGroup] = useState<groupT>();
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
      <div className=" flex-[3] border rounded-r-3xl h-full overflow-y-scroll">
        <h1 className=" text-center capitalize">
          {activeGroup ? activeGroup.name : "Root"}
        </h1>
        <div className="flex flex-wrap gap-4">
          {groups
            .filter((item) =>
              activeGroup
                ? activeGroup.id === item.id || activeGroup.name === "Root"
                : true
            )
            .map((item, index) => (
              <div
                key={index}
                className={`rounded-2xl my-2 gap-4 min-w-[170px] `}
                //   style={{ paddingLeft: depth * 10 }}
              >
                <GroupDeviceChart group={item} depth={1} />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default HomePageDashboard;

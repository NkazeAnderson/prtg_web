"use client";
import { getffromserver } from "@/actions";
import { groupT } from "@/types";
import React, { createContext, useContext, useEffect, useState } from "react";

const DataContext = createContext<groupT[] | null>(null);

export function useDataContext() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("Must be wrapped in data context");
  }
  return context;
}

function DataContextProvider({
  children,
  groups,
}: {
  children: React.ReactNode;
  groups: groupT[];
}) {
  const [groupsFromBackend, setGroupsFromBackend] = useState(groups);
  useEffect(() => {
    setInterval(async () => {
      const res = await getffromserver();
      setGroupsFromBackend(res);
      console.log("updated");
    }, 10000);
  }, []);

  return <DataContext value={groupsFromBackend}>{children}</DataContext>;
}

export default DataContextProvider;

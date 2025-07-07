"use client";
import { groupT } from "@/types";
import React, { createContext, useContext } from "react";

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
  return <DataContext value={groups}>{children}</DataContext>;
}

export default DataContextProvider;

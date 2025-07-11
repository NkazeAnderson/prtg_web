
"use server"

import { groupSchema } from "@/schemas";
import { parseItemToArray, pullPrtgGraph } from "../src/utils";
import { groupT } from "@/types";

export async function getffromserver() {
  const graph = await pullPrtgGraph();
   const rootGroup = graph.prtg.sensortree.nodes.group;
   let depth = 0;
   let flattenedGroup: (groupT & { depth: number; parent: number })[] = [];
   let parent = rootGroup.id;
 
   function flattenGroup(root: any) {
     if (typeof root === "object") {
       parent = root.id;
     }
     const groups: groupT[] = parseItemToArray(root, groupSchema);
 
     const classification: groupT["classification"] = groups[0].classification
       ? groups[0].classification
       : groups[0].name.toLowerCase().includes("connect")
       ? "connect"
       : groups[0].name.toLowerCase().includes("vsat")
       ? "vsat"
       : groups[0].name.toLowerCase().includes("root") ||
         groups[0].probenode ||
         root.probenode
       ? undefined
       : groups.some((item) => item.name.includes("probe")) ||
         groups[0].probenode
       ? undefined
       : "main";
 
     console.log(classification, groups[0].name.toLowerCase());
 
     const newGroups = groups.map((item) => ({
       ...item,
       parent,
       depth,
       classification,
     }));
 
     flattenedGroup = [...flattenedGroup, ...newGroups];
     groups.forEach((g) => {
       if (g.group) {
         depth = depth + 1;
         flattenGroup(g.group);
       }
       if (g.probenode) {
         depth = depth + 1;
         flattenGroup(g.probenode);
       }
     });
   }
   flattenGroup(rootGroup);

   return flattenedGroup
}
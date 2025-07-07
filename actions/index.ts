
"use server"

import { pullPrtgGraph } from "../src/utils";

export async function getffromserver() {
  return await pullPrtgGraph();
}
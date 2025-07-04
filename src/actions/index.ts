
"use server"

import { pullPrtgGraph } from "../utils";

export async function getffromserver() {
  return await pullPrtgGraph();
}
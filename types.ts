import { z } from "zod/v4"
import { deviceSchema, groupSchema, probeSchema, sensorSchema } from "./schemas"
import { sensorStatus } from "./src/constants.ts"

export type groupT = z.infer<typeof groupSchema>
export type probeT = z.infer<typeof probeSchema>
export type deviceT = z.infer<typeof deviceSchema>
export type sensorT = z.infer<typeof sensorSchema>
export type sensorStatusT = typeof sensorStatus[number]

export type parsedXMLGraphT = {prtg:{sensortree:{nodes:{ group: groupT}}}}
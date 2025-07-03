import { z } from "zod/v4"
import { deviceSchema, groupSchema, probeSchema, sensorSchema } from "./schemas"

export type groupT = z.infer<typeof groupSchema>
export type probeT = z.infer<typeof probeSchema>
export type deviceT = z.infer<typeof deviceSchema>
export type sensorT = z.infer<typeof sensorSchema>

export type parsedXMLGraphT = {prtg:{sensortree:{nodes:{ group: groupT}}}}
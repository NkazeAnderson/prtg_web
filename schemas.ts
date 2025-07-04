import z from "zod/v4";

const stringSchema = z.string();
const numberSchema = z.number();
const booleanSchema = z.boolean();
const upDownSchema = z.enum(["Up", "Down", "Warning", "Down (Partial)", "Down (Acknowledged)",  "Unusual", "Paused", "Unknown"]);

const commonSchema = z.object({
name: stringSchema,
id: numberSchema,
tags: stringSchema,
priority: numberSchema,
fixed: numberSchema,
hascomment: numberSchema,
status_raw: numberSchema,
active: booleanSchema,
});

export const sensorSchema = z.object({
...commonSchema.shape,
sensortype: stringSchema,
sensorkind: stringSchema,
interval: numberSchema,
status: upDownSchema,
datamode: numberSchema,
lastvalue: stringSchema,
statusmessage: stringSchema,
statussince_raw_utc: numberSchema,
lasttime_raw_utc: numberSchema,
lastok_raw_utc: numberSchema,
lasterror_raw_utc: numberSchema,
lastup_raw_utc: numberSchema,
lastdown_raw_utc: numberSchema,
cumulateddowntime_raw: numberSchema,
cumulateduptime_raw: numberSchema,
cumulatedsince_raw: numberSchema,
});

export const deviceSchema = z.object({
...commonSchema.shape,
host: stringSchema,
sensor: z.preprocess((value)=>{
    return !value ? [] : Array.isArray(value) ? value : [value]
}, sensorSchema.array())
});

export const probeSchema = z.object({
...commonSchema.shape,
device: z.preprocess((value)=>{
    return !value ? [] : Array.isArray(value) ? value : [value]
}, deviceSchema.array()).optional(),
group: z.preprocess((value)=>{
    return !value ? [] : Array.isArray(value) ? value : [value]
}, z.any().array()).optional(),
});

export const groupSchema = z.object({
...commonSchema.shape,
probenode: z.preprocess((value)=>{
    return !value ? [] : Array.isArray(value) ? value : [value]
}, probeSchema.array()).optional(),
group: z.preprocess((value)=>{
    return !value ? [] : Array.isArray(value) ? value : [value]
}, z.any().array()).optional(),
autodevice: z.preprocess((value)=>{
    return !value ? [] : Array.isArray(value) ? value : [value]
}, deviceSchema.array()).optional(),
device: z.preprocess((value)=>{
    return !value ? [] : Array.isArray(value) ? value : [value]
}, deviceSchema.array()).optional(),
});
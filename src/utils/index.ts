import { parsedXMLGraphT } from "@/types";
import axios from "axios";
import { XMLParser } from "fast-xml-parser";
import { ZodType } from "zod/v4";

export const getApiKey = () =>{
    const key = process.env.PTRG_API_KEY
    if (!key) {
        throw new Error("API key needed in env")
    }
    return  new URLSearchParams({apitoken:key}).toString()
}

export function getUrl(path:string, params?:string) {
    const host = process.env.HOST_IP ?? "localhost"
    const url=`http://${host}/api${path}?${params? params+"&":""}${getApiKey()}`
    return url
}

export async function pullPrtgGraph() {
    const res = await axios.get(getUrl("/table.xml", "content=sensortree"))
    const graph = new XMLParser().parse(res.data)
    return graph as parsedXMLGraphT
}

export function parseItemToArray<T extends ZodType>(value:any, schema:T) {
   return schema
    .array()
    .parse(
      !value
        ? []
        : Array.isArray(value)
        ? value
        : [value]
    );
}

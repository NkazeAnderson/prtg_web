import { parsedXMLGraphT } from "@/types";
import axios from "axios";
import { XMLParser } from "fast-xml-parser";

export const getApiKey = () =>{
    const key = process.env.PTRG_API_KEY
    if (!key) {
        throw new Error("API key needed in env")
    }
    return  new URLSearchParams({apitoken:key}).toString()
}

export function getUrl(path:string, params?:string) {
    const url=`http://localhost/api${path}?${params? params+"&":""}${getApiKey()}`
    console.log(url);
    return url
}



export async function pullPrtgGraph() {
    const res = await axios.get(getUrl("/table.xml", "content=sensortree"))
    const graph = new XMLParser().parse(res.data)
    return graph as parsedXMLGraphT
}
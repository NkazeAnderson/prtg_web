export function getUrl(path:string, params?:Record<string, string>) {
    const encodeParams = new URLSearchParams(params)
    const url=`http://localhost/${path}?${encodeParams}`
    console.log(url);
    return url
    
}

export function pullSystemXml(ip:string) {
}
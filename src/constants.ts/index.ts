const systemConfig = {
    ip:""
}

export const apiRoutes= {
    systemInfo: "/api/table.xml?content=sensortree"
    } as const

export const prtgKeysOfInterest = ["group", "probenode", "device", "sensor"]

export const sensorStatus =["Up", "Down", "Warning", "Down (Partial)", "Down (Acknowledged)",  "Unusual", "Paused", "Unknown"] as const
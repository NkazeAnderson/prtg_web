import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/src/shadcn/components/ui/navigation-menu";
import { Input } from "@/src/shadcn/components/ui/input";
import { parseItemToArray, pullPrtgGraph } from "@/src/utils";
import { classificationT, groupT } from "@/types";
import { groupSchema } from "@/schemas";
import DataContextProvider from "@/src/components/DataContextProvider";
import Image from "next/image";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Orion PRTG Web",
  description: "Customized Prtg web interface by Orion Tech Group",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className=" w-screen h-screen overflow-hidden fixed">
          <div className="flex flex-col h-full">
            <header className="">
              <nav className="p-4 bg-gray-700 text-white font-semibold  flex w-full justify-between">
                <div className=" flex flex-row gap-10 items-center">
                  <Image 
                    src="/images/orion.jpg"
                    alt="Logo"
                    width={50}
                    height={50}
                    className="rounded-lg shadow-md"
                  />
                  <div>

                  <h4 className=" text-nowrap">ORION-X</h4>
                  </div>
                
                </div>
                <NavigationMenu >
                  <NavigationMenuList>
                    <NavigationMenuItem>
                      <NavigationMenuLink href="/">Devices</NavigationMenuLink>
                    </NavigationMenuItem>
                  </NavigationMenuList>
                </NavigationMenu>
                <Input className=" bg-white w-1/4" placeholder="Search" />
              </nav>
            </header>
            <main className="w-full flex-1 border-4">
              <DataContextProvider groups={flattenedGroup}>
                {children}
              </DataContextProvider>
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}

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
import { groupT } from "@/types";
import { groupSchema } from "@/schemas";
import DataContextProvider from "@/src/components/DataContextProvider";

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
    const groups = parseItemToArray(root, groupSchema);

    const newGroups = groups.map((item) => ({
      ...item,
      parent,
      depth,
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
  console.log(flattenedGroup);
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className=" w-screen h-screen overflow-hidden fixed">
          <div className="flex flex-col h-full">
            <header className="">
              <nav className="p-4 bg-gray-700 text-white font-semibold  flex w-full justify-between">
                <NavigationMenu>
                  <NavigationMenuList>
                    <NavigationMenuItem>
                      <NavigationMenuLink href="/">Devices</NavigationMenuLink>
                    </NavigationMenuItem>
                  </NavigationMenuList>
                </NavigationMenu>
                <Input className=" bg-white w-[500]" placeholder="Search" />
              </nav>
            </header>
            <main className="w-full flex-1 ">
              <div className="w-full h-full fixed">
                <DataContextProvider groups={flattenedGroup}>
                  {children}
                </DataContextProvider>
              </div>
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}

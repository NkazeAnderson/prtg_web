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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
              <div className="w-full h-full fixed">{children}</div>
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}

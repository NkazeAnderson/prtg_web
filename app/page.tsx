import { deviceSchema, groupSchema, probeSchema } from "@/schemas";
import { DeviceSensorsChart } from "@/src/components/PieChart";
import { Button } from "@/src/shadcn/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/src/shadcn/components/ui/navigation-menu";
import { pullPrtgGraph } from "@/src/utils";
import { deviceT, groupT } from "@/types";
import { NavigationMenuItem } from "@radix-ui/react-navigation-menu";
import Image from "next/image";

const Device = ({ device }: { device: deviceT }) => {
  return (
    <div>
      <DeviceSensorsChart device={device} />
    </div>
  );
};

const Group = ({ group, depth }: { group: groupT; depth: number }) => {
  const devices = deviceSchema
    .array()
    .parse(
      !group.device
        ? []
        : Array.isArray(group.device)
        ? group.device
        : [group.device]
    );
  const groups = groupSchema
    .array()
    .parse(
      !group.group
        ? []
        : Array.isArray(group.group)
        ? group.group
        : [group.group]
    );
  const probes = probeSchema
    .array()
    .parse(
      !group.probenode
        ? []
        : Array.isArray(group.probenode)
        ? group.probenode
        : [group.probenode]
    );
  return (
    <div className={`d`} style={{ paddingLeft: depth * 10 }}>
      <p className={``}>{group.name}</p>

      {Boolean(probes.length) && (
        <div>
          <h1>Probes</h1>
          {probes.map((item) => (
            <div key={item.id}>
              <Group group={item} depth={depth + 1} />
            </div>
          ))}
        </div>
      )}
      {Boolean(groups.length) && (
        <div>
          <h1>Groups</h1>
          {groups.map((item) => (
            <div key={item.id}>
              <Group group={item} depth={depth + 1} />
            </div>
          ))}
        </div>
      )}
      {Boolean(devices.length) && (
        <div>
          <h1>Devices</h1>
          {devices.map((item) => (
            <div>
              <div className="w-[250]">
                <p key={item.id}>
                  <b>Name:</b> {item.name}
                </p>
                <Device device={item} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default async function Home() {
  const graph = await pullPrtgGraph();
  const rootGroup = graph.prtg.sensortree.nodes.group;
  console.log({ rootGroup });

  return (
    <div className="w-screen h-screen overflow-scroll">
      <div className="p-4 bg-gray-700 text-white font-semibold">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink>Devices</NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      <div className=" container p-4">
        <Group group={rootGroup} depth={0} />
      </div>
    </div>
  );
}

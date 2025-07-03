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
    <div className=" w-[160]">
      <div className=" border border-gray-900 bg-gray-100 p-2">
        <h2 className=" text-yellow-800 capitalize font-semibold">
          device - {device.name}
        </h2>
      </div>
      <DeviceSensorsChart device={device} />
    </div>
  );
};

const Group = ({
  group,
  depth,
  isProbe,
}: {
  group: groupT;
  depth: number;
  isProbe?: boolean;
}) => {
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
    <div
      className={` border border-green-200 rounded-2xl my-2 self-start flex gap-4`}
      style={{ paddingLeft: depth * 10 }}
    >
      <div>
        <div className=" border border-gray-900 bg-gray-100 p-2">
          <h2
            className={` ${
              !isProbe ? "text-blue-600" : "text-purple-600"
            }  capitalize font-bold`}
          >
            {!isProbe ? "group" : "probe"} - {group.name}
          </h2>
        </div>
      </div>
      <div className="flex flex-row">
        {Boolean(probes.length) && (
          <div className="basis-1/3">
            {probes.map((item) => (
              <div key={item.id}>
                <Group group={item} depth={depth + 1} isProbe />
              </div>
            ))}
          </div>
        )}
      </div>

      {Boolean(groups.length) && (
        <div className="basis-1/3">
          {groups.map((item) => (
            <Group key={item.id} group={item} depth={depth + 1} />
          ))}
        </div>
      )}
      {Boolean(devices.length) && (
        <div className="basis-1/3 flex items-center ml-4 gap-11 my-10">
          {devices.map((item) => (
            <Device key={item.id} device={item} />
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

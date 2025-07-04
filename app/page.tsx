import { deviceSchema, groupSchema, probeSchema } from "@/schemas";
import { GroupDeviceChart } from "@/src/components/GroupChart";
import { DeviceSensorsChart } from "@/src/components/PieChart";
import { parseItemToArray, pullPrtgGraph } from "@/src/utils";
import { deviceT, groupT, sensorT } from "@/types";

const Device = ({ device }: { device: deviceT }) => {
  return (
    <div>
      <div className="">
        <DeviceSensorsChart device={device} />
      </div>
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
  const devices = parseItemToArray(group.device, deviceSchema);
  const groups = parseItemToArray(group.group, groupSchema);
  const probes = parseItemToArray(group.probenode, probeSchema);

  return (
    <div
      className={`rounded-2xl my-2 gap-4 min-w-[170px] `}
      style={{ paddingLeft: depth * 10 }}
    >
      {/* <div className="grid grid-cols-3">
        <div className="p-4 border-2 border-gray-400">
          <h4 className=" text-green-600">Up</h4>
          <p>
            <b>Total:</b> {}
          </p>
        </div>
        <div>
          <h3 className=" text-red-600">Down</h3>
        </div>
        <div>
          <h3 className=" text-yellow-600">Others</h3>
        </div>
      </div> */}
      {/* <div>
        <div className=" border border-gray-900 bg-gray-100 p-2 w-full">
          <h5
            className={` ${
              !isProbe ? "text-blue-600" : "text-purple-600"
            }  capitalize font-medium text-nowrap`}
          >
            {group.name}
          </h5>
        </div>
      </div> */}
      {/* {Boolean(devices.length) && (
        <div className="grid grid-cols-3 ml-4 gap-11 my-10">
          {devices.map((item) => (
            <Device key={item.id} device={item} />
          ))}
        </div>
      )} */}
      <GroupDeviceChart group={group} depth={depth} />
      <div className="flex flex-row">
        {Boolean(probes.length) &&
          probes.map((item) => (
            <div key={item.id} className="flex-1">
              <Group group={item} depth={depth + 1} isProbe />
            </div>
          ))}
      </div>

      {Boolean(groups.length) && (
        <div className="flex flex-row flex-wrap gap-3 justify-center">
          {groups.map((item) => (
            <Group key={item.id} group={item} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export default async function Home() {
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
    <div className=" container p-4 flex flex-row h-full">
      <div className=" flex-1 shadow-2xl h-full overflow-y-scroll">
        {flattenedGroup.map((item) => (
          <div className="p-2 border bg-gray-50 hover:bg-gray-100 my-1 hover:cursor-pointer ">
            <h4>{item.name}</h4>
          </div>
        ))}
      </div>
      <div className=" flex-[3] border rounded-r-3xl h-full overflow-y-scroll">
        <Group group={rootGroup} depth={0} />
      </div>
    </div>
  );
}

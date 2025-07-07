import { deviceSchema, groupSchema, probeSchema } from "@/schemas";
import { GroupDeviceChart } from "@/src/components/GroupChart";
import HomePageDashboard from "@/src/components/HomePageDashboard";
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
  // const devices = parseItemToArray(group.device, deviceSchema);
  // const groups = parseItemToArray(group.group, groupSchema);
  // const probes = parseItemToArray(group.probenode, probeSchema);

  return (
    <div
      className={`rounded-2xl my-2 gap-4 min-w-[170px] `}
      style={{ paddingLeft: depth * 10 }}
    >
      <GroupDeviceChart group={group} depth={depth} />
      {/* <div className="flex flex-row">
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
      )} */}
    </div>
  );
};

export default async function Home() {
  return <HomePageDashboard />;
}

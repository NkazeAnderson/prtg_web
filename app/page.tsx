import { deviceSchema, groupSchema, probeSchema } from "@/schemas";
import Button from "@/src/components/Button";
import { pullPrtgGraph } from "@/src/utils";
import { groupT } from "@/types";
import Image from "next/image";

const Group = ({ group }: { group: groupT }) => {
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
    <div>
      <p>
        {" "}
        <b>Name:</b> {group.name}
      </p>

      <div>
        <h1>Probes</h1>
        {probes.map((item) => (
          <div key={item.id}>
            <p>
              <b>Name:</b> {item.name}
            </p>
            <Group group={item} />
          </div>
        ))}
      </div>
      <div>
        <h1>Groups</h1>
        {groups.map((item) => (
          <div key={item.id}>
            <p>
              <b>Name:</b> {item.name}
            </p>
            <Group group={item} />
          </div>
        ))}
      </div>
      <div>
        <h1>Devices</h1>
        {devices.map((item) => (
          <p key={item.id}>
            <b>Name:</b> {item.name}
          </p>
        ))}
      </div>
    </div>
  );
};

export default async function Home() {
  const graph = await pullPrtgGraph();
  const rootGroup = graph.prtg.sensortree.nodes.group;
  console.log({ rootGroup });

  return (
    <div className="w-screen h-screen bg-blue-950">
      <Group group={rootGroup} />
    </div>
  );
}

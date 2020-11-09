import React from "react";
import ClusterDot from "./cluster-dot";

/* Clusters are not visible in the current state of the visualization. Yet the instances are separated by clusters in the data structure as this might change again. */
const Cluster = props => {
  const { cluster, getLocation, radius, highlightedInstances } = props;
  const instances = cluster.instances.map(instance => ({
    ...instance,
    point: getLocation(instance.mappoint),
    color: instance.color,
    icon: instance.icon
  }));

  return (
    <g key={cluster.id}>
      {instances.map((instance, i) => (
        <ClusterDot
          point={instance}
          color={instance.color}
          icon={instance.icon}
          key={i + "instance"}
          radius={radius}
          x={instance.point[0]}
          y={instance.point[1]}
          isHighlighted={highlightedInstances.includes(instance.id)}
        />
      ))}
    </g>
  );
};

export default Cluster;

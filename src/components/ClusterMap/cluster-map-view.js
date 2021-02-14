import React from "react";

import Cluster from "./cluster";
import style from "./cluster-map-view.module.css";
import OverviewButton from "./overview-button";
import HoverPopover from "../HoverPopover/HoverPopover";

const arcMarginSides = (width, scale) => Math.min(0.2 * width, 0.2 * scale);
const arcMarginTop = (height, scale) => Math.min(0.05 * height, 0.05 * scale);
const clusterSize = scale => 0.8 * scale;
const clusterPosX = (width, scale) => 0.5 * width - clusterSize(scale) / 2;
const clusterPosY = (height, scale) => 0.5 * height - clusterSize(scale) / 2;

export default class ClusterMapView extends React.Component {
  constructor(props) {
    super();
    this.renderHover = this.renderHover.bind(this);
  }

  // translate mappoint of instances to current screen size
  getPointLocation = (pt, width, height) => {
    const [x, y] = pt;
    return [
      x * clusterSize(this.scale) + clusterPosX(width, this.scale),
      y * clusterSize(this.scale) + clusterPosY(height, this.scale)
    ];
  };

  renderHover(pId) {
    let text = "";
    let mouseLocation = [0, 0];
    if (pId) {
      let instance = this.props.clusterData
        .map(cluster => cluster.instances.find(instance => instance.id === pId))
        .find(p => p);
      text = "NAME: " + instance.title + ", ID: " + instance.id;
      mouseLocation = this.getPointLocation(
        instance.mappoint,
        this.props.width,
        this.props.height
      );
    }
    return (
      pId && (
        <HoverPopover
          width={"15em"}
          height="20px"
          locationX={mouseLocation[0]}
          locationY={mouseLocation[1] - 50}
        >
          <p
            style={{
              position: "absolute",
              backgroundColor: "#1c1d1f",
              margin: "0",
              fontSize: "10px",
              color: "#afca0b",
              fontWeight: "500",
              letterSpacing: "1px",
              overflow: "hidden",
              padding: "5px 10px"
            }}
          >
            <label>{text}</label>
          </p>
        </HoverPopover>
      )
    );
  }

  render() {
    const {
      width,
      height,
      onUnClicked,
      highlightedInstances,
      isAnyClicked,
      isInstanceHovered,
      clusterData
    } = this.props;
    this.scale = Math.min(height, width);
    const scale = this.scale;
    if (!width || !height || scale <= 0) {
      return <div />;
    }
    const radius = clusterSize(scale) - arcMarginSides(width, scale);

    return (
      <div
        className={style.clusterMapWrapper}
        style={{
          width: width,
          height: height,
          marginTop: arcMarginTop(height, scale)
        }}
      >
        <OverviewButton posX={20} posY={0} />
        <svg
          className="viz-3"
          viewBox={"0 0 " + width + " " + height}
          width={width}
          height={height}
          onClick={isAnyClicked ? onUnClicked : null}
        >
          <g>
            {clusterData.map(cluster => {
              return (
                <Cluster
                  key={cluster.id + "cluster"}
                  cluster={cluster}
                  getLocation={p => this.getPointLocation(p, width, height)}
                  radius={radius}
                  highlightedInstances={highlightedInstances}
                />
              );
            })}
          </g>
        </svg>
        {this.renderHover(isInstanceHovered)}
      </div>
    );
  }
}

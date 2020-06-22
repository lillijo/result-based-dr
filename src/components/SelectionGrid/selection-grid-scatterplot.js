import React from "react";
import { getFieldColor } from "../../util/utility";

export default class Scatterplot extends React.Component {
  constructor(props) {
    super();
    this.state = {
      singleOrdering: props.singleOrdering
    };
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    return (
      this.props.width !== nextProps.width ||
      this.props.size !== nextProps.size ||
      this.props.singleOrdering !== nextProps.singleOrdering
    );
  }

  render() {
    const { singleOrdering, width, size } = this.props;

    if (!singleOrdering || !width) {
      return <svg />;
    }
    return (
      <svg
        key={singleOrdering[0] + "p"}
        height={width / size}
        width={width / size}
      >
        {singleOrdering[1].projects.map((project, i) => (
          <circle
            transform={
              "translate(" +
              (project[0] + 0.1) * ((width * 0.8) / size) +
              " " +
              (project[1] + 0.1) * ((width * 0.8) / size) +
              ")"
            }
            key={i + "punkt"}
            r={11 / size}
            x="0"
            y="0"
            viewBox="0 0 100 100"
            stroke={"transparent"}
            fill={getFieldColor(singleOrdering[1].classes[i])}
          />
        ))}
      </svg>
    );
  }
}

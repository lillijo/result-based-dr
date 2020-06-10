import React from "react";
import style from "./selection-grid.module.css";
import HoverPopover from "../HoverPopover/HoverPopover";
import { Slider } from "@blueprintjs/core";
import Scatterplot from "./selection-grid-scatterplot";

export default class SelectionGridOverview extends React.Component {
  constructor(props) {
    super();
    this.state = {
      hovered: false,
      mouseLocation: [0, 0],
      hoveredId: false
    };
    this.renderHover = this.renderHover.bind(this);
  }

  renderHover(hovered, mouseLocation) {
    return (
      hovered && (
        <HoverPopover
          width={"10em"}
          height="20px"
          locationX={mouseLocation[0]}
          locationY={mouseLocation[1]}
        >
          <p
            style={{
              position: "absolute",
              backgroundColor: "#1c1d1f",
              margin: "0",
              fontSize: "12px",
              color: "#aaa",
              fontWeight: "500",
              letterSpacing: "1px",
              padding: "5px 10px",
              lineHeight: "100%"
            }}
          >
            <label>{hovered}</label>
          </p>
        </HoverPopover>
      )
    );
  }

  render() {
    const { selectedOrdering, selectOrdering, data, width, size } = this.props;

    if (!selectedOrdering || !width || !data[0].length > 1) {
      return <div />;
    }
    return (
      <div className={style.allOrderingsWrapper}>
        {data.map(reihe => (
          <span key={reihe[0][0] + "reihe"}>
            {reihe.map(ord => (
              <svg key={ord[0]} height={width / size} width={width / size}>
                <Scatterplot singleOrdering={ord} width={width} size={size} />

                <rect
                  height={width / size}
                  width={width / size}
                  stroke={
                    ord[0] === parseInt(selectedOrdering)
                      ? "#afca0b"
                      : this.state.hoveredId === ord[0]
                      ? "#888"
                      : "#222"
                  }
                  fill="transparent"
                  onClick={() => selectOrdering(ord[0])}
                  cursor="POINTER"
                  onMouseOver={evt => {
                    this.setState({
                      hoveredId: ord[0],
                      hovered:
                        "Perplexity: " +
                        ord[1].perp +
                        " Learning Rate: " +
                        ord[1].lr +
                        " t-SNE Wert: " +
                        Math.floor(ord[1].x_tsne, 2),
                      mouseLocation: [
                        evt.nativeEvent.clientX,
                        evt.nativeEvent.clientY
                      ]
                    });
                  }}
                  onMouseLeave={() => {
                    this.setState({
                      hovered: false,
                      hoveredId: false,
                      mouseLocation: [0, 0]
                    });
                  }}
                />
              </svg>
            ))}
            <br />
          </span>
        ))}
        <span className={style.sliderWrapper}>
          Größe des Gitters:
          <Slider
            className={style.RangeSliderStyle}
            min={3}
            max={12}
            id="size"
            labelStepSize={3}
            value={this.props.size}
            onRelease={value => this.props.changeSize(value)}
          />
        </span>
        {this.renderHover(this.state.hovered, this.state.mouseLocation)}
      </div>
    );
  }
}

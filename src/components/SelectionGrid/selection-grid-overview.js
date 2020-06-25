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
          locationY={mouseLocation[1] - 20}
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
                  height={(width / size) * 0.98}
                  width={(width / size) * 0.98}
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
                        Math.round(ord[1].tsne_measure),
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
        <div
          className={style.xAxis}
          onMouseOver={evt => {
            this.setState({
              hovered:
                "Die Plots in den Zeilen sind nach ihrer Perplexity geordnet. Eine niedrige Perplexity (links) bedeutet, dass relativ kleine enge Gruppierungen entstehen. Eine hohe Perplexity deutet auf eine eher gleichmäßige Verteilung hin.",
              mouseLocation: [width / 2 + 180, width + 65]
            });
          }}
          onMouseLeave={() => {
            this.setState({
              hovered: false,
              mouseLocation: [0, 0]
            });
          }}
        >
          Perplexity
        </div>
        <div className={style.sliderWrapper}>
          <span className={style.sliderText}>Größe des Gitters:</span>
          <Slider
            className={style.RangeSliderStyle}
            min={3}
            max={12}
            id="size"
            labelStepSize={3}
            value={this.props.size}
            onRelease={value => this.props.changeSize(value)}
          />
        </div>
        <div
          className={style.yAxis}
          style={{
            left: "20px",
            top: width / 2 + 65 + "px"
          }}
          onMouseOver={evt => {
            this.setState({
              hovered:
                "Die Verteilung der Punkte in den einzelnen Plots ist in einer Zeile ähnlich, während sie sich über die Zeilen hinweg verändert.",
              mouseLocation: [140, width / 2 + 65]
            });
          }}
          onMouseLeave={() => {
            this.setState({
              hovered: false,
              mouseLocation: [0, 0]
            });
          }}
        >
          t-SNE Measure
        </div>
        {this.renderHover(this.state.hovered, this.state.mouseLocation)}
      </div>
    );
  }
}

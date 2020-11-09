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
      hoveredId: false,
      gridsize: props.size
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
    const { selectedState, selectOrdering, data, width, size } = this.props;

    if (!selectedState.length > 1 || !width || !data[0].length > 1) {
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
                    ord[0] === parseInt(selectedState[1])
                      ? "#afca0b"
                      : this.state.hoveredId === ord[0]
                      ? "#888"
                      : "#333"
                  }
                  fill="transparent"
                  onClick={() =>
                    selectOrdering([selectedState[0], ord[0].toString()])
                  }
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
          <p>
            Perplexity
            <span className={style.questionMark}>?</span>
          </p>
        </div>
        <div className={style.sliderWrapper}>
          <span className={style.sliderText}>Größe des Gitters:</span>
          <Slider
            className={style.RangeSliderStyle}
            min={3}
            max={10}
            id="size"
            labelStepSize={3}
            value={this.state.gridsize}
            onChange={value => this.setState({ gridsize: value })}
            onRelease={value => this.props.changeSize(value)}
          />
        </div>
        <div
          className={style.yAxis}
          style={{
            left: "10px",
            top: width / 2 + 65 + "px"
          }}
          onMouseOver={evt => {
            this.setState({
              hovered:
                "Die vertikale Sortierung der Visualisierungen wird durch deren Ähnlichkeit der Anordnung zueinander bestimmt. So sollten die Punkte bei zwei Nachbarn in einer ähnlichen Position sein, während sie bei weit entfernten Visualisierungen in der gegenüberliegenden Ecke sein können.",
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
          <span className={style.questionMark}>?</span>
        </div>
        {this.renderHover(this.state.hovered, this.state.mouseLocation)}
      </div>
    );
  }
}

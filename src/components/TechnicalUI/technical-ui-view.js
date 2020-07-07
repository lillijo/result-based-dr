import React from "react";
import style from "./technical-ui.module.css";
import HoverPopover from "../HoverPopover/HoverPopover";
import { ReactComponent as UnselectedIcon } from "../../assets/Unselected-Project.svg";
import { ReactComponent as Tick } from "../../assets/tick.svg";
import { getFieldColor } from "../../util/utility";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import { Slider } from "@blueprintjs/core";

export default class TechnicalUiView extends React.Component {
  constructor(props) {
    super();
    this.state = {
      hovered: false,
      mouseLocation: [0, 0],
      perplexity: 5,
      learningrate: 10
    };
    this.renderHover = this.renderHover.bind(this);
    this.changeParameters = this.changeParameters.bind(this);
  }

  sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
  }

  changeParameters(perp, lr) {
    this.setState({
      perplexity: perp,
      learningrate: lr
    });
    let ordering = this.props.allOrderings.reduce((prev, curr) =>
      Math.abs(curr[1].perp - perp) <= Math.abs(prev[1].perp - perp) &&
      Math.abs(curr[1].lr - lr) <= Math.abs(prev[1].lr - lr)
        ? curr
        : prev
    );
    this.sleep(1500);
    this.props.selectOrdering([ordering[0], ordering[0]]);
  }

  getPointLocation(pt, scale) {
    let [x, y] = pt;
    let newX = x * scale * 0.9 + 20;
    let newY = y * scale * 0.9 + 20;
    return newX + " " + newY;
  }

  renderHover(hovered, mouseLocation) {
    console.log(hovered);
    return (
      hovered && (
        <HoverPopover
          width={"15em"}
          height="20px"
          locationX={mouseLocation[0]}
          locationY={mouseLocation[1]}
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
            <label>{hovered}</label>
          </p>
        </HoverPopover>
      )
    );
  }

  render() {
    const { selectedOrdering, scaling, allOrderings } = this.props;
    if (!selectedOrdering) {
      return <div />;
    }
    return (
      <div className={style.technicaluiWrapper}>
        <svg
          height={scaling}
          width={scaling}
          fill="transparent"
          className={style.svgWrapper}
        >
          <rect
            stroke="#aaa"
            strokeWidth="3px"
            height={scaling}
            width={scaling}
            fill="transparent"
          />
          {selectedOrdering.projects.map((project, i) => (
            <g
              transform={
                "translate(" + this.getPointLocation(project, scaling) + ")"
              }
              key={i + "punkt"}
            >
              <UnselectedIcon
                width={scaling / 20}
                height={scaling / 20}
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                x="0"
                y="0"
                viewBox="0 0 100 100"
                cursor="POINTER"
                stroke={"transparent"}
                fill={getFieldColor(selectedOrdering.classes[i])}
                onMouseOver={evt => {
                  this.setState({
                    hovered: selectedOrdering.titles[i],
                    mouseLocation: [
                      evt.nativeEvent.clientX,
                      evt.nativeEvent.clientY
                    ]
                  });
                }}
                onMouseLeave={() => {
                  this.setState({
                    hovered: false,
                    mouseLocation: [0, 0]
                  });
                }}
              />
            </g>
          ))}
        </svg>
        <div className={style.sliderWrapper}>
          <div className={style.SliderOut}>
            <div className={style.sliderTitle}>Perplexity:</div>
            <Slider
              className={style.RangeSliderStyle}
              min={Math.min(...allOrderings.map(o => o[1].perp))}
              max={Math.max(...allOrderings.map(o => o[1].perp))}
              id="perplexity"
              labelStepSize={4}
              stepSize={1}
              value={this.state.perplexity}
              onRelease={value =>
                this.changeParameters(value, this.state.learningrate)
              }
            />
          </div>
          <div className={style.SliderOut}>
            <div className={style.sliderTitle}>Learning Rate:</div>
            <Slider
              className={style.RangeSliderStyle}
              min={Math.min(...allOrderings.map(o => o[1].lr))}
              max={Math.max(...allOrderings.map(o => o[1].lr))}
              id="learningrate"
              labelStepSize={20}
              stepSize={10}
              value={this.state.learningrate}
              onRelease={value =>
                this.changeParameters(this.state.perplexity, value)
              }
            />
          </div>
          <div className={style.chooseButtonWrapper}>
            <span
              className={style.chooseButton}
              onClick={() => this.props.changeGraph("0")}
            >
              Auswählen
              <br />
              <Tick width="35px" height="35px" />
            </span>
          </div>
        </div>
        {this.renderHover(this.state.hovered, this.state.mouseLocation)}
      </div>
    );
  }
}

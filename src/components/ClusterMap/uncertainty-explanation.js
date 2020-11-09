import React from "react";
import style from "./cluster-map-view.module.css";
import { useDispatch } from "react-redux";
import {
  showUncertainty,
  highlightUncertainty
} from "../../store/actions/actions";

/* legend for uncertaintyLandscape is drawn as a fixed position div over the cluster vis. when uncertainty landscape is toggled in through checkbox */
const UncertaintyExplanation = props => {
  const dispatch = useDispatch();
  return (
    <div
      style={{
        position: "absolute",
        left: props.posX + "px",
        bottom: props.posY + "px",
        backgroundColor: "transparent",
        zIndex: 99,
        color: "#6B6B6B",
        fontFamily: "IBM_Plex_Mono",
        fontSize: "80%"
      }}
    >
      {props.uncertaintyOn && (
        <div
          className={style.legendRow}
          onMouseEnter={() => dispatch(highlightUncertainty(true))}
          onMouseLeave={() => dispatch(highlightUncertainty(false))}
          style={{ cursor: "POINTER" }}
        >
          <p
            style={{
              fontWeight: "700",
              fontSize: "80%",
              display: "flex",
              justifyContent: "space-between"
            }}
          >
            <span>uncertain</span>
            <span>certain</span>
          </p>
          <svg width="190px" height="20">
            <linearGradient id="grad1" x1="20%" y1="0%" x2="120%" y2="0%">
              <stop offset="0%" stopColor="#0a0a0a" />
              <stop offset="100%" stopColor="#999" />
            </linearGradient>
            <rect width="190" height="20" fill="url(#grad1)" stroke="none" />
          </svg>
        </div>
      )}
      <label
        htmlFor="toggleUncertainty"
        style={{
          fontWeight: "700"
        }}
        className={style.checkboxWrapper}
      >
        <input
          type="checkbox"
          id="toggleUncertainty"
          checked={props.uncertaintyOn}
          onChange={() => dispatch(showUncertainty(!props.uncertaintyOn))}
        />
        uncertainty landscape
        <span className={style.checkmark}></span>
      </label>
    </div>
  );
};

export default UncertaintyExplanation;

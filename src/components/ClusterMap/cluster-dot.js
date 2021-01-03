import React from "react";
import PropTypes from "prop-types";
import { ReactComponent as SelectedIcon } from "../../assets/Selected-Instance.svg";
import { ReactComponent as UnselectedIcon } from "../../assets/Unselected-Instance.svg";
import { useDispatch } from "react-redux";
import {
  instanceClicked,
  instanceHovered,
  unHovered
} from "../../store/actions/actions";

const ClusterDot = props => {
  const { x, y, color, isHighlighted, radius, point } = props;
  const dispatch = useDispatch();
  const scale = isHighlighted ? 1.2 : 1;
  return (
    <g
      transform={
        "translate(" +
        (x - (radius / 24) * scale) +
        "," +
        (y - (radius / 24) * scale) +
        ")"
      }
      onClick={() => (point ? dispatch(instanceClicked(point.id)) : null)}
      onMouseOver={() => (point ? dispatch(instanceHovered(point.id)) : null)}
      onMouseLeave={() => dispatch(unHovered())}
    >
      <circle
        cx={radius / 24}
        cy={radius / 24}
        r={radius / 46}
        fill={"transparent"}
      />
      <SelectedIcon
        width={(radius / 15) * scale}
        height={(radius / 15) * scale}
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        x="0px"
        y="0px"
        viewBox="0 0 100 100"
        cursor="POINTER"
        stroke={isHighlighted ? "#7c7c7c" : "transparent"}
        fill={color}
        style={{
          opacity: isHighlighted ? "1" : "0",
          transition: "opacity 800ms"
        }}
      />
      <UnselectedIcon
        width={(radius / 15) * scale}
        height={(radius / 15) * scale}
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        x="0px"
        y="0px"
        viewBox="0 0 100 100"
        fill={color}
        stroke="#7c7c7c"
        cursor="POINTER"
      />
      )}
    </g>
  );
};

ClusterDot.propTypes = {
  x: PropTypes.number,
  y: PropTypes.number,
  color: PropTypes.string
};
export default ClusterDot;

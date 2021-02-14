import React from "react";
import { useDispatch } from "react-redux";
import { changeGraph } from "../../store/actions/actions";
import style from "./cluster-map-view.module.css";
import { ReactComponent as OrderingIcon } from "../../assets/ordering_icon.svg";

/* legend for the labels in the outer circle of clustervis is drawn as a fixed position div over the cluster vis. When one is hovered all links of the type are highlighted. */
const OverviewButton = props => {
  const dispatch = useDispatch();
  return (
    <div
      style={{
        position: "absolute",
        left: props.posX + "px",
        top: props.posY + "px",
        height: "auto",
        width: "300px",
        zIndex: 99
      }}
    >
      <div
        className={style.buttonOverview}
        onClick={() => dispatch(changeGraph("1"))}
      >
        <OrderingIcon className={style.orderingIcon} />
        <p>Show Selection</p>
      </div>
    </div>
  );
};

export default OverviewButton;

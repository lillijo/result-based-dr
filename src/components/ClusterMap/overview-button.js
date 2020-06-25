import React from "react";
import { useDispatch } from "react-redux";
import { selectVis, changeGraph } from "../../store/actions/actions";
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
        width: "160px",
        zIndex: 99
      }}
      data-intro="Overview"
      data-step="7"
      id="overviewbutton"
    >
      <p
        className={style.buttonOverview}
        onClick={() => dispatch(changeGraph("3"))}
      >
        <OrderingIcon className={style.orderingIcon} />
        Anordnung auswählen
      </p>
      <p
        className={style.buttonOverview}
        onClick={() => dispatch(changeGraph("4"))}
      >
        Technische Parameterauswahl
      </p>
    </div>
  );
};

// <p
//   className={style.buttonOverview}
//   onClick={() => dispatch(selectVis(Math.floor(Math.random() * 100)))}
// >
//   Zufällige Auswahl
// </p>

export default OverviewButton;

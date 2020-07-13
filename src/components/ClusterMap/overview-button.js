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
        width: "160px",
        zIndex: 99
      }}
    >
      <p
        className={style.buttonOverview}
        onClick={() => dispatch(changeGraph("3"))}
        data-intro="Durch diesen Knopf gelangt man in eine Ansicht, um eine Vielzahl anderer möglicher Anordnungen zu sehen und eine neue auszuwählen."
        data-step="7"
        id="overviewbutton"
      >
        <OrderingIcon className={style.orderingIcon} />
        Anordnung auswählen
      </p>
      <p
        className={style.buttonOverview}
        onClick={() => dispatch(changeGraph("4"))}
        data-intro="Wenn man eine neue Anordnung durch verändern der technischen Parameter erhalten möchte, kann man das in dieser Ansicht tun."
        data-step="8"
        id="technicalbutton"
      >
        Technische Parameterauswahl
      </p>
    </div>
  );
};

export default OverviewButton;

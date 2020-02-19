import React from "react";
import { ReactComponent as WtaIcon } from "../../assets/wta.svg";
import { ReactComponent as CollectionIcon } from "../../assets/collection.svg";
import { ReactComponent as InfrastructureIcon } from "../../assets/infrastructure.svg";
import style from "./cluster-map-view.module.css";
import { useDispatch } from "react-redux";
import { legendHovered } from "../../store/actions/actions";

const IconExplanation = props => {
  const dispatch = useDispatch();
  return (
    <div
      style={{
        position: "absolute",
        left: props.posX + "px",
        top: props.posY + "px",
        height: "auto",
        width: "auto",
        backgroundColor: "transparent",
        zIndex: 99,
        fontFamily: "IBM_Plex_Mono",
        fontSize: "80%"
      }}
      data-intro="Die interdisziplinäre Perspektive auf Drittmittelforschung wird durch den äußeren Ring bedeutsam erweitert. Projekte werden hier, basierend auf Informationen aus dem VIA-Wiki, mit Wissenstransferaktivitäten und Infrastrukturen wie Sammlungen und Laborgeräten verknüpft. Hierdurch können einerseits Projekte weitergehend nach Gemeinsamkeiten eingeordnet werden, andererseits Potenziale für Wissenstransfer basierend auf Gemeinsamkeiten entdeckt werden."
      data-step="3"
    >
      <p
        style={{ display: "flex", cursor: "POINTER" }}
        data-intro="Die Größe der Kreise und die Zahl neben den unterschiedlichen Zielgruppen vermittelt die Anzahl der Wissenstransferaktivitäten, die diese Zielgruppe haben"
        data-step="4"
        className={style.legendRow}
        onMouseEnter={() => dispatch(legendHovered("kta"))}
        onMouseLeave={() => {
          dispatch(legendHovered(null));
        }}
      >
        <WtaIcon className={style.tooltipIcon} />
        <span> Wissenstransferaktivitäten</span>
      </p>
      <p
        style={{ display: "flex", cursor: "POINTER" }}
        data-intro="Alle Verknüpfungen, die dieses Icon tragen, sind Sammlungen am Museum für Naturkunde, zu denen Forschungsprojekten einen Bezug haben können."
        data-step="5"
        className={style.legendRow}
        onMouseEnter={() => dispatch(legendHovered("collections"))}
        onMouseLeave={() => {
          dispatch(legendHovered(null));
        }}
      >
        <CollectionIcon className={style.tooltipIcon} />
        <span>Sammlungen</span>
      </p>
      <p
        style={{ display: "flex", cursor: "POINTER" }}
        data-intro="Alle Verknüpfungen, die dieses Icon tragen, sind Laborgeräte oder andere Infrastruktur am Museum, die in Forschungsprojekten eingesetzt werden können."
        data-step="6"
        className={style.legendRow}
        onMouseEnter={() => dispatch(legendHovered("infrastructures"))}
        onMouseLeave={() => {
          dispatch(legendHovered(null));
        }}
      >
        <InfrastructureIcon className={style.tooltipIcon} />
        <span>Laborgeräte und Infrastruktur</span>
      </p>
    </div>
  );
};

export default IconExplanation;

import * as actionTypes from "./actionTypes";

/* value can be 0=WISSEN, 1=ZEIT, 2=RAUM. switches to the page accordingly (only if not touch version)*/
export const changeGraph = value => {
  return {
    type: actionTypes.CHANGE_GRAPH,
    value: value
  };
};

/* hovering events for different elements (help to highlight on hover) In touch version hover event is triggered on one tap, value is id of the hovered element. changes the isHovered state to that id */
export const instanceHovered = instanceId => {
  return {
    type: actionTypes.PROJECT_HOVERED,
    value: instanceId
  };
};

export const unHovered = () => {
  return {
    type: actionTypes.UNHOVERED
  };
};

/* click events for different elements (the sidebar component will be changed according to the clicked element) In touch version click event is triggered on double tap, value is id of the clicked element. changes the "isClicked" state to that id */
export const instanceClicked = instanceId => {
  return {
    type: actionTypes.PROJECT_CLICKED,
    value: instanceId
  };
};

export const unClicked = () => {
  return {
    type: actionTypes.UNCLICKED
  };
};

/* highlights all labels that fit to one point in the legend. e.g. legendKey="ktas" highlights all kta-labels*/
export const legendHovered = legendKey => ({
  type: actionTypes.LEGEND_HOVERED,
  value: legendKey
});

/* fetches the flattened data graph from the backend and parses it back into  json. Also triggers updating and after that processing of the data*/
export const fetchData = () => {
  return {
    type: actionTypes.PROCESS_DATA_IF_READY
  };
};

/* opens overview grid*/
export const selectVis = numbers => {
  return {
    type: actionTypes.SELECT_VIS,
    value: numbers
  };
};
/* changes grid size to specified value (squared)*/
export const changeGridSize = number => {
  return {
    type: actionTypes.CHANGE_GRID_SIZE,
    value: number
  };
};

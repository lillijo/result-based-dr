import * as actionTypes from "../actions/actionTypes";
import locations from "../../assets/current_dump.json";
import dump from "../../assets/test.json";
const Flatted = require("flatted/esm");

export const initialState = {
  graph: "0",
  instances: Flatted.parse(JSON.stringify(dump)).projects,
  isHovered: null,
  isClicked: null,
  instancesMaxSizing: [0, 0],
  legendHovered: "none",
  uncertaintyOn: false,
  uncertaintyHighlighted: false,
  orderings: locations,
  selectedState: ["77", "77"],
  gridSize: 7,
  isDataProcessed: false
};

// Keep the reducer switch lean by outsourcing the actual code below
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.CHANGE_GRAPH:
      return {
        ...state,
        graph: action.value
      };

    case actionTypes.PROCESS_DATA_IF_READY:
      return processAllData(state);

    case actionTypes.PROJECT_HOVERED:
      return instanceHovered(state, action);

    case actionTypes.UNHOVERED:
      return unHovered(state);

    case actionTypes.PROJECT_CLICKED:
      return instanceClicked(state, action);

    case actionTypes.UNCLICKED:
      return unClicked(state);

    case actionTypes.SHOW_UNCERTAINTY:
      return showUncertainty(state, action);

    case actionTypes.HIGHLIGHT_UNCERTAINTY:
      return highlightUncertainty(state, action);

    case actionTypes.LEGEND_HOVERED:
      return legendHovered(state, action);

    case actionTypes.SELECT_VIS:
      return selectVis(state, action);

    case actionTypes.CHANGE_GRID_SIZE:
      return changeGridSize(state, action);
    default:
      return state;
  }
};

/* The received data is transformed in the beginning (e.g. sorted, some attributes slightly changed), the filters get their initial filling too */
const processAllData = state => {
  const processedInstances = state.instances.map((instance, index) => ({
    ...instance,
    id: instance.fulltext,
    mappoint: [
      state.orderings[state.selectedState[1]].projects[index][0],
      state.orderings[state.selectedState[1]].projects[index][1]
    ]
  }));
  const newState = {
    instances: processedInstances,
    instancesMaxSizing: [
      Math.max(...processedInstances.map(p => p.mappoint[0])),
      Math.max(...processedInstances.map(p => p.mappoint[1]))
    ]
  };

  return {
    ...state,
    ...newState,
    isDataProcessed: true
  };
};

const instanceHovered = (state, action) => ({
  ...state,
  isHovered: action.value
});

const unHovered = state => ({
  ...state,
  isHovered: null
});

const instanceClicked = (state, action) => ({
  ...state,
  isClicked: action.value
});

const unClicked = state => ({
  ...state,
  isClicked: null
});

const legendHovered = (state, action) => ({
  ...state,
  legendHovered: action.value
});

const showUncertainty = (state, action) => ({
  ...state,
  uncertaintyOn: action.value
});

const highlightUncertainty = (state, action) => ({
  ...state,
  uncertaintyHighlighted: action.value
});

const selectVis = (state, action) => {
  const processedInstances = state.instances.map((instance, index) => ({
    ...instance,
    mappoint: [
      state.orderings[action.value[1]].projects[index][0],
      state.orderings[action.value[1]].projects[index][1]
    ]
  }));

  return {
    ...state,
    instances: processedInstances,
    instancesMaxSizing: [
      Math.max(...processedInstances.map(p => Math.abs(p.mappoint[0]))),
      Math.max(...processedInstances.map(p => Math.abs(p.mappoint[1])))
    ],
    selectedState: action.value
  };
};

const changeGridSize = (state, action) => {
  return {
    ...state,
    gridSize: action.value
  };
};

export default reducer;

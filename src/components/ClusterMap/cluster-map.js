import { connect } from "react-redux";
import ClusterMapView from "./cluster-map-view";
import { unClicked, unHovered } from "../../store/actions/actions";
import { getClassColor } from "../../util/utility";

/* instance list is divided into clusters */
const computeClusters = instances => {
  if (!instances || instances.length === 0) return [];

  return [{
    id: 0,
    instances: instances
      .map(p => ({
        ...p,
        color: getClassColor(p.class)
      }))
  }]
};
/* helper functions to determine whcih elements in the visualization should b highlighted in the MfN green */
const extractHighlightedFromState = state => {
  let highlighted = [];
  if (state.isHovered) {
    highlighted.push(state.isHovered);
  }
  if (state.isClicked) {
    highlighted.push(state.isClicked);
  }
  console.log(highlighted);
  return highlighted;
};

const mapStateToProps = state => {
  const {
    instances,
    isDataProcessed,
    isClicked,
    isHovered,
    instancesMaxSizing,
    selectedState
  } = state.main;

  let clusterDataForView = [];
  let highlightedInstances = [];
  if (isDataProcessed) {
    // filters are applied to all lists and data is prepared for the vis
    clusterDataForView = computeClusters(instances);
    const highlighted = extractHighlightedFromState(state.main);
    highlightedInstances = highlighted;
  }

  return {
    clusterData: clusterDataForView,
    isAnyClicked: isClicked,
    highlightedInstances: highlightedInstances,
    isInstanceHovered: isHovered,
    instancesMaxSizing: instancesMaxSizing,
    selectedState: selectedState
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onUnClicked: () => {
      dispatch(unClicked());
    },
    onUnHovered: () => {
      dispatch(unHovered());
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ClusterMapView);

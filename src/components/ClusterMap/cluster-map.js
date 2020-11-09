import { connect } from "react-redux";
import ClusterMapView from "./cluster-map-view";
import { unClicked, unHovered } from "../../store/actions/actions";
import { getFieldColor } from "../../util/utility";

/* instance list is divided into clusters */
const computeClusters = instances => {
  if (!instances || instances.length === 0) return [];

  const clusterIds = [...new Set(instances.map(p => p.cluster))];
  return clusterIds.map(id => ({
    id: id,
    instances: instances
      .filter(p => p.cluster === id)
      .map(p => ({
        ...p,
        color: getFieldColor(p.id)
      }))
  }));
};
/* helper functions to determine whcih elements in the visualization should b highlighted in the MfN green */
const extractHighlightedFromState = state => {
  let highlighted = [];
  if (state.isHovered) {
    highlighted += [state.isHovered];
  }
  if (state.isClicked) {
    highlighted += [state.isClicked];
  }
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
    uncertaintyOn: state.main.uncertaintyOn,
    uncertaintyHighlighted: state.main.uncertaintyHighlighted,
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

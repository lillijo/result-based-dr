import { connect } from "react-redux";
import SelectionGridView from "./selection-grid-view";
import { isTouchMode, applyFilters } from "../../util/utility";
import {
  changeGraph,
  selectVis,
  selectDialogOpened,
  changeGridSize
} from "../../store/actions/actions";

const mapStateToProps = state => {
  const selectedOrderingData =
    state.main.orderings[state.main.selectedState[1]];
  const allOrderings = state.main.orderings.map((ordering, index) => [
    index,
    ordering
  ]);
  const size = state.main.gridSize;
  allOrderings.sort((a, b) => (a[1].perplexity < b[1].perplexity ? 1 : -1));
  let samples = [];
  let step = allOrderings.length / (size * size);
  for (let i = 0; i < size * size; i++) {
    console.log(Math.round(step * i, 0));
    samples.push(allOrderings[Math.round(step * i, 0)]);
  }
  samples.sort((a, b) => (a[1].tsne_measure < b[1].tsne_measure ? 1 : -1));
  let grid = [];
  while (grid.length < size) {
    grid.push(
      samples.splice(0, size).sort((a, b) => (a[1].perp > b[1].perp ? 1 : -1))
    );
  }
  return {
    size: size,
    allOrderings: grid,
    selectedOrderingData: selectedOrderingData,
    selectedState: state.main.selectedState,
    isDataProcessed: state.main.isDataProcessed,
    isTouch: isTouchMode(state),
    filtered: applyFilters(state.main.projects, state.main.filters).map(
      p => p.fulltext
    )
  };
};

const mapDispatchToProps = dispatch => {
  return {
    changeGraph: value => dispatch(changeGraph(value)),
    changeGridSize: value => dispatch(changeGridSize(value)),
    selectOrdering: value => dispatch(selectVis(value)),
    selectDialogOpened: () => {
      dispatch(selectDialogOpened());
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SelectionGridView);

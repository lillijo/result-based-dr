import React from "react";
import SelectionGridOverview from "./selection-grid-overview";
import SelectionGridDetail from "./selection-grid-detail";
import style from "./selection-grid.module.css";

class SelectionGridView extends React.Component {
  render() {
    const width = window.innerWidth * 0.41;
    if (!this.props.isDataProcessed) {
      return <div />;
    }
    return (
      <div width={window.innerWidth}>
        <div className={style.wrapper}>
          <SelectionGridOverview
            className={style.sideWrapper}
            selectedState={this.props.selectedState}
            selectOrdering={this.props.selectOrdering}
            data={this.props.allOrderings}
            width={width}
            size={this.props.size}
            changeSize={this.props.changeGridSize}
            filtered={this.props.filtered}
          />
          <SelectionGridDetail
            className={style.sideWrapper}
            selectedOrdering={this.props.selectedOrderingData}
            selectedState={this.props.selectedState}
            selectOrdering={this.props.selectOrdering}
            width={width}
            selectDialogOpened={this.props.selectDialogOpened}
            changeGraph={this.props.changeGraph}
            filtered={this.props.filtered}
          />
        </div>
      </div>
    );
  }
}

export default SelectionGridView;

import React, {Component} from 'react'
import {connect} from 'react-redux'
import FilterBox from '../../components/FilterBox/FilterBox'
import PetridishGraph from '../../components/PetridishGraph/PetridishGraph'
import AreaGraph from '../../components/AreaGraph/AreaGraph'
import TimeGraph from './TimeLine'
import classes from './GraphView.css'
import * as actions from '../../store/actions/actions'

class GraphView extends Component {
  constructor (props) {
    super(props)
    this.state = {activePopover: -1, height: window.innerHeight, width: window.innerWidth}
    this.filterClickHandler = this.filterClickHandler.bind(this)
  }

  componentDidMount () {
    window.addEventListener('resize', this.resize.bind(this))
    this.resize()
  }

  resize () {
    this.setState({width: window.innerWidth, height: window.innerHeight})
  }

  filterClickHandler (filter) {
    const newState = (filter === this.state.activePopover) ? -1 : filter
    this.setState({
      activePopover: newState
    })
  }

  render () {
    let Graph = (<PetridishGraph/>) // render conditional according to state. Petridish rendered as default
    switch (this.props.graph) {
      case '0':
        Graph = (<PetridishGraph/>)
        break
      case '1':
        Graph = (<TimeGraph height={this.state.height} width={this.state.width}/>)
        break
      case '2':
        Graph = (<AreaGraph/>)
        break
      default:
        break
    }
    return (
      <div className={classes.BackGradient}>
        <div style={{width: '100vw', height: '100vh', position: 'absolute'}} onClick={() => this.filterClickHandler(-1)}/>
        <div className={classes.FilterWrapper}>
          <button style={{width: '33%'}} onClick={() => this.props.testingOfFilterUp('0')}> Petri </button>
          <button style={{width: '33%'}} onClick={() => this.props.testingOfFilterUp('1')}> Time </button>
          <button style={{width: '33%'}} onClick={() => this.props.testingOfFilterUp('2')}> Area </button>
          <FilterBox activeBox={this.state.activePopover} change={this.filterClickHandler}/>
        </div>
        {Graph}
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    graph: state.graph
  }
}

const mapDispatchToProps = dispatch => {
  return {
    testingOfFilterUp: (key, value) => dispatch(actions.changeGraph(key, value))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GraphView)

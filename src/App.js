import React, { Component } from "react";
import GraphView from "./pages/graph-view";
import { ConnectedRouter } from "connected-react-router";
import { Route, Redirect, Switch } from "react-router";
import { history } from "./index";
import classes from "./App.module.css";

export const menuBarHeight = 65;
export const appMargin = 5;

const AppBodyStandard = () => (
  <>
    <div className={classes.appBody}>
      <div className={classes.contentWindow}>
        <GraphView />
      </div>
    </div>
  </>
);

class App extends Component {
  render() {
    return (
      <ConnectedRouter history={history}>
        <>
          <div className={classes.offsetWrapper} style={{ padding: appMargin }}>
            <Switch>
              <Route exact path="/" render={() => <Redirect to="/explore" />} />
              <Route path="/explore" component={AppBodyStandard} />
            </Switch>
          </div>
        </>
      </ConnectedRouter>
    );
  }
}
//TODO: reverse redirect
export default App;

import { history } from "../index";
import { initialState } from "../store/reducer/reducer";
import { topicIntToString, topicStringToInt } from "./utility";

const getTupleFromIsClicked = isClicked => {
  if (isClicked.project) {
    return [1, isClicked.project];
  }
  return [0, null];
};

const getIsClickedFromTuple = tuple => {
  const [key, value] = tuple;
  if (key === 1) {
    return {
      project: value
    };
  }
};

/*turns state of filters, visualization and sidebar into minified url*/
export const pushStateToUrl = newState => {
  if (!newState.isDataProcessed || !newState.isDataLoaded) {
    return;
  }
  let newUrlData = {
    g: newState.graph,
    cl: getTupleFromIsClicked(newState.isClicked),
    un: newState.uncertaintyOn ? 1 : 0,
    or: newState.selectedState
  };

  let minifiedUrlData = {
    ...newUrlData,
    t: newUrlData.t.map(f => topicStringToInt(f)),
    f: newUrlData.f
  };
  var newQueryString = "?";
  if (newState.user) {
    newQueryString = newQueryString.concat("uid=" + newState.user + "&");
  }
  newQueryString = newQueryString.concat(
    "state=" + btoa(JSON.stringify(minifiedUrlData))
  );
  if (newQueryString !== window.location.search) {
    history.push(newQueryString);
  }
};

/*turns minified url back into readable state*/
export const parseStateFromUrl = urlParams => {
  const stateString = urlParams.state;
  const userId = urlParams.uid;
  if (stateString == null) {
    console.log("No URL params");
    console.log("User ID found = " + urlParams.uid);
    return {
      main: {
        ...initialState,
        user: userId
      }
    };
  }
  const urlState = JSON.parse(atob(stateString));
  const deminifiedUrlState = {
    ...urlState,
    t: urlState.t.map(f => topicIntToString(f))
  };
  return {
    main: {
      ...initialState,
      graph: deminifiedUrlState.g,
      uncertaintyOn: deminifiedUrlState.un === 1 ? true : false,
      isClicked: getIsClickedFromTuple(deminifiedUrlState.cl),
      user: userId,
      selectedState: deminifiedUrlState.or
    }
  };
};

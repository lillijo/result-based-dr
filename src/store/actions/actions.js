import * as actionTypes from "./actionTypes";
import axios from "axios";

// action emitters to keep the containers clean

export const changeGraph = value => {
  return {
    type: actionTypes.CHANGE_GRAPH,
    value: value
  };
};

export const checkboxFilterChange = (filterId, value) => {
  return {
    type: actionTypes.CHECKBOX_FILTER_CHANGE,
    id: filterId,
    value: value
  };
};

export const timerangeFilterChange = value => {
  return {
    type: actionTypes.TIMERANGE_FILTER_CHANGE,
    value: value
  };
};

export const setSelectedProject = projectId => {
  return {
    type: actionTypes.SET_SELECTED_PROJECT,
    value: projectId
  };
};

export const setSelectedCat = catId => {
  return {
    type: actionTypes.SET_SELECTED_CAT,
    value: catId
  };
};

export const setSelectedInfra = infraName => {
  return {
    type: actionTypes.SET_SELECTED_INFRA,
    value: infraName
  };
};

export const setSelectedKta = ktaId => {
  return {
    type: actionTypes.SET_SELECTED_KTA,
    value: ktaId
  };
};

export const deselectItems = () => {
  return {
    type: actionTypes.DESELECT_ITEMS
  };
};

export const resetSelectedProject = () => {
  return {
    type: actionTypes.RESET_SELECTED_PROJECT
  };
};

export const deactivatePopover = () => {
  return {
    type: actionTypes.DEACTIVATE_POPOVER
  };
};

export const getFiltersFromURL = () => {
  return {
    type: actionTypes.GET_FILTERS_FROM_URL
  };
};

export const fetchClusterData = () => {
  return dispatch => {
    axios.get("/api/clustering").then(result => {
      dispatch(updateClusterData(result.data));
    });
  };
};

export const fetchInstitutionsData = () => {
  return dispatch => {
    axios.get("/api/institutions").then(result => {
      dispatch(updateInstitutionsData(result.data));
    });
  };
};

export const fetchProjectsData = () => {
  return dispatch => {
    axios.get("/api/projects").then(result => {
      dispatch(updateProjectsData(result.data));
    });
  };
};

export const fetchKTAData = () => {
  return dispatch => {
    axios.get("/api/knowledgeTransferActivities").then(result => {
      dispatch(updateKTAData(result.data));
    });
  };
};

export const fetchKTAMappingData = () => {
  return dispatch => {
    axios.get("/api/ktastargetgroups").then(result => {
      dispatch(updateKTAMappingData(result.data));
    });
  };
};

export const fetchTargetGroupsData = () => {
  return dispatch => {
    axios.get("/api/targetgroups").then(result => {
      dispatch(updateTargetGroupsData(result.data));
    });
  };
};
///projects_old.json

export const fetchInfrastructureData = () => {
  return dispatch => {
    axios.get("/api/infrastructure").then(result => {
      dispatch(updateInfrastructureData(result.data));
    });
  };
};

export const fetchCollectionsData = () => {
  return dispatch => {
    axios.get("/api/collections").then(result => {
      dispatch(updateCollectionsData(result.data));
    });
  };
};

export const fetchOldProjectData = () => {
  return dispatch => {
    axios.get("/api/projects").then(result => {
      dispatch(updateOldProjectData(result.data));
    });
  };
};

export const updateClusterData = clusterData => {
  return {
    type: actionTypes.UPDATE_CLUSTER_DATA,
    value: clusterData
  };
};

export const updateOldProjectData = oldProjectData => {
  return {
    type: actionTypes.UPDATE_OLD_PROJECT_DATA,
    value: oldProjectData
  };
};

export const updateInstitutionsData = institutionsData => {
  return {
    type: actionTypes.UPDATE_INSTITUTIONS_DATA,
    value: institutionsData
  };
};

export const updateProjectsData = projectsData => {
  return {
    type: actionTypes.UPDATE_PROJECTS_DATA,
    value: projectsData
  };
};

export const updateKTAData = ktaData => {
  return {
    type: actionTypes.UPDATE_KTA_DATA,
    value: ktaData
  };
};

export const updateTargetGroupsData = targetgroups => {
  return {
    type: actionTypes.UPDATE_TARGETGROUPS_DATA,
    value: targetgroups
  };
};

export const updateInfrastructureData = infrastructures => {
  return {
    type: actionTypes.UPDATE_INFRASTRUCTURE_DATA,
    value: infrastructures
  };
};

export const updateCollectionsData = collections => {
  return {
    type: actionTypes.UPDATE_COLLECTIONS_DATA,
    value: collections
  };
};

export const updateKTAMappingData = ktaMappingData => {
  return {
    type: actionTypes.UPDATE_KTA_MAPPING_DATA,
    value: ktaMappingData
  };
};

export const setSideBarComponent = component => {
  return {
    type: actionTypes.SET_SIDE_BAR_COMPONENT,
    value: component
  };
};

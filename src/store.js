import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

/**
 * consult the local storage to check if the drawing surface dimensions are set or equals 0 ot not
 * @returns [boolean] the value of the checking operation 
 */
const initializeShowSurfaceDimensionsAlertState = () => {
  const surfaceHeight = window.localStorage.getItem("surfaceHeight");
  const surfaceWidth = window.localStorage.getItem("surfaceWidth");
  const booleanValue = (surfaceHeight == null || surfaceWidth == null) || (surfaceHeight == 0 || surfaceWidth == 0);
  return booleanValue;
};

export default new Vuex.Store({
  state: {
    doShowSurfaceDimensionsAlert: initializeShowSurfaceDimensionsAlertState(),
    isTransmissionProcessActive: false,
    currentActivePort: undefined,
    currentFileName: undefined,
    isHomePage: false,
    //? snackbar state
    sbContent: "",
    sbColor: "",
    sbVisibility: false,
  },
  getters: {
    isGcodeFile: state => state.currentFileName != undefined ? state.currentFileName.includes("gcode") : false,
    isLogFile: state => state.currentFileName != undefined ? state.currentFileName.includes("log") : false,
  },
  mutations: {
    TOGGLE_SURFACE_DIMENSIONS_ALERT_STATE: (state) => {
      state.doShowSurfaceDimensionsAlert = !state.doShowSurfaceDimensionsAlert;
    },
    TOGGLE_TRANSMISSION_PROCESS_STATE: (state) => {
      state.isTransmissionProcessActive = !state.isTransmissionProcessActive;
    },
    SET_TRANSMISSION_PROCESS_STATE: (state, newState) => {
      state.isTransmissionProcessActive = newState;
    },
    SET_CURRENT_ACTIVE_PORT: (state, port) => {
      state.currentActivePort = port;
    },
    SHOW_SNACKBAR: (state, payload) => {
      state.sbColor = payload.color;
      state.sbContent = payload.content;
    },
    TOGGLE_SB_VISIBILITY: (state, visibility) => {
      state.sbVisibility = visibility;
    },
    SET_CURRENT_FILE_NAME: (state, currentFileName) => {
      state.currentFileName = currentFileName;
    },
    SET_IS_HOME_PAGE: (state, bool) => {
      state.isHomePage = bool;
    }
  },
  actions: {

  }
});
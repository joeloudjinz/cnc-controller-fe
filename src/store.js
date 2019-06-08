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
    first_name: 'system',
    last_name: 'user',
    id: 0,
    email: 'system.user@email.com',
    token: '',
    refresh_token: '',
    isConnected: false,
    doShowSurfaceDimensionsAlert: initializeShowSurfaceDimensionsAlertState(),
    isTransmissionProcessActive: false,
    currentActivePort: undefined,
    currentFileName: undefined,
    isHomePage: false,
    adminsCount: 0,
    workersCount: 0,
    conversionsCount: 0,
    activePortsCount: 0,
    //? snackbar state
    sbContent: "",
    sbColor: "",
    sbVisibility: false,
  },
  getters: {
    isGcodeFile: state => state.currentFileName != undefined ? state.currentFileName.includes("gcode") : false,
    isLogFile: state => state.currentFileName != undefined ? state.currentFileName.includes("log") : false,
    getToken: state => state.token,
    getRefreshToken: state => state.refresh_token,
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
    },
    SET_ADMINS_COUNT: (state, count) => {
      state.adminsCount = count;
    },
    SET_WORKERS_COUNT: (state, count) => {
      state.workersCount = count;
    },
    SET_CONVERSIONS_COUNT: (state, count) => {
      state.conversionsCount = count;
    },
    SET_ACTIVE_PORTS_COUNT: (state, count) => {
      state.activePortsCount = count;
    },
    SET_FIRST_NAME: (state, value) => {
      state.first_name = value;
    },
    SET_LAST_NAME: (state, value) => {
      state.last_name = value;
    },
    SET_EMAIL: (state, value) => {
      state.email = value;
    },
    SET_ID: (state, value) => {
      state.id = value;
    },
    SET_TOKEN: (state, value) => {
      state.token = value;
    },
    SET_REFRESH_TOKEN: (state, value) => {
      state.refresh_token = value;
    },
    TOGGLE_IS_CONNECTED_STATE: (state) => {
      state.isConnected = !state.isConnected;
    }
  },
  actions: {

  }
});
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
  console.log('surfaceHeight, surfaceWidth :', surfaceHeight, surfaceWidth);
  const booleanValue = (surfaceHeight == null || surfaceWidth == null) ||
    (surfaceHeight == 0 || surfaceWidth == 0) ||
    (surfaceHeight == undefined || surfaceWidth == undefined);
  return booleanValue;
};

export default new Vuex.Store({
  state: {
    doShowSurfaceDimensionsAlert: initializeShowSurfaceDimensionsAlertState(),
    isTransmissionProcessActive: false,
    currentActivePort: undefined,
    currentFileName: undefined,
    isHomePage: false,
    isAdmin: undefined,
    adminsCount: 0,
    workersCount: 0,
    conversionsCount: 0,
    activePortsCount: 0,
    loginAlertContent: "",
    loginAlertValue: false,
    isConversionActive: false,
    selectedPortObject: undefined
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
    SHOW_LOGIN_ALERT_VALUE: (state, content) => {
      state.loginAlertContent = content;
      state.loginAlertValue = true;
    },
    HIDE_LOGIN_ALERT_VALUE: (state) => {
      state.loginAlertValue = false;
      state.loginAlertContent = "";
    },
    SET_IS_CONVERSION_ACTIVE: (state, value) => {
      state.isConversionActive = value;
    },
    SET_IS_ADMIN_VALUE: (state, value) => {
      state.isAdmin = value;
    },
    SET_SELECTED_PORT_OBJECT: (state, object) => {
      state.selectedPortObject = object;
    },
    initializeShowSurfaceDimensionsAlertState: (state) => {
      state.doShowSurfaceDimensionsAlert = initializeShowSurfaceDimensionsAlertState();
    }
  },
  actions: {

  }
});
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
    doShowSurfaceDimensionsAlert: initializeShowSurfaceDimensionsAlertState()
  },
  // getters: {
  //   getShowSurfaceDimensionsAlertState: state => {
  //     return state.doShowSurfaceDimensionsAlert;
  //   }
  // },
  mutations: {
    TOGGLE_SURFACE_DIMENSIONS_ALERT_STATE: (state) => {
      state.doShowSurfaceDimensionsAlert = !state.doShowSurfaceDimensionsAlert;
    }
  },
  actions: {

  }
});
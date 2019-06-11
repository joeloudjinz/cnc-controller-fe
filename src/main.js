import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import Vuetify from 'vuetify';
import VueSocketio from 'vue-socket.io-extended';
import io from 'socket.io-client';
import axios from 'axios';

Vue.use(Vuetify);

// TODO: use vue.config.js to set the io() parameter
Vue.use(VueSocketio, io('http://localhost:3000'));

import 'vuetify/dist/vuetify.min.css'; // Ensure you are using css-loader

Vue.config.productionTip = false;

// const redirectToLogin = () => {
//   console.log('in redirectToLogin()');

// }

const responseErrorCallback = (error) => {
  //? this means that web token or refresh token is either invalid or not present in headers of the previous request
  if (error.response.status === 401 || error.response.status === 400) {
    window.localStorage.removeItem("id");
    window.localStorage.removeItem("first_name");
    window.localStorage.removeItem("last_name");
    window.localStorage.removeItem("email");
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("refresh_token");
    store.commit('SHOW_LOGIN_ALERT_VALUE', 'Session has expired, login again please')
    router.replace('/login');
  }
  //! here you must use this expression so the call of the api treat the response as an error in the catch block
  return Promise.reject(error);
}
const requestConfigCallback = (config) => {
  config.headers.Authorization = "Bearer " + localStorage.token;
  return config;
}
axios.interceptors.request.use((config) => requestConfigCallback(config), (error) => Promise.reject(error));
axios.interceptors.response.use(response => response, error => responseErrorCallback(error));

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
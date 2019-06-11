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

// TODO: create request interceptor to add token to each request
// TODO: if web token is not defined, redirect to login, same for refresh token

//? Add a response interceptor to treat Unauthorized and Bad Request errors
axios.interceptors.response.use(function (response) {
  return response;
}, function (error) {
  //? this means that web token or refresh token is either invalid or not present in headers of the previous request
    if (error.response.status === 401 || error.response.status === 400) {
    // TODO: remove user data from storage
    store.commit('SHOW_LOGIN_ALERT_VALUE', 'Session has expired, login again please')
    router.replace('/login');
  }
  //! here you must use this expression so the call of the api treat the response as an error in the catch block
  return Promise.reject(error);
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
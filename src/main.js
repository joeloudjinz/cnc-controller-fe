import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import Vuetify from 'vuetify';
import VueSocketio from 'vue-socket.io-extended';
import io from 'socket.io-client';

Vue.use(Vuetify);

Vue.use(VueSocketio, io('http://localhost:3000'));

// index.js or main.js
import 'vuetify/dist/vuetify.min.css'; // Ensure you are using css-loader

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
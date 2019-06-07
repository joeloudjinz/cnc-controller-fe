import Vue from 'vue';
import Router from 'vue-router';
import store from './store.js';

Vue.use(Router);

const router = new Router({
  routes: [{
      path: '/',
      name: 'home',
      component: () => import( /* webpackChunkName: "about" */ './views/Home.vue'),
      meta: {
        requireAuth: true
      },
    children: [
        {
          path: 'users',
          name: 'users',
          component: () => import( /* webpackChunkName: "agents" */ "./views/Workers.vue"),
        },
        {
          path: 'converter',
          name: 'converter',
          component: () => import( /* webpackChunkName: "images" */ './views/Images.vue'),
        },
        {
          path: 'files',
          name: 'files',
          component: () => import( /* webpackChunkName: "resources" */ './views/Files.vue'),
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import( /* webpackChunkName: "resources" */ "./views/Login.vue"),
    }
  ]
});

/**
 * before executing each route, check if the status of the authentication is true or not of the user
 * this will ensure that the protected routes will accessed only if the user is logged in
 * it checks the status from the local storage of the browser
 *? isConnected variable will be initialized (in the local storage) during login process to 'true', and to 'false' during logout.
 */
router.beforeEach((to, from, next) => {
  if (to.name === 'home') {
    store.commit("SET_IS_HOME_PAGE", true);
  } else {
    store.commit("SET_IS_HOME_PAGE", false);
  }
  if (to.matched.some(record => record.meta.requireAuth)) {
    const isConnected = window.localStorage.getItem('isConnected');
    if (isConnected === 'true') {
      next();
    } else {
      router.replace('/login');
    }
  } else {
    next();
  }
});

export default router;
import Vue from 'vue';
import Router from 'vue-router';
import store from './store.js';

Vue.use(Router);

const router = new Router({
  routes: [{
      path: '/',
      name: 'home',
      component: () => import( /* webpackChunkName: "home" */ './views/Home.vue'),
      meta: {
        requireAuth: true
      },
      children: [{
          path: 'users',
          name: 'users',
          component: () => import( /* webpackChunkName: "users" */ "./views/Workers.vue"),
          meta: {
            requireAuth: true
          }
        },
        {
          path: 'converter',
          name: 'converter',
          component: () => import( /* webpackChunkName: "images" */ './views/Images.vue'),
          meta: {
            requireAuth: true
          }
        },
        {
          path: 'files',
          name: 'files',
          component: () => import( /* webpackChunkName: "files" */ './views/Files.vue'),
          meta: {
            requireAuth: true
          }
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import( /* webpackChunkName: "login" */ "./views/Login.vue"),
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
  // console.log('localStorage.id :', localStorage.id);
  if (to.matched.some(record => record.meta.requireAuth)) {
    if (localStorage.id != undefined) {
      next()
      return
    }
    next('/login')
  } else {
    next()
  }
});

export default router;
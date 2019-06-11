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
          component: () => import( /* webpackChunkName: "images" */ './views/Converter.vue'),
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
  next()
  if (to.matched.some(record => record.meta.requireAuth)) {
    //? if the id is defined, means that the user is connected, because when he/she logout data will be wiped out
    if (localStorage.id != undefined || localStorage.id != '') {
      //? ensuring that the tokens are defined and not empty
      if (localStorage.token === "" || localStorage.refresh_token === "") {
        store.commit(
          "SHOW_LOGIN_ALERT_VALUE",
          "Session has expired, login again please"
        );
        next("/login");
        return;
      }
      if (to.name === "login") {
        next('/');
        return;
      } else {
        next()
        return
      }
    }
    next('/login')
  }
});

export default router;
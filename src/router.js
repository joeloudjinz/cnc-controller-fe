import Vue from 'vue';
import Router from 'vue-router';
// import Login from "./views/Login.vue";
// import Home from './views/Home.vue';
// import Dashboard from "./views/Dashboard.vue";
// import Agents from "./views/Agents.vue";
// import Images from './views/Images.vue'; //? for converter page
// import Resources from './views/Resources.vue';
// import { Agent } from 'https';


Vue.use(Router);

const router = new Router({
  routes: [{
      path: '/',
      name: 'home',
      component: () => import( /* webpackChunkName: "about" */ './views/Home.vue'),
      // component: Home,
      meta: {
        requireAuth: true
      },
      // component: Home,
      children: [{
          path: 'dashboard',
          component: () => import( /* webpackChunkName: "dashboard" */ "./views/Dashboard.vue"),
          // component: Dashboard
        },
        {
          path: 'agents',
          component: () => import( /* webpackChunkName: "agents" */ "./views/Agents.vue"),
          // component: Agents
        },
        {
          path: 'converter',
          component: () => import( /* webpackChunkName: "images" */ './views/Images.vue'),
          // component: Images
        },
        {
          path: 'resources',
          component: () => import( /* webpackChunkName: "resources" */ './views/Resources.vue'),
          // component: Resources
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import( /* webpackChunkName: "resources" */ "./views/Login.vue"),
      // component: Login
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
  if (to.matched.some(record => record.meta.requireAuth)) {
    const isConnected = window.localStorage.getItem('isConnected');
    // console.log(isConnected);
    if (isConnected === 'true') {
      // console.log(to.name);
      next();
    } else {
      router.replace('/login');
    }
  } else {
    next();
  }
});

export default router;
import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import Login from "./views/Login.vue";
import Dashboard from "./views/Dashboard.vue";
import Agents from "./views/Agents.vue";
import Images from './views/Images.vue';
import Resources from './views/Resources.vue';


Vue.use(Router);

const router = new Router({
  routes: [{
      path: '/',
      name: 'home',
      component: Home,
      meta: {
        requireAuth: true
      },
      // component: Home,
      children: [{
          path: 'dashboard',
          component: Dashboard
        },
        {
          path: 'agents',
          component: Agents
        },
        {
          path: 'images',
          component: Images
        },
        {
          path: 'resources',
          component: Resources
        }
      ]
    },
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (about.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import( /* webpackChunkName: "about" */ './views/About.vue'),
    //   meta: {
    //     requireAuth: true
    //   },
    // },
    {
      path: '/login',
      name: 'login',
      component: Login
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
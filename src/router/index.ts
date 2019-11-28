import Vue from "vue";
import VueRouter, { Route, RouteConfig } from "vue-router";

import nprogress from "nprogress";

import EmptyRouterView from "@/views/EmptyRouterView.vue";

import UsersModule from "@/store/modules/Users";

nprogress.configure({
  showSpinner: false
});

Vue.use(VueRouter);

const routes: RouteConfig[] = [
  {
    name: "login",
    path: "/login",
    beforeEnter: (to: Route, from: Route, next) => {
      if (UsersModule.loggedIn) {
        next({
          path: "/"
        });
      } else {
        next();
      }
    },
    meta: {
      nameArabic: "تسجيل الدخول",
      visible: false,
      icon: "mdi-login",
      requiresAuth: false
    },
    // route level code-splitting
    // this generates a separate chunk (login.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/Login.vue")
  },
  {
    props: true,
    name: "home",
    path: "/",
    meta: {
      nameArabic: "استعلام",
      visible: true,
      icon: "mdi-magnify",
      requiresAuth: true
    },
    // route level code-splitting
    // this generates a separate chunk (home.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "home" */ "../views/Home.vue")
  },
  {
    props: true,
    name: "users",
    path: "/users",
    meta: {
      nameArabic: "الحسابات",
      visible: UsersModule.isAdmin,
      icon: "mdi-account",
      requiresAuth: true,
      requiresAdmin: true
    },
    // route level code-splitting
    // this generates a separate chunk (users.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "users" */ "../views/Users.vue")
  },
  {
    path: "/lines",
    component: EmptyRouterView,
    meta: {
      nameArabic: "الخطوط",
      visible: true,
      icon: "mdi-arrow-expand-horizontal",
      requiresAuth: true
    },
    children: [
      {
        name: "lines",
        path: "",
        // route level code-splitting
        // this generates a separate chunk (line.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
          import(/* webpackChunkName: "lines" */ "../views/Lines.vue")
      },
      {
        props: true,
        name: "lines.stations",
        path: ":lineId/stations",
        // route level code-splitting
        // this generates a separate chunk (line-stations.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
          import(
            /* webpackChunkName: "line-stations" */ "../views/LineStations.vue"
          )
      },
      {
        props: true,
        name: "lines.trains",
        path: ":lineId/trains",
        // route level code-splitting
        // this generates a separate chunk (line-trains.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
          import(
            /* webpackChunkName: "line-trains" */ "../views/LineTrains.vue"
          )
      }
    ]
  },
  {
    name: "stations",
    path: "/stations",
    meta: {
      nameArabic: "المحطات",
      visible: true,
      icon: "mdi-city",
      requiresAuth: true
    },
    // route level code-splitting
    // this generates a separate chunk (stations.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "stations" */ "../views/Stations.vue")
  },
  {
    path: "/trains",
    component: EmptyRouterView,
    meta: {
      nameArabic: "القطارات",
      visible: true,
      icon: "mdi-train",
      requiresAuth: true
    },
    children: [
      {
        name: "trains",
        path: "",
        // route level code-splitting
        // this generates a separate chunk (trains.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
          import(/* webpackChunkName: "trains" */ "../views/Trains.vue")
      },
      {
        props: true,
        name: "trains.details",
        path: "trains/:id",
        // route level code-splitting
        // this generates a separate chunk (trains.details.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
          import(
            /* webpackChunkName: "trains.details" */ "../views/TrainDetails.vue"
          )
      }
    ]
  },
  {
    props: true,
    name: "trainRuns",
    path: "/runs",
    meta: {
      nameArabic: "الرحلات",
      visible: true,
      icon: "mdi-car-estate",
      requiresAuth: true
    },
    // route level code-splitting
    // this generates a separate chunk (trainRuns.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "trainRuns" */ "../views/TrainRuns.vue")
  },
  // otherwise redirect to home
  {
    path: "*",
    redirect: "/"
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeResolve((to, from, next) => {
  // If this isn't an initial page load.
  if (to.name) {
    // Start the route progress bar.
    nprogress.start();
  }
  next();
});

router.beforeEach((to: Route, from: Route, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin);
  if (requiresAuth && !requiresAdmin) {
    if (UsersModule.loggedIn) {
      return next();
    }
    if (from.path !== "/login") next("/login");
  }
  if (requiresAuth && requiresAdmin) {
    if (UsersModule.loggedIn && UsersModule.isAdmin) {
      return next();
    }
    next("/");
  }
  next();
});

router.afterEach((to, from) => {
  // Complete the animation of the route progress bar.
  nprogress.done();
});

export default router;

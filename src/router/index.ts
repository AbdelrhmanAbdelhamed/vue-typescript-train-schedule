import Vue from "vue";
import VueRouter, { Route, RouteConfig } from "vue-router";

import nprogress from "nprogress";

import EmptyRouterView from "@/views/EmptyRouterView.vue";

import UsersModule from "@/store/modules/Users";
import AbilitiesModule from "@/store/modules/Abilities";

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
      requiresAuth: true,
      resource: "Train"
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
      visible: false,
      icon: "mdi-account",
      resource: "User",
      requiresAuth: true
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
      visible: false,
      icon: "mdi-arrow-expand-horizontal",
      resource: "Line",
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
      visible: false,
      icon: "mdi-city",
      resource: "Station",
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
      visible: false,
      icon: "mdi-train",
      resource: "Train",
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
        name: "trains.run.details",
        path: ":id/runs",
        // route level code-splitting
        // this generates a separate chunk (trains.run.details.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
          import(
            /* webpackChunkName: "trains.run.details" */ "../views/TrainRunDetails.vue"
          )
      },
      {
        props: true,
        name: "trains.line.stations",
        path: ":id/stations/line/:lineId",
        // route level code-splitting
        // this generates a separate chunk (trains.line.stations.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
          import(
            /* webpackChunkName: "trains.line.stations" */ "../views/TrainLineStations.vue"
          )
      }
    ]
  },
  {
    props: true,
    name: "trainRuns",
    path: "/runs",
    meta: {
      nameArabic: "خدمات التأمين",
      visible: false,
      icon: "mdi-shield-car",
      resource: "TrainRun",
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
  const canNavigate = to.matched.some(route => {
    if (route.meta.requiresAuth) {
      return AbilitiesModule.ability.can(
        route.meta.action || "read",
        route.meta.resource
      );
    }
    return true;
  });

  if (!canNavigate) {
    return next("/login");
  }

  next();
});

router.afterEach((to, from) => {
  // Complete the animation of the route progress bar.
  nprogress.done();
});

export default router;

import { createRouter, createWebHistory } from "vue-router";
import Style from "@/views/Style.vue";
import Home from "@/views/Home.vue";

const routes = [
  {
    meta: {
      title: "Users",
    },
    path: "/users",
    name: "Users",
    // component: () => import("@/views/Users.vue"),
    component: () => import('@/views/User/List.vue')
  },
  {
    meta: {
      title: "ADDUser",
    },
    path: "/user/add",
    name: "ADDUser",
    component: () => import("@/views/User/Add.vue"),
  },
  {
    meta: {
      title: "Customers"
    },
    path: "/customers",
    name: 'Customer',
    component: () => import('@/views/Customer/List.vue')
  },
  {
    meta: {
      title: "Geography",
    },
    path: "/geography",
    name: "Geography",
    component: () => import("@/views/Geography/list.vue"),
    // children: [
    //   {
    //     path: "add",
    //     component: () => import(/* webpackChunkName: "ui" */ "@/views/Ui.vue"),
    //   }
    // ],
  },
  {
    meta: {
      title: "ADDGeography",
    },
    path: "/geography/add",
    name: "ADDGeography",
    component: () => import("@/views/Geography/Add.vue"),
  },
  {
    meta: {
      title: "EDITGeography",
    },
    path: "/geography/edit/:id",
    name: "EDITGeography",
    component: () => import("@/views/Geography/Edit.vue"),
  },
  {
    meta: {
      title: "Weather",
    },
    path: "/weather",
    name: "Weather",
    component: () => import("@/views/Weather/list.vue"),
  },
  {
    meta: {
      title: "ADDWeather",
    },
    path: "/weather/add",
    name: "ADDWeather",
    component: () => import("@/views/Weather/Add.vue"),
  },
  {
    meta: {
      title: "EDITWeather",
    },
    path: "/weather/edit/:id",
    name: "EDITWeather",
    component: () => import("@/views/Weather/Edit.vue"),
  },
  {
    meta: {
      title: "TEST",
    },
    path: "/test",
    name: "test",
    component: () => import("@/views/Test.vue"),
  },
  {
    meta: {
      title: "Login",
      fullScreen: true,
    },
    path: "/",
    name: "style",
    component: () => import("@/views/Login.vue"),
  },
  {
    // Document title tag
    // We combine it with defaultDocumentTitle set in `src/main.js` on router.afterEach hook
    meta: {
      title: "Dashboard",
    },
    path: "/dashboard",
    name: "dashboard",
    component: Home,
  },
  {
    meta: {
      title: "Tables",
    },
    path: "/tables",
    name: "tables",
    component: () =>
      import(/* webpackChunkName: "tables" */ "@/views/Tables.vue"),
  },
  {
    meta: {
      title: "Forms",
    },
    path: "/forms",
    name: "forms",
    component: () => import(/* webpackChunkName: "forms" */ "@/views/Forms.vue"),
  },
  {
    meta: {
      title: "Profile",
    },
    path: "/profile",
    name: "profile",
    component: () => import(/* webpackChunkName: "profile" */ "@/views/Profile.vue"),
  },
  {
    meta: {
      title: "Ui",
    },
    path: "/ui",
    name: "ui",
    component: () => import(/* webpackChunkName: "ui" */ "@/views/Ui.vue"),
  },
  {
    meta: {
      title: "Responsive layout",
    },
    path: "/responsive",
    name: "responsive",
    component: () =>
      import(/* webpackChunkName: "responsive" */ "@/views/Responsive.vue"),
  },
  {
    meta: {
      title: "Login",
      fullScreen: true,
    },
    path: "/login",
    name: "login",
    component: () =>
      import(/* webpackChunkName: "login" */ "@/views/Login.vue"),
  },
  {
    meta: {
      title: "Register",
      fullScreen: true,
    },
    path: "/register",
    name: "register",
    component: () =>
      import(/* webpackChunkName: "login" */ "@/views/Register.vue"),
  },
  {
    meta: {
      title: "Error",
      fullScreen: true,
    },
    path: "/error",
    name: "error",
    component: () =>
      import(/* webpackChunkName: "error" */ "@/views/Error.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0 };
  },
});

export default router;

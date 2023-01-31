import { createRouter, createWebHistory } from "vue-router";
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
      title: 'EDITUser'
    },
    path: "/user/edit/:id",
    name: "EDITUser",
    component: () => import('@/views/User/Edit.vue'),
  },
  {
    meta: {
      title: "OtherCustomers",
    },
    path: "/customers",
    name: "OtherCustomers",
    // component: () => import("@/views/Users.vue"),
    component: () => import('@/views/CustomerSale/CustomerList.vue')
  },
  {
    meta: {
      title: "AddOtherCustomers",
    },
    path: "/customers/add",
    name: "AddOtherCustomers",
    component: () => import("@/views/CustomerSale/FormCustomer.vue"),
  },
  {
    meta: {
      title: "EditOtherCustomers",
    },
    path: "/customers/edit",
    name: "EditOtherCustomers",
    component: () => import("@/views/CustomerSale/FormCustomer.vue"),
  },
  {
    meta: {
      title: "CustomerDetail",
    },
    path: "/customers/view-detail",
    name: "CustomerDetail",
    component: () => import("@/views/CustomerSale/CustomerDetail.vue"),
  },
  {
    meta: {
      title: "MyCustomers",
    },
    path: "/my-customers",
    name: "MyCustomers",
    // component: () => import("@/views/Users.vue"),
    component: () => import('@/views/MyCustomer/MyCustomerList.vue')
  },
  {
    meta: {
      title: "AddMyCustomers",
    },
    path: "/my-customers/add",
    name: "AddMyCustomers",
    component: () => import("@/views/MyCustomer/FormMyCustomer.vue"),
  },
  {
    meta: {
      title: "EditMyCustomers",
    },
    path: "/my-customers/edit",
    name: "EditMyCustomers",
    component: () => import("@/views/MyCustomer/FormMyCustomer.vue"),
  },
  {
    meta: {
      title: "Fruits"
    },
    path: "/fruits",
    name: 'Fruits',
    component: () => import('@/views/Fruits/FruitList.vue'),
  },
  {
    meta: {
      title: "AddFruits",
    },
    path: "/fruits/add",
    name: "AddFruits",
    component: () => import("@/views/Fruits/FormFruits.vue"),
  },
  {
    meta: {
      title: "EditFruits",
    },
    path: "/fruits/edit",
    name: "EditFruits",
    component: () => import("@/views/Fruits/FormFruits.vue"),
  },
  {
    meta: {
      title: "FruitsType"
    },
    path: "/fruits-type",
    name: 'FruitsType',
    component: () => import('@/views/FruitsType/FruitsTypeList.vue'),
  },
  {
    meta: {
      title: "AddFruitsType",
    },
    path: "/fruits-type/add",
    name: "AddFruitsType",
    component: () => import("@/views/FruitsType/FruitsTypeForm.vue"),
  },
  {
    meta: {
      title: "EditFruitsType",
    },
    path: "/fruits-type/edit",
    name: "EditFruitsType",
    component: () => import("@/views/FruitsType/FruitsTypeForm.vue"),
  },
  {
    meta: {
      title: "Geography",
    },
    path: "/geography",
    name: "Geography",
    component: () => import("@/views/Geography/list.vue"),
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
      title: "GeographyBase",
    },
    path: "/geography_base",
    name: "GeographyBase",
    component: () => import("@/views/GeographyBase/list.vue"),
  },
  {
    meta: {
      title: "GeographyBaseForm",
    },
    path: "/geography_base/form",
    name: "GeographyBaseForm",
    component: () => import("@/views/GeographyBase/Form.vue"),
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
      title: "Role",
    },
    path: "/roles",
    name: "Role",
    component: () => import("@/views/Role/List.vue"),
  },
  {
    meta: {
      title: "ADDRole"
    },
    path: "/role/add",
    name: "ADDRole",
    component: () => import("@/views/Role/Form.vue")
  },
  {
    meta: {
      title: "Permission"
    },
    path: "/role/permission/:id",
    name: "Permission",
    component: () => import("@/views/Role/Permission.vue")
  },
  {
    meta: {
      title: "EDITRole"
    },
    path: "/role/edit/:id",
    name: "EDITRole",
    component: () => import("@/views/Role/Form.vue")
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
      title: "Profile",
    },
    path: "/profile",
    name: "profile",
    component: () => import(/* webpackChunkName: "profile" */ "@/views/Profile.vue"),
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

import { createRouter, createWebHistory } from "vue-router";
const router1 = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/login",
      name: "login",
      component: () => import("../pages/Login.vue"),
    },
    {
      path: "/",
      name: "home",
      //重定向,使得一进入主页就默认展示数据
      redirect: "/data",
      component: () => import("../pages/Home.vue"),
      meta: {
        title: "首页（数据展示）",
        sign: 1,
      },
      children: [
        //数据展示
        {
          path: "data",
          name: "data",
          component: () => import("../pages/Data.vue"),
          meta: {
            title: "首页（数据展示）",
            sign: 1,
          },
        },
        // 权限管理
        {
          path: "userManage",
          name: "userManage",
          component: () => import("../pages/UserManage.vue"),
          meta: {
            title: "用户管理",
            sign: 2,
          },
        },
        {
          path: "jueseManage",
          name: "jueseManage",
          component: () => import("../pages/JueSeManage.vue"),
          meta: {
            title: "角色管理",
            sign: 2,
          },
        },
        {
          path: "menuManage",
          name: "menuanage",
          component: () => import("../pages/MenuManage.vue"),
          meta: {
            title: "菜单管理",
            sign: 2,
          },
        },
        // 商品管理
        {
          path: "pingtai",
          name: "pingtai",
          component: () => import("../pages/PingTai.vue"),
          meta: {
            title: "平台属性管理",
            sign: 3,
          },
        },
        {
          path: "spu",
          name: "spu",
          component: () => import("../pages/Spu.vue"),
          meta: {
            title: "SPU管理",
            sign: 3,
          },
        },
        {
          path: "sku",
          name: "sku",
          component: () => import("../pages/Sku.vue"),
          meta: {
            title: "SKU管理",
            sign: 3,
          },
        },
        //测试管理
        {
          path: "test1",
          name: "test1",
          component: () => import("../pages/Test1.vue"),
          meta: {
            title: "test1",
            sign: 4,
          },
        },
        {
          path: "test2",
          name: "test2",
          component: () => import("../pages/Test2.vue"),
          meta: {
            title: "test2",
            sign: 4,
          },
        },
      ],
    },
  ],
});


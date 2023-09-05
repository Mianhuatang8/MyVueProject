import { createRouter, createWebHistory } from "vue-router";
//拆分路由
//常量路由-所有用户都拥有的
export const constRoutes = [
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
    beforeEnter: (to, from, next) => {
      // 在此处加载动态路由信息
      const dynamicRoutes = JSON.parse(localStorage.getItem('dynamicRoutes'));
      if (dynamicRoutes && dynamicRoutes.length > 0) {
        dynamicRoutes.forEach((route) => {
          router.addRoute('home', route);
        });
      }
         console.log("添加后的路由 router.getRoutes(): ", router.getRoutes());
      next();
    },
    children: [
      // 数据展示
      {
        path: "data",
        name: "Dashboard",
        component: () => import("../pages/Data.vue"),
        meta: {
          title: "首页（数据展示）",
          sign: 1,
        },
      },
    ],
  },
];
//异步路由-根据用户权限进行判断是否拥有
export const asyncRoutes = [
  // 权限管理
  {
    path: "userManage",
    name: "User",
    component: () => import("../pages/UserManage.vue"),
    meta: {
      title: "用户管理",
      sign: 2,
    },
  },
  {
    path: "jueseManage",
    name: "Role",
    component: () => import("../pages/JueSeManage.vue"),
    meta: {
      title: "角色管理",
      sign: 2,
    },
  },
  {
    path: "menuManage",
    name: "Permission",
    component: () => import("../pages/MenuManage.vue"),
    meta: {
      title: "菜单管理",
      sign: 2,
    },
  },
  // 商品管理
  {
    path: "pingtai",
    name: "Attr",
    component: () => import("../pages/PingTai.vue"),
    meta: {
      title: "平台属性管理",
      sign: 3,
    },
  },
  {
    path: "spu",
    name: "Spu",
    component: () => import("../pages/Spu.vue"),
    meta: {
      title: "SPU管理",
      sign: 3,
    },
  },
  {
    path: "sku",
    name: "Sku",
    component: () => import("../pages/Sku.vue"),
    meta: {
      title: "SKU管理",
      sign: 3,
    },
  },
  //测试管理
  {
    path: "test1",
    name: "Test",
    component: () => import("../pages/Test1.vue"),
    meta: {
      title: "test1",
      sign: 4,
    },
  },
  {
    path: "test2",
    name: "test1",
    component: () => import("../pages/Test2.vue"),
    meta: {
      title: "test2",
      sign: 4,
    },
  },
];


// const allRoutes = constRoutes.concat(asyncRoutes);
//任意路由-当路径出现错误时重定向

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: constRoutes,
});

//全局前置路由守卫
router.beforeEach((to, from, next) => {
  //如果从登录页面过来就进入
  if (to.path == "/login") {
    next();
  } else {
    //从本地会话中获取token
    const token = sessionStorage.getItem("token");
    //从vuex中获取token
    // if(store.state.UserAbout.token){
    // console.log('路由首位',store.state.UserAbout.token);
    if (token) {
      // console.log("token:", token);
      next();
    } else next("/login");
  }
});
//全局后置路由守卫
router.afterEach((to, from) => {
  // console.log('后置路由守卫to',to);
  // console.log('后置路由守卫from',from);
  if (to.meta.title) {
    document.title = to.meta.title;
  } else {
    document.title = "后台管理系统";
  }
});
export default router;

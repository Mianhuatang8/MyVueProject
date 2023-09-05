import { getLogin, outLogin, getInfo } from "../api/user.js";
import { ElMessage } from "element-plus";
import cloneDeep from "lodash/cloneDeep";
import { constRoutes, asyncRoutes } from "../router/index.js";
import router from "../router/index.js";
const UserAbout = {
  namespaced: true, //开启命名空间
  state() {
    return {
      token: "",
      username: "", //用户名
      avatar: "", //存储用户头像
      routes: [], //存储用户权限
      rules: [],
      buttons: [],
      //对比之后【项目中已有的异步路由，与服务器返回的标记信息进行对比最终需要展示的理由】
      resultAsyncRoutes: [],
      //用户最终需要展示全部路由
      resultAllRoutes: [],
    };
  },
  actions: {
    //登陆业务
    async user_login(context, loginForm) {
      let res = await getLogin(loginForm); //向服务器发起登录请求
      console.log("发起登录请求", res.data);
      //请求成功
      if (res.data.code == 20000) {
        context.commit("USER_LOGIN", res.data.data);
        ElMessage({
          message: "登陆成功",
          type: "success",
        });
        return true;
      } else {
        //请求失败
        ElMessage({
          message: res.data.message !== null ? res.data.message : "用户不存在",
          type: "error",
        });
        return false;
      }
    },
    //退出登录业务
    async user_quit(context) {
      let res = await outLogin();
      // console.log('退出登录',res);
      if (res.data.code == 20000) {
        context.commit("USER_QUIT");
        ElMessage({
          message: "成功退出登录",
          type: "success",
        });
        return true;
      } else {
        //请求失败
        ElMessage({
          message: "退出失败",
          type: "error",
        });
        return false;
      }
    },
    //获取用户信息业务
    async user_info(context) {
      let res = await getInfo();
      // console.log('获取用户信息',res.data);
      context.commit("USER_INFO", res.data.data);
    },
    //过滤用户路由
    async userRoutes(context) {
      console.log("userRoutes的context", context);
      console.log("异步路由信息：", context.state.resultAsyncRoutes);
      if (!context.state.routes) {
        // 如果 state.routes 未设置，则先获取用户信息，等待用户信息获取成功再计算异步路由
        //防止在计算异步路由之前，state.routes 还没有被初始化，导致state.routes为undefined
        await context.dispatch("user_info");
      }
      context.commit("USER_ROUTES");
    },
  },
  mutations: {
    //登录
    USER_LOGIN(state, value) {
      //存储token
      state.token = value.token;
      //本地存储token
      sessionStorage.setItem("token", value.token);
    },
    //获取用户信息
    USER_INFO(state, value) {
      // console.log('获取用户信息',value);
      state.username = value.name;
      state.avatar = value.avatar;
      state.routes = value.routes;
      state.rules = value.rules;
      state.buttons = value.buttons;
      console.log("登陆成功获取用户信息USER_INFO：", value);
    },
    //退出登录
    USER_QUIT(state) {
      //移除token
      state.token = "";
      //移除本地存储token
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("allRoute");
      //清空信息
      state.avatar = "";
      state.username = "";
      state.routes = [];
      state.rules = [];
      (state.resultAsyncRoutes = []), (state.resultAllRoutes = []);
    },
    //用户路由信息-计算异步路由
    USER_ROUTES(state) {
      console.log("当前的路由信息USER_ROUTES--state", state);
      //计算出异步路由
      state.resultAsyncRoutes = asyncRoutes.filter((p) => {
        if (state.routes.indexOf(p.name) != -1) {
          return true;
        } else return false;
      });

      console.log("异步路由信息1：", state.resultAsyncRoutes);

      //复制常量路由
      state.resultAllRoutes = cloneDeep(constRoutes);
      state.resultAllRoutes[1].children = state.resultAsyncRoutes;
      console.log(
        "最终计算出来的全部路由state.resultAllRoutes[1]",
        state.resultAllRoutes
      );
      // 给路由器添加新的路由
      state.resultAsyncRoutes.map((p) => {
        router.addRoute("home", p);
      });
      // 将路由信息存储到本地
       // 将路由信息存储到本地，并使用 JSON.stringify 转换为字符串
    sessionStorage.setItem("allRoute", JSON.stringify(state.resultAsyncRoutes));
    // 确认存储的内容
    console.log("存储在 sessionStorage 中的路由信息：", sessionStorage.getItem("allRoute"));
      console.log("添加后的路由 router.getRoutes(): ", router.getRoutes());
    },
  },
};
export default UserAbout;

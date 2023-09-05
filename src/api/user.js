// 接口统一管理
// 引入 定义的公共的函数
import request from "../request";
//登录/admin/acl/index/login
export function getLogin({ username, password }) {
  return request({
    // url路径
    url: "/admin/acl/index/login",
    // 请求方式
    method: "post",
    data:{ username, password }
  });
}

//退出登录
export function outLogin() {
  return request({
    url: "/admin/acl/index/logout",
    method: "post",
  });
}

//获取用户信息
export function getInfo() {
  return request({
    url: "/admin/acl/index/info",
    method: "get",
  });
}

// 获取当前用户的菜单权限列表
export function getMenu() {
  return request({
    url: "/admin/acl/index/menu",
    method: "get",
  });
}

// 接口统一管理
// 引入 定义的公共的函数
import request from "../request";

//获取用户列表
export function getUsers(page,limit) {
    console.log('发起请求',page,limit);
  return request({
    // url路径
    url: `/admin/acl/user/${page}/${limit}`,
    // 请求方式
    method: "get",
  });
}

//添加用户
export function addUser(userObj){
    console.log('发起请求传过来的数据-新增用户:',userObj);
    return request({
        url:'/admin/acl/user/save',
        method:'post',
        data:userObj
    })
}
//删除用户
export function delUserItem(id){
    return request({
        url:`/admin/acl/user/remove/${id}`,
        method:'delete'
    })
}

//修改用户
export function editUserItem(newData){
    return request({
        url:'/admin/acl/user/update',
        method:'put',
        data:newData
    })

}
//批量删除用户
export function delSomeUserItem(idList){
    return request({
        url:'/admin/acl/user/batchRemove',
        method:'post',
        data:idList//post请求,传递body参数
    })
}

//查找
//api里面的参数名是username nickname,所以在接收传递过来的对象的属性名字也必须是username nickname 否则传参失败
export function searchSome(page,limit,searchContext){
    console.log('searchContext',searchContext);
    return request({
        url:`/admin/acl/user/${page}/${limit}`,
        method:'get',
        params:searchContext//get请求传递query参数
    })
}

//获取全部角色列表和某个用户的角色列表
export function getUserRole(userId){
    return request({
        url:`/admin/acl/user/toAssign/${userId}`,
        method:'get'
    })
}

//给用户分配某个角色、
// POST /admin/acl/user/doAssign
// roleId:Array[string]
export function saveUserRole(userId,roleId){
    console.log('111111',roleId);
    return request({
        url:'/admin/acl/user/doAssign',
        method:'post',
        params:{userId,roleId}
    })
}


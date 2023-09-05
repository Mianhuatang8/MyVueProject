
import request from "../request";

//获取用户列表(带搜索)
export function getRoles(page,limit,searchContext) {
    console.log('发起请求',page,limit);
  return request({
    // url路径
    url: `/admin/acl/role/${page}/${limit}`,
    // 请求方式
    method: "get",
    params:searchContext//get请求传递query参数
  });
}

//批量删除角色
export function delSomeRole(idList){
    return request({
        url:'/admin/acl/role/batchRemove',
        method:'post',
        data:idList//post请求,传递body参数
    })
}
//删除角色 
export function delRole(id){
    return request({
        url:`/admin/acl/role/remove/${id}`,
        method:'delete'
    })
}
//添加角色
export function addRole(role){
    return request({
        url:'/admin/acl/role/save',
        method:'post',
        data:role
    })
}

//修改角色
export function editRole(newRole){
    // console.log("传递过来的新的角色名称:",newRole);
    return request({
        url:'/admin/acl/role/update',
        method:'put',
        data:newRole
    })

}

//获取权限列表-角色授权（根据角色获取菜单）
export function getRoleMenu(roleId){
    return request({
        url:`/admin/acl/permission/toAssign/${roleId}`,
        method:'get',
    })
}


//给角色分配权限

export function updateRoleMenu(roleId,permissionId){
    return request({
        url:'/admin/acl/permission/doAssign',
        method:'post',
        params:{roleId,permissionId}
    })
}

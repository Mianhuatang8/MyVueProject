import request from "../request";

//获取菜单列表
export function getMenuList(){
    return request({
        url:'/admin/acl/permission',
        method:'get'
    })
}
//递归删除菜单
export function deleteMenu(id){
    return request({
        url:`/admin/acl/permission/remove/${id}`,
        method:'delete'
    })
}
//添加菜单
export function addMenu(permission){
    return request({
        url:'/admin/acl/permission/save',
        method:'post',
        data:permission
    })
}
//修改菜单
export function editMenu(permission){
    return request({
        url:'/admin/acl/permission/update',
        method:'put',
        data:permission
    })
}
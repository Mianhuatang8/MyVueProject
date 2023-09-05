import request from "../request";

//根据category3Id获取平台属性列表
export function getAttrList({category1Id,category2Id,category3Id}){
    return request({
        url:`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
        methods:'get',
    })
}

//保存对平台属性的修改
export function saveUpdateAttr(attrInfo){
    return request({
        url:'/admin/product/saveAttrInfo',
        method:'post',
        data:attrInfo
    })
}

//保存对平台属性的某个属性值的修改
export function saveAttrInfoValue(attrInfo){
    return request({
        url:'/admin/product/saveAttrInfo',
        method:'post',
        data:attrInfo
    })
}


//删除平台属性的某个属性值
export function delAttr(attrId){
    return request({
        url:`/admin/product/deleteAttr/${attrId}`,
        method:'delete',
    })
}

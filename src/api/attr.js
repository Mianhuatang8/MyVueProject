import request from "../request";

//获取一级分类选择
export function getCategory1(){
    return request({
        url:'/admin/product/getCategory1',
        methods:'get'
    })
}

//获取二级分类选择
export function getCategory2(category1Id){
    return request({
        url:`/admin/product/getCategory2/${category1Id}`,
        methods:'get'
    })
}

//获取三级分类选择
export function getCategory3(category2Id){
    return request({
        url:`/admin/product/getCategory3/${category2Id}`,
        methods:'get'
    })
}


// //添加新的属性
// export function addNewAttr(){
//     return request({
//         url:'',
//         method:'',
//     })
// }
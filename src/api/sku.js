import request from "../request";

//获取sku商品列表
export function getSkuList(page,limit){
    return request({
        url:`/admin/product/list/${page}/${limit}`,
        methods:'get'
    })
}

//上架商品
export function onSale(skuId){
    return request({
        url:`/admin/product/onSale/${skuId}`,
        methods:'get'
    })
}
//下架商品
export function downSale(skuId){
    return request({
        url:`/admin/product/cancelSale/${skuId}`,
        methods:'get'
    })
}

//sku商品详情
export function displaySale(skuId){
    return request({
        url:`/admin/product/getSkuById/${skuId}`,
        methods:'get'
    })
}
//删除商品
export function delSale(skuId){
    return request({
        url:`/admin/product/deleteSku/${skuId}`,
        methods:'delete'
    })
}
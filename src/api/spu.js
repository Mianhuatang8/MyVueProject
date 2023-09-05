import request from "../request";

//根据category3Id获取数据
export function getSelectList(page, limit, searchObj) {
  return request({
    url: `/admin/product/${page}/${limit}`,
    method: "get",
    params: searchObj, //三个分类的选择
  });
}

//删除spu
// DELETE /admin/product/deleteSpu/{spuId}
export function deleteSpu(id) {
  return request({
    url: `/admin/product/deleteSpu/${id}`,
    method: "delete",
  });
}

// //新增spu
// export function saveNewSpu(newSpuInfo) {
//   return request({
//     url: "/admin/product/saveSpuInfo",
//     method: "post",
//     data: newSpuInfo,
//   });
// }
//保存对spu的修改
export function updatedSpuInfo(updatedSpuInfo) {
  //携带的参数带有id----修改spu
  if (updatedSpuInfo.id) {
    return request({
      url: "/admin/product/updateSpuInfo",
      method: "post",
      data: updatedSpuInfo,
    });
  } else {
    return request({
      url: "/admin/product/saveSpuInfo",
      method: "post",
      data: updatedSpuInfo,
    });
  }
}

//查看某个spu的全部sku列表
export function showSpuSku(spuId) {
  return request({
    url: `/admin/product/findBySpuId/${spuId}`,
    methods: "get",
  });
}
//获取spu的基本信息
export function getSpuInfo(spuId) {
  return request({
    url: `/admin/product/getSpuById/${spuId}`,
    method: "get",
  });
}

//添加sku
export function addSku(skuInfo) {
  return request({
    url: "/admin/product/saveSkuInfo",
    method: "post",
    data: skuInfo,
  });
}

//获取平台属性的数据
// GET /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
export function getAttrInfoList({ category1Id, category2Id, category3Id }) {
  // console.log('发起请求searchObj',searchObj);
  console.log("category1Id", category1Id, category2Id, category3Id);
  return request({
    url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
    method: "get",
  });
}

//获取某个spu销售属性数据
// GET /admin/product/spuSaleAttrList/{spuId}
export function getSaleInfoList(spuId) {
  return request({
    url: `/admin/product/spuSaleAttrList/${spuId}`,
    method: "get",
  });
}

// 获取全部销售属性
export function getBaseSaleAttr() {
  return request({
    url: "/admin/product/baseSaleAttrList",
    method: "get",
  });
}

//获取spu图片列表数据
// GET /admin/product/spuImageList/{spuId}
export function getImagList(spuId) {
  return request({
    url: `/admin/product/spuImageList/${spuId}`,
    method: "get",
  });
}

//获取品牌属性数据
export function getPingPaiList() {
  return request({
    url: "/admin/product/baseTrademark/getTrademarkList",
    method: "get",
  });
}

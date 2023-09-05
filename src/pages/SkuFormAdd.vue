<template>
    <el-form label-width="120px">
        <el-form-item label="SPU名称">
            <span>{{ spu.spuName }}</span>
        </el-form-item>
        <el-form-item label="SKU名称">
            <el-input v-model="skuInfo.skuName" placeholder="sku名称" />
        </el-form-item>
        <el-form-item label="价格(元)">
            <el-input v-model.number="skuInfo.price" placeholder="价格(元)" />
        </el-form-item>
        <el-form-item label="重量(千克)">
            <el-input v-model.number="skuInfo.weight" placeholder="重量(千克)" />
        </el-form-item>
        <el-form-item label="规格描述">
            <el-input v-model="skuInfo.skuDesc" type="textarea" />
        </el-form-item>

        <el-form-item label="平台属性">
            <el-form :model="attrInfoList" :inline="true" label-width="90px">
                <el-form-item v-for="p in attrInfoList" :key="p.id" :label="p.attrName" style="font-weight:bold">
                    <el-select v-model="p.attrIdAndValueId" placeholder="请选择">
                        <!-- 最终有进行选择的平台属性上面都多了一个属性attrIdAndValueId：attrIdAndValueId: "106:176" -->
                        <el-option v-for="item in p.attrValueList" :key="item.id" :label="item.valueName"
                            :value="`${p.id}:${item.id}`" />
                    </el-select>
                </el-form-item>
            </el-form>

        </el-form-item>
        <el-form-item label="销售属性">
            <el-form :model="saleInfoList" :inline="true" label-width="80px">
                <el-form-item v-for="p in saleInfoList" :key="p.id" :label="p.saleAttrName" style="font-weight:bold">
                    <el-select v-model="p.saleIdAndValueId" placeholder="请选择">
                        <el-option v-for="item in p.spuSaleAttrValueList" :key="item.id" :label="item.saleAttrValueName"
                            :value="`${p.id}:${item.id}`" />
                    </el-select>
                </el-form-item>
            </el-form>

        </el-form-item>
        <el-form-item label="图片列表">
            <el-table :data="imgTableData" style="width: 100%" @select="handleSelectionChange"
                @select-all="handleSelectionChange">
                <el-table-column type="selection" width="55" />
                <el-table-column label="图片" width="200">
                    <template v-slot="imgScope">
                        <img :src="imgScope.row.imgUrl" style="width:100px;height:100px">
                    </template>
                </el-table-column>
                <el-table-column label="名称" width="200" prop="imgName" />
                <el-table-column label="操作">
                    <template v-slot="optScope">
                        <el-button type="primary" @click="setDefault(optScope.row)"
                            v-if="optScope.row.isDefault == 0">设为默认</el-button>
                        <el-button v-else>默认</el-button>
                    </template>
                </el-table-column>

            </el-table>
        </el-form-item>

        <el-form-item>
            <el-button type="primary" @click="saveSku">保存</el-button>
            <el-button @click="cancel">取消</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
import { ElMessage } from 'element-plus'
import { getAttrInfoList, getSaleInfoList, getImagList,addSku} from '../api/spu'
export default {
    props: ['getSkuShow'],//接收父组件传递过来的函数,便于向父组件传递组件显示与否的参数
    data() {
        return {
            show: 1,
            //当前操作的spu数据
            spu: {},
            //提交的表单数据
            skuInfo: {
                //父组件传递过来的数据
                category3Id: 0,
                spuId: 0,
                tmId: 0,
                //表单双向绑定收集
                skuName: '',//sku名称
                price: '',//价格
                weight: '',//重量
                skuDesc: '',//规格描述
                //列表收集
                skuImageList: [],//图片
                skuDefaultImg: '',//默认图片

                skuSaleAttrValueList: [],//销售属性
                skuAttrValueList: [],//平台属性
            },
            attrInfoList: [],// 平台属性数据
            saleInfoList: [],//销售属性数据
            imgTableData: [],//图片列表数据

        }
    },
    methods: {
        // 获取基本数据
        async getData(searchObj, row) {
            console.log('传过来的row', row);
            console.log('传过来的searchObj', searchObj);
            this.spu = row
            this.skuInfo.category3Id = searchObj.category3Id
            this.skuInfo.spuId = row.id;
            this.skuInfo.tmId = row.tmId;
            // 获取平台属性数据
            let res1 = await getAttrInfoList(searchObj)
            console.log('平台属性数据res1', res1);
            if (res1.data.code == 200) {
                this.attrInfoList = res1.data.data
                console.log('平台属性数据:', this.attrInfoList);
            }
            // 获取销售属性数据getSaleInfoList(spuId)
            let res2 = await getSaleInfoList(row.id)
            console.log('销售属性数据res2', res2);
            if (res2.data.code == 200) {
                this.saleInfoList = res2.data.data
                console.log('销售属性数据:', this.saleInfoList);
            }
            // 获取图片列表数据getImagList(spuId)
            let res3 = await getImagList(row.id)
            console.log('图片列表数据res3', res3);
            if (res3.data.code == 200) {
                const list = res3.data.data
                list.forEach((p) => {
                    p.isDefault = 0
                })
                this.imgTableData = list
                // this.skuInfo.skuImageList=this.imgTableData
                console.log('图片列表数据:', this.imgTableData);
            }
        },
        // 保存添加sku
        async saveSku() {
            console.log('加工前面----------------------');
            console.log('保存sku,原本数据：', this.skuInfo);
            console.log('当前平台属性：', this.attrInfoList);
            console.log('当前销售属性：', this.saleInfoList);
            // console.log('当前图片列表数据：',this.imgTableData);


            console.log('加工后----------------------');
            //对数据进行加工和包装
            //封装数据
            //1-封装平台属性数据
            //解构
            const prev1 = []
            this.attrInfoList.map((p) => {
                if (p.attrIdAndValueId) {
                    const [attrId, valueId] = p.attrIdAndValueId.split(":");
                    prev1.push({ attrId, valueId });
                }
            })
            this.skuInfo.skuAttrValueList=prev1
            console.log('prev1', prev1)
            //2-封装销售属性数据
            const prev2 = []
            this.saleInfoList.map((p) => {
                if (p.saleIdAndValueId) {
                    const [saleAttrId, saleAttrValueId] = p.saleIdAndValueId.split(":");
                    prev2.push({ saleAttrId, saleAttrValueId });
                }
            })
            console.log('prev2', prev2)
            this.skuInfo.skuSaleAttrValueList=prev2

            console.log('加工后的sku', this.skuInfo);
            //发起请求
            let res= await addSku(this.skuInfo)
            console.log('成功发起请求',res.data);
            if (res.data.code == 200) {
                ElMessage({
                    message: '添加成功',
                    type: 'success',
                })
            }
            else {
                ElMessage({
                    message: '添加失败',
                    type: 'error',
                })
            }

            //整理平台属的数据
            // reduce的第一个参数作为累加器,第二个参数是索引值
            // this.skuInfo.skuAttrValueList = this.attrInfoList.reduce((prev, item) => {
            //     if (item.attrIdAndValueId) {
            //         const [attrId, valueId] = item.attrIdAndValueId.split(":");
            //         prev.push({ attrId, valueId });
            //     }
            //     return prev;
            // }, []);
            // //整理销售属性
            // skuInfo.skuSaleAttrValueList = spuSaleAttrList.reduce((prev, item) => {
            //     if (item.attrIdAndValueId) {
            //         const [saleAttrId, saleAttrValueId] = item.attrIdAndValueId.split(':');
            //         prev.push({ saleAttrId, saleAttrValueId });
            //     }
            //     return prev;
            // }, []);
            // let res=await addSku(this.skuInfo)
            // console.log('保存sku',res.data);
            this.show = 0
            this.$emit("getSkuShow", this.show)


            //清空整个表单数据
        },
        //取消添加sku
        cancel() {
            this.show = 0
            this.$emit("getSkuShow", this.show)
            //清空整个表单数据
        },
        //当图片列表选择框发生变化时触发
        handleSelectionChange(selection) {
            console.log('图片状态改变', selection);
            //存储图片列表
            this.skuInfo.skuImageList = selection
            console.log('this.skuInfo.skuImageList', this.skuInfo.skuImageList);
        },
        //设置默认图片
        setDefault(row) {
            // 排他 只剩下自己
            this.imgTableData.forEach((p) => {
                p.isDefault = 0
            })
            row.isDefault = 1
            this.skuInfo.skuDefaultImg = row.imgUrl
        },


    },
}
</script>

<style scope></style>
<template>
    <el-form label-width="120px">
        <el-form-item label="SPU名称">
            <el-input v-model="spuInfo.spuName" placeholder="spu名称" />
        </el-form-item>
        <el-form-item label="品牌">
            <el-select v-model="spuInfo.tmId" placeholder="请选择品牌">
                <el-option v-for="p in pingPaiList" :key="p.id" :label="p.tmName" :value="p.id" />
            </el-select>
        </el-form-item>
        <el-form-item label="SPU描述">
            <el-input v-model="spuInfo.description" type="textarea" />
        </el-form-item>
        <el-form-item label="SPU图片">
            <!-- action:请求 URL -->
            <!-- on-preview:图片预览 -->
            <!-- on-remove:删除图片 -->
            <!-- on-success:文件上传成功 -->
            <!-- 照片墙显示图片的数据需要数组，数组里面的元素需要有name与url字段 -->
            <el-upload v-model:file-list="currentSpuImageList"
                action="http://gmall-h5-api.atguigu.cn/admin/product/fileUpload" list-type="picture-card"
                :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :on-success="handelSuccess">
                <el-icon>
                    <Plus />
                </el-icon>
            </el-upload>
            <!-- 图片预览的对话框 -->
            <el-dialog v-model="dialogVisible">
                <img w-full :src="dialogImageUrl" alt="Preview Image" />
            </el-dialog>

        </el-form-item>
        <el-form-item label="销售属性">
            <el-select v-model="attrIdAndAttrName" :placeholder="`还有${unSelectSaleList.length}项未选择`">
                <el-option v-for="p in unSelectSaleList" :key="p.id" :label="p.name" :value="`${p.id}:${p.name}`" />
            </el-select>
            <!-- 要将选中的id和名字传给添加属性按钮，不然添加属性按钮无法操作：:value="`${p.id}:${p.name}`"  -->
            <el-button type="primary" @click="addUnSelectAttr" :disabled="unSelectSaleList.length == 0">+添加销售属性</el-button>
            <!-- 展示的是当前SPU属于自己的销售属性 -->
            <el-table style="width: 100%" border :data="spuInfo.spuSaleAttrList">
                <el-table-column type="index" label="序号" width="125px" align="center">
                </el-table-column>
                <el-table-column label="属性名" width="250px" prop="saleAttrName">
                </el-table-column>
                <el-table-column label="属性值名称列表" width="400px">
                    <template v-slot="tagScope">
                        <!-- el-tag:用户展示已有属性值列表的数据的 -->
                        <el-tag v-for="(p, index) in tagScope.row.spuSaleAttrValueList" :key="p.id" closable
                            :disable-transitions="false" @close="tagScope.row.spuSaleAttrValueList.splice(index, 1)"
                            style="margin-right:5px"> {{ p.saleAttrValueName }} </el-tag>
                        <!-- @keyup.enter.native=" handleInputConfirm" 
                             @blur="handleInputConfirm(row)"> -->
                        <!-- inputValue和isInput都是属性值列表上面未拥有的，开始时为undefined -->
                        <!-- 让enter事件的回调变为触发blur失焦，这样就相当于按enter自动触发blur，就只会触发一次回调正常执行
                        这样就不会导致不重复的属性值成功添加到属性值列表后提示重复
                        （会拿到响应后的row和现在的值对比，因为已经记录了输入内容，会提示重复）
                        原因是enter的时候 input也失焦触发了blur 导致回调被触发两次 -->

                        <el-input style="width:60px;" :ref="tagScope.$index" @keyup.enter="handelEnter"
                            @blur="handelBlur(tagScope.row)" v-model="tagScope.row.inputValue"
                            v-if="tagScope.row.isInput"></el-input>
                        <el-button class="button-new-tag" v-else :ref="tagScope.$index"
                            @click="addSaleAttrValue(tagScope.row, tagScope.$index)">添加</el-button>
                    </template>
                </el-table-column>

                <el-table-column label="操作" width="277">
                    <template v-slot="optAttrValue">
                        <el-button type="danger" @click="delAttr(optAttrValue.row, optAttrValue.$index)"> <el-icon>
                                <Delete />
                            </el-icon> </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-form-item>

        <el-form-item>
            <el-button type="primary" @click="saveSpu">保存</el-button>
            <el-button @click="cancel">取消</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
// import { Vue } from 'vue';
import { reactive, toRefs } from 'vue';
import { ElMessage } from 'element-plus'
import { getPingPaiList, updatedSpuInfo, getSpuInfo, getImagList, getBaseSaleAttr, } from '../api/spu'
export default {
    props: ['getSpuShow'],//接收父组件传递过来的函数,便于向父组件传递组件显示与否的参数
    data() {
        return {
            dialogVisible: false,//点击加号显示大图
            dialogImageUrl: '',
            selectPingPaiId: '',
            select: '',
            show: 2,
            spuInfo: reactive({
                //父组件传过来
                category3Id: 0,
                //双向绑定收集
                spuName: '',
                tmId: '',
                description: '',

                spuImageList: [],//图片列表
                spuSaleAttrList: [],//销售属性列表
            }),
            // 品牌列表
            pingPaiList: [],
            currentSpuImageList: [],//当前的图片列表
            allSpuSaleAttrList: [],//全部销售属性列表
            attrIdAndAttrName: "", //收集未选择的销售属性的id和名字-----
        }
    },
    computed: {
        unSelectSaleList() {
            // this.spuInfo.spuSaleAttrList
            //数组的过滤方法，可以从已有的数组当中过滤出用户需要的元素，并未返回一个新的数据
            let result = this.allSpuSaleAttrList.filter((item) => {
                //every数组的方法，会返回一个布尔值
                return this.spuInfo.spuSaleAttrList.every((p) => {
                    return p.saleAttrName != item.name
                })
            })
            console.log('unSelectSaleList:', result);
            return result
        }
    },
    methods: {
        //添加属性值名称
        addSaleAttrValue(row, index) {
            console.log('添加属性值名称：', row)
            //往属性值列表上动态添加响应式数据isInput和inputValue
            // Vue3不需要再使用 Vue.set，而是可以直接对属性进行赋值。
            row.isInput = true
            row.inputValue = ''
            // Vue.set(row.spuSaleAttrValueList,'isInput',true)
            // Vue.set(row.spuSaleAttrValueList,'inputValue','')
            //实现自动聚焦效果
            //因为标签的切换和渲染是要一定时间的
            this.$nextTick(() => {
                this.$refs[index].focus()
            })
        },
        handelEnter(event) {
            // 在 Vue 3 中，事件对象不再通过 $event 参数传递，而是直接作为函数的参数传递给方法中。
            event.target.blur();
        },
        //输入框失去焦点、按下回车键
        handelBlur(row) {
            console.log('输入框失去焦点', row);
            //判断输入框的值是否为空 
            if (row.inputValue.trim() == '') {
                ElMessage({
                    message: '请输入正确的属性值',
                    type: 'error',
                })
                return
            }
            //新增的属性值和原来已有的不能相同
            let isReapt = row.spuSaleAttrValueList.some((p) => {
                return p.saleAttrValueName == row.inputValue
            })
            //不重复
            if (isReapt) {
                ElMessage({
                    message: '不能输入相同的属性值',
                    type: 'error',
                })
                 row.inputValue = ''
                 row.isInput = false
            } else {
                // 往数组里面添加
                row.spuSaleAttrValueList.push({
                    baseSaleAttrId: row.baseSaleAttrId,
                    saleAttrValueName: row.inputValue
                })
                console.log('增加属性值：', row);
                row.isInput = false
                 row.inputValue = ''
            }
            // row.isInput = true
            // row.inputValue = ''
        },
        // 删除当前spu的某个属性
        delAttr(row, index) {
            console.log('删除属性：', row, index);
            this.spuInfo.spuSaleAttrList.splice(index, 1)
            console.log('成功删除', this.spuInfo.spuSaleAttrList);
        },
        // 添加spu获取数据
        async getNewData(selection) {
            console.log('添加spu数据', selection);
            this.spuInfo.category3Id = selection.category3Id
            //获取全部销售属性数据
            let rst1 = await getBaseSaleAttr()
            // console.log('全部基础销售属性数据res2', res2);
            if (rst1.data.code == 200) {
                this.allSpuSaleAttrList = rst1.data.data
                console.log('全部销售属性allSpuSaleAttrList:', this.allSpuSaleAttrList);
            }
            //获取品牌数据
            this.getPingPaiData()
            console.log('添加spu获取的当前加工的spuInfo的数据：', this.spuInfo);
        },
        // 修改spu获取数据
        async getUpdateSpu(row) {
            //获取该spu的基本信息
            let res1 = await getSpuInfo(row.id)
            // console.log('res1', res1);
            // if (res1.data.code == 200) {
            this.spuInfo = res1.data.data
            console.log('该spu的基本信息spuInfo:', this.spuInfo);
            // }
            //获取品牌列表数据
            this.getPingPaiData()

            // 获取平台的全部销售属性数据
            let res2 = await getBaseSaleAttr()
            // console.log('全部基础销售属性数据res2', res2);
            if (res2.data.code == 200) {
                this.allSpuSaleAttrList = res2.data.data
                console.log('全部销售属性allSpuSaleAttrList:', this.allSpuSaleAttrList);
            }

            // 获取图片列表数据getImagList(spuId)
            let res3 = await getImagList(row.id)
            // console.log('图片列表数据res3', res3);
            if (res3.data.code == 200) {
                //由于照片墙显示图片的数据需要数组，数组里面的元素需要有name与url字段
                let imageList = res3.data.data
                imageList.forEach((item) => {
                    item.name = item.imgName
                    item.url = item.imgUrl
                });
                this.currentSpuImageList = imageList
                console.log('图片列表数据currentSpuImageList:', this.currentSpuImageList);
            }
        },

        //获取品牌列表数据
        async getPingPaiData() {
            let res = await getPingPaiList()
            console.log('品牌列表数据', res.data);
            this.pingPaiList = res.data.data
        },
        //图片相关
        // 预览图片
        handlePictureCardPreview(upLoadData) {
            console.log('上传图片的地址upLoadData:', upLoadData);
            this.dialogVisible = true
            this.dialogImageUrl = upLoadData.url

        },
        // 文件列表移除文件时的钩子
        handleRemove(removeData, fileList) {
            console.log('删除图片的数据removeData:', removeData, fileList);
            //从当前的图片列表中删除该图片
            this.currentSpuImageList = fileList
            // console.log(this.currentSpuImageList);
        },
        // 图片成功上传
        handelSuccess(response, file, fileList) {
            this.currentSpuImageList = fileList
            console.log('图片上传成功', this.currentSpuImageList);
        },
        //添加未选择的销售属性
        addUnSelectAttr() {
            console.log('未选择属性里面选择的attrIdAndAttrName:', this.attrIdAndAttrName);
            //对收到的数据进行分割
            // let newAttr=this.attrIdAndAttrName.split(":")
            // console.log(newAttr);
            const [baseSaleAttrId, saleAttrName] = this.attrIdAndAttrName.split(":")
            console.log(baseSaleAttrId, saleAttrName);

            //从未选择属性数组中移除该选项-因为是计算属性，当数据变化时计算属性会重新渲染，所以不需要多一步专门移除
            // //往spuInfo的属性列表中添加该选项
            this.spuInfo.spuSaleAttrList.push({
                baseSaleAttrId: baseSaleAttrId,
                saleAttrName: saleAttrName,
                spuSaleAttrValueList: [],
            })
            //清空数据
            this.attrIdAndAttrName = ''

        },
        // 保存spu
        async saveSpu() {
            console.log('保存spu', this.spuInfo);
            console.log('保存spu-当前的图片列表', this.currentSpuImageList);
            //整理图片数据与要求形式相同
            this.spuInfo.spuImageList = this.currentSpuImageList.map((p) => {
                return {
                    imgName: p.name,
                    imgUrl: p.url
                }
            })
            // console.log('保存spu图片列表',this.spuInfo.spuImageList);
            // 发起保存请求
            let result1 = await updatedSpuInfo(this.spuInfo)
            console.log('成功发起更新请求', result1.data);
            if (result1.data.code == 200) {
                ElMessage({
                    message: '成功修改',
                    type: 'success',
                })
            }
            else {
                ElMessage({
                    message: result1.data.data,
                    type: 'error',
                })
            }
            this.show = 0
            this.$emit("getSpuShow", this.show)
            //清空数据
            this.spuInfo.spuName = ''
            this.spuInfo.description = ''
            this.spuInfo.tmId = ''
            this.spuInfo.category3Id = 0
            this.spuInfo.spuImageList = []
            this.spuInfo.spuSaleAttrList = []
            this.currentSpuImageList = []

        },
        //取消保存
        cancel() {
            this.show = 0
            this.$emit("getSpuShow", this.show)
            //清空数据
            this.spuInfo.spuName = ''
            this.spuInfo.description = ''
            this.spuInfo.tmId = ''
            this.spuInfo.category3Id = 0
            this.spuInfo.spuImageList = []
            this.spuInfo.spuSaleAttrList = []
            this.currentSpuImageList = []
            //清空整个data里面的数据
            // Object.assign(this._data, this.$options.data());

        },
    }



}


</script>

<style></style>
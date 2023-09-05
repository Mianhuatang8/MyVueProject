<template>
    <div>
        <el-row>
            <el-col class="select" :span="7">
                一级分类
                <el-select v-model="selections.category1Id" placeholder="请选择" @change="changeOne"
                :disabled="!show==0">
                    <el-option v-for="item in oneOptions" :key="item.id"  :label="item.name" :value="item.id" />
                </el-select>
            </el-col>
            <el-col class="select" :span="7">
                二级分类
                <el-select v-model="selections.category2Id" placeholder="请选择" @change="changeTwo" :disabled="!show==0">
                    <el-option v-for="item in twoOptions" :key="item.value" :label="item.name"  :value="item.id" />
                </el-select>
            </el-col>
            <el-col class="select" :span="7">
                三级分类
                <el-select v-model="selections.category3Id" placeholder="请选择" @change="changeThree" :disabled="!show==0">
                    <el-option v-for="item in threeOptions" :key="item.value" :label="item.name"  :value="item.id" />
                </el-select>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import { getCategory1, getCategory2, getCategory3 } from '../api/attr'
export default {
    name: "CategorySelect",
    props:['getCategory3Id','show'],
    data() {
        return {
            //一二三级分类的选中id
            selections:{
                category1Id:'',
                category2Id:'',
                category3Id:''
            },
            oneOptions: [],
            twoOptions: [],
            threeOptions: [],
        }
    },
    methods: {
        //获取一级分类选择内容
        async getCategory1() {
            let res = await getCategory1()
            res = res.data
            // console.log('一级分类:', res.data);
            this.oneOptions = res.data
        },
        //获取二级分类选择内容
        async getCategory2(category1Id) {
            let res = await getCategory2(category1Id)
            res = res.data
            // console.log('二级分类:', res.data);
            this.twoOptions = res.data
        },
        //获取三级分类选择内容
        async getCategory3(category2Id) {
            let res = await getCategory3(category2Id)
            res = res.data
            // console.log('三级分类:', res.data);
            this.threeOptions = res.data
        },
        changeOne(category1Id){//选中值发生变化时触发,回调-当前选中的值
            // console.log('category1Id',category1Id);
            this.twoOptions=[]
            this.threeOptions=[]
            this.selections.category2Id=''
            this.selections.category3Id=''
            this.getCategory2(category1Id)
            // console.log('selections',this.selections);
        },
        changeTwo(category2Id){
            this.threeOptions=[]
            this.selections.category3Id=''
            // console.log('category2Id',category2Id);
            this.getCategory3(category2Id)
            // console.log('selections',this.selections);
        },
        //传送三级分类id给父组件获取数据
        changeThree(category3Id){
             console.log('selections',this.selections);
            this.$emit('getCategory3Id',this.selections)//传递给spu管理
            this.$emit('getCategory3IdAttr',this.selections)//传递给平台属性管理

        }
    },
    mounted() {
        this.getCategory1()
    }

}
</script>

<style scope>
.select {
    font-weight: bold;
    margin-left: 10px;
    display: flex;
    align-items: center;
}
</style>
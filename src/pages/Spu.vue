<template>
  <div class="spu_all">
    <!-- 分类选择器卡片 -->
    <el-card style="width: 100%;height: 100px;margin-bottom: 20px;">
      <CascaderSelect @getCategory3Id="getCategory3Id" :show="show"></CascaderSelect>
    </el-card>
    <!-- 属性表单 -->
    <el-card style="width: 100%;">
      <div v-show="show == 0">
        <el-button type="primary" @click="addSpu" :disabled="isDisAddSPU">+添加SPU</el-button>
        <el-table ref="spuTableRef" :data="spuTableData" style="width: 100%;" stripe v-loading="isLoading">
          <!-- 序号 -->
          <el-table-column label="序号" width="100">
            <template #default="scope">
              <span style="margin-left: 10px">{{ (pages.currentPage - 1) * pages.pageLen + scope.$index + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column label="SPU名称" :width="275" prop="spuName"></el-table-column>
          <el-table-column label="SPU描述" :width="420" prop="description"></el-table-column>


          <!-- 操作按钮 -->
          <el-table-column fixed="right" label="操作" width="350">
            <template #default="slotScope">
              <el-tooltip content="添加sku" placement="bottom" effect="light">
                <el-button type="success" @click="addSpuSku(slotScope.row)"><el-icon>
                    <Plus />
                  </el-icon></el-button>
              </el-tooltip>
              <el-tooltip content="修改spu" placement="bottom" effect="light">
                <el-button type="warning" @click="editSpu(slotScope.row)"><el-icon>
                    <EditPen />
                  </el-icon></el-button>
              </el-tooltip>
              <el-tooltip content="查看当前spu全部sku列表" placement="bottom" effect="light">
                <el-button type="danger" @click="displaySpuSku(slotScope.row)"><el-icon>
                    <Warning />
                  </el-icon></el-button>
              </el-tooltip>
              <!-- 弹出气泡框-选择是否确定删除 -->
              <el-popconfirm width="220" confirm-button-text="确定" cancel-button-text="取消" icon-color="#626AEF"
                title="确定删除吗" @confirm="deleteSpu(slotScope.row.id)" @cancel="cancelDel">
                <template #reference>
                  <el-button type="primary"><el-icon>
                      <Delete />
                    </el-icon></el-button>
                </template>
              </el-popconfirm>

            </template>
          </el-table-column>
        </el-table>
        <!-- 分页条 -->
        <el-pagination v-model:current-page="pages.currentPage" v-model:page-size="pages.pageLen" :disabled="false"
          :background="false" layout="prev, pager, next, jumper" :total="pages.total" style="margin-top: 20px;" 
          @current-change="handleCurrentChange"/>
      </div>

      <!-- 添加sku -->
      <SkuFormAdd v-show="show == 1" @getSkuShow="getSkuShow" ref="sku"></SkuFormAdd>
      <!-- 修改spu或新增spu -->
      <SpuFormAddEdit v-show="show == 2" @getSpuShow="getSpuShow" ref="spu"></SpuFormAddEdit>
    </el-card>

    <!-- 显示该spu的所有sku列表 -->
    <el-dialog v-model="skuListVisible" :title="`${spu.spuName}的sku列表`">
      <el-table :data="skuListData" v-loading="isSkuLoading">
        <el-table-column prop="skuName" label="名称" width="200" />
        <el-table-column prop="price" label="价格" width="150" />
        <el-table-column prop="weight" label="重量" width="150" />
        <el-table-column label="默认图片" width="150">
          <template #default="skuImgScope">
            <img :src="skuImgScope.row.skuDefaultImg" style="height:120px;width:100px" />
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <span class="dialog-footer" @click="dialogVisible = false"></span>
      </template>
    </el-dialog>

  </div>
</template>

<script>
import SkuFormAdd from '@/pages/SkuFormAdd.vue'
import SpuFormAddEdit from '@/pages/SpuFormAddEdit.vue'
import CascaderSelect from '../components/CascaderSelect.vue'
import { ElMessage } from 'element-plus'
import { getSelectList, deleteSpu, showSpuSku, } from '../api/spu'
export default {
  components: {
    CascaderSelect, SkuFormAdd, SpuFormAddEdit
  },
  data() {
    return {
      isDisAddSPU: true,
      // 当前行的spu信息
      currentRow: [],
      show: 0,//判断显示哪个组件,0-基本组件,1-新增sku,2-新增/修改spu
      isSkuLoading: false,
      spu: {},
      skuListData: [],
      skuListVisible: false,
      //三个分类的三个id
      searchObj: {},
      isLoading: false,
      pages: {
        pageLen: 5,//每页数量
        currentPage: 1,//当前页面
        total: 0,//总数量
      },
      spuTableData: [],//根据分类选择得到的数据
    }
  },
  methods: {
      //分页条-当前页面数改变时触发-获取数据
      handleCurrentChange() {
      this.isLoading = true
      this.getSpuList()
    },
    // 获取根据分类选择得到的数据
    async getSpuList() {
      let res = await getSelectList(this.pages.currentPage, this.pages.pageLen, this.searchObj)
      console.log('根据分类获取的数据:', res.data);
      res = res.data
      this.spuTableData = res.data.records
      this.pages.total=res.data.total
      this.isLoading = false
    },
    //接收从选择器组件传递过来的Category3Id
    getCategory3Id(value) {
      console.log('父组件接收子组件传递过来的getCategory3Id:', value);
      this.searchObj = value
      // this.searchObj.category3Id = value.category3Id
      this.isLoading = true
      this.isDisAddSPU = false
      this.getSpuList()

    },
    // 添加sku
    addSpuSku(row) {
      //显示skuAddForm表单
      this.show = 1
      console.log('当前行的spu的信息', row);
      this.currentRow = row
      // 通知子组件调用函数getData()
      this.$refs.sku.getData(this.searchObj, row)
    },

    //接收从子组件传递过来的show
    getSkuShow(value) {
      console.log('SkuForm传递过来的show:', value);
      this.show = value

    },
    //接收从子组件传递过来的show
    getSpuShow(value) {
      console.log('SpuForm传递过来的show:', value);
      this.show = value
      //重新渲染数据
      //重新渲染数据
      this.isLoading = true
      // this.getSpuList()
      this.getSpuList()
    },
    //修改spu
    editSpu(row) {
      this.show = 2
      // 通知子组件调用函数getData()
      this.$refs.spu.getUpdateSpu(row)
    },
    //添加SPU
    addSpu() {
      this.show = 2
      // 通知子组件调用函数getNewData()ss
      this.$refs.spu.getNewData(this.searchObj)
    },
    //查看当前spu全部sku列表
    async displaySpuSku(row) {
      this.skuListVisible = true
      this.spu = row//保存当前行的spu信息,方便后面调用
      this.isSkuLoading = true
      console.log('当前查看sku的数据:', row);
      let res = await showSpuSku(row.id)
      this.isSkuLoading = false
      // console.log('当前spu的基本信息spuInfo:', res.data);
      this.skuListData = res.data.data
      console.log('this.skuListData:', this.skuListData);
    },
    //删除spu
    async deleteSpu(id) {
      console.log('id', id);
      let res = await deleteSpu(id)
      //  console.log('删除spu',res);
      if (res.data.code == 200) {
        console.log('删除成功', res.data);
        ElMessage({
          message: '删除成功',
          type: 'success',
        })
      }
      else {
        console.log('删除失败', res.data);
        ElMessage({
          message: '删除失败',
          type: 'error',
        })
      }
      //重新渲染数据
      this.getSpuList()

    },
    //取消删除
    cancelDel() {
      ElMessage({
        message: '取消删除',
        type: 'warning',
      })
    }

  },
}
</script>

<style scoped>
.spu_all {
  margin-top: 70px;
  margin-left: 30px;
  margin-right: 30px;
}

.select {
  font-weight: bold;
  margin-left: 10px;
  display: flex;
  align-items: center;
}
</style>
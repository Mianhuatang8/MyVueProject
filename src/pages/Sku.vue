<template>
  <div class="sku_all">
    <el-table ref="skuTableRef" :data="skuTableData" style="width: 100%;" stripe v-loading="isLoading">
      <!-- 序号 -->
      <el-table-column label="序号" width="60">
        <template #default="scope">
          <span style="margin-left: 10px">{{ (pages.currentPage - 1) * pages.pageLen + scope.$index + 1 }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="skuName" label="名称" width="190"></el-table-column>
      <el-table-column prop="skuDesc" label="描述" width="300"></el-table-column>
      <el-table-column label="默认图片" width="170">
        <template #default="imgScope">
          <img :src="imgScope.row.skuDefaultImg" alt="" style="width: 140px; height: 100px" />
        </template>
      </el-table-column>
      <el-table-column prop="weight" label="重量" width="130"></el-table-column>
      <el-table-column prop="price" label="价格" width="130"></el-table-column>

      <!-- <el-table-column v-for="p in skuTableLabel" :key="p.filed" :label="p.label" :width="p.width"
          :prop="p.filed"></el-table-column> -->

      <!-- 操作按钮 -->
      <el-table-column fixed="right" label="操作" width="230">
        <template #default="saleScope">
          <!-- 商品已经上架 点击按钮下架 -->
          <el-button type="success" size="small" v-if="saleScope.row.isSale"
            @click="removeOnSale(saleScope.row.id)"><el-icon>
              <Check />
            </el-icon></el-button>
          <!-- 商品已经下架 点击按钮上架 -->
          <el-button type="success" size="small" v-if="!saleScope.row.isSale" @click="onSale(saleScope.row.id)"><el-icon>
              <CloseBold />
            </el-icon></el-button>
          <!-- 商品详情 -->
          <el-button type="info" size="small" @click="displaySale(saleScope.row.id)"><el-icon>
              <Warning />
            </el-icon></el-button>
          <!-- 编辑 -->
          <el-button type="danger" size="small" @click="editSale(saleScope.row.id)"><el-icon>
              <EditPen />
            </el-icon></el-button>
          <!-- 删除 -->
          <el-popconfirm width="220" confirm-button-text="确定" cancel-button-text="取消" icon-color="#626AEF"
            title="确定删除该商品吗" @confirm="deleteSale(saleScope.row.id)" @cancel="cancleDel">
            <template #reference>
              <el-button type="primary" size="small"><el-icon>
                  <Delete />
                </el-icon></el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页条 -->
    <el-pagination v-model:current-page="pages.currentPage" v-model:page-size="pages.pageLen" :disabled="false"
      :background="false" layout="prev, pager, next, jumper" :total="pages.total" @current-change="handleCurrentChange"
      style="margin-top: 10px;" />


    <!-- 右边抽屉 -->
    <el-drawer :show-close="false" size="50%" v-model="isDrawerShow" class="drawer">
      <el-row>
        <el-col :span="5">名称</el-col><el-col :span="16">{{ drawerData.skuName }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">描述</el-col><el-col :span="16">{{ drawerData.skuDesc }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">价格</el-col><el-col :span="16">{{ drawerData.price }}元</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">平台属性</el-col>
        <el-col :span="16">
          <el-tag  type="success" v-for="p in drawerData.skuAttrValueList" :key="p.id">{{ p.attrId }}-{{ p.valueId }}</el-tag>
   
      </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">商品图片</el-col>
        <el-col :span="16">
            <!-- 走马灯 -->
          <el-carousel height="150px">
            <el-carousel-item v-for="p in drawerData.skuImageList" :key="p.id">
              <img :src="p.imgUrl">
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
import { ElMessage } from 'element-plus'
import { getSkuList, onSale, downSale, displaySale, delSale } from '../api/sku'
export default {
  data() {
    return {
      //抽屉数据
      drawerData: {},
      isDrawerShow: false,
      isLoading: true,
      pages: {
        pageLen: 4,//每页数量
        currentPage: 1,//当前页面
        total: 0,//总数量
      },
      //用户表单数据
      skuTableData: [],
    }
  },
  methods: {
    //获取Sku列表
    async getSku() {
      let res = await getSkuList(this.pages.currentPage, this.pages.pageLen)
      console.log('获取sku列表', res.data.data);
      res = res.data
      this.pages.total = res.data.total
      this.skuTableData = res.data.records
      this.isLoading = false
      console.log(" skuTableData", this.skuTableData);

    },
    //分页条-当前页面数改变时触发-获取数据
    handleCurrentChange() {
      this.isLoading = true
      this.getSku()
    },
    // 上架
    async onSale(id) {
      let res = await onSale(id)
      console.log('商品上架', res.data);
      if (res.data.code == 200) {
        // this.isLoading = true
        //重新加载数据
        this.getSku()
        ElMessage({
          message: '上架成功',
          type: 'success',
        })
      }
      else {
        // this.isLoading = false
        console.log('上架失败', res);
        ElMessage({
          message: '上架失败',
          type: 'error',
        })
      }

    },
    //下架
    async removeOnSale(id) {
      // downSale(id)
      let res = await downSale(id)
      console.log('商品下架', res.data);
      if (res.data.code == 200) {
        // this.isLoading = true
        //重新加载数据
        this.getSku()
        ElMessage({
          message: '下架成功',
          type: 'success',
        })
      }
      else {
        // this.isLoading = false
        console.log('下架失败', res);
        ElMessage({
          message: '下架失败',
          type: 'error',
        })
      }
    },
    //修改商品内容
    editSale(id) {
      ElMessage({
        message: '正在开发中',
        type: 'info',
      })
      console.log('当前打算修改的商品的id:', id)
    },
    //显示商品细节
    async displaySale(id) {
      let res = await displaySale(id)
      console.log('当前商品的商品详情:', res.data.data);
      this.drawerData = res.data.data
      this.isDrawerShow = true

    },
    //删除商品
    async deleteSale(id) {
      console.log('输出id:', id);
      let res = await delSale(id)
      console.log('删除商品', res.data);
      if (res.data.code == 200) {
        this.isLoading = true
        //重新加载数据
        this.getSku()
        console.log('删除成功', res);
        ElMessage({
          message: '删除成功',
          type: 'success',
        })
      }
      else {
        this.isLoading = false
        console.log('删除失败', res);
        ElMessage({
          message: '删除失败',
          type: 'error',
        })
      }

    },
    // 取消删除
    cancleDel() {
      ElMessage({
        message: '取消删除',
        type: 'warning',
      })
    },
  },
  mounted() {
    this.getSku();
  }

}
</script>

<style scoped lang="less">
.sku_all {
  margin-top: 60px;
  margin-left: 30px;
  margin-right: 30px;
}
  .el-row{
    margin-bottom: 24px;
    font-size: 18px;
    // text-align:right;

  }
  .el-col{
    margin-left: 5px;
  }
  .el-tag{
    margin-right: 5px;
    font-size: 16px;
  }
</style>
<template>
  <div class="pingtai_all">
    <!-- 分类选择器卡片 -->
    <el-card style="width: 100%;height: 100px;margin-bottom: 20px;">
      <CascaderSelect @getCategory3IdAttr="getCategory3IdAttr"></CascaderSelect>
    </el-card>

    <!-- 属性表单 -->
    <el-card style="width: 100%;">
      <!-- :disabled="isDisable" -->
      <div v-show="isShowTable">
        <el-button type="primary" @click="addAttr">+添加属性</el-button>
        <el-table ref="pingtaiTableRef" :data="pingtaiTableData" style="width: 100%;" stripe v-loading="isLoading">
          <!-- 序号 -->
          <el-table-column label="序号" width="100">
            <template #default="scope">
              <span style="margin-left: 10px">{{ (pages.currentPage - 1) * pages.pageLen + scope.$index + 1 }}</span>
            </template>
          </el-table-column>

          <el-table-column label="属性名称" :width="250" prop="attrName"></el-table-column>
          <el-table-column label="属性值列表" :width="520">
            <template v-slot="attrScope">
              <el-tag v-for="p in attrScope.row.attrValueList" :key="p.idList" style="margin-right:8px">{{ p.valueName
              }}</el-tag>
            </template>
          </el-table-column>
          <!-- 操作按钮 -->
          <el-table-column fixed="right" label="操作" width="300">
            <template #default="opotionScope">
              <el-button type="warning" @click="editAttr(opotionScope.row)"><el-icon>
                  <EditPen />
                </el-icon></el-button>
              <el-button type="danger" @click="deleteAttrInfo(opotionScope.row)"><el-icon>
                  <Delete />
                </el-icon></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>


      <!-- 添加/编辑属性 -->
      <div v-show="!isShowTable">
        <el-form :inline="true" ref="form" label-width="80px" :model="attrInfo">
          <el-form-item label="属性名">
            <el-input placeholder="请输入属性名" v-model="attrInfo.attrName"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" @click="addAttrValue" :disabled="showBtn">+添加属性值</el-button>
        <el-button @click="cancelAddAttrValue">取消</el-button>
        <el-table style="width: 100%; margin: 20px 0px" border :data="attrInfo.attrValueList">
          <el-table-column align="center" type="index" label="序号" width="80">
          </el-table-column>
          <el-table-column width="700" label="属性值名称">
            <template v-slot="attrScope">
              <!-- isChangeSpan一开始是为undefined -->
              <!-- 这里结构需要用到span与input进行来回的切换 -->
              <el-input v-model="attrScope.row.valueName" placeholder="请输入属性值名称" v-if="attrScope.row.isChangeInput"
                :ref="attrScope.$index" @keyup.enter="toLook(attrScope.row, attrScope.$index)"
                @blur="toLook(attrScope.row, attrScope.$index)"></el-input>
              <!-- @blur="toLook(row)" -->
              <span v-else style="display: block" :ref="attrScope.$index"
                @click="toEdit(attrScope.row, attrScope.$index)">{{ attrScope.row.valueName }}</span>
            </template>
          </el-table-column>

          <el-table-column fixed="right" width="393" label="操作">
            <template v-slot="optionsAttrScope">
              <el-popconfirm :title="`确定删除吗?`" confirm-button-text="确定" cancel-button-text="取消"
                @confirm="deleteAttrValue(optionsAttrScope.row, optionsAttrScope.$index)" @cancel="cancelDel">
                <template #reference>
                  <el-button type="danger"><el-icon>
                      <Delete />
                    </el-icon></el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" @click="addOrUpdateAttr">保存</el-button>
        <el-button @click="isShowTable = true">取消</el-button>
      </div>

    </el-card>



  </div>
</template>

<script>
//按需引入lodash当中的深拷贝
import cloneDeep from "lodash/cloneDeep";

import { ElMessage } from 'element-plus'
import CascaderSelect from '../components/CascaderSelect.vue'
import { getAttrList, delAttr, saveUpdateAttr } from '../api/pingtaiAttr'
import { reactive } from 'vue'
export default {
  components: {
    CascaderSelect
  },
  data() {
    return {
      showBtn: false,
      isShowTable: true,
      isLoading: false,
      searchObj: {
        // category3Id: '',
      },
      isLoading: false,
      pages: {
        pageLen: 5,//每页数量
        currentPage: 1,//当前页面
        total: 0,//总数量
      },
      pingtaiTableData: [],
      selectvalue: '',
      //收集新增属性|修改属性使用的
      attrInfo: reactive({
        attrName: '',
        attrValueList: [],
        categoryId: 0,
        categoryLevel: 0
      }),
    }
  },
  methods: {
    //根据三级分类的id获取属性列表数据
    // 接收子组件传递过来的三级分类的id
    getCategory3IdAttr(value) {
      console.log('父组件接收子组件传递过来的getCategory3Id:', value);
      this.searchObj = value
     
      this.isLoading = true
      this.getAttrList()
    },
    //根据三级分类的id获取属性列表数据
    async getAttrList() {
      let res = await getAttrList(this.searchObj)
      console.log('根据分类获取的数据:', res.data);
      res = res.data
      this.pingtaiTableData = res.data
      // this.attrInfo.categoryId=this.searchObj.category3Id
      this.isLoading = false
    },
    //编辑属性
    editAttr(row) {
      // editAttr(opotionScope.row)
      console.log('当前编辑的属性:', row);
      // 直接赋值不进行拷贝会出现没有保存修改时返回属性页面会看到还是修改了
      // this.attrInfo=row
      //对当前数据进行深拷贝
      this.attrInfo = cloneDeep(row)
      console.log('当前编辑的属性attrInfo', this.attrInfo);
      this.isShowTable = false
    },
    //保存对属性的修改
    async addOrUpdateAttr() {
      console.log('保存对属性值的修改addrInfo', this.attrInfo);
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter((p) => {
        delete p.isChangeInput
        return true
      })
      console.log('加工后属性值addrInfo', this.attrInfo);
      let result = await saveUpdateAttr(this.attrInfo)
      console.log('保存数据发起请求', result.data);
      if (result.data.code == 200) {
        ElMessage({
          message: '成功保存',
          type: 'success',
        })
      } else {
        ElMessage({
          message: result.data.message ? result.data.data : '保存失败',
          type: 'error',
        })
      }
      this.isShowTable = true
      //重新获取数据
      this.isLoading = true
      this.getAttrList()
      //清空表单数据
      this.attrInfo.attrName = ''
      this.attrInfo.categoryId = 0
      this.attrInfo.attrValueList = []
      this.attrInfo.categoryLevel = 0
    },
    //删除属性
    async deleteAttrInfo(row) {
      console.log('id', row);
      let res = await delAttr(row.id)
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
          message: res.data.message ? res.data.message : '删除失败',
          type: 'error',
        })
      }
      //重新渲染数据
      this.getAttrList()

      // ElMessage({
      //   message: '正在开发中',
      //   type: 'info',
      // })

    },
    //添加属性
    addAttr() {
      this.isShowTable = false
      //收集三级分类的id
      this.attrInfo.categoryId=this.searchObj.category3Id,
      this.attrInfo.categoryLevel=3
      this.attrInfo.attrName='',
      this.attrInfo.attrValueList=[]
    },

    //删除属性值(点击编辑里面的)
    deleteAttrValue(value, index) {
      //当前删除属性值的操作是不需要发请求的
      console.log('输出value:', value, index);
      //第一个参数代表从哪个位置开始
      // 第二个参数代表删除几个元素
      console.log(this.attrInfo);
      //列表数据是一行一行获取的, this.attrInfo直接得到该行的所有数据
      this.attrInfo.attrValueList.splice(index, 1)
      ElMessage({
        message: '成功删除',
        type: 'success',
      })
    },
    // 编辑属性值
    toEdit(row, index) {
      console.log('编辑属性值', row, index);
      row.isChangeInput = true
      //实现聚焦
      this.$nextTick(() => {
        //直接将下标作为ref用以标记
        this.$refs[index].focus();
      })
    },
    //失去焦点
    toLook(row, index) {
      console.log('失去焦点:', row, index);
      // 如果属性值为空不能作为新的属性值，需要给用户提示，让他输入一个其他的属性值
      if (row.valueName.trim() == '') {
        ElMessage({
          message: '请输入一个正常的属性值',
          type: 'error',
        })
        return;
      }
      //新增的属性值不能与已有的属性值重复，some:一真则真
      let repeat = this.attrInfo.attrValueList.some((p) => {
        if (p != row) {
          return p.valueName == row.valueName
        }
      })
      if (repeat) {
        ElMessage({
          message: '属性值相同,不能重复添加',
          type: 'error',
        })
        row.valueName = ''
        return
      }
      else {
        row.isChangeInput = false
        this.showBtn = false
      }
    },
    // 取消添加属性值
    cancelAddAttrValue() {
      this.showBtn = false
      ElMessage({
        message: '取消添加一个新的属性值',
        type: 'info',
      })
      this.attrInfo.attrValueList.splice(this.attrInfo.attrValueList.length - 1, 1)
    },
    //添加属性值
    addAttrValue() {
      this.showBtn = true
      //像数组中追加一个新的属性
      this.attrInfo.attrValueList.push({
        // id:'',
        isChangeInput: true,
        valueName: '',
        attrId: this.attrInfo.id
      })
      this.$nextTick(() => {
        this.$refs[this.attrInfo.attrValueList.length - 1].focus();
      });
    },
    //取消删除
    cancelDel() {
      ElMessage({
        message: '取消删除',
        type: 'warning',
      })
    }
  }
}
</script>

<style scoped>
.pingtai_all {
  margin-top: 70px;
  margin-left: 30px;
  margin-right: 30px;
}

.select {
  font-weight: bold;
  margin-left: 10px;
}
</style>
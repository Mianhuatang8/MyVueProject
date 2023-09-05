<template>
  <div class="menu_all">
    <!-- expand-row-keys:可以通过该属性设置Table目前的展开行，需要设置row-key属性才能使用，该属性为展开行的keys数组。 -->
    <el-table ref="menuTableRef" :data="menuTableData" style="width: 100%;" stripe 
      :expand-row-keys="expandKeys" row-key="id" >
      <!-- 下拉 -->
      <el-table-column label="名称" prop="name" width="250">
      </el-table-column>
      <el-table-column label="权限值" prop="code" width="250">
      </el-table-column>
      <el-table-column label="跳转权限值" prop="toCode" width="250">
      </el-table-column>

      <!-- 操作按钮 -->
      <el-table-column fixed="right" label="操作" width="400">
        <template #default="option">
          <el-tooltip content="添加菜单" placement="bottom" effect="light">
            <el-button type="primary" :disabled="option.row.level == 4" @click="addMenu(option.row)"><el-icon>
                <Plus />
              </el-icon></el-button>
          </el-tooltip>

          <el-tooltip content="修改菜单" placement="bottom" effect="light">
            <el-button type="danger" :disabled="option.row.level == 1" @click="editMenu(option.row)"><el-icon>
                <EditPen />
              </el-icon></el-button>
          </el-tooltip>

          <el-tooltip content="删除菜单" placement="bottom" effect="light">
            <el-button type="primary" :disabled="option.row.level == 1" @click="delMenu(option.row)"
              :loading="loading"><el-icon>
                <Delete />
              </el-icon></el-button></el-tooltip>
        </template>
      </el-table-column>
    </el-table>


    <!-- 添加/修改菜单 -->
    <el-dialog v-model="dialogPermissionVisible" :title="dialogTitle" @close="resetData">
      <el-form ref="permission" :model="permission" label-width="120px">
        <el-form-item label="父级名称" v-if="permission.level > 2 && !permission.id">
          <el-input :value="permission.pname" disabled />
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="permission.name" />
        </el-form-item>

        <el-form-item label="功能权限值" prop="code">
          <el-input v-model="permission.code" />
        </el-form-item>

        <el-form-item label="跳转路由权限值" prop="toCode" v-if="permission.level === 4">
          <el-input v-model="permission.toCode" />
        </el-form-item>
      </el-form>
      <!-- 底部按钮 -->
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="resetData">取消</el-button>
          <el-button type="primary" @click="savePermission">确定</el-button>
        </span>
      </template>
    </el-dialog>

  </div>
</template>

<script>
import { ElMessage } from 'element-plus'
import { getMenuList, deleteMenu, addMenu, editMenu } from '../api/menu'
export default {
  data() {
    return {
      //菜单列表数据
      // isMenuLoading: true,
      menuTableData: [],
      expandKeys: [],
      //删除按钮加载
      loading: false,
      //收集增加/修改菜单的数据
      dialogPermissionVisible: false,
      // dialogTitle: '修改菜单',
      permission: {
        code: '',//权限值
        level: 1,//第几层
        name: '',//名称
        toCode: '',//跳转权限值
      },
      type: 'add'
    }
  },
  computed: {
    //动态得出标题名称
    dialogTitle() {
      if (this.type == 'edit') {
        return this.permission.level != 4 ? '修改菜单' : '修改功能'
      } else {
        if (this.permission.level == 2) {
          return '添加一级菜单'
        } else if (this.permission.level == 3) {
          return '添加二级菜单'
        } else return '添加功能'
      }
    }
  },
  methods: {
    //获取菜单数据
    async getMenuList() {
      let res = await getMenuList()
      console.log('获取菜单列表的数据', res.data);
      this.menuTableData = res.data.data.children
      console.log(' this.menuTableData', this.menuTableData);
      // this.expandKeys = this.setExpandKeys(this.menuTableData)
      this.expandKeys= [this.menuTableData[0].id]
      // console.log(' this.expandKeys', this.expandKeys);
      // this.isMenuLoading = false
      console.log('当前的展开行expandKeys',this.expandKeys);
    },
    //设置目前的展开行
    setExpandKeys(data, initId = []) {
      return data.reduce((prev, p) => {
        if (p.children && p.level == 4) {
          prev.push(p.id)
        } else if (p.children) {
          this.setExpandKeys(p.children, initId)
        }
        return prev
      }, initId)
    },
    //删除菜单
    async delMenu(row) {
      this.loading = true
      console.log('准备删除的菜单的数据', row);
      let res = await deleteMenu(row.id)
      console.log('删除菜单', res.data);
      this.loading = false
      if (res.data.code == 20000) {
        ElMessage({
          message: '删除成功',
          type: 'success',
        })
      } else {
        ElMessage({
          message: res.data.message ? res.data.message : '删除失败',
          type: 'error',
        })
      }
      //重新加载数据
      this.getMenuList()
    },
    //修改菜单
    async editMenu(row) {
      this.type = 'edit'
      this.dialogPermissionVisible = true
      console.log('准备修改的菜单的数据', row);
      this.permission = { ...row }//浅拷贝
    },
    //添加菜单
    async addMenu(row) {
      this.type = 'add'
      console.log('准备在该菜单上添加新的菜单', row);
      this.permission.pid = row.id
      this.permission.level = row.level + 1
      this.permission.pname = row.name//父级名称
      this.dialogPermissionVisible = true
    },

    // 确定保存修改/新增
    async savePermission() {
      let res
      //保存修改
      this.dialogPermissionVisible = false
      console.log('保存传递的数据', this.permission);
      if (this.type == 'edit') {
        res = await editMenu(this.permission)
        console.log('发起请求-修改菜单', res.data);
      } else {
        delete this.permission.pname
        console.log('加工后',this.permission);
        res = await addMenu(this.permission)
        console.log('发起请求-添加菜单', res.data);
      }
      if (res.data.code == 20000) {
        ElMessage({
          message: '保存成功',
          type: 'success',
        })
        //重新获取数据
        // this.isMenuLoading = true
        this.getMenuList()
        this.expandKeys=[this.permission.id]
      } else {
        ElMessage({
          message: res.data.message ? res.data.message : '保存失败',
          type: 'error',
        })
      }
    },
    //重置数据
    resetData() {
      this.dialogPermissionVisible = false
      this.permission = {
        level: 0,
        name: '',
        code: '',
        toCode: ''
      }
    },
  },
  mounted() {
    this.getMenuList()
  }

}
</script>

<style scoped>
.menu_all {
  margin-top: 60px;
  margin-left: 30px;
  margin-right: 30px;
}

.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>

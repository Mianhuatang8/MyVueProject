<template>
  <div class="juese_all" v-if="isShowRoleTable">
    <!-- 搜索部分 -->
    <el-row style="margin-bottom: 10px;">
      <el-col :span="20">
        <el-input v-model="searchObj.roleName" placeholder="角色名称" style="width: 150px;margin-right: 10px;" />
        <el-button type="primary" @click="searchRole">
          <el-icon>
            <Search />
          </el-icon>查询</el-button>
        <el-button @click="clearInput">清空</el-button>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" @click="addRoles">添加</el-button>
        <el-button type="danger" @click="deleteSomeRole" :disabled="idList.length == 0">批量删除</el-button></el-col>
    </el-row>

    <!-- 用户表单数据 -->
    <el-table ref="jueseTableRef" :data="jueseTableData" style="width: 100%;" stripe @select="selectionChange"
      @select-all="selectionChange" v-loading="isLoading">
      <!-- 勾选按钮 -->
      <el-table-column type="selection" width="55" />
      <!-- 序号 -->
      <el-table-column label="序号" width="150">
        <template #default="scopeR">
          <span style="margin-left: 10px">{{ (pages.currentPage - 1) * pages.pageLen + scopeR.$index + 1 }}</span>
        </template>
      </el-table-column>

      <!-- prop="roleName" -->
      <el-table-column label="角色名称" :width="600">
        <template v-slot="roleChange">
          <template v-if="roleChange.row.isroleEdit">
            <el-input v-model="roleChange.row.roleName" class="edit-input" size="small" />
            <el-button class="cancel-btn" size="small" type="warning"
              @click="roleChange.row.isroleEdit = !roleChange.row.isroleEdit">取消</el-button>
          </template>
          <span v-else>{{ roleChange.row.roleName }}</span>
        </template>
      </el-table-column>


      <!-- 操作按钮 -->
      <el-table-column fixed="right" label="操作" width="400">
        <template #default="roleScope">
          <!-- 分配角色 -->
          <el-tooltip content="分配权限" placement="bottom" effect="light">
            <el-button link type="info" @click="setRole(roleScope.row)"><el-icon>
                <User />
              </el-icon></el-button>
          </el-tooltip>
          <!-- 修改用户 -->
          <el-tooltip content="确认修改" placement="bottom" effect="light" v-if="roleScope.row.isroleEdit">
            <el-button link type="success" @click="confirmRole(roleScope.row)">
              <el-icon>
                <Check />
              </el-icon>
            </el-button>
          </el-tooltip>

          <el-tooltip content="修改角色" placement="bottom" effect="light" v-if="!roleScope.row.isroleEdit">
            <el-button link type="danger" @click="roleScope.row.isroleEdit = !roleScope.row.isroleEdit"><el-icon>
                <EditPen />
              </el-icon></el-button>
          </el-tooltip>
          <!-- 删除用户 -->
          <!-- 弹出气泡框-选择是否确定删除 -->
          <el-popconfirm width="220" confirm-button-text="确定" cancel-button-text="取消" icon-color="#626AEF" title="确定删除吗"
            @confirm="deleteRole(roleScope.row.id)" @cancel="cancelDel">
            <template #reference>
              <el-button link type="primary"><el-icon>
                  <Delete />
                </el-icon></el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 底部内容-分页条 清空按钮 -->
    <el-row style="margin-top: 20px;">
      <el-col :span="15">
        <el-button @click="clearSelection">清空选中内容</el-button></el-col>
      <!-- 分页条 -->
      <el-col :span="8">
        <el-pagination v-model:current-page="pages.currentPage" v-model:page-size="pages.pageLen" :disabled="false"
          :background="false" layout="prev, pager, next, jumper" :total="pages.total"
          @current-change="handleCurrentChange" />
      </el-col>
    </el-row>
    <!-- 添加对话框 -->
    <el-dialog v-model="addDialogVisible" title="添加角色">
      <el-form :model="addForm" label-width="120px">
        <el-form-item label="请输入新名称">
          <el-input v-model="addForm.roleName" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveRole">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
  <!-- 分配权限-使用树形控件 -->
  <div class="juese_all" v-if="!isShowRoleTable">
    <el-input disabled :value="roleInfo.roleName"></el-input>
    <!-- default-expand-all:是否默认展开所有节点 -->
    <!--node-key： 每个树节点用来作为唯一标识的属性，整棵树应该是唯一的 -->
    <el-tree :data="treeData" show-checkbox node-key="id" :default-expand-all="true" :props="defaultProps"
      :getCheckedKeys="getCheckedKeys" ref="tree" />
    <el-button type="primary" @click="saveRoleMenu">保存</el-button>
    <el-button @click="isShowRoleTable = !isShowRoleTable">取消</el-button>
  </div>
</template>

<script>
import { getRoles, delSomeRole, addRole, delRole, editRole, getRoleMenu, updateRoleMenu } from '../api/roleManage'
import { ElMessage } from 'element-plus'
export default {
  data() {
    return {
      //当前角色的信息
      roleInfo: {},
      //树形控件数据-当前角色的权限列表
      treeData: [],
      defaultProps: {
        children: 'children',//指定子树为节点对象的某个属性值
        label: 'name',//指定节点标签为节点对象的某个属性值
      },
      permissionId: [],//被选中的权限的id



      isShowRoleTable: true,
      //修改角色
      addDialogVisible: false,
      addForm: {
        roleName: '',
      },
      searchObj: {
        roleName: '',
      },
      isLoading: true,
      //角色列表
      jueseTableData: [],
      pages: {
        pageLen: 8,//每页数量
        currentPage: 1,//当前页面
        total: 0,//总数量
      },
      //批量删除用户的id列表
      idList: [],
    }
  },
  methods: {
    //点击分配权限
    async setRole(row) {
      this.isShowRoleTable = false
      console.log('当前准备分配权限的用户的信息roleInfo/row：', row);
      this.roleInfo = row
      //获取当前角色的权限列表
      let res1 = await getRoleMenu(row.id)
      console.log('发起请求获取当前角色的权限菜单', res1.data);
      this.treeData = res1.data.data.children
      console.log('treeData', this.treeData);
      //获取被选中节点的id列表
      const checkedIds = this.getCheckedIds(this.treeData)
      console.log('获取当前被选中节点的id', checkedIds);
      //设置目前选中的节点：setCheckedKeys(keys)
      this.$refs.tree.setCheckedKeys(checkedIds)

    },
    //获取被选中节点的id列表
    getCheckedIds(data, initArr = []) {
      // 使用 reduce() 方法来遍历 data 数组的每个元素，对数组中的元素进行累积处理，并返回累积结果
      // initArr 是一个可选的初始数组，用于存储最终结果
      // p（累积器）和 prev（当前数组元素）
      return data.reduce((prev, p) => {
        if (p.select && p.level === 4) {
          prev.push(p.id)
        } else if (p.children) {
          this.getCheckedIds(p.children, initArr)
        }
        // 在每次迭代结束时，返回累积器 prev，以便作为下一次迭代的累积器值。
        return prev
      }, initArr)
    },
    //保存对角色权限的分配
    async saveRoleMenu() {
      // getCheckedKeys():若节点可用被选中 (show-checkbox 为 true), 它将返回当前选中节点 key 的数组
      const ids = this.$refs.tree.getCheckedKeys().join(",")
      console.log('ids', ids);
      console.log('this.roleInfo.id',this.roleInfo);
      let res2 = await updateRoleMenu(this.roleInfo.id, ids)
      console.log('保存对角色权限的分配', res2.data);
      this.isShowRoleTable =true
      if (res2.data.code == 20000) {
        ElMessage({
          message: '分配权限成功',
          type: 'success',
        })
      }else {
        ElMessage({
          message: res2.data.message ? res2.data.message : '分配权限失败',
          type: 'error',
        })
      }
    },


    //获取角色分页列表(带搜索)
    async getRole() {
      let res = await getRoles(this.pages.currentPage, this.pages.pageLen, this.searchObj)
      res = res.data//返回来的用户数据
      console.log('获取用户信息', res.data)
      this.isLoading = false
      this.pages.total = res.data.total
      this.jueseTableData = res.data.items
    },
    //查询角色
    searchRole() {
      this.searchObj = this.searchObj
      this.isLoading = true
      this.getRole()
    },
    // 清空查询
    clearInput() {
      this.searchObj.roleName = '';
      this.isLoading = true
      this.getRole()
    },
    //分页条-当前页面数改变时触发-获取数据
    handleCurrentChange() {
      this.isLoading = true
      this.getRole()
    },
    //清空选中角色按钮
    clearSelection() {
      this.$refs.jueseTableRef.clearSelection()
      this.idList = []
      // console.log('idList:',this.idList);
    },
    //当用户勾选时触发
    selectionChange(selection) {
      console.log('selection', selection);
      // selection.map(item => item.id)
      this.idList = selection.map((p) => {
        return p.id
      })
      console.log('当前的id列表:', this.idList);
    },
    //批量删除用户
    deleteSomeRole() {
      delSomeRole(this.idList).then((res) => {
        console.log('批量删除用户', res);
        if (res.data.code == 20000) {
          ElMessage({
            showClose: true,
            message: '删除成功',
            type: 'success',
          })
          //重新加载数据
          this.isLoading = true
          //重新加载数据
          this.getRole()
        }
        else {
          // console.log('批量删除失败', res.data);
          ElMessage({
            showClose: true,
            message: res.data.message ? res.data.message : '删除失败',
            type: 'error',
          })
        }

      })


    },
    //点击添加角色
    addRoles() {
      this.addDialogVisible = true

    },
    //保存角色-成功添加
    async saveRole() {
      this.addDialogVisible = false
      let res = await addRole(this.addForm)
      console.log('新增用户返回结果', res.data);
      this.addDialogVisible = false
      //   //重新获取表单数据
      this.isLoading = true
      this.getRole()
      this.addForm = {}//重置新增表单数据
    },
    //确认修改
    confirmRole(value) {
      value.isroleEdit = false
      console.log('确认修改', value);
      //保存修改-发送请求
      editRole({ id: value.id, roleName: value.roleName }).then((res) => {
        console.log('111', res)
        if (res.data.code == 20000) {
          ElMessage({
            showClose: true,
            message: '修改成功',
            type: 'success',
          })
          //重新加载数据
          // this.isLoading = true
          //重新加载数据
          // this.getRole()
        }
        else {
          // console.log('批量删除失败', res.data);
          ElMessage({
            showClose: true,
            message: '修改失败',
            type: 'error',
          })
        }

      })


    },
    //取消删除
    cancelDel() {
      ElMessage({
        message: '取消删除',
        type: 'warning',
      })

    },
    //删除角色
    async deleteRole(id) {
      console.log('输出id:', id);
      let res = await delRole(id)
      if (res.data.code == 20000) {
        this.isLoading = true
        //重新加载数据
        this.getRole()
        console.log('删除成功', res);
        ElMessage({
          message: '删除成功',
          type: 'success',
        })
      }
      else {
        console.log('删除失败', res);
        ElMessage({
          message: '删除失败',
          type: 'error',
        })
      }
    },
  },
  mounted() {
    this.getRole()

  },

}
</script>

<style scoped>
.juese_all {
  margin-top: 60px;
  margin-left: 30px;
  margin-right: 30px;

}

.edit-input {
  padding-right: 250px;
}

.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>
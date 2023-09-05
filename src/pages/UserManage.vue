<template>
  <div class="user_all">
    <!-- 搜索及按钮 -->
    <el-row style="margin-bottom: 10px;">
      <el-col :span="20">
        <el-input v-model="searchObj.username" placeholder="用户名" style="width: 150px;margin-right: 10px;" />
        <el-button type="primary" @click="searchUser"><el-icon>
            <Search />
          </el-icon>查询</el-button>
        <el-button @click="clearInput">清空</el-button>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" @click="addUser">添加</el-button>
        <el-button type="danger" round @click="deleteSome" :disabled="idList.length == 0">批量删除</el-button></el-col>

    </el-row>
    <!-- 用户表单数据 -->
    <el-row>
      <el-table ref="userTableRef" :data="userTableData" style="width: 100%;" stripe v-loading="isLoading"
        @select="selectionChange" @select-all="selectionChange">
        <!-- 勾选按钮 -->
        <el-table-column type="selection" width="55" />
        <!-- 序号 -->
        <el-table-column label="序号" width="60">
          <template #default="scope">
            <span style="margin-left: 10px">{{ (pages.currentPage - 1) * pages.pageLen + scope.$index + 1 }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="username" label="用户名" width="150" />
        <el-table-column prop="nickName" label="用户昵称" width="150" />
        <el-table-column prop="roleName" label="权限列表" width="250" />
        <el-table-column prop="gmtCreate" label="创建时间" width="170" />
        <el-table-column prop="gmtModified" label="更新时间" width="160" />

        <!-- 操作按钮 -->
        <el-table-column fixed="right" label="操作" width="220">
          <template #default="slotScope">
            <!-- 分配角色 -->
            <el-tooltip content="分配角色" placement="bottom" effect="light">
              <el-button link type="info" @click="setRoleItem(slotScope.row)"><el-icon>
                  <User />
                </el-icon></el-button>
            </el-tooltip>
            <!-- 修改用户 -->
            <el-tooltip content="修改用户" placement="bottom" effect="light">
              <el-button link type="danger" @click="editItem(slotScope.row)"><el-icon>
                  <EditPen />
                </el-icon></el-button>
            </el-tooltip>
            <!-- 删除用户 -->
            <!-- 弹出气泡框-选择是否确定删除 -->
            <el-popconfirm width="220" confirm-button-text="确定" cancel-button-text="取消" icon-color="#626AEF" title="确定删除吗"
              @confirm="deleteItem(slotScope.row.id)" @cancel="cancleDel">
              <template #reference>
                <el-button link type="primary"><el-icon>
                    <Delete />
                  </el-icon></el-button>
              </template>
            </el-popconfirm>

          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <!-- 底部内容-分页条 清空按钮 -->
    <el-row style="margin-top: 20px;">
      <el-col :span="15">
        <el-button @click="clearSelection()">清空选中内容</el-button></el-col>
      <!-- 分页条 -->
      <el-col :span="8">
        <el-pagination v-model:current-page="pages.currentPage" v-model:page-size="pages.pageLen" :disabled="false"
          :background="false" layout="prev, pager, next, jumper" :total="pages.total"
          @current-change="handleCurrentChange" />
      </el-col>
    </el-row>

    <!-- 添加对话框 -->
    <!-- 添加用户 修改用户 -->
    <!-- autocomplete="off" -->
    <el-dialog v-model="dialogUserFormVisible" :title="type == 'add' ? '新增用户' : '修改用户'">
      <el-form :model="newUserForm">
        <el-form-item label="用户名" :label-width="80">
          <el-input v-model="newUserForm.username" autocomplete="off" />
        </el-form-item>
        <el-form-item label="用户昵称" :label-width="80">
          <el-input v-model="newUserForm.nickName" autocomplete="off" />
        </el-form-item>
        <el-form-item label="用户密码" :label-width="80" v-if="type == 'add'">
          <el-input v-model="newUserForm.password" autocomplete="off" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogUserFormVisible = false">取消</el-button>
          <el-button type="primary" @click="saveUser()">保存</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 对话框-设置角色 -->
    <el-dialog v-model="dialogRoleFormVisible" title="设置角色">
      <el-form :model="roleInfo">
        <el-form-item label="用户名" :label-width="80">
          <el-input v-model="roleInfo.username" :disabled="true" />
        </el-form-item>
        <el-form-item label="角色" :label-width="80">
          <!-- 全选按钮的（checkAll）返回值是布尔值 -->
          <el-checkbox v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
          <el-checkbox-group v-model="checkedRoles" @change="handleCheckedRoleChange">
            <!-- checkedRoles返回的是label传递的值 -->
            <el-checkbox v-for="role in roleForm" :key="role.id" :label="role.id">{{ role.roleName }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>

      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogRoleFormVisible = false">取消</el-button>
          <el-button type="primary" @click=" saveRoleItem()">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ElMessage } from 'element-plus'
import { getUsers, delUserItem, addUser, editUserItem, delSomeUserItem, searchSome, getUserRole, saveUserRole } from '../api/userManage'
export default {
  data() {
    return {
      //设置角色
      dialogRoleFormVisible: false,
      roleInfo: {},
      roleForm: [],//获取全部角色列表
      oneRoleForm: [],//某个用户的角色列表
      checkedRoles: [],
      checkAll: false,

      type: 'add',//add:新增 edit:修改
      dialogUserFormVisible: false,//弹出修改用户 添加用户对话框
      isLoading: true,//加载
      searchObj: {
        username: '',//搜索输入框
      },
      pages: {
        pageLen: 5,//每页数量
        currentPage: 1,//当前页面
        total: 0,//总数量
      },
      //用户表单数据
      userTableData: [],
      //新增用户对话
      newUserForm: {},
      //勾选的用户id列表
      idList: []
    }
  },
  methods: {
    //全选按钮发生变化
    handleCheckAllChange(value) {
      console.log('全选按钮发生变化', value);
      if (value) {
        const allRoleIds = [];
        this.roleForm.map((p) => {
          allRoleIds.push(p.id)
        })
        console.log('全部角色列表的id：', allRoleIds);
        this.checkedRoles = allRoleIds
      }
      else{
        this.checkedRoles=[]
      }


    },
    //角色按钮发生变化
    handleCheckedRoleChange(value) {
      // value收集的是label传递的内容
      console.log('角色按钮发生变化', value);
      console.log('checkedRoles', this.checkedRoles);
    },
    //获取某个用户的权限列表(角色)和全部角色列表
    async getOneRole(id) {
      let res = await getUserRole(id)
      console.log('得到某个角色的权限列表', res.data);
      //全部角色列表
      this.roleForm = res.data.data.allRolesList
      //某个用户的角色列表
      this.oneRoleForm = res.data.data.assignRoles
      // checkedRoles
      this.oneRoleForm.map((p) => {
        if (p.id) {
          this.checkedRoles.push(p.id)
        }
      })
      console.log('某个用户拥有的角色id,checkedRoles', this.checkedRoles);

    },
    //点击设置角色,弹出对话框
    setRoleItem(value) {
      //再次点击设置角色时，要先清空checkedRoles
      this.checkedRoles = []
      this.dialogRoleFormVisible = true
      this.roleInfo = value
      console.log('当前设置角色的用户信息roleInfo:', value);
      this.getOneRole(value.id)
    },
    //分配角色(权限列表)
    async saveRoleItem() {
      this.dialogRoleFormVisible = false
     
      const roleId = this.checkedRoles.join(',')
     
      console.log('this.checkedRoles', this.checkedRoles);
      console.log('roleId', roleId);
      let res1 = await saveUserRole(this.roleInfo.id,  roleId)
      console.log('保存对角色的修改', res1.data);
      if (res1.data.code == 20000) {
        ElMessage({
          message: '成功分配角色',
          type: 'success',
        })
      } else {
        ElMessage({
          message: '分配角色失败',
          type: 'error',
        })
      }
      //重新渲染数据
      this.isLoading = true
      this.getUser()
    },
    //获取用户分页列表
    async getUser() {
      let res = await getUsers(this.pages.currentPage, this.pages.pageLen)
      res = res.data//返回来的用户数据
      console.log('获取用户信息', res.data)
      this.isLoading = false
      this.pages.total = res.data.total
      this.userTableData = res.data.items
    },
    //分页条-当前页面数改变时触发-获取数据
    handleCurrentChange() {
      this.isLoading = true
      this.getUser()
    },
    //清空选中用户按钮
    clearSelection() {
      this.$refs.userTableRef.clearSelection()
      this.idList = []
      // console.log('clear2',this.idList);
    },
    // 查询用户
    async searchUser() {
      // searchSome
      this.isLoading = true
      let res = await searchSome(this.pages.currentPage, this.pages.pageLen, this.searchObj)
      console.log('搜索查询列表:', res.data);
      this.pages.total = res.data.data.total
      this.userTableData = res.data.data.items
      // console.log('查询到的数据',this.userTableData);
      this.isLoading = false
    },
    // 清空查询
    clearInput() {
      this.searchObj.username = '';
      this.isLoading = true
      this.getUser()
    },
    // 点击添加/修改用户 弹出对话框
    addUser() {
      this.type = 'add'
      this.newUserForm = {}//重置新增表单数据
      this.dialogUserFormVisible = true
    },
    //保存-新增用户
    async saveUser() {
      if (this.type == 'add') {
        console.log('新增用户-传过去的数据:', this.newUserForm);
        let res = await addUser(this.newUserForm)
        console.log('新增用户返回结果', res.data);
        this.dialogUserFormVisible = false
        //重新获取表单数据
        this.isLoading = true
        this.getUser()
        // this.newUserForm = {}//重置新增表单数据
      }
      else {
        let res = await editUserItem(this.newUserForm)
        console.log('修改用户返回的结果:', res.data);
        this.dialogUserFormVisible = false
        //重新获取表单数据
        this.isLoading = true
        this.getUser()
        // console.log('当前修改后的用户数据:',newData);
        // this.newUserForm = {}//重置新增表单数据
      }
      // this.newUserForm = {}//重置新增表单数据
    },
    //修改用户
    async editItem(newData) {
      this.type = 'edit'
      this.dialogUserFormVisible = true
      this.newUserForm = newData//回填表单数据
    },
    //当用户勾选时触发
    selectionChange(selection) {
      console.log('selection', selection);
      // selection.map(item => item.id)
      this.idList = selection.map((p) => {
        return p.id
      })
      console.log('当前的id列表:', this.idList);
      // console.log('row',row);
    },
    // 批量删除用户
    deleteSome() {
      console.log('批量删除用户！！！！！！！！！', this.idList)
      delSomeUserItem(this.idList).then((res) => {
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
          this.getUser()
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
    //删除用户
    async deleteItem(id) {
      console.log('输出id:', id);
      let res = await delUserItem(id)
      if (res.data.code == 20000) {
        this.isLoading = true
        //重新加载数据
        this.getUser()
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
    // 取消删除
    cancleDel() {
      ElMessage({
        message: '取消删除',
        type: 'warning',
      })
    },

  },
  mounted() {
    this.getUser();
  }
}
</script>

<style scoped>
.user_all {
  margin-top: 60px;
  margin-left: 30px;
  margin-right: 30px;
}
</style>
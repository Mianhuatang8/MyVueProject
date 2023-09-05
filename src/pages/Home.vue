<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="auto">
        <Aside></Aside>
      </el-aside>
      <el-main style="height: 100%;">
        <!-- 吸顶 -->
        <div class="header">
          <div class="left">
            <el-button @click="changeCollapse"><el-icon :size="25">
                <Fold />
              </el-icon></el-button>
            <!-- <div style="margin-left: 5px">首页</div> -->
            <!-- 顶部面包屑 -->
            <Breadcrumb style="margin-left: 5px"></Breadcrumb>
          </div>
          <div class="right">
            <span style="margin-right: 10px;font-size: 20px;line-height: 55px">{{ username }}</span>
            <!-- 下拉菜单 -->
            <el-dropdown>
              <el-avatar v-loading="isloading" shape="square" :size="35" class="el-dropdown-link" :src="avatarSrc" />
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="goHome">首页</el-dropdown-item>
                  <el-dropdown-item @click="quit">退出</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>

        </div>
        <!-- 路由出口 -->
        <RouterView></RouterView>
        <!-- <Main></Main> -->
      </el-main>
    </el-container>
  </div>
</template>

<script>
import router from '../router/index.js'
import Aside from '../components/Aside.vue';
import Breadcrumb from '../components/Breadcrumb.vue'
// import Main from '../components/Main.vue';
export default {
  components: { Aside, Breadcrumb },
  async created() {
    //获取用户信息
    await this.getUserInfo();
  },


  data() {
    return {
      username: '',
      avatarSrc: 'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png',
      isloading: true,
    }

  },
  methods: {

    //回到首页
    goHome() {
      this.$router.push({ path: '/' })
    },
    //退出登录
    quit() {
      this.$store.dispatch("UserAbout/user_quit").then(() => {
        this.$router.push({ path: '/login' })
        // window.location.reload(); // 在退出登录后强制刷新页面
      }
      )
    },
    //获取用户信息
    getUserInfo() {
      this.$store.dispatch("UserAbout/user_info").then(() => {
        this.username = this.$store.state.UserAbout.username
        this.avatarSrc = this.$store.state.UserAbout.avatar
        this.isloading = false
        // console.log('头像,姓名', this.username, this.avatarSrc);
        this.$store.dispatch("UserAbout/userRoutes")
      })
    },
    changeCollapse() {
      this.$store.commit("MenuCollapseAbout/CHANG_MENU")

    },
  },

}

</script>

<style lang="less" scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
  height: 55px;
  position: fixed;
  top: 0px;
  z-index: 999;
  background-color: #fff;
  border-bottom: 1px solid #e4e4e4;
  width: 100%;

  .right {
    margin-right: 11%;
    display: flex;
    // align-content: center;
    align-items: center;
  }

  .left {
    display: flex;
    align-items: center;
  }

}

.el-main {
  --el-main-padding: 0px;
}

//下拉菜单-当鼠标经过头像时会显示下拉菜单
.example-showcase .el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}
</style>
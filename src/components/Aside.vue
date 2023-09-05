<template>
  <div class="menu-container" style="height:100vh;">
    <el-menu active-text-color="#ffd04b" background-color="#545c64" class="el-menu-vertical-demo" default-active="1"
      :collapse="isCollapse" text-color="#fff">
      <el-menu-item index="1" @click="clickMenu1">
        <el-icon>
          <location />
        </el-icon>
        <span>数据展示</span>
      </el-menu-item>
      <el-sub-menu index="2" v-if="index2.length!=0">
        <template #title>
          <el-icon>
            <setting />
          </el-icon>
          <span>权限管理</span>
        </template>
        <el-menu-item :index="item.name" v-for="(item,index) in index2" :key="index"
         @click="clickMenu2(item)">
         {{item.meta.title}}
        </el-menu-item>
      </el-sub-menu>

      <el-sub-menu index="3" v-if="index3.length!=0">
        <template #title>
          <el-icon>
            <setting />
          </el-icon>
          <span>商品管理</span>
        </template>
        <el-menu-item :index="item.name" v-for="(item,index) in index3" :key="index"
         @click="clickMenu3(item)">
         {{item.meta.title}}
        </el-menu-item>
      </el-sub-menu>

      <el-sub-menu index="4" v-if="index4.length!=0">
        <template #title>
          <el-icon>
            <setting />
          </el-icon>
          <span>测试管理</span>
        </template>
        <el-menu-item :index="item.name" v-for="(item,index) in index4" :key="index"
         @click="clickMenu4(item)">
         {{item.meta.title}}
        </el-menu-item>
      </el-sub-menu>

    </el-menu>
  </div>
</template>

<script scoped>
import router from '../router/index'
export default {
  data() {
    return {
      routesInfo: [],
      index2: [],
      index3: [],
      index4: [],

    }
  },
  computed: {
    isCollapse() {
      return this.$store.state.MenuCollapseAbout.isCollapse
    },
  },
  methods: {
    //折叠菜单
    clickMenu1() {
      this.$router.push({ path: '/data' })
    },
    clickMenu2(item){
      console.log('path:',item);
      this.$router.push({ 
        name:item.name
       })
    },
    clickMenu3(item){
     console.log('path',item.path);
      this.$router.push({ 
        name: item.name
       })
    },
    clickMenu4(item){
      this.$router.push({ 
        name: item.name
       })
    },
    clickMenu21() {
      this.$router.push({ path: '/userManage' })
    },
    clickMenu22() {
      this.$router.push({ path: '/jueseManage' })
    },
    clickMenu23() {
      this.$router.push({ path: '/menuManage' })
    },
    clickMenu31() {
      this.$router.push({ path: '/pingtai' })
    },
    clickMenu32() {
      this.$router.push({ path: '/spu' })
    },
    clickMenu33() {
      this.$router.push({ path: '/sku' })
    },
    clickMenu41() {
      this.$router.push({ path: '/test1' })
    },
    clickMenu42() {
      this.$router.push({ path: '/test2' })
    },
  },
  watch: {
    '$store.state.UserAbout.resultAllRoutes': {
      handler(routes) {
        if (routes.length > 0) {
          console.log('输出从vuex拿到的最终的路由表信息', routes);
          this.routesInfo = routes[1].children
          console.log('输出从vuex拿到的最终的路由表信息', this.routesInfo);
          //将sign=2的放入index2
          this.routesInfo.map((p) => {
            if (p.meta.sign == '2') {
              this.index2.push(p)
            } else if (p.meta.sign == '3') {
              this.index3.push(p)
            } else {this.index4.push(p)}
          })

          console.log('index2',this.index2);
          console.log('index3',this.index3);
          console.log('index4',this.index4);
        }
      },
      immediate: true // 立即执行回调函数，避免侦听时机不对的问题
    },

  },

}
</script>

<style>
.menu-container {
  height: 100vh;
}

.el-menu {
  height: 100%;
  border: none;
  /* position: fixed;
  top: 0px; */
}
</style>
<template>
    <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页(数据展示)</el-breadcrumb-item>
        <el-breadcrumb-item v-if="currentRouteInfo.meta.sign !== 1" :to="{ path: path2 }">
            <span v-if="currentRouteInfo.meta.sign == 2"> 权限管理</span>
            <span v-else-if="currentRouteInfo.meta.sign == 3">商品管理</span>
            <span v-else>测试管理</span>
        </el-breadcrumb-item>
        <el-breadcrumb-item v-if="currentRouteInfo.meta.sign !== 1">{{ currentRouteInfo.meta.title }}</el-breadcrumb-item>
    </el-breadcrumb>
</template>

<script>
export default {
    data() {
        return {
            currentRouteInfo: [],
        };
    },
    created() {
        // 注册beforeEach导航守卫
        this.$router.beforeEach((to, from, next) => {
            this.getCurrentRouterInfo(); // 在每次路由变化前更新currentRouteInfo数据
            next(); // 必须调用next()，否则导航不会继续
        });
        this.getCurrentRouterInfo(); // 在创建组件时先执行一次，确保数据初始化
    },
    methods: {
        getCurrentRouterInfo() {
            // console.log('整个路由信息', this.$router);
            console.log('当前的路由信息', this.$route);
            this.$nextTick(() => { })
            this.currentRouteInfo = this.$route; // 更新currentRouteInfo数据

        },
    },
    watch: {
        // 监听$route的变化，调用getCurrentRouterInfo方法
        //简写形式： $route: 'getCurrentRouterInfo', 
        $route(newRoute, oldRoute) {
            this.getCurrentRouterInfo();
        },
    },
    computed: {
        path2() {
            return this.currentRouteInfo.meta.sign == 2 ? '/userManage' : this.currentRouteInfo.meta.sign == 3 ? '/pingtai' : '/test1'
        }
    }
}
</script>

<style></style>


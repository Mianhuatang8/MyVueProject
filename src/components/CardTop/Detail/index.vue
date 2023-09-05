<template>
    <div class="all">
        <div class="one">
            <div>{{ title }}</div>
            <div><el-icon>
                    <Warning />
                </el-icon></div>
        </div>
        <div class="two">{{ count }}</div>
        <div class="chart">
            <slot name="center">我是中间默认内容</slot>
        </div>

        <div class="foot">
            <el-divider />
            <slot name="footer">我是底部默认内容</slot>
        </div>

    </div>
    <!-- <el-card class="box-card">
        <el-row>
           
        </el-row>
        <el-row class="main_text">$123456</el-row>
        <el-row>
            周同比:23.15%
            日同比:23.23%
        </el-row>
        <el-row>日销售额:$12345</el-row>
    </el-card> -->
</template>

<script>
export default {
    //接收组件传过来的参数
    props: ['title', 'count']

}
</script>

<style scope>
/* 标题部分 */
.one {
    display: flex;
    justify-content: space-between;
    font-size: 15px;
    color: #ababab;
}

.two {
    margin: 10px 0;
    font-size: 28px;
    color: black;
    font-weight: bold;
}
</style>
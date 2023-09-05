<template>
    <!-- 卡片内容 -->
    <div>
        <el-row :gutter="10">
            <el-col :span="12">
                <LineCharts></LineCharts>
            </el-col>
            <el-col :span="12">
                <LineCharts></LineCharts>
            </el-col>
        </el-row>
        <!-- table表格 -->
        <el-table :data="tableData" style="width: 100%" border>
            <el-table-column label="排名" width="80" type="index">
            </el-table-column>
            <el-table-column label="搜索关键字" width="180"> </el-table-column>
            <el-table-column label="用户数" sortable> </el-table-column>
            <el-table-column label="周涨幅" sortable> </el-table-column>
        </el-table>
        <!-- 分页条 -->
        <el-pagination layout="prev, pager, next" :total="1000"  class="pagination"/>
    </div>
</template>
  
<script>
import LineCharts from '../LineCharts/index.vue'

export default {
    data() {
        return {
            tableData:[],
        };
    },
    components: {
        LineCharts,
    },
};
</script>
  
<style scoped>

.pagination {
    float: right;
}
</style>
  
<template>
    <el-row :gutter="24" class="threeCardAll">
        <el-col :span="12">
            <el-card>
                <template #header>
                    <div class="search-header">
                        <span>线上热门搜索</span>
                        <el-dropdown>
                            <span>
                                <el-icon>
                                    <More />
                                </el-icon>
                            </span>
                            <template #dropdown>
                                <el-dropdown-menu>
                                    <el-dropdown-item>黄金糕</el-dropdown-item>
                                    <el-dropdown-item>狮子头</el-dropdown-item>
                                    <el-dropdown-item>螺蛳粉</el-dropdown-item>
                                    <el-dropdown-item>双皮奶</el-dropdown-item>
                                    <el-dropdown-item>蚵仔煎</el-dropdown-item>
                                </el-dropdown-menu>
                            </template>
                        </el-dropdown>
                    </div>
                </template>
                <Search></Search>
            </el-card>
        </el-col>
        <el-col :span="12">
            <el-card>
                <template #header>
                    <div class="top">
                        <div class="top_left">
                            <span>销售类别占比</span>
                        </div>
                        <div class="top_right">
                            <el-tabs v-model="activeName" type="card" class="demo-tabs">
                                <el-tab-pane label="全部渠道" name="all"></el-tab-pane>
                                <el-tab-pane label="线上" name="up"></el-tab-pane>
                                <el-tab-pane label="线下" name="down"></el-tab-pane>
                            </el-tabs>
                        </div>
                    </div>
                </template>
                <PieChart :title="activeName" v-if="activeName === 'all'"></PieChart>
                <PieChart :title="activeName" v-else-if="activeName === 'up'"></PieChart>
                <PieChart :title="activeName" v-else-if="activeName === 'down'"></PieChart>
            </el-card>
        </el-col>
    </el-row>
</template>

<script>
import Search from './Search/index.vue'
import PieChart from './PieChart/index.vue'
export default {
    components: { PieChart, Search },
    data() {
        return {
            activeName: 'all'
        }
    },
    methods: {
        // handleClick(context, name) {
        //     console.log('context', context);
        //     console.log('name', name);

        // },
    }
}
</script>

<style scope>
.threeCardAll {
    display: flex;
    margin-top: 20px;
    margin-left: 30px;
    margin-right: 30px;
    width: 100%;
}

.top {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

/* .header {
    border-bottom: 1px solid #eee;
    padding: 5px 0px;
} */

.search-header {
    display: flex;
    justify-content: space-between;
}
</style>
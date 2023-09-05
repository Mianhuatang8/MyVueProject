<template>
    <div class="twoCardAll">
        <el-card>
            <template #header>
                <div class="clearfix">
                    <!-- 头部左侧内容 -->
                    <el-tabs class="tab" v-model="activeName">
                        <el-tab-pane label="销售额" name="sale"></el-tab-pane>
                        <el-tab-pane label="访问量" name="visite"></el-tab-pane>
                    </el-tabs>
                    <!-- 头部右侧内容 -->
                    <div class="right">
                        <span @click="setDay">今日</span>
                        <span @click="setWeek">本周</span>
                        <span @click="setMonth">本月</span>
                        <span @click="setYear">本年</span>
                        <!-- 日期选择器 -->
                        <el-date-picker v-model="date" class="date" type="daterange" range-separator="-" start-placeholder="开始日期"
                            end-placeholder="结束日期" >
                        </el-date-picker>
                    </div>
                </div>
            </template>

            <el-row :gutter="24" style="height:300px">
                <el-col :span="18">
                    <!-- <div style="height:300px"> -->
                    <TwoLineChart v-if="activeName == 'sale'" :options="option1"></TwoLineChart>
                    <TwoLineChart v-else :options="option2"></TwoLineChart>
                    <!-- </div> -->
                </el-col>
                <el-col :span="6">
                    <div class="bodyRight">
                        <p>门店{{ title }}排名</p>
                        <ul>
                            <li>
                                <span class="rindex">1</span>
                                <span>肯德基</span>
                                <span class="rvalue">123456</span>
                            </li>
                            <li>
                                <span class="rindex">2</span>
                                <span>肯德基</span>
                                <span class="rvalue">123456</span>
                            </li>
                            <li>
                                <span class="rindex">3</span>
                                <span>肯德基</span>
                                <span class="rvalue">123456</span>
                            </li>
                            <li>
                                <span>4</span>
                                <span>肯德基</span>
                                <span class="rvalue">123456</span>
                            </li>
                            <li>
                                <span>5</span>
                                <span>肯德基</span>
                                <span class="rvalue">123456</span>
                            </li>
                            <li>
                                <span>6</span>
                                <span>肯德基</span>
                                <span class="rvalue">123456</span>
                            </li>
                            <li>
                                <span>7</span>
                                <span>肯德基</span>
                                <span class="rvalue">123456</span>
                            </li>
                        </ul>
                    </div>
                </el-col>
            </el-row>
        </el-card>
    </div>
</template>

<script>
import dayjs from "dayjs";
import TwoLineChart from './TwoLineChart/index.vue'


export default {
    components: { TwoLineChart },
    data() {
        return {
            activeName: 'sale',
            date: [], // 初始化日期范围为null，即不选择任何日期
            option1: {
                title: {
                    text: "销售额趋势",
                },
                tooltip: {
                    trigger: "axis",
                    axisPointer: {
                        type: "shadow",
                    },
                },
                grid: {
                    left: "3%",
                    right: "4%",
                    bottom: "3%",
                    containLabel: true,
                },
                xAxis: [
                    {
                        type: "category",
                        data: [],
                        axisTick: {
                            alignWithLabel: true,
                        },
                    },
                ],
                yAxis: [
                    {
                        type: "value",
                    },
                ],
                series: [
                    {
                        name: "Direct",
                        type: "bar",
                        barWidth: "60%",
                        data: [120, 200, 150, 80, 70, 110, 130],
                        color: "yellowgreen",
                    },
                ],
            },
            option2: {
                title: {
                    text: "访问量趋势",
                },
                tooltip: {
                    trigger: "axis",
                    axisPointer: {
                        type: "shadow",
                    },
                },
                grid: {
                    left: "3%",
                    right: "4%",
                    bottom: "3%",
                    containLabel: true,
                },
                xAxis: [
                    {
                        type: "category",
                        data: [],
                        axisTick: {
                            alignWithLabel: true,
                        },
                    },
                ],
                yAxis: [
                    {
                        type: "value",
                    },
                ],
                series: [
                    {
                        name: "Direct",
                        type: "bar",
                        barWidth: "60%",
                        data: [120, 200, 150, 80, 70, 110, 130],
                        color: "yellowgreen",
                    },
                ],
            },
        }
    },

    computed: {
        title() {
            return this.activeName == 'sale' ? '销售额' : '访问量'
        },
        options() {
            return this.activeName == 'sale' ? this.option1 : this.option2
        }
    },
    methods: {
        //本天
        setDay() {
            // console.log('本天date', this.date);
            // dayjs():获取当前时间
            const day = dayjs().format("YYYY-MM-DD");
            this.date = [day, day];
            // console.log('本天date', this.datePick);

        },
        //本周
        setWeek() {
            const start = dayjs().day(1).format("YYYY-MM-DD");
            const end = dayjs().day(7).format("YYYY-MM-DD");
            this.date = [start, end];
            // console.log('本周date', this.datePick);
        },
        //本月
        setMonth() {
            const start = dayjs().startOf("month").format("YYYY-MM-DD");
            const end = dayjs().endOf("month").format("YYYY-MM-DD");
            this.date = [start, end];
            // console.log('本月date', this.datePick);
        },
        //本年
        setYear() {
            const start = dayjs().startOf("year").format("YYYY-MM-DD");
            const end = dayjs().endOf("year").format("YYYY-MM-DD");
            this.date = [start, end];
            // console.log('本年date', this.datePick);
        },
    }

}
</script>

<style scope lang="less">
.twoCardAll {
    margin-top: 20px;
    margin-left: 30px;
    margin-right: 30px;
}

.clearfix {
    display: flex;
    justify-content: space-between;
    position: relative;

    .tab {
        width: 100%;
    }

    .right {
        position: absolute;
        right: 0;

        span {
            margin-right: 5px;
        }
    }
}

.card_body {
    display: flex;
    position: relative;
}


.bodyRight {
    position: absolute;
    right: 80px;

    p {
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 10px;
    }

    span {
        margin: 0px 10px;
    }

    ul {
        list-style: none;
        width: 100%;
        height: 300px;
        padding: 0px;
    }

    ul li {
        height: 8%;
        margin: 10px 0px;
    }

    .rindex {
        float: left;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: black;
        color: white;
        text-align: center;
    }

    .rvalue {
        float: right;
    }
}
</style>
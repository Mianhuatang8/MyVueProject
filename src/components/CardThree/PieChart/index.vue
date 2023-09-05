<template>
    <div class="charts" ref="charts"></div>
</template>

<script>
import * as echarts from "echarts";
export default {
    props:['title'],
    mounted() {
        //饼图
        const mychart = echarts.init(this.$refs.charts);
        mychart.setOption({
            title: {
                text: this.title,
                subtext: 1048,
                left: "center",
                top: "center",
            },
            tooltip: {
                trigger: "item",
            },
            series: [
                {
                    name: "Access From",
                    type: "pie",
                    radius: ["40%", "70%"],
                    avoidLabelOverlap: false,
                    itemStyle: {
                        borderRadius: 10,
                        borderColor: "#fff",
                        borderWidth: 2,
                    },
                    label: {
                        show: true,
                        position: "outsize",
                    },
                    labelLine: {
                        show: true,
                    },
                    data: [
                        { value: 1048, name: "视频" },
                        { value: 735, name: "Direct" },
                        { value: 580, name: "Email" },
                        { value: 484, name: "Union Ads" },
                        { value: 300, name: "Video Ads" },
                    ],
                },
            ],
        });
        //绑定事件
    }

}
</script>

<style scoped>
.charts {
    width: 100%;
    height: 300px;
}
</style>
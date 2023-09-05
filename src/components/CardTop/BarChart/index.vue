
<template>
  <div ref="chart" class="charts"></div>
</template>



<script>
import * as echarts from 'echarts';
export default {
  data() {
    return {
      options: {
        xAxis: {
          //隐藏x轴
          show: false,
          //均分
          type: "category",
        },
        yAxis: {
          //隐藏y轴
          show: false,
        },
        //系列
        series: [
          {
            //图标形式-柱状图
            type: "bar",
            data: [10, 7, 33, 12, 48, 9, 29, 10, 44, 33, 22, 8],
            color: 'cyan'
          },
        ],
        //布局调试
        grid: {
          left: 0,
          top: 0,
          right: 0,
          bottom: 0,
        },
        tooltip: {}
      },
    }
  },
  mounted() {
    const myChart = echarts.init(this.$refs.chart);
    myChart.setOption(this.options)

  },
}
</script>

<style>
.charts {
  width: 100%;
  height: 100%;
}
</style>
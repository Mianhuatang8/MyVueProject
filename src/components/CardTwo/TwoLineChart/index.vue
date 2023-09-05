
<template>
    <div ref="chart" class="charts"></div>
  </template>
  
  
  
  <script>
  import * as echarts from 'echarts';
  export default {
    props:['options'],
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
<template>
    <div :class="className" :style="{height:height,width:width}" />
  </template>
  
  <script>
  import echarts from 'echarts'
  require('echarts/theme/macarons') // echarts theme
  import resize from './mixins/resize'
  
  const animationDuration = 6000
  
  export default {
    mixins: [resize],
    props: {
      className: {
        type: String,
        default: 'chart'
      },
      width: {
        type: String,
        default: '100%'
      },
      height: {
        type: String,
        default: '300px'
      },
      chartData:{
        type:Object,
        default:()=>null
      }
    },
    watch:{
        chartData:{
            handler(newV){
                if(newV){
                    this.initChart()
                }
            },deep:true,
            immediate:false
        }
    },
    data() {
      return {
        chart:null
    }
    },
    mounted() {
      this.$nextTick(() => {
        this.initChart()
      })
    },
    beforeDestroy() {
      if (!this.chart) {
        return
      }
      this.chart.dispose()
      this.chart = null
    },
    methods: {
      initChart() {
        this.chart = echarts.init(this.$el, 'macarons')
  
        this.chart.setOption(this.chartData)
      }
    }
  }
  </script>
  
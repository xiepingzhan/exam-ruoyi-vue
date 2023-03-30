<template>
  <!--学习统计-->
  <div class="app-container">
    <div class="echarts-search">
      <el-form
        :model="queryForm"
        ref="queryForm"
        inline
      >
        <el-form-item
          label="搜索条件1"
          prop="tj1"
        >
          <el-input
            v-model="queryForm.tj1"
            clearable
            placeholder="请输入检索内容" />
        </el-form-item>
        <el-form-item
          label="搜索条件2"
          prop="tj2"
        >
          <el-input
            v-model="queryForm.tj2"
            clearable
            placeholder="请输入检索内容" />
        </el-form-item>
        <el-form-item
        >
          <el-button type="primary">搜索</el-button>
          <el-button @click="($refs.queryForm.resetFields(),resetForm('queryForm'))">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="echarts-list">
      <echarts :key="1" :chart-options="barOptions" />
      <echarts :key="2" :chart-options="lineOptions" />
      <echarts :key="3" height="400px" width="50%" :chart-options="pieOptions" />
      <echarts :key="4" height="400px" width="50%" :chart-options="radarOptions" />
    </div>

  </div>
</template>

<script>
import statistics from "@/mixins/statistics";
import Echarts from "@/views/modules/components/echarts/echarts";
export default {
  name: "index",
  mixins:[statistics],
  components: {Echarts},
  data(){
    return {
      queryForm:{
        tj1:undefined,
        tj2:undefined
      }
    }
  }
}
</script>

<style scoped lang="scss">
.echarts-list{
  display: flex;
  flex-wrap: wrap;
  column-gap: 0;
  row-gap: 0;
}
</style>

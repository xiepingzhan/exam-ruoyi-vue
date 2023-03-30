<template>
  <el-table
    :data="datalist"
    stripe
    ref="tt"
    :max-height="height+'px'"
    highlight-current-row
    @row-click="handleRowClick"
  >
    <el-table-column label="类号" prop="topicType" align="center" />
    <el-table-column label="内容名称" prop="topicName" show-overflow-tooltip align="center" />
    <el-table-column label="试题数量" prop="topicNum" align="center" />
  </el-table>
</template>

<script>
export default {
  name: "myTable",
  props:{
    // dataString:{
    //   type:String,
    //   default:()=>undefined
    // },
    height:{
      type:Number,
      default:200
    },
    datalist:{
      type:Array,
      default:()=>[]
    }
  },
  watch:{
    // dataString:{
    //   handler(newV){
    //     if(newV){
    //       this.datalist = JSON.parse(newV)
    //     }
    //   },
    //   deep:true,
    //   immediate:true
    // }
  },
  data(){
    return{
      // datalist:[]
    }
  },
  methods:{
    //处理点击行
    handleRowClick(row,column,event){
      this.$emit('hanldeRowClick',row)
    }
  }
}
</script>

<style scoped lang="scss">
::v-deep .el-table{
  background: pink!important;
}
</style>

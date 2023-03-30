<template>
<!--已选择区-->
  <el-card>
    <my-table
      ref="myTable"
      :height="320"
      :datalist="datalist"
    @hanldeRowClick="hanldeRowClick"
    />
  </el-card>
</template>

<script>
export default {
  name: "selectedquestion",
  props:{
    datalist:{
      type:Array,
      default:()=>[]
    }
  },
  components:{
    myTable:()=>import('./myTable')
  },
  methods:{
    //处理点击行
    hanldeRowClick(row){
      this.$emit('hanldeRowClick',row)
    },
    setCurrentRow(row){
      this.$refs.myTable.$refs.tt.setCurrentRow(row)
    }
  }
}
</script>

<style scoped>

</style>

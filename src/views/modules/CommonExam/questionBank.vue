<template>
<!--题库区-->
  <el-card>
    <div class="md8">
      <fieldset>
        <legend>题型</legend>
        <el-radio-group v-model="queryForm.selectedTx">
          <el-radio
            v-for="(item,index) in test_type"
            :key="index"
            :label="item.value"
          >{{item.label}}</el-radio>
        </el-radio-group>
      </fieldset>
    </div>

    <my-table
      :datalist="datalist"
      :height="240"
      @hanldeRowClick="handleRowClick"
      ref="myTable"
    />

  </el-card>
</template>

<script>
export default {
  name: "questionBank",
  props:{
    datalist:{
      type:Array,
      default:()=>[]
    },
    test_type:{
      type:Array,
      default:()=>[]
    }
  },
  watch:{
    'queryForm.selectedTx':{
      handler(newV){
        if(newV){
          this.$emit('uploadData',newV)
        }
      },
      immediate:true
    },

  },
  components:{
    myTable:()=>import('./myTable')
  },
  data(){
    return {
      queryForm:{
        selectedTx:undefined,
      },
    }
  },
  mounted() {
    },
  methods:{
    //处理点击行
    handleRowClick(row){
      this.$emit('hanldeRowClick',row)
    },
    setCurrentRow(row){
      this.$refs.myTable.$refs.tt.setCurrentRow(row)
    }
  }
}
</script>

<style scoped>
.md8{
  box-sizing: border-box;
  padding:8px 0;
}
</style>

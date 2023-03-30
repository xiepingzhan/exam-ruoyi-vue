<template>
  <div class="content">
    <el-card class="myCard">
      <el-form
        :model="queryForm"
        ref="myForm"
        :rules="rules"
        size="small">
        <el-form-item
          label="考试名称"
          label-width="100px"
          prop="title">
          <el-input v-model="queryForm.title" clearable/>
        </el-form-item>
        <el-form-item
          label-width="100px"
          label="考试对象"
          prop="examObj">
          <el-select
            v-model="queryForm.examObj"
            style="width: 100%"
            clearable>
            <el-option
              v-for="(item,index) in groupList"
              :key="index"
              :label="item.fileName"
              :value="item.importId"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <slot></slot>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import {getImportInfo} from "@/api/hgExam-ui/group";

export default {
  computed:{
    ...mapGetters(['examObj'])
  },
  watch:{
    "examObj.examInfo":{
      handler(newV){
        if(newV){
          this.queryForm = this.examObj.examInfo
        }
      },
      immediate:true,
      deep:true
    }
  },
  name: "index.vue",
  data(){
    return{
      groupList:[],
      queryForm:{
        title:'',
        examObj:''
      },
      rules:{
        title:[{required:true,message:'请输入考试名称',trigger:'blur'}],
        examObj:[{required:true,message:'请选择考试对象',trigger:'blur'}],
      }
    }
  },
  methods:{
    init(){
      getImportInfo({pageSize:10000,pageNum:1}).then(res=>{
        if(res.code!=200)return
        this.groupList = res.rows
      })
    },
    submitFn(){
      this.$refs.myForm.validate((valid)=>{
        if(valid){
          this.$emit('changeActive','add')
          this.examObj.examInfo = JSON.parse(JSON.stringify(this.queryForm))
        }
      })
    }
  },
  mounted(){
    this.init()
  }
}
</script>
<style scoped lang="scss">
.myCard{
  width: 30%;
  margin:0 auto;
}
</style>

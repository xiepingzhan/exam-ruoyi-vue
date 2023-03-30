<template>
  <div class="app-container commonExam">
    <div class="header">
      <!--      <el-input-number  :controls="false" v-model="active"></el-input-number>-->
      <!--      <el-card>-->
      <el-steps :active="active" simple>
        <el-step title="考试对象" :status="active==1?'process':active>1?'success':'wait'"></el-step>
        <el-step title="考题设置" :status="active==2?'process':active>2?'success':'wait'"></el-step>
        <el-step title="试卷设置" :status="active>=3?'success':'wait'"></el-step>
      </el-steps>
      <!--      </el-card>-->
    </div>
    <!--考试对象-->
    <exam-obj
      ref="examObj"
      v-if="active==1"
      style="width: 100%"
      @changeActive="changeActive"
    >
      <div style="text-align: center">
        <el-button type="primary"
                   @click="submitFn">下一步
        </el-button>
      </div>
    </exam-obj>
    <!--考题设置 试卷设置-->
    <common-vue
      :key="active"
      class="myContent"
      style="width:100%"
      :active-index="active"
      v-if="active==2||active==3"
      ref="commonVue"
    >
      <div class="myOperator">
        <el-button v-if="active!=1"
                   @click="submitFn('prev')">上一步
        </el-button>
        <el-button type="primary"
                   v-if="active!=3"
                   @click="submitFn('add')">下一步
        </el-button>
        <el-button type="primary"
                   v-if="active==3"
                   @click="submitFn('save')">保存
        </el-button>
      </div>
    </common-vue>
  </div>
</template>

<script>
import commonVue from "@/views/modules/CommonExam/common1";
import examObj from "@/views/modules/CommonExam/examObj";
import service from '@/utils/request'
export default {
  name: "index.vue",
  components: {
    commonVue,
    examObj
  },

  data() {
    return {
      active: 1,
    }
  },
  mounted() {

  },
  methods: {
    //流程操作按钮
    async submitFn(type) {
      if (this.active == 1) {
        this.$refs.examObj.submitFn()
      } else if (this.active == 2) {
        if (type == 'add') {
          let res = await this.$refs.commonVue.nextFn()
          res && this.changeActive(type)
        } else {
          this.changeActive(type)

        }
      } else if (this.active == 3) {
        if (type == 'prev') {
          this.changeActive(type)
        } else {
          let res = await this.$refs.commonVue.submitFn()
          res && this.$modal.confirm("是否保存当前考试？").then(_=>{
            service({
              method:'post',
              url:'/select/base/add',
              data:this.$store.state.commonExam.examObj
            }).then(res=>{
              if(res.code!=200)return
              this.$tab.closePage()
              this.$nextTick(()=>{
                this.$store.state.commonExam.examObj = {
                  questionInfo: {
                  }
                }
              })
            })
          })
          console.log(JSON.stringify(this.$store.state.commonExam.examObj), "examObj");

        }
      }
    },
    changeActive(type) {
      if (type == 'add') {
        ++this.active
      } else {
        --this.active
      }
    }
  }

}
</script>

<style lang="scss" scoped>
.commonExam {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;

  box-sizing: border-box;
  .myContent{
    height: calc(100% - 60px);
    /*background: red;*/
  }
  .header{
    padding-bottom:20px;
    height: 60px;
    /*background: pink;*/
    box-sizing: border-box;
  }


}

.myOperator {
  text-align: right;
  position: absolute;
  bottom: 10px;
  right: 10px;
}
</style>

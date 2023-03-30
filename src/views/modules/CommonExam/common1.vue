<template>
  <div class="content">
    <div class="leftAction">
      <questionBank
        class="top"
        ref="topRef"
        :datalist="topList"
        :test_type="dict.type.test_type"
        @hanldeRowClick="beforeAdd"
        @uploadData="uploadData"
      />
      <div class="operator" :class="type!=undefined?'':'displayBlock'">
        <div class="descript" v-if="type!=undefined">
          <div>{{dict.type.test_type.find(item=>item.value==type).label}}当前已抽取:{{curTypeObj.typeNum}} 类</div>
          <div>数量:{{curTypeObj.totalNum}} 题</div>
        </div>
        <div style="width: auto;text-align: right">
          <el-button
            size="mini"
            type="primary"
            @click="handleAdd"
            :disabled="JSON.stringify(curtopRow)=='{}'"
          >加入</el-button>
          <el-button
            size="mini"
            @click="handleRemove"
            :disabled="JSON.stringify(curbottomRow)=='{}'"
          >剔出</el-button>
        </div>
      </div>

      <selectedquestion
        class="bottom"
        ref="bottomRef"
        :datalist="bottomList"
        @hanldeRowClick="handleEdit"
      />
    </div>
    <div class="rightAction">
      <opreate
        class="operate"
        :test_type="dict.type.test_type"
        :currentObj ="JSON.stringify(curbottomRow)"
        :examPool = "JSON.stringify(this.examObj)"
        @changeStsl="changeStsl"
        ref="operate"
        :title="activeIndex==2?'考试抽选题库组成方案设计':'试卷设计'"
        :legend="legend"
        :activeIndex="activeIndex"
        @changeExamPool="changeExamPool"
      >
        <slot></slot>
      </opreate>
    </div>
  </div>
</template>

<script>
import opreate from "@/views/modules/CommonExam/opreate";
import questionBank from "@/views/modules/CommonExam/questionBank";
import selectedquestion from "@/views/modules/CommonExam/selectedquestion";
import {mapGetters} from "vuex";

import exam_data from "@/views/modules/CommonExam/examData";

export default {
  name: "index.vue",
  mixins:[exam_data],
  dicts:['test_type'],
  components:{
    selectedquestion,
    opreate,
    questionBank
  },
  props:{
    activeIndex:{
      type:Number,
      default:undefined
    }
  },
  data(){
    return{
      legend:"详细信息",
      topList:[],
      bottomList:[],
    //  题库  当前行信息
      curtopRow:{},
      curbottomRow:{},
      type:undefined
    }
  },
  computed:{
    ...mapGetters(['examObj']),
    //统计信息
    curTypeObj() {
      let num = this.bottomList.reduce((prev,cur)=>prev+Number(cur.topicNum),0)
      let typeNum = this.bottomList.length
      return {
        totalNum: num,
        typeNum
      }
    }
  },
  watch:{
    type:{
      handler(newV){
        if(newV){
          this.curtopRow = {}
          this.curbottomRow = {}
          if(this.activeIndex==2){
            // this.topList = this.exam_data[newV]?this.exam_data[newV]:[]
            this.getQuestion(this.type)
            this.bottomList = []
            if(this.type&&this.examObj.questionInfo[this.type]){
              this.bottomList = this.examObj.questionInfo[this.type]?.questionPool?this.examObj.questionInfo[this.type].questionPool:[]
            }
          }else if(this.activeIndex==3){
            this.topList = this.examObj.questionInfo[this.type]?.questionPool?this.examObj.questionInfo[this.type].questionPool:[]
            this.bottomList =this.examObj.questionInfo[this.type]?.testPaperPool?this.examObj.questionInfo[this.type].testPaperPool:[]
          }
        }
      },
      deep:true,
      immediate:true
    }
  },
  methods:{
    submitFn(){
      return  this.$refs.operate.submitFn()
    },
    nextFn(){
      return new Promise((resolve,reject)=>{
          let arr = []
          for(let i in this.examObj.questionInfo){
            if(this.examObj.questionInfo[i].questionPool.length>0){
              arr.push(true)
            }else{
              arr.push(false)
            }
          }
          if(arr.some(item=>item==true)){
            resolve(true)

          }else {
            resolve(false)
            this.$modal.msgWarning("请抽取相应的试题")
          }
      })
    },
    changeExamPool(type,value,attr,index){
      this.$set(this.examObj.questionInfo[type],attr,value)
      this.examObj.questionInfo[type][attr] = value
    },
    changeStsl(topicNum){
      this.$set(this.curbottomRow,'topicNum',topicNum)
     if(this.activeIndex==2){
       let index = this.examObj.questionInfo[this.type].questionPool.findIndex(item=>item.topicType==this.curbottomRow.topicType)
       this.$set(this.examObj.questionInfo[this.type].questionPool,index,this.curbottomRow)
     }else{
       let index = this.examObj.questionInfo[this.type].testPaperPool.findIndex(item=>item.topicType==this.curbottomRow.topicType)
       this.$set(this.examObj.questionInfo[this.type].testPaperPool,index,this.curbottomRow)
     }
      let index_bto = this.bottomList.findIndex(item=>item.topicType==this.curbottomRow.topicType)
      this.$set(this.bottomList,index_bto,this.curbottomRow)

      this.curbottomRow = {}
    },
    //题型
    uploadData(type){
      this.type = type;
    },
    //题库行点击事件
    beforeAdd(row){
      this.curtopRow = row;
      this.legend = "详细信息"
      this.curbottomRow = {}
    },
    // 加入
    handleAdd(){
      this.bottomList.push(JSON.parse(JSON.stringify(this.curtopRow)))
      this.bottomList = this.bottomList.filter((item,index)=>{
        let findIN = this.bottomList.findIndex(it=>it.topicType==item.topicType)
        return index ==findIN
      })
      this.curtopRow = {}
      if(this.activeIndex==2){
        let obj = {questionPool:this.bottomList,testPaperPool:[],score:1}
        this.examObj.questionInfo[this.type] = {
          ...obj
        }
      }else{
        this.examObj.questionInfo[this.type].testPaperPool = this.bottomList
      }
      this.$refs.topRef.setCurrentRow()
    },
    //选中题库的点击事件
    handleEdit(row){
      this.curbottomRow = row;
      this.curtopRow = {}
      this.legend = this.dict.type.test_type.find(item=>item.value==this.type).label+'所选信息'
    },
    //剔出
    handleRemove(){
      let findIn = this.bottomList.findIndex(item=>item.topicType==this.curbottomRow.topicType)
      if(findIn==-1)return
      this.bottomList.splice(findIn,1)
      this.curbottomRow = {}
      this.$refs.bottomRef.setCurrentRow()
      if(this.activeIndex==2){
        let obj = {questionPool:this.bottomList,testPaperPool:[],}
        this.examObj.questionInfo[this.type] = {
          ...obj,
          score:1
        }
      }else{
        this.examObj.questionInfo[this.type].testPaperPool = this.bottomList
      }
    },
  }
}
</script>
<style scoped lang="scss">

.content{
  display: flex;
  flex-direction: row;

}

.leftAction,
.rightAction
{
  height: 100%;
}
.leftAction{
  width: 50%;
  padding-right:20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  &>div{
    margin-bottom: 10px;
  }
  .top,.bottom{
    height: 350px;
  }
}
.rightAction{
  width: 50%;
  height: 100%;
  .operate{
    height: 750px;
    position: relative;
  }
}
.operator{
  display: flex;
  height: 30px;
  flex-direction: row;
  justify-content: space-between;
  .descript{
    display: flex;
    flex-direction: row;

    justify-content: flex-start;
    &>div{
      padding:0 10px;
    }
  }
}
.displayBlock{
  display: block;
}
</style>

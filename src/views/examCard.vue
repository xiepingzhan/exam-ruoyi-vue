<template>
  <el-card class="exam_card">
    <div class="info">
      <div class="examName"
        :title="curObj.examName"
      >
        {{curObj.examName}}
      </div>
      <div class="middle">
        <div class="label">考试类型</div>
        <div class="content">
          {{dict.type.testpapertype.find(item=>item.value==curObj.papertype)?
          dict.type.testpapertype.find(item=>item.value==curObj.papertype).label:
          ""}}</div>
      </div>
      <div class="bottom">

        <div class="durction">
          <div class="label">考试时长</div>
          <div class="content">{{curObj.duration}} 分钟</div>
        </div>

        <div class="some1">
          <div class="label">重复考试</div>
          <div class="content">
            <template v-if="curObj.frepeat == 'true'">
              <el-tag type="success" plain>
                {{ curObj.ftwice == 'true' ? '可补考一次' : '不限次数' }}
              </el-tag>
            </template>
            <template v-else>
              <el-tag type="danger" plain>仅一次</el-tag>
            </template>
          </div>
        </div>
      </div>
      <div class="examCutoffTime">
        <div class="label">截止日期</div>
        <div class="content">{{curObj.examCutoffTime}}</div>
      </div>
<!--      <template v-if="row.frepeat == 'true'">-->
<!--        <el-tag type="success" plain>-->
<!--          {{ row.ftwice == 'true' ? '可补考一次' : '不限次数' }}-->
<!--        </el-tag>-->
<!--      </template>-->
<!--      <template v-else>-->
<!--        <el-tag type="danger" plain>仅一次</el-tag>-->
<!--      </template>-->
    </div>
    <div class="footer">
      <el-button
        size="small"
        plain
        type="primary"
        @click="addExam"
      >
        参加考试
      </el-button>
    </div>
  </el-card>
</template>

<script>
export default {

  dicts:['testpapertype'],
  props:{
    curObj:{
      type:Object,
      default:()=>{
        return {
          examName:'xxx考试xxx考试xxx考试xxx考试xxx考试xxx考试xxx考试xxx考试xxx考试',
          papertype:'竞聘考试',
          duration:"60",
          examCutoffTime:'2023-3-1',
          frepeat:'true',
          ftwice:'true',

        }
      }
    }
  },
  methods: {
    // 参加考试
    addExam(){
      this.$modal.confirm('是否参加 “'+this.curObj.examName+'” 考试？').then(_=>{
        this.$emit('addExam',this.curObj)
      })
    },
  },
};
</script>

<style scoped lang="scss">
  .exam_card{
    width: 347px;
    //height: 400px;
    ::v-deep .el-card__body{
      position: relative;
      height: 400px;
      .footer{
        width: 100%;
        height: 100px;
        line-height: 60px;
        box-sizing: border-box;
        padding:20px;
        position: absolute;
        bottom:0;
        left:0;
        text-align: center;
      }
    }
    &:hover{
      cursor: pointer;
      border-color: #00afff;
      box-shadow: 0 0 2px black;
      .examName{
        color:#00afff!important;
      }
    }

    .info{
      height: calc(100% - 100px);
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      column-gap: 10px;

      .examName{
        height: 66px;
        margin-bottom: 30px;
        font-size:24px;
        font-weight: bold;

        color:#000;
        overflow: hidden;
        text-overflow: ellipsis;
        //white-space: nowrap;
        display: -webkit-box;
        word-break: break-word;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;

      }
    }
    .middle,.bottom,.examCutoffTime
    {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      column-gap: 10px;
      padding: 10px 0;
    }
    .bottom{
      flex-direction: column;
      row-gap: 20px;

    }
    .durction,.some1{
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      column-gap: 10px;
    }
    .label{
      font-weight: bold;
      font-size: 16px;
      color:gray;
    }
    .content{
      font-size:18px;
      color:black;
    }



  }
</style>


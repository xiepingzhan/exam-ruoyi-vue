<template>
  <div>
    <!-- 一道道答題 -->
    <singeleQuestion
      ref="singleQuestion"
      type="single"
      v-if="singleable"
      @changeData="changeData"
      :TESTPAPER_ID="pageParams.FID"
      :examId="pageParams.examId"
      :EXID="pageParams.TESTPAPER_ID"/>
    <!-- 答题全部展开 -->
    <not-single-question
      ref="notSingleQuestion"
      type="noSingle"
      v-if="notSingleable"
      :TESTPAPER_ID="pageParams.FID"
      :EXID="pageParams.TESTPAPER_ID"
      :examId="pageParams.examId"
      @changeData="changeData"
    />
  </div>
</template>
<script>
import singeleQuestion from './singeleQuestion.vue'
import notSingleQuestion from './notSingleQuestion.vue'

export default {
  components: {
    singeleQuestion,
    notSingleQuestion
  },
  data(){
    return{
      singleable:false,
      notSingleable:false,
      pageParams:{}
    }
  },
  mounted() {
    if (JSON.stringify(this.$route.query) != '{}') {
      this.pageParams = this.$route.query;
    }
    this.$nextTick(()=>{
      let {isalone, FID, TESTPAPER_ID} = this.pageParams;
      if (isalone == 'true') {
        // 一道道回答
        this.singleable = true;
        this.$nextTick(() => {
          this.$refs.singleQuestion.visible = true;
        })
      } else {
        this.notSingleable = true;
        this.$nextTick(() => {
          this.$refs.notSingleQuestion.visible = true;
        })
      }
    })
  },
  methods:{
    // 更新作答id
    changeData(EXID, examinationrecordId) {
      // this.pageParams.TESTPAPER_ID = examinationrecordId;
      // this.$route.query.TESTPAPER_ID = examinationrecordId
      // console.log(this.$route,"route");
      debugger
      let route = this.$router.resolve(
        {
          path:this.$route.path,
          query:{
            ...this.pageParams,
            TESTPAPER_ID:examinationrecordId
          }
        }
      )
      window.open(route.href,'_self')
    },
  }
}
</script>

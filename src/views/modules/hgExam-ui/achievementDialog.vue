<template>
  <el-dialog class="hgExam"
             :title="title"
             :visible.sync="visible"
             :before-close="closeDialog"
             :close-on-click-modal="false"
              width="75%"
  >
    <template slot="title">
      <div><span class="hightColor">{{title}}&nbsp;</span>成绩</div>
    </template>
    <el-card style="border-radius: 5px;">
      <achievement_user_list
        :FID="testpaperId"
        :examId="examId"
        :isPy="isPy"
        :nowMsg="msg"/>
    </el-card>
  </el-dialog>
</template>
<script>
import achievement_user_list from "./achievement_user_list";

export default {
  components: {
    achievement_user_list
  },
  props:['testpaperId','msg','isPy','examId'],
  data() {
    return {
      title: 'xxx试卷成绩',
      visible: false,
    }
  },
  methods: {
    //关闭弹框事件
    closeDialog() {
      this.$emit('closeDialog')
    },

  }
}
</script>
<style lang="scss" scoped>
.hightColor{
  color:#409EFF;
}
</style>

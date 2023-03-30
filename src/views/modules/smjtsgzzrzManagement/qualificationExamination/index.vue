<!--资格认证考核-->
<template>
  <havingExam/>
  <!--  <div class="app-container">-->
  <!--  <el-tabs-->
  <!--    v-model="activeIndex"-->
  <!--    stretch-->
  <!--    type="border-card"-->
  <!--  >-->
  <!--    <el-tab-pane label="资质考核" name="first"/>-->
  <!--    <el-tab-pane label="资质认证" name="second"/>-->
  <!--  </el-tabs>-->
  <!--  <el-card>-->
  <!--    <step1 v-if="activeIndex==='first'" />-->
  <!--    <step2 v-if="activeIndex==='second'" />-->
  <!--  </el-card>-->
  <!--  </div>-->
</template>

<script>
import step2 from "@/views/modules/smjtsgzzrzManagement/qualificationExamination/step2";
import step1 from "@/views/modules/smjtsgzzrzManagement/qualificationExamination/step1";
import havingExam from '@/views/modules/hgExam-ui/myExamtion/testpaperMy/index'

export default {
  components: {
    // step2,
    // step1
    havingExam
  },
  data() {
    return {
      activeIndex: "first"
    }
  },
}
</script>
<style scoped lang="scss">
::v-deep .el-tabs {
  .el-tabs__content {
    display: none;
  }
}
</style>

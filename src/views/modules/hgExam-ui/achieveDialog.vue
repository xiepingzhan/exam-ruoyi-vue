<template>
  <el-dialog title="成绩" class="hgExam" :close-on-click-modal="false"
  :visible.sync="visible"
  width="70%"
  :before-close="closeDialog"

  >
    <Achievement_list :msg="msg" :FID="TESTPAPER_ID" :examId="examId" @changeId="changeId" />
  </el-dialog>
</template>

<script>
import Achievement_list from './achievement/achievement_list.vue';

export default {
    props: {
        msg: {
            default: "manage",
            type: String
        },
        TESTPAPER_ID: {
            default: null,
            type: String
        },
        examId:{
          default: undefined,
          type: String
        },
    },methods:{
        changeId(value){
            this.$emit('changeId',value)
        },
        closeDialog(){
            this.$emit('closeDialog')
        },
    },
    data(){
        return {
            visible:false
        }
    },
    components: { Achievement_list }
}
</script>

<style>

</style>

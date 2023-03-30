<template>
  <el-dialog
    :title="title"
    class="hgExam"
    :visible.sync = 'visible'
    :before-close="closeDialog"
    :close-on-click-modal="false"
    width="40%"
  >
    <el-card >
      <div id="print" class="print-container">
        <!--      证件类型-->
        <div class="top">
          <h2>xxxx证件资质认证</h2>
        </div>
        <!--      图片-->
        <div class="middle-0">
          <div>
            <img :src="require('@/assets/logo/logo.png')" alt="头像" width="80px" height="80px">
          </div>
        </div>
        <!--      姓名-->
        <div class="middle-1">
          <div>龙龙</div>
        </div>
        <!--      编号-->
        <div class="bottom">
          0011221210121221
        </div>
      </div>
      <div style="text-align: center">
        <el-button v-print="printObj" type="primary" icon="el-iconn-download">下载</el-button>
      </div>
    </el-card>

  </el-dialog>
</template>

<script>
export default {
  name: "dialog",
  data(){
    return{
      title:'证件下载',
      visible:false,
      printObj: {
        id: "print",
        preview: false,
        popTitle:'',
        // extraCss: "https://cdn.bootcdn.net/ajax/libs/animate.css/4.1.1/animate.compat.css, https://cdn.bootcdn.net/ajax/libs/hover.css/2.3.1/css/hover-min.css",
        // extraHead: '<meta http-equiv="Content-Language"content="zh-cn"/>',

      }
    }
  },
  methods:{
    closeDialog(){
      this.$emit('closeDialog')
    },

  }
}
</script>

<style scoped lang="scss">
  .print-container{
    height: 400px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
  }
  .top{
    flex:1;
    text-align: center;
    h2{
      text-align: center;
      word-break: break-all;
    }
  }
  .middle-0{
    flex:1;
    width: 100%;
    height: 100%;
    text-align: center;
  }
  .middle-1{
    flex:1;
    text-align: center;
    width: 100%;
  }
  .bottom{
    flex:1;
    text-align: center;
  }
  .middle-1,.middle-0{
    position: relative;
  }
  .middle-1>div,middle-0>div{
    transform: translate(-50%, -50%);
    position: absolute;
    left: 50%;
    top: 50%;
  }
</style>

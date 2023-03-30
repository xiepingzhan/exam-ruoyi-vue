<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    :close-on-click-modal="false"
    :before-close="closeDialog"
    width="40%"
  >
    <vue-core-video-player
      ref="myVideoPlayer"
      :autoplay="false"
      :src="[{src:require('@/assets/20230224_170321.mp4')}]"
      @play="play"
      @pause='pause'
      @loadeddata="loadeddata"
      @loadedmetadata="loadedmetadata"

    />
    <div v-if="false" slot="footer" style="text-align: right">
      <el-button type="primary" size="small" @click="handleSubmit">确定</el-button>
      <el-button size="small" @click="closeDialog">取消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import {debounce} from "lodash";
import service from "@/utils/request";
import learning from  '@/mixins/digitalizationResource/learning'
export default {
  mixins:[learning],
  data() {
    return {
      visible: false,
      title: '视频播放',
    }
  },
  props: {
    id: {
      type: String,
      default: undefined
    },
    currentObj: {
      type: Object,
      default: () => {
      }
    },
    exportUrl: {
      type: Object,
      default: () => {
        return {
          info: undefined,
          addOrEdit: undefined,//根据传入id判断
        }
      }
    }
  },
  mounted() {
    this.init()
    },
  methods: {
    init() {
      if (this.id) {
        //  修改
        this.title = "修改"
        this.queryForm = Object.assign({}, this.currentObj);
        this.visible = true;
        //  接口
      } else {
        //  新增
        // this.title = "新增"
        this.visible = true;
      }
    },
    play(event){
      console.log(event,"evnet")
      // event.target.currentTime = 10
      console.log('onplay')
    },
    pause(event){
      console.log(event,"evnet")
      // event.target.currentTime = 12
      console.log('onpause')
      console.log(event.target.currentTime,"22222222222222222222222");
    },
    loadeddata(event){
      console.log(event,'event')
      console.log('onloadeddata')
      event.target.currentTime = 12

    },
    loadedmetadata(event){
      // console.log(event,'event')
      // console.log('onloadedmetadata')
      // event.target.currentTime = 15
    },

    handleSubmit: debounce(function() {
      this.$refs.queryForm.validate((valid) => {
        if (valid) {
          this.$emit('uploadList',this.queryForm,this.id?'edit':'add')
          this.closeDialog()
          return
          service({
            method: this.id ? 'put' : 'post',
            url: this.exportUrl.addOrEdit,
            data: {...this.queryForm}
          }).then(res => {
            let {code} = res;
            if (code !== 200) return false;
            this.$emit('uploadList',this.queryForm,this.id?'edit':'add')
            this.closeDialog()
          })
        }
      })
    }, 800),
    closeDialog() {
      // this.$refs.myVideoPlayer.pause()
      // return
      this.$emit('closeDialog')
    }
  }
}
</script>

<template>
    <el-dialog :title="title" :visible.sync="visible" width="400px" append-to-body :before-close="closeDialog">
      <el-upload
        ref="upload"
        :limit="limitNum"
        :accept="acceptType"
        :headers="upload.headers"
        :action="defaultUrl + '/importData' + '?updateSupport=' + upload.updateSupport"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="false"
        drag>
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip text-center" slot="tip" v-if="showTip">
          <!-- <div class="el-upload__tip" slot="tip" >
                  <el-checkbox v-model="upload.updateSupport" /> 是否更新已经存在的数据
              </div> -->
          <span>{{ tipText }}</span>
          <el-link type="primary" v-show="isDownload" :underline="false"
                   style="font-size:12px;vertical-align: baseline;"
                   @click="importTemplate">下载模板
          </el-link>
        </div>
      </el-upload>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitFileForm">确 定</el-button>
            <el-button @click="closeDialog">取 消</el-button>
        </div>
    </el-dialog>
</template>

<script>
import { getToken } from "@/utils/auth";
export default {
    props:{
        // 是否禁用上传
        isUploading:{
            type:Boolean,
            default:false
        },
        // 上传类型
        acceptType:{
            type:String,
            default:'.xlsx, .xls'
        },
        // 上传限制
        limitNum:{
            type:Number,
            default:1
        },
        // 是否具备下载模板
        isDownload:{
            type:Boolean,
            default:true
        },
        // 提示框信息展示
        showTip:{
            type:Boolean,
            default:true
        },
        // 提示内容
        tipText:{
            type:String,
            default:'仅允许导入xls、xlsx格式文件。'
        },
        baseUrl:{
            type:String,
            default:"/system/user/importData"
        },
        fileName:{
            type:String,
            default:''
        }

    },
    data(){
        return {
            title: "导入",
            visible: false,
            defaultUrl:process.env.VUE_APP_BASE_API+this.baseUrl,
            upload: {
                // 是否显示弹出层
                // 弹出层标题
                isUploading:false,
                // 是否更新已经存在的数据
                updateSupport: 0,
                // 设置上传的请求头部
                headers: { Authorization: "Bearer " + getToken() },
            },
        }
    },
    mounted(){
        this.upload.isUploading = this.isUploading
    },
    methods: {
        closeDialog(){
            this.$emit('closeDialog')
        },
        /** 下载模板操作 */
        importTemplate() {
            this.download(process.env.VUE_APP_BASE_API + this.baseUrl + '/importTemplate', {
            }, `${this.fileName}_${new Date().getTime()}.xlsx`)
        },
        // 文件上传中处理
        handleFileUploadProgress(event, file, fileList) {
            this.upload.isUploading = true;
        },
        // 文件上传成功处理
        handleFileSuccess(response, file, fileList) {
            // this.upload.open = false;
            this.visible = false;
            this.upload.isUploading = false;
            this.$refs.upload.clearFiles();
            this.$alert("<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + response.msg + "</div>", "导入结果", { dangerouslyUseHTMLString: true });
            this.$emit('uploadList')
        },
        // 提交上传文件
        submitFileForm() {
            this.$refs.upload.submit();
            this.$emit('closeDialog')
            this.$emit('uploadList')
        }
    }
}
</script>


<style lang="scss" scoped>
::v-deep .el-upload{
  width: 100%;
  .el-upload-dragger{
    width: 100%;
  }
}
</style>

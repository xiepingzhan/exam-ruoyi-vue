<template>
    <el-dialog :title="title" append-to-body width="25rem" :close-on-click-modal="false" :visible.sync="visible"
        :before-close="closeDialog">
        <el-upload ref="upload" :limit="limit" :accept="accept" :headers="upload.headers" action=""
            :disabled="isUploading" :on-change="onChange" :before-upload="beforeUploadClick"
            :on-progress="handleFileUploadProgress" :on-success="handleFileSuccess" multiple :http-request="httpRequest"
            :auto-upload="false" :before-remove="beforeRemove" drag>
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip text-center" slot="tip">
                <div class="el-upload__tip" slot="tip">
                    <!-- <el-checkbox v-model="upload.updateSupport" /> 
                    是否更新已经存在的用户数据 -->
                </div>
                <span>仅允许导入png,img,jpg格式文件。</span>
                <!-- <el-link type="primary" :underline="false" style="font-size:12px;vertical-align: baseline;"
                    @click="importTemplate">下载模板</el-link> -->
            </div>
        </el-upload>
        <div slot="footer" class="dialog-footer" style="text-align:center">
            <el-button type="primary" @click="saveClick">保存</el-button>
            <el-button type="primary" @click="closeDialog">关闭</el-button>
        </div>
    </el-dialog>
</template>

<script>
import { getToken } from "@/utils/auth";
import { saveFile } from '@/api/hgExam-ui/testpaper_picture'
import axios from 'axios'
export default {
    data() {
        return {
            title: '上传文件',
            visible: false,
            fileList: [],//文件上传列表
            upload: {
                // 是否显示弹出层（用户导入）
                open: false,
                // 弹出层标题（用户导入）
                title: "",
                // 是否禁用上传
                isUploading: false,
                // 是否更新已经存在的用户数据
                updateSupport: 0,
                // 设置上传的请求头部
                headers: { Authorization: "Bearer " + getToken() },
                // 上传的地址
                url: process.env.VUE_APP_BASE_API + this.uploadFileUrl
            },

        }
    },
    props: {
        accept: {
            type: String,
            default: '.png, .jpg,.img'
        },
        limit: {
            type: Number,
            default: 5
        },
        isUploading: {
            type: Boolean,
            default: false
        },
        baseUrl: {
            type: String,
            default: process.env.VUE_APP_BASE_API
        },
        uploadFileUrl: {
            type: String,
            default: process.env.VUE_APP_BASE_API + '/system/file/saveFile'
        }, // 上传文件服务器地址
        PARENT_ID: {
            type: String,
            default: '0'
        }
    },
    methods: {
        beforeUploadClick(file) {
        },
        onChange(file, fileList) {
            this.fileList = fileList
        },
        beforeRemove(file, fileList) {
            let index = this.fileList.findIndex(item => item.name == file.name)
            this.fileList.splice(index, 1)
        },
        httpRequest(option) {
            this.fileList.push(option)
        },
        saveClick() {
            let formData = new FormData();
            formData.append('parentId', this.PARENT_ID)

            // 使用form表单的数据格式
            this.fileList.forEach(item => {
                formData.append('file', item.raw)
            })
            console.log(formData,formData,"fileListfileList")
            // return
                        saveFile(formData,{
                            headers: { "Content-Type": "multipart/form-data" } //设置请求头请求格式为JSON
                        }).then(res => {
                            this.$emit('uploadThem')
                            this.$emit('closeDialog')
            })

        },
        closeDialog() {
            this.$emit('closeDialog')
        },
        /** 下载模板操作 */
        importTemplate() {
            // this.download('system/user/importTemplate', {
            // }, `user_template_${new Date().getTime()}.xlsx`)
        },
        // 文件上传中处理
        handleFileUploadProgress(event, file, fileList) {
            this.upload.isUploading = true;
        },
        // 文件上传成功处理
        handleFileSuccess(response, file, fileList) {
            this.upload.open = false;
            this.upload.isUploading = false;
            this.$refs.upload.clearFiles();
            this.$alert("<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + response.msg + "</div>", "导入结果", { dangerouslyUseHTMLString: true });
            this.$emit('uploadThem')
        },
    }
}
</script>

<style>

</style>
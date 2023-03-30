<template>
    <el-dialog class="hgExam" :title="title" :visible.sync="visible" :before-close="closeDialog" :append-to-body="true"
        :close-on-click-modal="false" width="40%">
        <el-card>
            <el-form :model="pd" ref="pd" :rules="rules" size="mini" label-width="80px" style="text-align: justify;">
                <el-form-item label="目录名" prop="name">
                    <el-input v-model="pd.name" placeholder="这里输入目录名"></el-input>
                </el-form-item>
                <el-form-item label="备注说明" prop="remarks">
                    <el-input v-model="pd.remarks" maxlength="255" placeholder="这里输入备注说明" type="textarea" :rows="4"
                        resize="none"></el-input>
                </el-form-item>
                <el-form-item style="text-align:center">
                    <el-button type="primary" @click="save">保存</el-button>
                    <el-button @click="closeDialog">取消</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </el-dialog>
</template>

<script>
import { saveFile, putFile, getFile } from '@/api/hgExam-ui/testpaper_picture.js'
export default {
    props: {
        PICTURE_ID: {//当前节点Id
            default: ''
        }
    },
    data() {
        return {
            title: '创建目录',
            visible: false,
            pd: {
                name: '',
                remarks: ''
            },
            rules: {
                name: [{ required: true, message: '请输入目录名', trigger: 'blur' }],
                remarks: [{ required: true, message: '请输入备注说明', trigger: 'blur' }]
            },
            currentObj:null,
            PARENT_ID:'0',//父节点Id
        }
    },
    watch:{
        title(nV){
            if(nV){
                this.init()
            }
        }
    },
    methods: {
        init() {
            if (this.title == '创建目录') {
                // 新增
                this.PARENT_ID = '0'
            } else {
                if(this.PICTURE_ID!=''){
                    this.getInfo()
                }else{
                    console.log(this.PICTURE_ID,"PICTURE_ID")
                }
            }
        },
        getInfo() {
            getFile(this.PICTURE_ID).then(res => {
                let { code, msg, data } = res;
                if (code != 200) return this.$modal.msgError(msg)
                this.currentObj = data;
                this.pd.name = data.originalFileName;
                this.pd.remarks = data.remark;
                this.PARENT_ID = data.parentId
            })
        },
        closeDialog() {
            this.$emit('closeDialog')
        },

        //去保存
        save() {
            this.$refs.pd.validate(valid => {
                if (valid) {
                    if (this.title == '创建目录') {
                        this.addFolder();
                    } else {
                        this.editFolder()
                    }
                }
            })
        },

        //添加目录
        addFolder() {
            //发送 post 请求提交保存
            let formData = new FormData()
            formData.append('tm', new Date().getTime())
            formData.append('originalFileName', this.pd.name)
            formData.append('remark', this.pd.remarks)
            formData.append('parentId', this.PARENT_ID)
            saveFile(formData).then(res => {
                let { code, msg } = res;
                if (code != 200) return this.$modal.msgError(msg);
                this.$modal.msgSuccess('目录创建成功')
                this.closeDialog()
                this.$emit('uploadTree')

            })
        },
        // 修改目录
        editFolder() {
            let { originalFileName, remark, ...others } = this.currentObj;
            let data = { originalFileName: this.pd.name, remark: this.pd.remarks, ...others }

            putFile(data).then(res => {
                let data = res;
                let { code, msg } = res;
                if (code != 200) return this.$modal.msgError(msg);
                this.$modal.msgSuccess('目录修改成功')
                this.closeDialog()
                this.$emit('uploadTree')
            })
        }
    },

    mounted() {
        // this.init()
    }
}
</script>

<style>

</style>
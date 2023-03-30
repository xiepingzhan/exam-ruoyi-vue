<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    :close-on-click-modal="false"
    :before-close="closeDialog"
    width="40%"
  >
    <el-form
      size="small"
      :model="queryForm"
      label-position="right"
      label-width="100px"
      ref="queryForm"
    >
      <el-form-item
        label="证件名称"
        prop="zjmc"
        :rules="[{required:true,message:'请输入证件名称',trigger:'blur'}]"
      >
        <el-input
          v-model="queryForm.zjmc"
          placeholder="请输入证件名称"
          clearable
        />
      </el-form-item>
      <el-form-item
        label="证件描述"
        prop="zjms"
        :rules="[{required:true,message:'请输入证件描述',trigger:'blur'}]"
      >
        <el-input
          v-model="queryForm.zjms"
          placeholder="请输入证件描述"
          type="textarea"
          maxlength="255"
          show-word-limit
          :rows="4"
          clearable
          resize="none"
        />
      </el-form-item>
    </el-form>
    <div slot="footer" style="text-align: right">
      <el-button type="primary" size="small" @click="handleSubmit">确定</el-button>
      <el-button size="small" @click="closeDialog">取消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import {debounce} from "lodash";
import service from "@/utils/request";

export default {
  data() {
    return {
      queryForm: {
        zjmc: undefined,
        zjms: undefined
      },
      visible: false,
      title: '新增',
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
        this.title = "新增"
        this.visible = true;
      }
    },
    handle1() {

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
      this.$emit('closeDialog')
    }
  }
}
</script>

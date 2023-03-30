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
        v-for="(item,index) in formList"
        :key="index"
        v-show="item.isSearch"
        :label="item.label"
        :prop="item.prop">
        <template v-if="item.type==='input'">
          <el-input
            v-model="queryForm[item.prop]"
            :placeholder="item.placeholer"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </template>
        <template v-if="item.type==='select'">
          <el-select
            v-model="queryForm[item.prop]"
            :placeholder="item.placeholer"
            clearable
            @keyup.enter.native="handleQuery"
          >
            <el-option
              v-for="(opt,optIndex) in dict[item.prop]"
              :key="optIndex"
              :label="opt.label"
              :value="opt.value"
            ></el-option>
          </el-select>
        </template>
      </el-form-item>
      <el-form-item label="附件上传">
        <el-upload
          ref="myUpload"
          action="#"
        >
          <el-button type="primary" >附件上传</el-button>
        </el-upload>
      </el-form-item>
      <el-table :data="fileList">
        <el-table-column label="名称" prop="name" show-overflow-tooltip align="center"></el-table-column>
        <el-table-column label="大小" prop="size" show-overflow-tooltip align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template v-slot="scope">
            <el-button type="text" >预览</el-button>
            <el-button type="text" icon="el-icon-delete">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
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
import classies from  '@/mixins/jtsgal/classies'
export default {
  mixins:[classies],
  data() {
    return {
      fileList:[{name:'未解之谜--100',size:100}],
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

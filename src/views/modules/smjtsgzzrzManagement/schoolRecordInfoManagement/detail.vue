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
        label="学生姓名"
        prop="username"
        :rules="[{required:true,message:'请输入学生姓名',trigger:'blur'}]"
      >
        <el-input
          v-model="queryForm.username"
          placeholder="请输入学生姓名"
          clearable
        />
      </el-form-item>
     <el-row>
       <el-col :span="12">
         <el-form-item
           label="性别"
           prop="sex"
           :rules="[{required:true,message:'请输入性别',trigger:'blur'}]"
         >
           <el-radio-group v-model="queryForm.sex">
             <el-radio label="男" >男</el-radio>
             <el-radio label="女" >女</el-radio>
           </el-radio-group>
         </el-form-item>

       </el-col>
       <el-col :span="12">
         <el-form-item
           label="年龄"
           prop="age"
           :rules="[{required:true,message:'请输入年龄',trigger:'blur'}]"
         >
           <el-input-number
             style="width: 100%"
             v-model="queryForm.age"
             placeholder="请输入年龄"
             clearable
             :controls="false"
           />
         </el-form-item>
       </el-col>
     </el-row>
      <el-form-item
        label="手机号"
        prop="phonenumber"
        :rules="[{required:true,message:'请输入手机号',trigger:'blur'}]"
      >
        <el-input
          v-model="queryForm.phonenumber"
          placeholder="请输入手机号"
          clearable
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
        username: undefined,
        age: undefined,
        phonenumber: undefined,
        sex: undefined
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

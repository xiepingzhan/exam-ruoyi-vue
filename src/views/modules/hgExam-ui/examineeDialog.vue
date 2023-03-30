<template>
  <el-dialog
    :title="title"
    :before-close="closeDialog"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="40%"
  >
    <!--    <el-card type="border-card">-->
    <el-form
      label-width="5rem"
      label-position="right"
      ref="queryForm"
      size="small"
      :model="queryForm"
      :disabled="!isEdit"
    >
      <el-form-item
        label="考试名称"
        prop="examName"
        :rules="[{required:true,message:'请输入考试名称',trigger:'blur'}]">
        <el-input v-model="queryForm.examName" placeholder="请输入考试名称" clearable></el-input>
      </el-form-item>
      <el-form-item
        label="试卷名称"
        prop="testpaperId"
        :rules="[{required:true,message:'请选择试卷名称',trigger:'blur'}]"
      >
        <el-select
          v-model="queryForm.testpaperId"
          clearable
          filterable
          style="width:100%"
          placeholder="请选择试卷名称"
        >
          <el-option
            v-for="(item,index) in testPaperList"
            :key="index"
            :label="item.title"
            :value="item.testpaperId"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="人员分组"
        prop="groups_old"
        :rules="[{required:true,message:'请选择人员分组',trigger:'blur'}]"
      >
        <el-select
          placeholder="人员分组"
          v-model="queryForm.groups_old"
          style="width:100%"
          multiple
          @change="$forceUpdate()"
        >
          <el-option
            v-for="(item, index) in ryfzList"
            :label="item.dictLabel"
            :value="item.dictValue"
            :key="index"/>
        </el-select>
      </el-form-item>
      <el-form-item
        label="证件名称"
        prop="card_type"
        :rules="[{required:false,message:'请选择证件名称',trigger:'blur'}]"
      >
        <el-select
          placeholder="证件名称"
          v-model="queryForm.card_type"
          style="width:100%"
          multiple
          @change="$forceUpdate()"
        >
          <el-option
            v-for="(item, index) in []"
            :label="item.dictLabel"
            :value="item.dictValue"
            :key="index"/>
        </el-select>
      </el-form-item>
      <el-form-item
        prop="examCutoffTime"
        label="截止日期"
        :rules="[{required:true,message:'请选择截止日期',trigger:'blur'}]">
        <el-date-picker
          v-model="queryForm.examCutoffTime"
          type="date"
          style="width:100%!important;"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          placeholder="截止日期"
          :picker-options="pickerOptions"
        />
      </el-form-item>
    </el-form>
    <!--    </el-card>-->
    <div slot="footer" v-if="isEdit">
      <el-button type="primary" size="small" @click="handleSubmit">{{ isCreated ? '修改' : '组建考试' }}</el-button>
      <el-button size="small" @click="closeDialog">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import serice from "@/utils/request";

export default {
  name: "examineeDialog",
  props: {
    selection: {
      type: Array,
      default: () => []
    },
    //是否可以编辑
    isEdit: {
      type: Boolean,
      default: true
    },
    //是否可以编辑
    isCreated: {
      type: Boolean,
      default: false
    },
    //人员分组
    ryfzList: {
      type: Array,
      default: () => []
    },
    // 试卷列表
    testPaperList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      visible: false,
      title: '组建考试',
      queryForm: {
        groups_old: undefined,
        testpaperId: undefined,
        examName: undefined,
        examCutoffTime: undefined
      },
      //截止日期 配置项
      pickerOptions: {
        disabledDate: currentTime => {
          let currentS = new Date(this.parseTime(new Date(currentTime).getTime(), '{y}-{m}-{d}')).getTime();
          let now = new Date(this.parseTime(new Date().getTime(), '{y}-{m}-{d}')).getTime();
          return currentS < now ? true : false
        },
      },
    }
  },
  methods: {
    closeDialog() {
      this.$emit('closeDialog')
    },

    handleSubmit() {
      this.$refs.queryForm.validate(valid => {
        if (valid) {
          let params = {
            ...this.queryForm
          }
          if (this.queryForm.groups_old) {
            params.groupstr = this.queryForm.groups_old.join(',')
          }
          if (this.queryForm.testpaperId) {
            params.title = this.testPaperList.find(item => item.testpaperId === this.queryForm.testpaperId).title
          }

          serice({
            method: this.isCreated ? 'put' : 'post',
            url: this.isCreated ? "/examobj/modifiedexam" : '/examobj/addexam',
            data: {
              ...params
            }
          }).then(res => {
            let {code, msg} = res;
            if (code != 200) return false;
            let txt = this.isCreated ? "修改成功" : "组建试卷成功"
            this.$message.success(txt)
            this.$emit('uploadList')
            this.closeDialog()
          })

        }
      })
    }
  }
}
</script>

<style scoped>

</style>

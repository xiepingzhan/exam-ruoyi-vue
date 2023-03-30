<template>
  <!--  试卷模板-->
  <div class="app-container testpaper_list">
    <el-row>
      <el-col>
        <el-form inline ref="myForm" :rules="rules" :model="form" size="mini">
          <el-form-item label="考试名称" prop="examName">
            <el-input v-model="form.examName" placeholder="请输入考试名称" clearable></el-input>
          </el-form-item>
          <el-form-item label="考试名称" prop="title" v-show="false">
            <el-input v-model="form.title" placeholder="请输入试卷名称" clearable></el-input>
          </el-form-item>
          <el-form-item label="试卷名称" prop="testpaperId" v-show="false">
            <el-select
              v-model="form.testpaperId"
              clearable
              filterable
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
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="searchBtn">搜索</el-button>
            <el-button icon="el-icon-refresh" @click="refreshBtn">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col>
        <el-row :gutter="10" style="margin-bottom: 1rem">
          <el-col :span="1.5">
            <el-button
              size="small"
              type="primary"
              @click="createExam"
            >新增
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              size="small"
              @click="handleDelete(null)"
            >删除
            </el-button>
          </el-col>
        </el-row>
        <el-table
          :data="tableList"
          @selection-change="selectChange"
          style="width: 100%">
          <el-table-column type="selection"/>
          <el-table-column show-overflow-tooltip label="考试名称" prop="examName"/>
          <el-table-column show-overflow-tooltip label="试卷名称" prop="title"/>
          <el-table-column show-overflow-tooltip label="证件名称" prop="card_name"/>
          <el-table-column label="考试截止时间" prop="examCutoffTime"/>
          <el-table-column width="320" align="center" fixed="right" label="操作">
            <template slot-scope="{row:data}">
              <el-button
                size='mini'
                type="primary"
                title="预览试卷"
                @click="view(data)">
                预览
              </el-button>
              <el-button
                size='mini'
                title="发放试卷"
                @click="grant(data)"
                type="primary">
                发放
              </el-button>
              <el-button
                size='mini'
                title="修改"
                @click="goEdit(data)"
                style="cursor:pointer;">
                修改
              </el-button>
              <el-button
                size='mini'
                title="删除"
                @click="handleDelete(data)"
                style="cursor:pointer;"
              >删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="initList"/>
      </el-col>
    </el-row>
    <!-- 预览 -->
    <yl-dialog-vue
      ref="yulan"
      v-if="ylable"
      :FID="FID"
      @closeDialog="ylable = false"/>
    <!--创建试卷-->
    <examinee-dialog
      v-if="examable"
      ref="examobj"
      :ryfzList="ryfzList"
      :isCreated="isCreated"
      :testPaperList="testPaperList"
      @closeDialog="closeDialog"
      @uploadList="initList"
    />
  </div>
</template>

<script>
import testpaper_list from '@/mixins/view-testpaper-list'
import ExamineeDialog from "@/views/modules/hgExam-ui/examineeDialog";
import serice from "@/utils/request";

export default {
  components: {ExamineeDialog},
  mixins: [testpaper_list],
  data() {
    return {
      STATE: "edit",
      examable: false,
      //人员分组
      ryfzList: [],
      //  试卷列表
      testPaperList: [],
      //  查询表单
      form: {
        examName: undefined,
        testpaperId: undefined,
        title: undefined,
        groups_old: undefined,
      },
      isCreated: false,
    }
  },
  created() {
    this.getTestPaper();
    this.initRyfz()
  },
  mounted() {
    this.initList()
  },
  methods: {
    searchBtn() {
      this.queryParams.pageNum = 1;
      this.queryParams.pageSize = 10;
      this.initList();
    },
    refreshBtn() {
      this.queryParams.pageNum = 1;
      this.queryParams.pageSize = 10;
      this.resetForm('myForm');
      this.initList()
    },
    //新增入口
    createExam() {
      this.examable = true;
      this.isCreated = false;
      this.$nextTick(() => {
        this.$refs.examobj.visible = true;
      })
    },
    goEdit(data) {
      this.examable = true;
      this.isCreated = true;
      this.$nextTick(() => {
        this.$refs.examobj.title = "修改考试";
        this.$refs.examobj.visible = true;
        this.$refs.examobj.queryForm = JSON.parse(JSON.stringify(data));
        this.$refs.examobj.queryForm.groups_old = this.$refs.examobj.queryForm.groupstr.split(',')
      })
    },
    //  人员分组
    initRyfz() {
      serice({
        method: 'get',
        url: '/system/group/info',
        params: {
          tm: new Date().getTime()
        }
      }).then(data => {
        if (data && data.length > 0) {
          this.ryfzList = data.map(item => {
            return {
              dictLabel: item.zb,
              dictValue: item.zb
            }
          })
        }
      })
    },
    closeDialog() {
      this.examable = false
    },
    //删除
    handleDelete(row) {
      let ids = '';
      if (row) {
        //  内部删除
        ids = row.examId;
      } else {
        //  顶部删除
        if (this.selection.length === 0) return this.$modal.msgWarning("请选择要删除的数据")
        ids = this.selection.map(item => item.examId).join(",")
      }
      this.$modal.confirm("是否进行删除？").then(_ => {
        serice({method: 'delete', url: `examobj/delexam/${ids}`}).then(res => {
          let {code, msg} = res;
          if (code != 200) return false;
          this.$modal.msgSuccess("删除成功")
          this.initList()
        })
      })
    },

  }
}
</script>

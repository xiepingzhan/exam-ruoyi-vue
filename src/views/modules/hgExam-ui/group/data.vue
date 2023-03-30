<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">

      <el-form-item label="单位" prop="unit">
        <el-input
          v-model="queryParams.unit"
          placeholder="请输入单位"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="姓名" prop="username">
        <el-input
          v-model="queryParams.username"
          placeholder="请输入姓名"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="部职别" prop="bzb">
        <el-input
          v-model="queryParams.bzb"
          placeholder="请输入部职别"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="军衔" prop="jx">
        <el-input
          v-model="queryParams.jx"
          placeholder="请输入军衔"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="组别" prop="zb">
        <el-input
          v-model="queryParams.zb"
          placeholder="请输入组别"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="考试号" prop="ksh">
        <el-input
          v-model="queryParams.ksh"
          placeholder="请输入考试号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="身份证号" prop="sfzh">
        <el-input
          v-model="queryParams.sfzh"
          placeholder="请输入身份证号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="联系方式" prop="lxfs">
        <el-input
          v-model="queryParams.lxfs"
          placeholder="请输入联系方式"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:group:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:group:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:group:remove']"
        >删除</el-button>
      </el-col>
  <!--      <el-col :span="1.5">-->
  <!--            <el-button-->
  <!--              type="info"-->
  <!--              plain-->
  <!--              icon="el-icon-upload2"-->
  <!--              size="mini"-->
  <!--              @click="handleImport"-->
  <!--              v-hasPermi="['system:group:import']"-->
  <!--            >导入</el-button>-->
  <!--      </el-col>-->
  <!--      <el-col :span="1.5">-->
  <!--        <el-button-->
  <!--          type="warning"-->
  <!--          plain-->
  <!--          icon="el-icon-download"-->
  <!--          size="mini"-->
  <!--          @click="handleExport"-->
  <!--          v-hasPermi="['system:group:export']"-->
  <!--        >导出</el-button>-->
  <!--      </el-col>-->
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="groupList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <!-- <el-table-column label="主键id" align="center" prop="groupId" />
      <el-table-column label="用户id" align="center" prop="userId" /> -->
      <el-table-column label="单位" align="center" prop="unit" />
      <el-table-column label="姓名" align="center" prop="username" />
      <el-table-column label="部职别" align="center" prop="bzb" />
      <el-table-column label="军衔" align="center" prop="jx" />
      <el-table-column label="组别" align="center" prop="zb" />
      <el-table-column label="考试号" align="center" prop="ksh" />
      <el-table-column label="身份证号" align="center" prop="sfzh" />
      <el-table-column label="联系方式" align="center" prop="lxfs" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:group:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:group:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改人员-分组对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <!-- <el-form-item label="用户id" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入用户id" />
        </el-form-item> -->
        <el-form-item label="单位" prop="unit">
          <el-input v-model="form.unit" placeholder="请输入单位" />
        </el-form-item>
        <el-form-item label="姓名" prop="username">
          <el-input v-model="form.username" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="部职别" prop="bzb">
          <el-input v-model="form.bzb" placeholder="请输入部职别" />
        </el-form-item>
        <el-form-item label="军衔" prop="jx">
          <el-input v-model="form.jx" placeholder="请输入军衔" />
        </el-form-item>
        <el-form-item label="组别" prop="zb">
          <el-input v-model="form.zb" placeholder="请输入组别" />
        </el-form-item>
        <el-form-item label="考试号" prop="ksh">
          <el-input v-model="form.ksh" placeholder="请输入考试号" />
        </el-form-item>
        <el-form-item label="身份证号" prop="sfzh">
          <el-input v-model="form.sfzh" placeholder="请输入身份证号" />
        </el-form-item>
        <el-form-item label="联系方式" prop="lxfs">
          <el-input v-model="form.lxfs" placeholder="请输入联系方式" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <FileImport
      v-if="uploadAble"
      ref="myImport"
      :baseUrl="requestParams.baseUrl"
      :fileName="requestParams.fileName"
      @uploadList="getList"
      @closeDialog="uploadAble = false"
      />
  </div>
</template>

<script>
import {listGroup, getGroup, delGroup, addGroup, updateGroup, getOnceImportInfo} from "@/api/hgExam-ui/group/index";
import fileImport from "../mixins/fileImport";
export default {
  name: "Group",
  mixins:[fileImport],
  data() {
    return {
      requestParams:{
        baseUrl:'/system/group',
        fileName:'考试分组管理'
      },
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 人员-分组表格数据
      groupList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userId: null,
        unit: null,
        username: null,
        bzb: null,
        jx: null,
        zb: null,
        ksh: null,
        sfzh: null,
        lxfs: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      },
      uploadAble:false,
      importId :undefined
    };
  },
  created() {
    this.importId  = this.$route.params.importId
    this.getList();
  },
  methods: {

    /** 查询人员-分组列表 */
    getList() {
      this.loading = true;
      this.queryParams.importId  = this.importId ;
      getOnceImportInfo(this.queryParams).then(response => {
        this.groupList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        groupId: null,
        userId: null,
        unit: null,
        username: null,
        bzb: null,
        jx: null,
        zb: null,
        ksh: null,
        sfzh: null,
        lxfs: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.groupId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加人员-分组";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const groupId = row.groupId || this.ids
      getGroup(groupId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改人员-分组";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.groupId != null) {
            updateGroup(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addGroup(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const groupIds = row.groupId || this.ids;
      this.$modal.confirm('是否确认删除人员-分组编号为"' + groupIds + '"的数据项？').then(function() {
        return delGroup(groupIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },

  }
};
</script>

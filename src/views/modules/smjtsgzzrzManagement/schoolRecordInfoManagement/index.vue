<template>
<!--学籍档案信息管理-->
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width="68px">
      <el-form-item
        label="学生姓名"
        prop="username">
        <el-input
          v-model="queryParams.username"
          placeholder="请输入学生姓名"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item
        label="性别"
        prop="sex">
        <el-input
          v-model="queryParams.sex"
          placeholder="请输入性别"
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
          @click="handleAdd('qualife')"
        >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
        >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-import"
          plain
          size="mini"
          @click="handleImport"
        >导入
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport('____')"
        >导出
        </el-button>
      </el-col>
      <!--      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>-->
    </el-row>

    <el-table
      v-loading="loading"
      :data="datalist"
      @row-click="rowClick"
      ref="myTable"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="学生姓名" show-overflow-tooltip align="center" prop="username"/>
      <el-table-column label="性别" align="center" prop="sex"/>
      <el-table-column label="年龄" align="center" prop="age" />
      <el-table-column label="手机号" prop="phonenumber" />
      <el-table-column label="操作" align="center" fixed="right" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row,'qualife')"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除
          </el-button>
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
    <qualification
      ref="qualife"
      v-if="open"
      :id="currentId"
      :current-obj="currentObj"
      :export-url="{info:exportUrl.info,addOrEdit:exportUrl.add}"
      @closeDialog="open = false"
      @uploadList="uploadList"
    />
<!-- 导入   -->
    <FileImport
      v-if="uploadAble"
      ref="myImport"
      :baseUrl="exportUrl.import"
      :fileName="exportUrl.fileName"
      @uploadList="getList"
      @closeDialog="uploadAble = false"/>
  </div>
</template>

<script>
import operate from "@/mixins/operate";
import qualification from "./detail";
import service from "@/utils/request";
import FileImport from "@/components/FileImport";

export default {
  mixins: [operate],
  components: {
    qualification,
    FileImport
  },
  data() {
    return {
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        username: undefined,
        sex: undefined
      },
      datalist: [
        {
          username: '明晓铭', sex: '男'
        }
      ]
    };
  },

  methods: {
    uploadList(dataForm, type) {
      if (type == 'add') {
        this.datalist.push(dataForm)
      } else {
        let index = this.datalist.findIndex(item => item.username == dataForm.username)
        this.$set(this.datalist, index, dataForm)
      }
    },
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除选中的数据项？').then(_ => {
        let idds = row.username || this.selection.map(itme => itme.username)
        if (typeof idds == 'string') {
          this.datalist.splice(this.datalist.findIndex(item => item.username == row.username), 1)
        } else {
          idds.forEach(item => {
            this.datalist.splice(this.datalist.findIndex(it => item.username == it.username), 1)

          })
        }

        this.$modal.msgSuccess("删除成功");

        return
        service({method: 'delete', url: `${this.exportUrl.delete}/${ids.join(',')}`}).then(res => {
          let {code, msg} = res;
          if (code != 200) return false;
          this.$modal.msgSuccess("删除成功");
        })
      })
    },
  }
};
</script>

<style scoped>

</style>

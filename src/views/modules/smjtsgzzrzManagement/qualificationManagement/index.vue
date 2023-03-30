<template>
  <!--资质认证认证管理-->
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width="68px">
      <el-form-item
        label="证件名称"
        prop="zjmc">
        <el-input
          v-model="queryParams.zjmc"
          placeholder="请输入证件名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item
        label="证件描述"
        prop="zjms">
        <el-input
          v-model="queryParams.zjms"
          placeholder="请输入证件描述"
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
      <!--      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>-->
    </el-row>

    <el-table
      v-loading="loading"
      :data="datalist"
      @row-click="rowClick"
      ref="myTable"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="证件名称" show-overflow-tooltip width="200" align="center" prop="zjmc"/>
      <el-table-column label="证件描述" align="center" prop="zjms"/>
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
  </div>
</template>

<script>
import operate from "@/mixins/operate";
import qualification from "@/views/modules/smjtsgzzrzManagement/components/qualification";
import service from "@/utils/request";

export default {
  mixins: [operate],
  components: {
    qualification
  },
  data() {
    return {
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        zjmc: undefined,
        zjms: undefined
      },
      datalist: [
        {
          zjmc: '计算机软考高级', zjms: '计算机软考相较于其他考试来说，还是比较受欢迎的。并且' +
            '，该考试的考生人数也较多。但是，许多准备报考计算机软考高级职称考生，会存在“计算机软考高级职称有什么用”这样的疑惑'
        }
      ]
    };
  },

  methods: {
    uploadList(dataForm, type) {
      if (type == 'add') {
        this.datalist.push(dataForm)
      } else {
        let index = this.datalist.findIndex(item => item.zjmc == dataForm.zjmc)
        this.$set(this.datalist, index, dataForm)
      }
    },
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除选中的数据项？').then(_ => {
        let idds = row.zjmc || this.selection.map(itme => itme.zjmc)
        if (typeof idds == 'string') {
          this.datalist.splice(this.datalist.findIndex(item => item.zjmc == row.zjmc), 1)
        } else {
          idds.forEach(item => {
            this.datalist.splice(this.datalist.findIndex(it => item.zjmc == it.zjmc), 1)

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


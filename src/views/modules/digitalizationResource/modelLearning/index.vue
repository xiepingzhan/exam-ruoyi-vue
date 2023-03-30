<template>
<!--教范学习-->
  <div class="app-container">
    <el-form
      :model="queryForm"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width="68px">
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
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
<!--      <el-col :span="1.5">-->
<!--        <el-button-->
<!--          type="primary"-->
<!--          plain-->
<!--          icon="el-icon-plus"-->
<!--          size="mini"-->
<!--          @click="handleAdd('qualife')"-->
<!--        >新增-->
<!--        </el-button>-->
<!--      </el-col>-->
<!--      <el-col :span="1.5">-->
<!--        <el-button-->
<!--          type="danger"-->
<!--          plain-->
<!--          icon="el-icon-delete"-->
<!--          size="mini"-->
<!--          :disabled="multiple"-->
<!--          @click="handleDelete"-->
<!--        >删除-->
<!--        </el-button>-->
<!--      </el-col>-->
    </el-row>

    <el-table
      v-loading="loading"
      :data="datalist"
      @row-click="rowClick"
      ref="myTable"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column
        v-for="(item,index) in formList"
        :key="index"
        :label="item.label"
        :prop="item.prop"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column label="操作" align="center" fixed="right" width="250" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-preve"
            @click="learning(scope.row)"
          >学习
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
    <my-video
      v-if="videoble"
      @closeDialog="videoble = false"
    />
  </div>
</template>

<script>
import operate from "@/mixins/operate";
import qualification from "./detail";
import service from "@/utils/request";
import FileImport from "@/components/FileImport"
import video from  './video'
import learning from "@/mixins/digitalizationResource/learning";

export default {
  mixins: [operate,learning],
  components: {
    qualification,
    FileImport,
    myVideo:video
  },
  data() {
    return {
      // 是否显示弹出层
      open: false,
      videoble:false
    };
  },

  methods: {
    learning(data){
      if(data.filetype=='mp4'){
        this.videoble = true;
      }else{
        this.$modal.msgWarning('正在学习')
      }
    },
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

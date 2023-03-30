<template>
<!--发证管理-->
  <div class="app-container">
    <el-form
      :model="form"
      label-position="left"
      inline
      size="small"
      ref="queryForm" >
      <el-form-item
        label="学生姓名"
        prop="tj1"
      >
        <el-input
          v-model="form.tj1"
          clearable
          placeholder="请输入学生姓名"
          @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item
        label="证件类型"
        prop="tj2"
      >
        <el-input
          v-model="form.tj2"
          clearable
          placeholder="请输入证件类型"
          @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table
    :data="datalist"
    @selection-change="handleSelectionChange"
    >
<!--      <el-table-column type="selection" width="55" />-->
      <el-table-column type="index" label="NO." />
      <el-table-column show-overflow-tooltip align="center" label="学生姓名" prop="username"/>
      <el-table-column show-overflow-tooltip align="center" label="资质模板" prop="zzmb" />
      <el-table-column show-overflow-tooltip align="center" label="证件类型" prop="type" />
      <el-table-column label="操作" fixed="right" width="200" align="center">
        <template slot-scope="{row}">
          <el-button type="primary" size="small" @click="openBook">证件</el-button>
          <el-button type="danger" size="small" @click="handleDelete(row)" >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-if="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
        @pagination="getList"
    />
<!--下载-->
    <dialog01
      v-if="open"
      @closeDialog="open = false"
      ref="dialog01"
    />
  </div>
</template>

<script>
import dialog01 from './dialog'
import operate from '@/mixins/operate'
import service from "@/utils/request";
export default {
  name: "index",
  mixins:[operate],
  components:{
    dialog01
  },
  data(){
    return{
      form:{
        tj1:undefined,
        tj2:undefined
      },
      datalist:[
        {username:'0010',zzmb:'模板1',}
      ],

    }
  },
  methods:{
    openBook(){
      this.open = true;
      this.$nextTick(()=>{
        this.$refs.dialog01.visible = true;
      })
    },
    handleDelete(row) {
      // const ids = row.achievementId || this.ids;
      this.$modal.confirm('是否确认删除当前的数据项？').then(_=>{
        let findIn = this.datalist.findIndex(item=>item.username==row.username)
        this.datalist.splice(findIn,1)
        // service({method:'delete',url:`${this.exportUrl.delete}/${ids.join(',')}`}).then(res=> {
        //   let {code, msg} = res;
        //   if (code != 200) return false;
        //   this.$modal.msgSuccess("删除成功");
        // })
      })
    },
  }
}
</script>

<style scoped>

</style>

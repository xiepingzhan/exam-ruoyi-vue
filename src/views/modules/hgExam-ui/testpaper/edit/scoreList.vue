<template>
  <div class="scoreList">
    <el-row style="margin-bottom:.625rem">
      <el-col>
        <el-button type="primary" size="mini" @click="handleAdd">新增</el-button>
        <el-button size="mini" @click="goDel()">刪除</el-button>
      </el-col>
    </el-row>
    <el-table :data="varList" @selection-change="changegSelection">
      <el-table-column type="selection" label="NO."></el-table-column>
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="title" label="大题题目" show-overflow-tooltip></el-table-column>
      <el-table-column label="本题题型" show-overflow-tooltip>
        <template slot-scope="{row:data}">
          <div>
            {{ data.type == 'A' ? '单选题' : '' }}
            {{ data.type == 'B' ? '多选题' : '' }}
            {{ data.type == 'C' ? '判断题' : '' }}
            {{ data.type == 'D' ? '填空题' : '' }}
            {{ data.type == 'E' ? '问答题' : '' }}
            {{ data.type == 'F' ? '复合题' : '' }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="每题分数">
        <template slot-scope="{row}">
          {{ row.fraction }}&nbsp;分
        </template>
      </el-table-column>
      <el-table-column label="题数/总分" prop="totalscore"></el-table-column>
      <el-table-column label="题序" prop="forder"></el-table-column>
      <el-table-column label="操作" width="300" flex="right">
        <template slot-scope="{row:data}">
          <el-button size="mini" title="查看题目" type="primary" icon="el-icon-search"
                     v-on:click="viewQue(data.type, data.selectedtopics)" style="cursor:pointer;">查看题目
          </el-button>
          <el-button size="mini" title="修改" icon="el-icon-edit" type="warning" v-on:click="goEdit(data.testpapermxId)"
                     style="cursor:pointer;">
            修改
          </el-button>
          <el-button size="mini" title="删除" type="danger" icon="el-icon-delete" v-on:click="goDel(data.testpapermxId)"
                     style="cursor:pointer;">删除
          </el-button>

        </template>
      </el-table-column>
    </el-table>
    <!-- <pagination :to></pagination> -->
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum"
                :limit.sync="queryParams.pageSize" @pagination="getList"/>
    <uploadDialog ref="uploadDialog1" v-if="addAble" :FID="FID" :evaluationresults="evaluationresults"
                  :TESTPAPER_ID="TESTPAPER_ID" @uploadList="getList"
                  @closeDialog="addAble = false"
                  @uploadData='uploadData'
                  @viewQue="viewQue"
    />
  </div>
</template>

<script>
  import '@/plugins/sweetalert/js/sweetalert.min.js'
  import jquery from 'jquery'

  import serice from '@/utils/request'
  import {listData} from '@/api/system/dict/data'
  import uploadDialog from './uploadDialog.vue'

  export default {
    //evaluationresults  考评方式  A 考完直接出  B 人工阅卷后
    props: ['TESTPAPER_ID', 'evaluationresults'],
    components: {uploadDialog},
    data() {
      return {
        FID: null,
        selection: [],
        addAble: false,
        varList: [],		//list
        total: 0,
        queryParams: {
          pageSize: 10,
          pageNum: 1
        },
        KEYWORDS: '',		//检索条件,关键词
        toExcel: false,		//导出到excel权限
        loading: false		//加载状态
      }
    },
    methods: {
      changegSelection(rows) {
        this.selection = rows;
      },
      //初始执行
      init() {
        this.getList();
      },

      //获取列表
      getList() {
        this.loading = true;
        serice({
          method: 'post',
          url: '/testpapermx/list',
          data: {
            pageNum: this.queryParams.pageNum,
            pageSize: this.queryParams.pageSize,
            tm: new Date().getTime(),
            testpaperId: this.TESTPAPER_ID
          }
        }).then(res => {
          let {code, total, rows, msg} = res;
          if (code != 200) return this.$message.error(msg);
          let zfaction = rows.reduce((prev, cur) => prev + cur.zfraction, 0)
          this.varList = rows;
          this.total = total;
        })
      },

      //查看题目
      viewQue(T, SELECTEDTOPICS) {
        this.$emit('viewQue', T, SELECTEDTOPICS);
      },

      //新增
      handleAdd() {
        this.FID = null;
        this.addAble = true;
        this.$nextTick(() => {
          this.$refs.uploadDialog1.visible = true;
          this.$refs.uploadDialog1.title = '新增题目'
        })
      },

      //修改
      goEdit(id) {
        this.FID = id;
        this.addAble = true;
        this.$nextTick(() => {
          this.$refs.uploadDialog1.visible = true;
          this.$refs.uploadDialog1.title = '修改题目'
        })
      },

      //删除
      goDel(id) {
        let nIds = ''
        if (!id) {
          if (this.selection.length == 0) return this.$modal.msgWarning("选择要删除的数据")
          nIds = this.selection.map(item => item.testpapermxId).join(',')
        } else {
          nIds = id
        }
        swal({
          title: '',
          text: "确定要删除吗?",
          icon: "warning",
          buttons: true,
          dangerMode: true,
        }).then((willDelete) => {
          if (willDelete) {
            // this.loading = true;
            serice.delete('/testpapermx/' + nIds).then(res => {
              let {code, msg} = res;
              if (code != 200) return this.$message.error(msg);
              this.$message.success('删除成功!')
              this.getList()
              this.uploadData()
            })
          }
        });
      },
      // 更新基本数据
      uploadData() {
        this.$emit('uploadData')
      },

      //批量操作
      makeAll(msg) {
        swal({
          title: '',
          text: msg,
          icon: "warning",
          buttons: true,
          dangerMode: true,
        }).then((willDelete) => {
          if (willDelete) {
            var str = '';
            for (var i = 0; i < document.getElementsByName('ids').length; i++) {
              if (document.getElementsByName('ids')[i].checked) {
                if (str == '') str += document.getElementsByName('ids')[i].value;
                else str += ',' + document.getElementsByName('ids')[i].value;
              }
            }
            if (str == '') {
              $("#cts").tips({
                side: 2,
                msg: '点这里全选',
                bg: '#AE81FF',
                time: 3
              });
              swal("", "您没有选择任何内容!", "warning");
              return;
            } else {
              if (msg == '确定要删除选中的数据吗?') {
                this.loading = true;
                $.ajax({
                  xhrFields: {
                    withCredentials: true
                  },
                  type: "POST",
                  url: httpurl + 'testpapermx/deleteAll?tm=' + new Date().getTime(),
                  data: {DATA_IDS: str},
                  dataType: 'json',
                  success(data) {
                    if ("success" == data.result) {
                      swal("删除成功", "已经从列表中删除!", "success");
                    }
                    vm.getList();
                    parent.vm.getData(); //刷新父页面
                  }
                });
              }
            }
          }
        });
      },

      //判断按钮权限，用于是否显示按钮
      hasButton() {
        var keys = 'toExcel';
        $.ajax({
          xhrFields: {
            withCredentials: true
          },
          type: "POST",
          url: httpurl + 'head/hasButton',
          data: {keys: keys, tm: new Date().getTime()},
          dataType: "json",
          success(data) {
            if ("success" == data.result) {
              vm.toExcel = data.toExcel;						//导出到excel权限
            } else if ("exception" == data.result) {
              showException("按钮权限", data.exception);		//显示异常
            }
          }
        })
      },

      //导出excel
      goExcel() {
        swal({
          title: '',
          text: '确定要导出到excel吗?',
          icon: "warning",
          buttons: true,
          dangerMode: true,
        }).then((willDelete) => {
          if (willDelete) {
            window.location.href = httpurl + 'testpapermx/excel';
          }
        });
      },

      //根据url参数名称获取参数值
      getUrlKey(name) {
        return decodeURIComponent(
          (new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null;
      },

      //-----分页必用----start
      nextPage(page) {
        this.currentPage = page;
        this.getList();
      },
      changeCount(value) {
        this.showCount = value;
        this.getList();
      },
      toTZ() {
        var toPaggeVlue = document.getElementById("toGoPage").value;
        if (toPaggeVlue == '') {
          document.getElementById("toGoPage").value = 1;
          return;
        }
        if (isNaN(Number(toPaggeVlue))) {
          document.getElementById("toGoPage").value = 1;
          return;
        }
        this.nextPage(toPaggeVlue);
      }
      //-----分页必用----end

    },

    mounted() {
      this.init();
    }
  }
</script>

<style>

</style>

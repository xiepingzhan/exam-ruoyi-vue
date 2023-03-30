<template>
  <div class="main">
   <div class="exam">
     <h4 class="body body_title">考试</h4>
     <el-divider />
     <div class="body bbody">
       <!--      tableList-->
       <examCard
         v-for="(item,index) in tableList"
         :key="index"
         @addExam="addExam"
         :cur-obj="item"
       />
     </div>
     <pagination
       class="my-pagination"
       :limit.sync="queryParams.pageSize"
       :page.sync="queryParams.pageNum"
       @pagination="getList"
       :pageSizes="pageSizes"
       :total="total"
       v-show="total>0"
     />
   </div>
<!--    <div class="exam">-->
<!--      <h4 class="body body_title">课程学习</h4>-->
<!--      <el-divider />-->
<!--      <div >-->
<!--        &lt;!&ndash;      tableList&ndash;&gt;-->
<!--        <classies/>-->
<!--      </div>-->
<!--    </div>-->
<!--    <div class="exam">-->
<!--      <h4 class="body body_title">资源学习</h4>-->
<!--      <el-divider />-->
<!--      <div>-->
<!--        &lt;!&ndash;      tableList&ndash;&gt;-->
<!--        <resource/>-->
<!--      </div>-->
<!--    </div>-->
    <div class="exam">
      <h4 class="body body_title">教范学习</h4>
      <el-divider />
      <div>
        <!--      tableList-->
        <modelLearning/>
      </div>
    </div>

    <testpaperMy ref="myTest" v-show="false"/>
  </div>
</template>

<script>
import testpaperMy from "@/views/modules/hgExam-ui/myExamtion/testpaperMy";
import examCard from './examCard.vue'
import classies from "@/views/modules/jtsgalDataBase/classies";
import resource from "@/views/modules/jtsgalDataBase/resource";
import modelLearning from "@/views/modules/digitalizationResource/modelLearning";
import serice from "@/utils/request";

export default {
  name: "Index",
  components: {testpaperMy, examCard,classies,resource,modelLearning},
  data() {
    return {
      // 版本号
      version: "3.8.4",
      tableList:[],
      title: '某数据中心研制系统',
      queryParams: {
        pageNum: 1,
        pageSize: 5
      },
      pageSizes:[5,10,15,20],
      form: {},
      total: 5,
    };
  },
  mounted() {
    this.init()
  },
  methods: {
    //参加考试
    addExam(curObj) {
      this.$refs.myTest.goExa(curObj)
    },
    init() {
      this.getList()
    },
    async getList() {
      let params = {
        ...this.queryParams,
        ...this.form,
        state: 'release',//考试状态
        'tm': new Date().getTime()
      }

      if (this.form.testpaperId) {
        params.title = this.testPaperList.find(item => item.testpaperId === this.form.testpaperId).title
      }
      if (this.form.groups_old) {
        params.groupstr = this.form.groups_old.join(',')
      }
      let res = await serice({
        method: 'get',
        url: '/examobj/examlist',
        params
      })
      let {code, total, msg, rows} = res;
      if (200 == code) {
        this.tableList = rows;
        this.total = total;
      } else {
        this.$message.error(msg)
      }
    },
  },
};
</script>

<style scoped lang="scss">

.app-main {
  background: #f7f7f782 !important;
}

.main {

  padding: 20px 0;

  p span {
    font-size: 20px;
    font-weight: bold;
    color: red;
  }
.body_title{
  font-size: 24px;
  font-weight: 500;
  //height: 40px、
}
  .body {
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
    display: flex;
    margin: 0 auto;
    flex-direction: row;
    justify-content: flex-start;
    flex-wrap: wrap;
    column-gap: 20px;
    row-gap: 20px;
  }
  .bbody{
    width: 1490px;
  }

  .my-pagination {
    padding: 20px 0;
  }

  .pagination-container {
    ::v-deep .el-pagination {
      right: 50%;
      position: absolute;
      transform: translateX(50%);
    }
  }
}
</style>


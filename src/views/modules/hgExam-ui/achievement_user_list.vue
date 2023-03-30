<template>
    <div class="app-container testpaper_list">
        <el-row>
            <el-col>
                <el-form inline ref="myForm" :rules="rules" :model="form" size="mini">
                    <el-form-item label="姓名" prop="keywords">
                        <el-input v-model="form.keywords" placeholder="请输入姓名" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="是否及格" v-show="msg != 'admin'" prop="passonot">
                        <el-select v-model="form.passonot">
                            <el-option v-for="(opt, optIndex) in typeList" :key="optIndex" :label="opt.dictLabel"
                                :value="opt.dictValue" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="状态" v-show="msg == ''" prop="state">
                        <el-select v-model="form.state" clearable filterable>
                            <el-option v-for="(opt, optIndex) in stateList" :key="optIndex" :value="opt.dictValue"
                                :label="opt.dictLabel" />
                        </el-select>
                    </el-form-item>
                    <!-- <el-form-item label="检索试卷" v-show="fromlocal && msg != ''" prop="sjId">
                        <el-select v-model="form.sjId" clearable filterable>
                            <el-option v-for="(opt, optIndex) in sjList" :key="optIndex" :value="opt.dictValue"
                                :label="opt.dictLabel" />
                        </el-select>
                    </el-form-item> -->
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" @click="searchBtn">搜索</el-button>
                        <el-button icon="el-icon-refresh" @click="refreshBtn">重置</el-button>
<!--                         <el-button v-show="toExcel && msg != '' && fromlocal" class="btn btn-light btn-sm"-->
<!--                            @click="goExcel" title="导出到excel表格">导出-->
<!--                        </el-button> -->
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col>
                <el-table :data="varList" border style="width: 100%">
                   <el-table-column min-width="50" label="NO." type="index"></el-table-column>
                    <!-- <el-table-column min-width="150" show-overflow-tooltip v-if="fromlocal" prop="title" label="试卷名称">
                    </el-table-column> -->
                    <el-table-column show-overflow-tooltip label="考生姓名" prop="username">
                        <template slot-scope="{row:data}">
                            {{ data.username }}
                        </template>
                    </el-table-column>
                    <el-table-column  show-overflow-tooltip label="得分" sortable prop="score">
                    </el-table-column>
                    <el-table-column  show-overflow-tooltip label="总分" prop="totalscore">
                    </el-table-column>
                    <el-table-column  show-overflow-tooltip label="及格线" prop="passingscore">
                    </el-table-column>
                    <el-table-column label="是否补考" prop="isBk">

                    </el-table-column>
                    <el-table-column  show-overflow-tooltip label="是否及格">
                        <template slot-scope="{row:data}">
                            <template v-if="data.passonot == 'yes'">
                                <el-tag type="success" plain>及格</el-tag>
                            </template>
                            <template v-if="data.passonot == 'no'">
                                <el-tag type="danger" plain>不及格</el-tag>
                            </template>
                            <template v-if="data.passonot == '未出'">
                                未出
                            </template>
                        </template>
                    </el-table-column>
                    <el-table-column  show-overflow-tooltip label="答对" prop="correct"></el-table-column>
                    <el-table-column  show-overflow-tooltip label="答错" prop="error"></el-table-column>
                    <el-table-column  show-overflow-tooltip label="未评" prop="DNAME2">
                        <template slot-scope="{row:data}">
                            {{ data.qtotal - data.error - data.correct }}
                        </template>
                    </el-table-column>
                    <el-table-column  show-overflow-tooltip label="总题数" prop="qtotal"></el-table-column>
                    <el-table-column  show-overflow-tooltip label="状态">
                        <template slot-scope="{row:data}">
                            <template v-if="data.state == 'out'">
                                <el-tag type="success" plain>已完成</el-tag>
                            </template>
                            <template v-if="data.state == 'notout'">
                                <el-tag type="danger" plain>待评阅</el-tag>
                            </template>
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip label="时间" prop="ctime" width="150px"></el-table-column>
                    <el-table-column  label="操作" fixed="right" width="300px" align="center">
                        <template slot-scope="{row:data}">
                            <template v-if="isPy">
                                <el-button type="primary" size="mini" title="评阅" icon="el-icon-edit-outline"
                                @click="correct(data.testpaperId, data.examinationrecordId, data.passonot, data.score, data.passingscore, data.achievementId)">
                                评阅
                            </el-button>
                            </template>
                           <template v-else>
                            <el-button size="mini" title="查看" type="primary" icon="el-icon-view"
                                @click="view(data.testpaperId, data.examinationrecordId, data.passonot, data.score)">
                                查看
                            </el-button>
                            <el-button type="primary" size="mini" icon="el-icon-sort" title="排名"
                                @click="ranking(data.testpaperId, data.username, data.passingscore)">
                                排名</el-button>
                           </template>
                            <el-button type="danger" size="mini" icon="el-icon-minus" title="删除"
                                @click="goDel(data.achievementId, data.examinationrecordId)">删除</el-button>
                          <el-button
                            size="mini"
                            title="认证"
                            @click="applyExam(data)"
                          >认证
                          </el-button>
                        </template>
                    </el-table-column>

                </el-table>
                <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum"
                    :limit.sync="queryParams.pageSize" @pagination="getList" />
            </el-col>
        </el-row>
        <!-- 排名 -->
      <sort-list
        ref="rank"
        v-if="sortable"
        @closeDialog="sortable = false"/>
        <!-- 评阅试卷   、查看成绩 -->
      <yl-dialog
        v-if="ylAble"
        ref="ylDialog"
        :FID="ylObj.FID"
        :currentType="ylObj.currentType"
        :PASSONOT="ylObj.PASSONOT"
        :SCORE="ylObj.SCORE"
        :EXID="ylObj.EXID"
        :ACID="ylObj.ACID"
        dataUrl="/achievement/view"
        :PASSINGSCORE="ylObj.PASSINGSCORE"
        :examId="examId"
        @uploadList='getList'
        @closeDialog="ylAble = false"/>
    </div>
</template>


<script>
import achievement from '@/mixins/view-achievement.js'
export default {
    mixins: [achievement],
    props: {
        nowMsg: {
            type: String,
            default: 'manage'
        },
        isPy:{
            type:Boolean,
            default:false
        },
      examId: {
        default: undefined, type: String
      },
    },
    data() {
        return {
            msg: 'manage',
        }
    },
    created(){
        this.msg = this.nowMsg;
    },
  methods:{
      /*资格认证*/
    applyExam(row){
      this.$modal.confirm("是否进行资质认证?").then(_=>{
        this.$modal.msgSuccess("认证成功")
      })
    }
  }
}
</script>

<style scoped>

</style>

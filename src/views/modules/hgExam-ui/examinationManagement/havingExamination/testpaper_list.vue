<template>
    <div class="app-container testpaper_list">
        <el-row>
            <el-col>
                <el-form inline ref="myForm" :rules="rules" :model="form" size="mini">
                    <el-form-item label="考试名称" prop="examName">
                        <el-input v-model="form.examName" placeholder="请输入考试名称" clearable></el-input>
                    </el-form-item>
<!--                  <el-form-item label="试卷名称" prop="title">-->
<!--                    <el-input v-model="form.title" placeholder="请输入试卷名称" clearable></el-input>-->
<!--                  </el-form-item>-->
<!--                    <el-form-item label="试卷类型" prop="type">-->
<!--                        <el-select v-model="form.type" clearable filterable>-->
<!--                            <el-option v-for="(opt, optIndex) in dict.type.test_type" :key="optIndex" :label="opt.dictLabel"-->
<!--                                :value="opt.dictValue" />-->
<!--                        </el-select>-->
<!--                    </el-form-item>-->
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" @click="searchBtn">搜索</el-button>
                        <el-button icon="el-icon-refresh" @click="refreshBtn">重置</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col>
                <el-table :data="tableList" style="width: 100%">
                  <el-table-column width="150" show-overflow-tooltip label="考试名称" prop="examName"/>
                  <el-table-column width="150" show-overflow-tooltip label="试卷名称" prop="title" v-if="false" />
                  <el-table-column width="100" show-overflow-tooltip label="试卷类型" prop="papertype">
                    <template
                      v-slot="scope"
                    >
                     <dict-tag
                      :value="scope.row.papertype"
                      :options="dict.type.testpapertype"
                     />
                    </template>
                  </el-table-column>
                  <el-table-column show-overflow-tooltip label="卷面总分" prop="totalscore">
                        <template slot-scope="{row}">
                            {{ row.totalscore }}分
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip label="及格分数">
                        <template slot-scope="{row}">
                            {{ row.passingscore }}分
                        </template>
                    </el-table-column>
                    <el-table-column width="100" label="考试时长">
                        <template slot-scope="{row}">
                            {{ row.duration }}(分钟)
                        </template>
                    </el-table-column>

                    <el-table-column  label="发布时间" prop="etime" width="200" v-if="false"/>
<!--                  <el-table-column width="150" label="截止日期" prop="otime"></el-table-column>-->
                  <el-table-column width="150" label="截止日期" prop="examCutoffTime"></el-table-column>
                    <el-table-column width="150" label="考评成绩">
                        <template slot-scope="{row}">
                            <template v-if="row.evaluationresults == 'A'">
                                <el-tag type="warning" plain >考完直接出</el-tag>
                            </template>
                            <template v-else>
                                <el-tag type="info" plain>人工判卷</el-tag>
                            </template>
                        </template>
                    </el-table-column>
                    <el-table-column width="120" show-overflow-tooltip label="重复考试">
                        <template slot-scope="{row}">
                            <template v-if="row.frepeat == 'true'">
                               <el-tag type="success" plain>{{ row.ftwice == 'true' ? '可补考一次' : '不限次数' }}</el-tag>
                            </template>
                            <template v-else>
                                <el-tag type='danger' plain>仅一次</el-tag>
                            </template>
                        </template>
                    </el-table-column>
                    <el-table-column width="100" show-overflow-tooltip label="公布答案">
                        <template slot-scope="{row:data}">
                            <template v-if="data.publishanswer == 'true'">
                                <el-tag type="success" plain>公布</el-tag>
                            </template>
                            <template v-else>
                                <el-tag type="danger" plain>不公布</el-tag>
                            </template>
                        </template>
                    </el-table-column>
                    <el-table-column width="80" show-overflow-tooltip label="题序">
                        <template slot-scope="{row:data}">
                            <template v-if="data.fhorder == 'true'">
                                <el-tag type="success" plain>一样</el-tag>
                            </template>
                            <template v-else>
                                <el-tag type="danger" plain>随机</el-tag>
                            </template>
                        </template>
                    </el-table-column>
                    <el-table-column width="60" show-overflow-tooltip label="单题">
                        <template slot-scope="{row:data}">
                            <template v-if="data.isalone == 'true'">
                                <el-tag type="success" plain>是</el-tag>
                            </template>
                            <template v-else>
                                <el-tag type="danger" plain>否</el-tag>
                            </template>
                        </template>
                    </el-table-column>
                    <el-table-column width="120" show-overflow-tooltip label="试卷状态" v-if="false">
                        <template slot-scope="{row:data}">
                            <template v-if="ntime > data.fotime">
                                <el-tag type="danger" plain>试卷过期</el-tag>
                            </template>
                            <template v-if="ntime <= data.fotime">
                                <el-tag type="primary" plain>正在考试</el-tag>
                            </template>
                        </template>
                    </el-table-column>
                    <el-table-column  fixed="right" width="240px" align="center" label="操作">
                        <template slot-scope="{row:data}">
                            <!-- 展示隐藏---后续待添加考试对象 -->
                            <!-- <el-button size='mini' title="考试对象" v-show="data.examinee != '' && null != data.examinee"
                                @click="viewDx(data.testpaperId)" type="primary">
                                对象
                            </el-button> -->
                            <el-button size='mini' type="primary" title="预览试卷" @click="view(data)">
                                预览
                            </el-button>
                            <!-- 待调试 -->
                            <el-button size='mini' title="成绩" @click="achievement(data)" type="primary">
                                成绩
                            </el-button>
                            <el-button size='mini' title="结束考试" @click="goEnd(data.examId)" type="warning">
                                结束
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum"
                    :limit.sync="queryParams.pageSize" @pagination="initList" />

            </el-col>
        </el-row>
        <!-- 考试对象 -->
        <!-- 查看考试对象窗口 start -->
        <modal-mo :roleList="roleList" v-if="modalable" ref='modalMo' @closeDialog="modalable = false" />
        <!-- 预览 -->
        <yl-dialog-vue ref="yulan" v-if="ylable" :FID="FID" @closeDialog="ylable = false" />
        <!-- 成绩 -->
        <achieve-dialog v-if="achieveAble" ref="achieve" :msg="msg" :TESTPAPER_ID="TESTPAPER_ID"
           :examId="examId" @closeDialog="achieveAble = false" />
    </div>
</template>

<script>
import testpaper_list from '@/mixins/view-testpaper-list'
export default {
    mixins: [testpaper_list],
    data() {
        return {
            STATE: "release",
            form:{
              title:undefined,
              examName:undefined
            }
        }
    }
}
</script>

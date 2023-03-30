<template>
    <div class="app-container testpaper_list">
        <el-row>
            <el-col>
                <el-form inline ref="myForm" :rules="rules" :model="form" size="mini">
                    <el-form-item label="姓名" prop="keywords">
                        <el-input v-model="form.keywords" placeholder="请输入试卷名称" clearable></el-input>
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
                        <el-button v-show="toExcel && msg != '' && fromlocal" class="btn btn-light btn-sm"
                            @click="goExcel" title="导出到excel表格">导出
                        </el-button>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col>

                <el-table :data="varList" style="width: 100%">
                    <el-table-column min-width="50" label="NO." type="index"></el-table-column>
                    <el-table-column min-width="150" show-overflow-tooltip v-if="fromlocal" prop="title" label="试卷名称">
                    </el-table-column>
                    <el-table-column min-width="100" show-overflow-tooltip label="考生姓名" prop="username">
                        <template slot-scope="{row:data}">
                            {{ data.username }}
                            <!-- <el-button size="mini" type="text" v-show="fromlocal" title="查看用户" icon="el-icon-search"
                                @click="viewUser(data.USERNAME)" style="cursor:pointer;"></el-button> -->
                        </template>
                    </el-table-column>
                    <el-table-column min-width="100" show-overflow-tooltip label="得分" sortable prop="score">
                    </el-table-column>
                    <el-table-column min-width="100" show-overflow-tooltip label="总分" prop="totalscore">
                    </el-table-column>
                    <el-table-column min-width="100" show-overflow-tooltip label="及格线" prop="passingscore">
                    </el-table-column>
                    <el-table-column min-width="100" show-overflow-tooltip label="是否及格">
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
                    <el-table-column min-width="60" show-overflow-tooltip label="答对" prop="correct"></el-table-column>
                    <el-table-column min-width="60" show-overflow-tooltip label="答错" prop="error"></el-table-column>
                    <el-table-column min-width="60" show-overflow-tooltip label="未评" prop="DNAME2">
                        <template slot-scope="{row:data}">
                            {{ data.qtotal - data.error - data.correct }}
                        </template>
                    </el-table-column>
                    <el-table-column min-width="100" show-overflow-tooltip label="总题数" prop="qtotal"></el-table-column>
                    <el-table-column min-width="100" show-overflow-tooltip label="状态">
                        <template slot-scope="{row:data}">
                            <template v-if="data.state == 'out'">
                                <el-tag type="success" plain>已完成</el-tag>
                            </template>
                            <template v-if="data.state == 'notout'">
                                <el-tag type="danger" plain>待评阅</el-tag>
                            </template>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="180" show-overflow-tooltip label="时间" prop="ctime"></el-table-column>
                </el-table>
                <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum"
                    :limit.sync="queryParams.pageSize" @pagination="getList" />
            </el-col>
        </el-row>
    </div>
</template>


<script>
import achievement from '@/mixins/view-achievement.js'
export default {
    mixins: [achievement],
    data() {
        return {
            msg: 'manage',
        }
    }
}
</script>

<style scoped>

</style>

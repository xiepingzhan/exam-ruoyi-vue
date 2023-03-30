<template>
    <div class="app-container">
        <!-- 检索 -->
        <el-form size="mini" :model="form" inline ref="form" :rules="rules">
            <el-form-item label="考试名称" prop="examName">
                <el-input v-model="form.examName" placeholder="请输入考试名称"></el-input>
            </el-form-item>
            <!-- <el-form-item label="试题类型" prop="type">
                <el-select v-model="form.type" filterable clearable placeholder="试题名称">
                    <el-option v-for="(opt, optIndex) in typeList" :label="opt.dictLabel" :value="opt.dictValue"
                        :key="optIndex"></el-option>
                </el-select>
            </el-form-item> -->
            <el-form-item>
                <el-button @click="search" icon="el-icon-search" type="primary">搜索</el-button>
                <el-button @click="resetForms" icon="el-icon-refresh">重置</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="varList">
            <el-table-column type="selection"></el-table-column>
            <el-table-column width="60" label="NO." type="index" />
            <el-table-column show-overflow-tooltip label="考试名称">
                <template slot-scope="{row:data}">
                    <span :title="data.title">
                        <el-button type="text" size="mini" v-if="data.type != 'C'"
                            @click="viewQue(data.type, data.questionsId, data.useranswer)">
                            {{ data.type == "A" ? data.title1 : data.type == 'B' ? data.title2 : data.title3 }}
                        </el-button>
                        <el-button v-else type="text" size="mini"
                            @click="viewQue(data.type, data.questionsId, data.useranswer == 'true' ? '正确' : '错误')">
                            {{ data.type == "A" ? data.title1 : data.type == 'B' ? data.title2 : data.title3 }}
                        </el-button>
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="试题类型" prop="type">
                <template slot-scope="{row:data}">
                   <dict-tag
                    :options="dict.type.test_type"
                    :value="data.type"
                   />
                </template>
            </el-table-column>
            <el-table-column label="你的答案">
                <template slot-scope="{row:data}">

                    <template v-if="data.type != 'C'">{{ data.useranswer }}</template>
                    <template v-if="data.type == 'C'">
                        {{ data.useranswer == 'true' ? '正确' : '错误' }}
                    </template>
                </template>
            </el-table-column>
            <el-table-column label="正确答案">

                <template slot-scope="{row:data}">

                    <template v-if="data.type != 'C'">{{ data.correctanswer }}</template>
                    <template v-if="data.type == 'C'">
                        {{ data.correctanswer == 'true' ? '正确' : '错误' }}
                    </template>
                </template>
            </el-table-column>
        </el-table>
        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize" @pagination="initList" />
        <dept-yl-dialog-vue ref="deptYlDialog" v-if="deptYlable" @closeDialog="deptYlable = false" paperType="wrong"
            currentType="read" :targetObj="targetObj" />
    </div>
</template>

<script>
import serice from '@/utils/request'
import deptYlDialogVue from '../../testpaper/edit/deptYlDialog.vue'
import testpaper_list from '@/mixins/view-testpaper-list'
import '@/plugins/sweetalert/js/sweetalert.min.js'

export default {
    components: {
        deptYlDialogVue
    },
    mixins: [testpaper_list],
    dicts:['test_type'],
    data() {
        return {
            form: {
                title: "",
                type: ''
            },
            varList: [],
            deptYlable: false,
            rules: {
                title: { required: false, trigger: 'blur' },
                type: { required: false, trigger: 'blur' },
            },
            typeList: [
                { dictLabel: '单选题', dictValue: "A" },
                { dictLabel: '多选题', dictValue: "B" },
                { dictLabel: '判断题', dictValue: "C" },
            ],
            targetObj: { t: '', selectedtopics: "" },
            total: 0,
            queryParams: {
                pageSize: 10,
                pageNum: 1
            }
        }
    },
    methods: {
        init() {
            this.initList()
        },
        initList() {
            serice.post('/smallquestionfo/list?pageNum=' + this.queryParams.pageNum + '&pageSize=' + this.queryParams.pageSize, {
                // ...this.queryParams,
                keywords: this.form.title,
                type: this.form.type,
                tm: new Date().getTime()
            }).then(res => {
                let { code, total, rows, msg } = res;
                if (code != 200) return this.$message.error(msg);
                this.total = total;
                this.varList = rows;
            })
        },

        viewQue(t, selectedtopics, USERANSWER) {

            this.deptYlable = true;
            this.targetObj = { t, selectedtopics, useranswer: USERANSWER }
            this.$nextTick(() => {
                this.$refs.deptYlDialog.title = '查看错题'
                this.$refs.deptYlDialog.visible = true;
            })
        },
        search() {
            this.initList()
        },
        resetForms() {
            this.resetForm('form')
            this.initList()
        },
    }

}
</script>

<style>

</style>

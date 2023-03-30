<template>
    <div class="app-container">
        <!-- 检索 -->
        <el-form size="mini" :model="form" inline ref="form" :rules="rules">
            <el-form-item label="考试名称" prop="examName">
                <el-input v-model="form.examName" placeholder="请输入考试名称"></el-input>
            </el-form-item>
<!--            <el-form-item label="试题类型" prop="type">-->
<!--                <el-select v-model="form.type" filterable clearable placeholder="试题类型">-->
<!--                    <el-option v-for="(opt, optIndex) in dict.type.test_type" :label="opt.label" :value="opt.value"-->
<!--                        :key="optIndex"></el-option>-->
<!--                </el-select>-->
<!--            </el-form-item>-->
            <el-form-item>
                <el-button @click="search" icon="el-icon-search" type="primary">搜索</el-button>
                <el-button @click="resetForms" icon="el-icon-refresh">重置</el-button>
                <el-button @click="exportData" icon="el-icon-export" type="warning">导出</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="varList">
            <el-table-column type="selection"></el-table-column>
            <el-table-column width="60" label="NO." type="index" />
            <el-table-column show-overflow-tooltip label="考试名称">
                <template slot-scope="{row:data}">
                    <span :title="data.title">
                        <el-button type="text" size="mini" title="查看题目" @click="viewQue(data.type, data.questionsId)">
                            {{ data.examName }}
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
            <el-table-column label="收藏时间" prop="ctime" />
            <el-table-column width="100" flexd="right" label="操作" prop="">
                <template slot-scope="{row:data}">
                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="goDel(data.collectionId)">
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize" @pagination="initList" />
        <dept-yl-dialog-vue ref="deptYlDialog" v-if="deptYlable" paperType="collection"
            @closeDialog="deptYlable = false" currentType="read" :targetObj="targetObj" />
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
    data() {
        return {
            form: {
                title: "",
                type: '',
                examName:undefined
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
            serice.get('/collection/list', {
                params: {
                    pageNum: this.queryParams.pageNum,
                    pageSize: this.queryParams.pageSize,
                    title: this.form.title,
                    type: this.form.type,
                    tm: new Date().getTime()
                }
            }).then(res => {
                let { code, total, rows, msg } = res;
                if (code != 200) return this.$message.error(msg);
                this.total = total;
                this.varList = rows;
            })
        },
        viewQue(t, selectedtopics) {
            this.deptYlable = true;
            this.targetObj = { t, selectedtopics }
            this.$nextTick(() => {

                this.$refs.deptYlDialog.title = '试卷'
                this.$refs.deptYlDialog.visible = true;
            })
        },
        goDel(id) {
            swal({
                title: '',
                text: "确定要删除吗?",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then((willDelete) => {
                if (willDelete) {
                    serice.delete('/collection/' + id).then(res => {
                        if (res.code != 200) return swal(res.msg, 'error')
                        swal("删除成功", "已经从列表中删除!", "success");
                        this.initList()
                    })
                }
            });
        },
        search() {
            this.initList()
        },
        resetForms() {
            this.resetForm('form')
            this.initList()
        },
        exportData() {
            swal({
                title: '',
                text: '确定要导出到excel吗?',
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then((willDelete) => {
                if (willDelete) {
                    window.location.href = process.env.VUE_APP_BASE_API + 'collection/excel';
                }
            });
        }
    }

}
</script>

<style>

</style>

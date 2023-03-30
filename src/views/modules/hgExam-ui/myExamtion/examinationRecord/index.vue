<template>
    <div class="app-container">
        <!-- 检索 -->
        <el-form size="mini" :model="form" inline ref="form" :rules="rules">
            <el-form-item label="试题名称" prop="title">
                <el-input v-model="form.title" placeholder="请输入试题名称"></el-input>
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
            <el-table-column show-overflow-tooltip label="试卷名称" prop="title">
            </el-table-column>
            <el-table-column label="答题时间" prop="ctime">
            </el-table-column>
            <el-table-column label="交卷时间" prop="etime" width="200">
            </el-table-column>
            <el-table-column label="状态">

                <template slot-scope="{row:data}">

                    <template v-if="data.state == 'complete'">
                        <span class="badge badge-success">完成考试</span>
                    </template>
                    <template v-if="data.state == 'edit'">
                        <span class="badge badge-danger">未提交</span>
                    </template>
                    <template v-if="data.state == 'fail'">
                        <span class="badge badge-danger">超时未提交</span>
                    </template>
                </template>
            </el-table-column>
            <el-table-column label="考生">
                <template slot-scope="{row:data}">
                    {{ data.name }}({{ data.username }})
                </template>
            </el-table-column>
            <el-table-column label="操作" flexd="right" header-align="center" align="center" width="200">
                <template slot-scope="{row:data}">
                  <el-button
                    size="mini"
                    type="primary"
                    title="查看"
                    v-on:click="view(data.testpaperId, data.examinationrecordId, data.state)"
                    icon="el-icon-search"
                    v-has-permi="['examination:record:query']"
                  >
                    查看
                  </el-button>
                  <el-button
                    type="danger"
                    icon="el-icon-delete"
                    size="mini"
                    title="删除"
                    v-on:click="goDel(data.examinationrecordId)"
                    style="cursor:pointer;"
                    v-has-permi="['examination:record:delete']"
                  >删除
                  </el-button>
                </template>
            </el-table-column>
        </el-table>
        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize" @pagination="initList" />
        <!-- examinationrecord/view -->
        <examinationrecord-dialog ref="examinationrecordDialog" dataUrl="/examinationrecord/view" v-if="ylable"
            @closeDialog="ylable = false" :FID="FID" currentType="read" :EXID="EXID" :STATE="STATE" />
    </div>
</template>

<script>
import serice from '@/utils/request'
import examinationrecordDialog from '@/views/modules/hgExam-ui/examinationrecordDialog.vue'
export default {
    components: {
        examinationrecordDialog
    },
    data() {
        return {
            FID: null,
            EXID: null,
            STATE: null,
            form: {
                title: "",
                type: ''
            },
            varList: [],
            ylable: false,
            rules: {
                title: { required: false, trigger: 'blur' },
                type: { required: false, trigger: 'blur' },
            },
            typeList: [
                { dictLabel: '单选题', dictValue: "A" },
                { dictLabel: '多选题', dictValue: "B" },
                { dictLabel: '判断题', dictValue: "C" },
                { dictValue: 'D', dictLabel: '填空题' },
                { dictValue: 'E', dictLabel: '问答题' },
                { dictValue: 'F', dictLabel: '复合题' }
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
        //删除
        goDel(id, STATE) {
            let text = "";
            if ('end' == STATE) text = "同时会删除此试卷相关联的所有用户成绩等数据";
            swal({
                title: '确定要删除吗?',
                text: text,
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then((willDelete) => {
                if (willDelete) {
                    // this.loading = true;
                    serice.post('/examinationrecord/delete', {
                        examinationrecordId: id
                    }).then(data => {
                        if (200 == data.code) {
                            swal("删除成功", "已经从列表中删除!", "success");
                            this.initList();
                        } else {
                            swal("删除失败!", "请先删除明细数据!", "warning");
                        }

                    })
                }
            });
        },
        initList() {
            serice.get('/examinationrecord/list', {
                params: {
                    pageNum: this.queryParams.pageNum,
                    pageSize: this.queryParams.pageSize,
                    keywords: this.form.title,
                    tm: new Date().getTime()
                }
            }).then(res => {
                let { code, total, rows, msg } = res;
                if (code != 200) return this.$message.error(msg);
                this.total = total;
                this.varList = rows;
            })
        },

        view(id, EXID, STATE) {
            this.ylable = true;
            this.FID = id;
            this.EXID = EXID;
            this.STATE = STATE;
            this.$nextTick(() => {
                this.$refs.examinationrecordDialog.visible = true;
            })
        },
        search() {
            this.initList()
        },
        resetForms() {
            this.resetForm('form')
            this.initList()
        },
    },
    mounted() {
        this.init()
    },

}
</script>

<style>

</style>

<template>
    <el-dialog append-to-body title="选择题目" width="80%" :before-close="closeDialog" :close-on-click-modal="false"
        :visible.sync="visible">
        <el-row>
            <el-col>
                <el-form :model="form" ref="form" :rules="rules" inline size="mini">
                    <el-form-item label="题目" prop="title">
                        <el-input clearable v-model="form.title"></el-input>
                    </el-form-item>
                    <el-form-item label="类型" prop="type">
                        <el-select v-model="form.type" clearable filterable="">
                            <el-option v-for="(opt, optIndex) in typeList" :key="optIndex" :label="opt.dictLabel"
                                :value="opt.dictValue"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="级别" prop="level">
                        <el-select clearable filterable v-model="form.level">
                            <el-option v-for="(opt, optIndex) in levelList" :key="optIndex" :label="opt.dictLabel"
                                :value="opt.dictValue"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" size="mini" @click="search1">搜索</el-button>
                        <el-button size="mini" @click="resetForm1">重置</el-button>
                    </el-form-item>
                </el-form>

            </el-col>
        </el-row>
        <el-row style="margin-bottom:.625rem">
            <el-col>
                <el-button type="primary" size="mini" @click="handleSelection">选择</el-button>
            </el-col>
        </el-row>
        <el-table :data="tableList" @selection-change="selectionChange">
            <el-table-column type="selection"></el-table-column>
            <el-table-column type="index" label="NO."></el-table-column>
            <el-table-column show-overflow-tooltip prop="title" label="题目"></el-table-column>
            <el-table-column show-overflow-tooltip prop="answer" label="答案"></el-table-column>
            <el-table-column show-overflow-tooltip prop="type" label="类型"></el-table-column>
            <el-table-column show-overflow-tooltip prop="level" label="级别"></el-table-column>
        </el-table>
        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize" @pagination="getList" />


    </el-dialog>
</template>

<script>
import '@/plugins/sweetalert/js/sweetalert.min.js'
import jquery from 'jquery'

import serice from '@/utils/request'
import { listData } from '@/api/system/dict/data'
export default {
    data() {
        return {
            selections: [],
            form: {
                title: '',
                type: '',
                level: '',
                state:true,//试题启用状态
            },
            levelList:[],
            typeList:[],
            rules: {
                title: [{ required: false, trigger: 'blur' }],
                level: [{ required: false, trigger: 'blur' }],
                type: [{ required: false, trigger: 'blur' }],
            },
            serverurl: '',
            visible: false,
            total: 0,
            tableList: [],
            queryParams: {
                pageSize: 10,
                pageNum: 1
            }
        }
    },
    props: {
        FID: {
            type: String,
            default: null
        },
        baseUrl: {
            type: String,
            default: ''
        }
    },
    methods: {
        handleSelection() {
            if (this.selections.length == 0) return this.$message.warning("请选择题目")
            this.$emit('changeSelect', this.selections);
            this.closeDialog()
        },
        closeDialog() {
            this.$emit('closeDialog')
        },
        //获取数据字典数据
        getDict() {
            listData(
                {
                    dictType: 'testquestionstype',
                    tm: new Date().getTime(),
                    pageSize: 10,
                    pageNum: 1
                }).then(res => {
                    let { code, rows, msg } = res;
                    if (code != 200) {
                        return this.$message.error(msg)
                    }
                    this.typeList = rows;
                })
            listData(
                {
                    dictType: 'testquestionslevel',
                    tm: new Date().getTime(),
                    pageSize: 10,
                    pageNum: 1
                }).then(res => {
                    let { code, rows, msg } = res;
                    if (code != 200) {
                        return this.$message.error(msg)
                    }
                    this.levelList = rows;
                })

        },
        selectionChange(rows) {
            this.selections = rows;
        },
        search1() {
            this.getList()
        },
        resetForm1() {
            this.resetForm('form');
            this.getList()
        },
        init() {
            this.serverurl = process.env.VUE_APP_BASE_API;
            this.getList();
            this.getDict()
        },
        getList() {
            // 获取form表单查询信息
            let formData = new FormData();
            for (let i in this.form) {
                formData.append(i, this.form[i])
            }
            formData.append('state', 'true')
            serice({
                method: "get",
                url: `${this.baseUrl}/list`,
                params:{
                    ...this.form,

                    pageSize:this.queryParams.pageSize,
                    pageNum:this.queryParams.pageNum,
                    tm:new Date().getTime()
                }
            }).then(res => {
                let {
                    code,
                    msg,
                    rows,
                    total
                } = res;
                if (code != 200) {
                    this.$message.error(msg)
                    return
                }
                this.total = total;
                this.tableList = rows;
            })
        }
    },
    mounted() {
        this.init()
    }
}
</script>

<style>

</style>

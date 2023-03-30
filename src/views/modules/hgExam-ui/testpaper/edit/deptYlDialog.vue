<template>
    <el-dialog :title="title" class="hgExam" append-to-body :visible.sync="visible" :close-on-click-modal="false"
        :before-close="closeDialog" width="60%">
        <el-card>
            <div style="overflow: auto; scrolling: yes;height:400px">
                <ul>
                    <li v-for="(data, index) in queList" :key="index">
                        <template v-if="'F' != TYPE">
                            <strong><b>{{ index + 1 }}.</b></strong>
                            <b>{{ data.title }}</b>
                        </template>
                        <!-- 带有富文本框的题目-----复合体 -->

                        <template v-if="'F' == TYPE">
                            <el-row class="fuheti"><el-col :span="0.5">
                                    {{ index + 1 }} .</el-col>
                                <el-col :span="23.5">
                                    <span v-html="data.title.split('../../plugins/ueditor').join(serverurl + 'plugins/ueditor')" /></el-col>
                            </el-row>
                        </template>
                        <template v-if="'A' == TYPE || 'B' == TYPE">
                            (<span v-show="paperType == 'common'" class="text-danger mb-1 mb-1">
                                答案：{{ data.answer }}</span>
                            <span v-show="paperType != 'common'" class="text-success mb-1">
                                正确答案：{{ data.answer }}</span>)
                        </template>
                        <template v-if="'C' == TYPE">
                            (<span v-show="paperType == 'common'" class="text-danger mb-1 mb-1">
                                答案：{{ data.answer
        == 'true' ? '正确' : '错误'
}}</span>
                            <span v-show="paperType != 'common'" class="text-success mb-1">
                                正确答案：{{ data.answer
        == 'true' ? '正确' : '错误'
}}</span>)
                        </template>
                        <template v-if="'F' != TYPE && '' != data.filepath && null != data.filepath"><br>
                            <img class="ylImg" v-bind:src="serverUrl + data.filepath"></template>
                        <template v-if="('A' == TYPE || 'B' == TYPE) && data.foption.length < 53">
                            <br>{{ data.foption.split(",fh,").join("") }}
                        </template>
                        <template v-if="('A' == TYPE || 'B' == TYPE) && data.foption.length > 52">
                            <br><span v-html="lineFeed(data.foption.split(',fh,'))"></span>
                        </template>
                        <template v-if="'D' == TYPE || 'E' == TYPE || 'F' == TYPE">
                            <br><span class="text-danger mb-1 mb-1">答案：{{ data.answer }}</span>
                        </template>
                        <br />
                        <span class="text-primary mb-1"> [答案解析：{{ data.remarks }} ]</span>

                        <div class="text-info mb-1">[类型：{{ data.type
}}&nbsp;级别：{{ data.level }}]
                            <!-- 移除功能添加 -->
                            <template v-if="currentType == 'edit'">
                                <template v-if="'A' == TYPE"><span class="badge badge-danger"
                                        style="cursor:pointer; float: right;"
                                        v-on:click="removeQue(data.singleelectionId, 'A')">移除此题</span></template>
                                <template v-if="'B' == TYPE"><span class="badge badge-danger"
                                        style="cursor:pointer; float: right;"
                                        v-on:click="removeQue(data.multipleselectionId, 'B')">移除此题</span></template>
                                <template v-if="'C' == TYPE"><span class="badge badge-danger"
                                        style="cursor:pointer; float: right;"
                                        v-on:click="removeQue(data.judgementquestionId, 'D')">移除此题</span></template>
                                <template v-if="'D' == TYPE"><span class="badge badge-danger"
                                        style="cursor:pointer; float: right;"
                                        v-on:click="removeQue(data.completionId, 'C')">移除此题</span></template>
                                <template v-if="'E' == TYPE"><span class="badge badge-danger"
                                        style="cursor:pointer; float: right;"
                                        v-on:click="removeQue(data.largequestionId, 'E')">移除此题</span></template>
                                <template v-if="'F' == TYPE"><span class="badge badge-danger"
                                        style="cursor:pointer; float: right;"
                                        v-on:click="removeQue(data.compoundquestionId, 'F')">移除此题</span></template>

                            </template>
                        </div>
                        <div v-if="targetObj.useranswer" class="text-danger mb-1 mb-1">[ 你的答案：{{ targetObj.useranswer }}
                            ]
                        </div>

                    </li>
                </ul>
                <div style="text-align:center">
                    <el-button class="btn btn-primary md-close" type="primary" size="mini" @click="closeDialog">
                        关闭
                    </el-button>
                </div>
            </div>
            <!-- <div class="md-overlay"></div> -->
        </el-card>
    </el-dialog>
</template>

<script>
import '@/plugins/sweetalert/js/sweetalert.min.js'
import jquery from 'jquery'

import serice from '@/utils/request'
export default {
    props: {
        currentType: {
            default: 'read',//只读   edit编辑
            type: String
        },
        // 试卷解析
        paperType: {
            default: 'common',
            type: String
        },
        targetObj: {
            default: () => {
                return null
            },
            type: Object
        }
    },
    data() {
        return {
            TESTPAPER_ID: '',	//主键ID
            pd: [],				//存放字段参数
            varList: [],		//试卷试题
            serverurl: '',
            fontSize: 14,		//页面字号
            loading: true,
            visible: false,
            queList: [],
            title: '预览试题',
            TYPE: '',
            serverUrl: process.env.VUE_APP_BASE_API

        }
    },
    watch: {
        targetObj: {
            handler(newV) {
                if (newV) {
                    this.$nextTick(() => {
                        this.init()
                    })
                }
            }, deep: true,
            immediate: true
        }
    },
    methods: {
        closeDialog() {
            this.$emit('closeDialog')
        },
        //初始执行
        init() {
            this.serverurl = process.env.VUE_APP_BASE_API;


            this.getData();

        },

        //根据主键ID获取数据
        getData() {
            this.TYPE = this.targetObj.t;
            let qurl = "";
            switch (this.TYPE) {
                case 'A':
                    qurl = '/singleelection/getListByIDS';
                    break;
                case 'B':
                    qurl = '/multipleselection/getListByIDS';
                    break;
                case 'C':
                    qurl = '/judgementquestion/getListByIDS';
                    break;
                case 'D':
                    qurl = '/completion/getListByIDS';
                    break;
                case 'E':
                    qurl = '/largequestion/getListByIDS';
                    break;
                case 'F':
                    qurl = '/compoundquestion/getListByIDS';
                    break;
            }
            //预览试题列表
            serice.get(qurl + '/' + this.targetObj.selectedtopics).then(res => {
                let { code, msg, data } = res;
                this.queList = data;
            })

        },
        //移除题目
        removeQue(ID, TYPE) {
            this.$emit('removeQue', ID, TYPE)
            let targetIndex = this.queList.findIndex(item => {
                let id = ''
                if (TYPE == 'A') {
                    id = item.singleelectionId
                } else if (TYPE == 'B') {
                    id = item.multipleselectionId
                } else if (TYPE == 'C') {
                    id = item.judgementquestionId
                } else if (TYPE == 'D') {
                    id = item.completionId;
                } else if (TYPE == "E") {
                    id = item.largequestionId
                } else if (TYPE == "F") {
                    id = item.compoundquestionId
                }

                return id
            })
            this.queList.splice(targetIndex, 1)
        },
        //单选多选题的选项换行
        lineFeed(arField) {
            let str = "";
            for (let i = 0; i < arField.length; i++) {
                str += arField[i] + '<br>';
            }
            return str;
        },

    },

    mounted() {
        // this.init();
    }

}
</script>

<style scoped lang="scss">
@import '../../../../../assets/fonts/material/css/materialdesignicons.min.css';
@import '../../../../../assets/fonts/fontawesome/css/fontawesome-all.min.css';

ul h6 {
    font-size: 14px !important;
    margin-bottom: 8px !important;
}

ul {
    list-style: none !important;
}

p.text-muted {
    font-size: 13px;
}

h4 {
    font-size: 20px !important;
}

h1,
h2,
h3,
h4,
h5,
h6 {
    color: #111;
    font-weight: 400 !important;
}

.text-primary {
    color: #007bff !important
}
.fuheti {
    ::v-deep.el-col span>p {
        margin: 0;
    }
}
</style>

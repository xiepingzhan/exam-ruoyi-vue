<template>
    <el-dialog :title="title" class="hgExam" :visible.sync="visible" append-to-body :close-on-click-modal="false"
        :before-close="closeDialog" width="60%">
        <div class="pcoded-wrapper" id="app" v-bind:style="{ fontSize: fontSize + 'px' }">
            <div class="pcoded-content">
                <div class="pcoded-inner-content">
                    <div class="main-body">
                        <div class="page-wrapper">
                            <!-- [ Main Content ] start -->
                            <el-row>
                                <!-- [ Hover-table ] start -->
                                <el-col>
                                    <el-card>

                                        <div class="card-block table-border-style">
                                            <div class="table-responsive">
                                                <!-- <img v-if="currentType == 'read'"
                                                    :src="require('@/assets/images/images/jige' + PASSONOT + '.png')"
                                                    style="z-index: 1;position:absolute;float: right;margin-top: 15px;" /> -->

                                                <!-- [加载状态 ] start -->
                                                <div v-show="loading">
                                                    <div class="d-flex justify-content-center">
                                                        <div class="spinner-border" style="width: 3rem; height: 3rem;"
                                                            role="status">
                                                            <span class="sr-only">Loading...</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <br>
                                                <!-- [ 加载状态  ] End -->
                                                <div style="width: 100%;text-align: center;">
                                                    <h4>{{ pd.TITLE }}</h4>
                                                </div>
                                                <div style="width: 100%;text-align: center;">
                                                    <p class="text-muted mb-0">
                                                        {{ pd.REMARKS }}&nbsp;&nbsp;(&nbsp;满分{{ pd.TOTALSCORE }}分，考试时间{{
                                                                pd.DURATION
                                                        }}分钟&nbsp;)
                                                    </p>
                                                </div>
                                                <div style="width: 100%;text-align: center;margin-top: 5px;">
                                                    <p class="text-muted mb-0">
                                                        页面字号：&nbsp;[&nbsp;
                                                        <a v-on:click="fontSize -= 5"
                                                            style="cursor:pointer;">小</a>&nbsp;
                                                        <a v-on:click="fontSize = 14"
                                                            style="cursor:pointer;">中</a>&nbsp;
                                                        <a v-on:click="fontSize += 5" style="cursor:pointer;">大</a>
                                                        &nbsp;]
                                                    </p>
                                                </div>
                                                <br>
                                                <ul style="margin-left: -30px;">
                                                    <li v-for="(data, index) in varList" :key="index">
                                                        <h6 style="margin-top: 10px;"><b>{{ data.TITLE }}</b>&nbsp;
                                                            <font color="#808080">
                                                                ({{ data.REMARKS }}&nbsp;每题{{ data.FRACTION }}分，{{
                                                                        data.TOTALSCORE
                                                                }})
                                                            </font>
                                                        </h6>
                                                        <ul style="margin-left: -20px;">
                                                            <!-- {{data}} -->
                                                            <li v-for="(fdata, findex) in data.ALLTI" :key="findex"
                                                                style="list-style-type:none;margin-top: 5px;">
                                                                <template v-if="data.TYPE!='F'">
                                                                    {{ findex + 1 }} .
                                                                    <span v-html="fdata.title.split('../../plugins/ueditor').join(serverurl + 'plugins/ueditor')"></span>
                                                                </template>
                                                                <template v-else>
                                                                    <el-row class="fuheti"><el-col :span="0.5">
                                                                            {{ findex + 1 }} .</el-col>
                                                                        <el-col :span="23.5">
                                                                            <span v-html="fdata.title.split('../../plugins/ueditor').join(serverurl + 'plugins/ueditor')"></span>
                                                                        </el-col>
                                                                    </el-row>
                                                                </template>

                                                                <template
                                                                    v-if="'' != fdata.filepath && null != fdata.filepath"><br>&nbsp;&nbsp;&nbsp;<img
                                                                        class="ylImg"
                                                                        v-bind:src="serverUrl+fdata.filepath"></template>
                                                                <template
                                                                    v-if="undefined != fdata.foption && fdata.foption.length < 77"><br>
                                                                    <div style="margin-top: 5px;margin-left: 20px;">
                                                                        {{
                                                                                fdata.foption.split(",fh,").join("&nbsp;&nbsp;&nbsp;")
                                                                        }}
                                                                    </div>
                                                                </template>
                                                                <!-- 选项 -->
                                                                <template
                                                                    v-if="undefined != fdata.foption && fdata.foption.length > 76"><br>
                                                                    <div style="margin-top: 5px;margin-left: 20px;"
                                                                        v-html="lineFeed(fdata.foption.split(',fh,'))">
                                                                    </div>
                                                                </template>
                                                                <!-- 带正确答案和考生回答以及回答正确与否 -->
                                                                <template
                                                                    v-if="currentType == 'pinglun' || currentType == 'read'">
                                                                    <template
                                                                        v-if="data.TYPE == 'A' || data.TYPE == 'B'">
                                                                        <span class="text-danger mb-1 mb-1"
                                                                            style="padding-left: 20px;">[
                                                                            考生选择：{{ fdata.ua }} ]</span>
                                                                    </template>
                                                                    <template v-if="data.TYPE == 'C'">
                                                                        <br>
                                                                        <span class="text-danger mb-1 mb-1"
                                                                            style="padding-left: 20px;">[
                                                                            考生填写的答案：{{ fdata.ua == 'true' ? '对' : '错' }}
                                                                            ]</span>
                                                                    </template>
                                                                    <template
                                                                        v-if="data.TYPE == 'D' || data.TYPE == 'E' || data.TYPE == 'F'">
                                                                        <span class="text-danger mb-1 mb-1"
                                                                            style="padding-left: 20px;"><br>[
                                                                            考生填写的答案：{{ fdata.ua }} ]</span></template>
                                                                </template>
                                                            </li>
                                                        </ul>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </el-card>
                                </el-col>
                            </el-row>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </el-dialog>
</template>

<script>
import '@/plugins/sweetalert/js/sweetalert.min.js'
import jquery from 'jquery'
import serice from '@/utils/request'
import echartsVue from './echarts.vue'


export default {
    components: {
        echartsVue
    },
    props: {
        dataUrl: {
            default: '',//页面请求地址
            type: String
        },
        FID: {
            default: null,
            type: String
        },
        STATE: {
            default: ''
        },
        currentType: {
            default: undefined,
            type: String,
        },
        PASSONOT: { //是否及格
            default: undefined,
            type: String
        },
        PASSINGSCORE: {
            default: undefined,
        },
        SCORE: { //得分
            default: undefined,
            // type: String
        },
        EXID: { //作答ID
            default: undefined,
            type: String
        }
    },
    data() {
        return {
            serverUrl:process.env.VUE_APP_BASE_API,
            TESTPAPER_ID: '',	//主键ID
            pd: [],				//存放字段参数
            varList: [],		//试卷试题
            serverurl: '',
            fontSize: 14,		//页面字号
            loading: true,
            visible: false,
            fbar: false,
            title: '预览',
            optionP: null,//饼图
            optionC: null,//柱状图
            staticsable: false,//分析统计标识符

        }
    },

    methods: {
        // 关闭统计分析
        beforeClose1() {
            this.staticsable = false;
        },
        closeDialog() {
            this.$emit('closeDialog')
        },
        //初始执行
        init() {
            this.serverurl = process.env.VUE_APP_BASE_API;

            let FID = this.FID;	//当接收过来的FID不为null时,表示此页面是修改进来的
            if (null != FID) {
                this.TESTPAPER_ID = FID;
                this.getData();
            }
        },

        //根据主键ID获取数据
        getData() {
            let curData = {
                testpaperId: this.TESTPAPER_ID,
                tm: new Date().getTime()
            }
            if (this.EXID) {
                curData.examinationrecordId = this.EXID;
            }
            if (this.STATE) curData.state = this.STATE;

            //发送 post 请求
            serice.post(this.dataUrl, curData).then(res => {
                let { result, ...data } = res;
                if (result != 'success') return
                for (let i in data.pd) {
                    this.pd[i.toLocaleUpperCase()] = data.pd[i]
                }							//参数map
                this.varList = data.varList.map(item => {
                    let obj = {}
                    for (let i in item) {
                        obj[i.toLocaleUpperCase()] = item[i]
                    }
                    obj.ALLTI = item.tqList;
                    return obj
                })

            })
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
        this.init();
    }

}
</script>

<style scoped>
@import '../../../assets/fonts/material/css/materialdesignicons.min.css';
@import '../../../assets/fonts/fontawesome/css/fontawesome-all.min.css';

.gnClass {
    color: black;
}

.gnClass:hover {
    color: #1890ff;
}

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
</style>

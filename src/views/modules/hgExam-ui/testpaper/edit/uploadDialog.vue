<template>
    <el-dialog :title="title" width="70%" :visible.sync="visible" :close-on-click-modal="false"
        :before-close="closeDialog">
        <el-form :model="form" ref="form" label-width="5rem" :rules="rules" size="mini">
            <el-row>
                <el-col>
                    <el-form-item label="大题题目" prop="title">
                        <el-input v-model="form.title" placeholder="请输入大题题目"></el-input>
                    </el-form-item>
                </el-col>
                <!-- 内部form -->
                <el-col>
                    <el-form :model="insideForm" ref="insideForm" label-width="5rem" :rules="insideRules"
                        label-position="left">
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="题型" prop="type">
                                  <el-select v-model="insideForm.type" style="width:100%"
                                             :disabled="SELECTEDTOPICS != ''"
                                             ref="testpaper_type"
                                             @change="testPaperChange"
                                  >
                                    <el-option v-for="(opt, optIndex) in typeList" :key="optIndex"
                                               :label="opt.dictLabel" :value="opt.dictValue"></el-option>
                                  </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="每题分数" prop="fraction">
                                    <el-input :disabled="SELECTEDTOPICS != ''" v-model="insideForm.fraction"
                                        type="number" min="1" placeholder="每题分数"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="题数/总分" prop="totalscore">
                                    <el-input placeholder="自动计算" v-model="insideForm.totalscore" disabled></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </el-col>
                <!-- tab切换 -->
                <el-col style="padding-right:.625rem;padding-bottom:.625rem;box-sizing:border-box;">
                    <el-tabs v-model="tabIndex" :stretch="true" type="border" @tab-click="tabchange">
                        <el-tab-pane name="first" label="随机选题">
                            <el-form :model="sjForm" ref="sjForm" :rules="sjRules" label-width="5rem" size="mini">
                                <el-row>
                                    <el-col :span="7">
                                        <el-form-item label="题数" prop="qnumber">
                                            <el-input type="number" min="1" style="width:100%" v-model="sjForm.qnumber">
                                            </el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="7">
                                        <el-form-item label="类型" prop="type">
                                            <el-select v-model="sjForm.type" clearable style="width:100%" filterable>
                                                <el-option v-for="(sj, sjIndex) in txtypeList" :key="sjIndex"
                                                    :label="sj.dictLabel" :value="sj.dictValue"></el-option>
                                            </el-select>
                                        </el-form-item>

                                    </el-col>
                                    <el-col :span="7">
                                        <el-form-item label="级别" prop="level">
                                            <el-select v-model="sjForm.level" clearable filterable style="width:100%">
                                                <el-option v-for="(sj, sjIndex) in txlevelList" :key="sjIndex"
                                                    :label="sj.dictLabel" :value="sj.dictValue"></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="3">
                                        <el-button type="primary" size="mini" style="float:right" @click="automatic">获取</el-button>
                                    </el-col>
                                </el-row>

                            </el-form>
                        </el-tab-pane>
                        <el-tab-pane name="second" label="手动选题">
                            <el-button type="primary" size="mini" @click="manualSelection">选择题目</el-button>
                        </el-tab-pane>
                    </el-tabs>
                </el-col>
                <el-col>
                    <el-col style="padding-left:10px;">
                        <el-form-item
                          label="选中题目"
                          label-width="5.375rem"
                          prop="selectedNum"
                          :rules="[{required:true,message:'请选择几道题',trigger:'blur'}]"
                        >
                            <span v-show="FHSEL == '已选中0道题'">已选中0道题</span>
                            <template v-if="FHSEL != '已选中0道题'">
                                <span>
                                    <span>{{ FHSEL }}</span>
                                    &nbsp;
                                    <el-button type="primary" size="mini" @click="viewQue">查看</el-button>&nbsp;<span>{{
                                            '(若要修改题型分值,请先移除全部选中的题目)'
                                    }}</span>
                                </span>
                            </template>

                        </el-form-item>
                    </el-col>
                    <el-col class="sortClass">
                        <el-form-item label="大题排序" prop="forder" label-width="4.375rem">
                            <el-input type="number" min="1" v-model="form.forder"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col>
                        <el-form-item label="大题说明" prop="remarks">
                            <el-input v-model="form.remarks" placeholder="大题说明"></el-input>
                        </el-form-item>
                    </el-col>
                </el-col>
            </el-row>
        </el-form>
        <template slot="footer">
            <div style="padding:0;margin:0;text-align:center">
                <el-button type="primary" size="mini" @click="save">确定</el-button>
                <el-button size="mini" @click="closeDialog">取消</el-button>
            </div>
        </template>
        <select-w-dialog v-if="selectable" :FID="FID" ref="selectDialog" :baseUrl="baseUrl"
            @closeDialog="selectable = false" @changeSelect='changeSelection'></select-w-dialog>
        <dept-yl-dialog ref="deptYlDialog" v-if="deptAble" :targetObj="targetObj" currentType="edit" :FID="FID"
            @closeDialog="deptAble = false" @removeQue='removeQue'></dept-yl-dialog>
    </el-dialog>
</template>

<script>
import '@/plugins/sweetalert/js/sweetalert.min.js'
import jquery from 'jquery'

import selectWDialog from './selectWDialog.vue'
import deptYlDialog from './deptYlDialog.vue'
import serice from '@/utils/request'
import { listData } from '@/api/system/dict/data'
export default {
    components: {
        selectWDialog,
        deptYlDialog
    },
  //evaluationresults  考评方式  A 考完直接出  B 人工阅卷后
  props: ['FID', 'TESTPAPER_ID','evaluationresults'],
    data() {
        return {
            answer: '',
            ZFRACTION: '',
            visible: false,
            deptAble: false,
            title: "新增",
            typeList: [
                { dictValue: 'A', dictLabel: "单选题" },
                { dictValue: 'B', dictLabel: "多选题" },
                { dictValue: 'C', dictLabel: "判断题" },
                { dictValue: 'D', dictLabel: '填空题' },
                { dictValue: 'E', dictLabel: '问答题' },
                { dictValue: 'F', dictLabel: '复合题' },
            ],
            targetObj: {
                t: '',
                selectedtopics: ''
            },
            txtypeList: [],
            txlevelList: [],
            selectable: false,
            SELECTEDTOPICS: "",
            tabIndex: 'first',
            form: {
                title: '',
                forder: '',
                remarks: '',
                selectedNum:undefined

            },
            rules: {
                title: [{ required: true, message: '请输入大题题目', trigger: 'blur' }],
                forder: [{ required: false, trigger: 'blur' }],
                remarks: [{ required: true, trigger: 'blur', message: '请输入大题说明' }]
            },
            insideForm: {
                type: "",
                fraction: '',
                totalscore: '',

            },
            insideRules: {
                type: [{ required: true, message: "请选择题型", trigger: 'bur' }],
                fraction: [{ required: true, message: '请输入每题分数', trigger: 'blur' }],
                totalscore: [{ required: false, message: '', trigger: 'blur' }],
            },
            sjForm: {
                qnumber: "",
                type: '',
                level: ""
            },
            sjRules: {
                qnumber: [{ required: true, message: '请输入题数', trigger: 'blur' }],
                type: [{ required: false, message: '请选择类型', trigger: 'blur' }],
                level: [{ required: false, message: "请选择级别", trigger: 'blur' }]
            },
            msg: 'add',
            FHSEL: '已选中0道题',		//题数
            baseUrl: '',
        }
    },
    methods: {
      testPaperChange(value){
        console.log(this.evaluationresults,"121212212121")
        if(this.evaluationresults!='B'){
        //  考完直接出
          if(value=='D'||
            value=='E'||
            value=="F"
          ){
            this.insideForm.type = '';
            this.$modal.msgWarning("请更改考评成绩为人工阅卷后")
            this.$refs['testpaper_type'].focus()
          }
        }
      },
        tabchange() {
            this.resetForm('sjForm')
        },
        //
        changeSelection(rows) {
            let fid = rows.map(item => {
                let id = ""
                if (item.singleelectionId) id = item.singleelectionId
                if (item.multipleselectionId) id = item.multipleselectionId
                if (item.judgementquestionId) id = item.judgementquestionId
                if (item.completionId) id = item.completionId;
                if (item.largequestionId) id = item.largequestionId;
                if (item.compoundquestionId) id = item.compoundquestionId;
                return id;
            }).join(',')

            let fan = rows.map(item => item.answer).join(',')

            if ("" != fid) {
                this.getQue(fid, fan)
            }
        },
        closeDialog() {
            this.$emit('closeDialog')
        },
        //初始执行
        init() {
            this.serverurl = process.env.VUE_APP_BASE_API;
            let FID = this.FID;	//当接收过来的FID不为null时,表示此页面是修改进来的
            if (null != FID) {
                this.msg = 'edit';
                this.TESTPAPERMX_ID = FID;
                this.getData();
            }
            setTimeout(() => {
                this.getDict();
                // this.modalEffects();
            }, 200);
        },

        //去保存
        save() {

            this.$refs.form.validate(valid => {
              this.$refs.insideForm.validate(insideValid=>{
                if(valid&&insideValid){
                  serice({
                    method: this.FID ? 'put' : 'post',
                    url: this.FID ? '/testpapermx' : '/testpapermx/add',
                    data: {
                      testpapermxId: this.TESTPAPERMX_ID,
                      testpaperId: this.TESTPAPER_ID,
                      title: this.form.title,
                      type: this.insideForm.type,
                      fraction: this.insideForm.fraction,
                      totalscore: this.insideForm.totalscore,
                      zfraction: this.ZFRACTION,
                      selectedtopics: this.SELECTEDTOPICS,
                      answer: this.answer,
                      forder: this.form.forder,
                      remarks: this.form.remarks,
                      tm: new Date().getTime()
                    }
                  }).then(res => {
                    this.$emit('uploadList')
                    this.$emit('uploadData')
                    this.closeDialog()
                  })
                }
              })
            })
        },

        //根据主键ID获取数据
        getData() {
            //发送 post 请求
            serice({
                method: "get",
                url: '/testpapermx/' + this.FID,
            }).then(res => {
                let { code, data, msg } = res;
                if (code != 200) return this.$message.error(msg);
                this.insideForm.type = data.type;						//题型
                this.insideForm.totalscore = data.totalscore;
                this.ZFRACTION = data.zfraction;
                this.SELECTEDTOPICS = data.selectedtopics;
                this.answer = data.answer;
                this.form.remarks = data.remarks;
                this.form.title = data.title;
                this.form.forder = data.forder;
                this.insideForm.fraction = data.fraction;
                let narry =this.SELECTEDTOPICS!=''? (this.SELECTEDTOPICS).split(','):[];
                if (null != narry && narry.length != 0) this.calculation(narry);
            })
        },

        //手动选题
        manualSelection() {
            this.$refs.insideForm.validate(valid => {
                if (valid) {
                    let durl = '';
                    let dtitle = '';
                    // 切换新窗口
                    switch (this.insideForm.type) {
                        case 'A':
                            dtitle = "单选题";
                            durl = '/singleelection'
                            break;
                        case 'B':
                            dtitle = "多选题";
                            durl = '/multipleselection'
                            break;
                        case 'C':
                            dtitle = "判断题";
                            durl = '/judgementquestion'
                            break;
                        case 'D':
                            dtitle = "填空题";
                            durl = '/completion'
                            break;
                        case 'E':
                            dtitle = "问答题";
                            durl = '/largequestion'
                            break;
                        case 'F':
                            dtitle = "复合题";
                            durl = '/compoundquestion'
                            break;
                    }
                    this.baseUrl = durl;
                    this.selectable = true;
                    this.$nextTick(() => {
                        this.$refs.selectDialog.visible = true;
                    })
                }
            })
        },

        //自动选题
        automatic() {
            this.$refs.insideForm.validate(valid => {
                if (valid) {
                    this.$refs.sjForm.validate(sjValid => {
                        if (sjValid) {
                            serice({
                                method: 'post',
                                data: {
                                    qnumber: this.sjForm.qnumber,
                                    type: this.sjForm.type,
                                    level: this.sjForm.level,
                                    tabn: this.insideForm.type,
                                    tm: new Date().getTime()
                                },
                                url: '/testpapermx/automatic'
                            }).then(res => {
                                let { result, ...data } = res;
                                let fid = data.fid;	//试题的ID
                                let fan = data.fan;	//试题的答案
                              if ("" != fid) {
                                    this.getQue(fid, fan)
                                } else {
                                    this.$message.error('没有符合要求的试题')
                                }
                            })
                        }
                    })
                }
            })
        },

        //根据字符串提取试题
        getQue(fid, fan) {
            if (this.SELECTEDTOPICS == '') {
                this.SELECTEDTOPICS += fid;
            } else {
                this.SELECTEDTOPICS += ',' + fid;
            }
            let arryFid = (this.SELECTEDTOPICS).split(',');
            let rFid = this.unique(arryFid);
            this.SELECTEDTOPICS = rFid.join(",");	//拼接成新的无重复字符串
            if ('A' == this.insideForm.type || 'B' == this.insideForm.type || 'C' == this.insideForm.type) {
                if (this.answer == '') {
                    this.answer += fan;
                } else {
                    this.answer += ',' + fan;
                }
                let arryFan = (this.answer).split(',');
                let rFan = this.unique(arryFan);
                this.answer = rFan.join(",");
            }
            this.calculation(rFid);
        },

        //去除数组重复数据
        unique(arr) {
            let hash = [];
            for (let i = 0; i < arr.length; i++) {
                if (hash.indexOf(arr[i]) === -1) {
                    hash.push(arr[i]);
                }
            }
            return hash;
        },

        //计算题数和总分
        calculation(arry) {
            this.insideForm.totalscore = "共" + arry.length + "题/" + (arry.length * this.insideForm.fraction) + "分"
            this.FHSEL = "已选中" + arry.length + "道题"
            this.ZFRACTION = arry.length * this.insideForm.fraction;
            this.$set(this.form,'selectedNum',(arry.length===0?undefined:arry.length))
        },

        //查看题目
        viewQue() {
            this.deptAble = true;
            this.targetObj.t = this.insideForm.type;
            this.targetObj.selectedtopics = this.SELECTEDTOPICS;
            this.$nextTick(() => {
                this.$refs.deptYlDialog.visible = true;
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

        //移除题目
        removeQue(ID, TYPE) {
            let arraySe = this.SELECTEDTOPICS.split(',');
            let index = arraySe.indexOf(ID);
            arraySe.splice(index, 1);
            this.SELECTEDTOPICS = arraySe.join(',');
            if ('A' == TYPE || 'B' == TYPE || 'C' == TYPE) {
                let arrayAn = this.answer.split(',');
                arrayAn.splice(index, 1);
                this.answer = arrayAn.join(',');
            }
            if ('' == this.SELECTEDTOPICS) {
                this.queList = [];
            }
            this.calculation(arraySe);
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
                    this.txtypeList = rows;
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
                    this.txlevelList = rows;
                })

        },

        //初始查看题目窗口事件
        modalEffects() {
            let overlay = document.querySelector('.md-overlay');
            [].slice.call(document.querySelectorAll('.md-trigger')).forEach(function (el, i) {
                let modal = document.querySelector('#' + el.getAttribute('data-modal')),
                    close = modal.querySelector('.md-close');

                function removeModal(hasPerspective) {
                    classie.remove(modal, 'md-show');
                    jquery('body').removeClass(el.getAttribute('data-modal'));
                    if (hasPerspective) {
                        classie.remove(document.documentElement, 'md-perspective');
                    }
                }
                function removeModalHandler() {
                    removeModal(classie.has(el, 'md-setperspective'));
                }
                el.addEventListener('click', function (ev) {
                    classie.add(modal, 'md-show');
                    jquery('body').addClass(el.getAttribute('data-modal'));
                    overlay.removeEventListener('click', removeModalHandler);
                    overlay.addEventListener('click', removeModalHandler);

                    if (classie.has(el, 'md-setperspective')) {
                        setTimeout(function () {
                            classie.add(document.documentElement, 'md-perspective');
                        }, 25);
                    }
                });
                close.addEventListener('click', function (ev) {
                    ev.stopPropagation();
                    removeModalHandler();
                });
            });

        },
    },
    mounted() {
        this.init();
    }
}
</script>

<style lang="scss" scoped>
.sortClass {
    padding-left: 10px;

    ::v-deep .el-form-item__content {
        width: calc(100% - 80px) !important;
    }
}
</style>

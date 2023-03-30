<template>
  <el-dialog
    :title="title"
    class="hgExam"
    :visible.sync="visible"
    append-to-body
    :close-on-click-modal="false"
    :before-close="closeDialog"
    width="60%">
    <div
      class="pcoded-wrapper"
      id="app"
      v-bind:style="{ fontSize: fontSize + 'px' }"
    >
      <div class="pcoded-content">
        <div class="pcoded-inner-content">
          <div class="main-body">
            <div class="page-wrapper">
              <!-- [ Main Content ] start -->
              <el-row>
                <!-- [ Hover-table ] start -->
                <el-col id="paper">
                  <el-card>

                    <div class="card-block table-border-style">
                      <div class="table-responsive">
                        <img
                          v-if="currentType == 'read'"
                          :src="require('@/assets/images/images/jige' + PASSONOT + '.png')"
                          style="z-index: 1;position:absolute;float: right;margin-top: 15px;"
                        />

                        <!-- [加载状态 ] start -->
                        <div v-show="loading">
                          <div class="d-flex justify-content-center">
                            <div
                              class="spinner-border"
                              style="width: 3rem; height: 3rem;"
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
                        <div
                          style="float: right;margin-right: 88px;"
                          v-show="currentType == 'read'">
                          <div
                            style="z-index: 1;position:absolute;font-size: 26px;margin-top: -20px;color: red">
                            <b>{{ SCORE }}</b>&nbsp;分
                          </div>
                        </div>
                        <div style="width: 100%;text-align: center;">
                          <p class="text-muted mb-0">
                            {{ pd.REMARKS }}&nbsp;&nbsp;(&nbsp;满分{{ pd.TOTALSCORE }}分，考试时间{{ pd.DURATION }}分钟&nbsp;)
                          </p>
                        </div>
                        <div style="width: 100%;text-align: center;margin-top: 5px;">
                          <p class="text-muted mb-0">
                            页面字号：&nbsp;[&nbsp;
                            <a v-on:click="fontSize -= 5"
                               style="cursor:pointer;">小</a>&nbsp;
                            <a v-on:click="fontSize = 14"
                               style="cursor:pointer;">中</a>&nbsp;
                            <a v-on:click="fontSize += 5"
                               style="cursor:pointer;">大</a>
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
                                <template v-if="data.TYPE == 'F'">
                                  <!-- 带有富文本框的题目-----复合体 -->
                                  <el-row class="fuheti">
                                    <el-col :span="0.5">
                                      {{ findex + 1 }} .
                                    </el-col>
                                    <el-col :span="23.5">
                                      <span v-html="fdata.title.split('../../plugins/ueditor').
                                      join(serverurl + 'plugins/ueditor')"/>
                                    </el-col>
                                  </el-row>
                                </template>
                                <template v-else>
                                  {{ findex + 1 }} . <span
                                  v-html="fdata.title.split('../../plugins/ueditor').
                                  join(serverurl + 'plugins/ueditor')"></span>
                                </template>
                                <template v-if="currentType == 'read'">

                                  <template v-if="data.TYPE == 'A'">
                                    <template
                                      v-if="undefined != fdata.foption">
                                      <el-button
                                        type="text" size="mini"
                                        icon="el-icon-s-data" class="gnClass"
                                        @click="statistics(fdata.singleelectionId, fdata.foption.split(',fh,').length,
                                         data.TYPE, 0);"
                                        title="统计"/>
                                    </template>
                                    <el-button type="text" size="mini"
                                               icon="el-icon-collection" class="gnClass"
                                               @click="collection(fdata.title, fdata.singleelectionId, data.TYPE, 'c' + index + '' + findex);"
                                               style="cursor:pointer;" title="收藏"/>
                                  </template>
                                  <!-- 多选 -->
                                  <template v-if="data.TYPE == 'B'">
                                    <template
                                      v-if="undefined != fdata.foption">
                                      <el-button
                                        type="text" size="mini" class="gnClass"
                                        icon="el-icon-s-data"
                                        @click="statistics(fdata.multipleselectionId, fdata.foption.split(',fh,').length, data.TYPE, 0);"
                                        title="统计"/>
                                    </template>
                                    <el-button type="text" size="mini"
                                               icon="el-icon-collection" class="gnClass"
                                               @click="collection(fdata.title, fdata.multipleselectionId, data.TYPE, 'c' + index + '' + findex);"
                                               style="cursor:pointer;" title="收藏"/>
                                  </template>
                                  <template v-if="data.TYPE == 'C'">
                                    <el-button type="text" size="mini"
                                               class="gnClass" icon="el-icon-s-data"
                                               @click="statistics(fdata.judgementquestionId, 0, data.TYPE, 0);"
                                               style="cursor:pointer;" title="统计"/>
                                    <el-button type="text" size="mini"
                                               class="gnClass" icon="el-icon-collection"
                                               @click="collection(fdata.title, fdata.judgementquestionId, data.TYPE, 'c' + index + '' + findex);"
                                               style="cursor:pointer;" title="收藏"/>
                                  </template>
                                  <template v-if="data.TYPE == 'D'">
                                    <el-button type="text" size="mini"
                                               class="gnClass" icon="el-icon-s-data"
                                               @click="statistics(fdata.completionId, 0, data.TYPE, data.FRACTION);"
                                               title="统计"></el-button>
                                    <el-button type="text" size="mini"
                                               class="gnClass" icon="el-icon-collection"
                                               @click="collection(fdata.title, fdata.completionId, data.TYPE, 'c' + index + '' + findex);"
                                               title="收藏"/>
                                  </template>
                                  <template v-if="data.TYPE == 'E'">
                                    <el-button type="text" size="mini"
                                               class="gnClass" icon="el-icon-s-data"
                                               @click="statistics(fdata.largequestionId, 0, data.TYPE, data.FRACTION);"
                                               title="统计"></el-button>
                                    <el-button type="text" size="mini"
                                               class="gnClass" icon="el-icon-collection"
                                               @click="collection(fdata.title, fdata.largequestionId, data.TYPE, 'c' + index + '' + findex);"
                                               title="收藏"/>
                                  </template>
                                  <template v-if="data.TYPE == 'F'">
                                    <el-button type="text" size="mini"
                                               class="gnClass" icon="el-icon-s-data"
                                               @click="statistics(fdata.compoundquestionId, 0, data.TYPE, data.FRACTION);"
                                               title="统计"></el-button>
                                    <el-button type="text" size="mini"
                                               class="gnClass" icon="el-icon-collection"
                                               @click="collection(fdata.title, fdata.compoundquestionId, data.TYPE, 'c' + index + '' + findex);"
                                               title="收藏"/>
                                  </template>
                                </template>
                                <template
                                  v-if="'' != fdata.filepath && null != fdata.filepath"><br>&nbsp;&nbsp;&nbsp;<img
                                  class="ylImg"
                                  v-bind:src="serverUrl + fdata.filepath"></template>
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
                                    <template v-if="('true' == pd.PUBLISHANSWER)">
                                      <span class="text-success mb-1"
                                            style="padding-left: 20px;">
                                        [正确答案：{{ fdata.answer }} ]
                                      </span>
                                    </template>
                                    <span class="text-danger mb-1 mb-1"
                                          style="padding-left: 20px;">[
                                                                            考生选择：{{ fdata.ua }} ]</span>

                                    <img
                                      v-bind:src="require('@/assets/images/images/' +
                                      (fdata.ur==''?'false':fdata.ur)
                                      +'.png')"
                                      width="25px;"
                                      style="vertical-align:middle"/>
                                    <template v-if="'true' == fdata.ur"><b>+&nbsp;{{
                                        fdata.uf
                                      }}</b>&nbsp;分
                                    </template>
                                    <template v-if="('true' == pd.PUBLISHANSWER)">
                                      <br><span class="text-primary mb-1" style="padding-left: 20px;">[
                                                                                答案解析：{{ fdata.remarks }} ]</span>
                                    </template>
                                  </template>
                                  <template v-if="data.TYPE == 'C'">
                                    <br>
                                    <template v-if="('true' == pd.PUBLISHANSWER)">
                                                                            <span class="text-success mb-1"
                                                                                  style="padding-left: 20px;">[
                                                                                正确答案：{{
                                                                                fdata.answer == 'true' ? '对' : '错'
                                                                              }}
                                                                                ]</span>
                                    </template>

                                    <span class="text-danger mb-1 mb-1"
                                          style="padding-left: 20px;">[
                                                                            考生填写的答案：{{
                                        fdata.ua == 'true' ? '对' : '错'
                                      }}
                                                                            ]</span>
                                    <img
                                      v-bind:src="require('@/assets/images/images/' + (fdata.ur==''?'false':fdata.ur) + '.png')"
                                      width="25px;"
                                      style="vertical-align:middle"/>
                                    <template v-if="'true' == fdata.ur">
                                      <b>+&nbsp;{{ fdata.uf }}</b>&nbsp;分
                                    </template>
                                    <template v-if="('true' == pd.PUBLISHANSWER)">
                                      <br>
                                      <span class="text-primary mb-1"
                                            style="padding-left: 20px;">[
                                                                                答案解析：{{ fdata.remarks }} ]</span>
                                    </template>
                                  </template>
                                  <template
                                    v-if="data.TYPE == 'D' || data.TYPE == 'E' || data.TYPE == 'F'">
                                    <el-row>

                                      <el-col :span="18">
                                                                                <span class="text-danger mb-1 mb-1"
                                                                                      style="padding-left: 20px;"><br>[
                                                                                    考生填写的答案：{{
                                                                                    fdata.ua
                                                                                  }} ]</span>
                                        <template v-if="('null' == fdata.ur)&&currentType!='pinglun'">
                                          <b>【未评审】</b>
                                        </template>
                                      </el-col>
                                      <el-col :span="6" v-if="currentType=='pinglun'">
                                        <template>
                                          <el-col :span="20">
                                            <el-col :span="4" :offset="8">
                                              <p style="margin-top:10px; font-size: 16px;">
                                                评：
                                              </p>
                                            </el-col>
                                            <el-col :span="8">
                                              <el-input style="width:100%" :ref="'pf'+index+'-'+findex"
                                                        v-model="fdata.uf"
                                                        @blur="subBig($event,data.FRACTION,fdata.bigId,fdata.uf,'pf'+index+'-'+findex)"
                                                        v-bind:id="'pf'+index+'-'+findex" name="NSCORE"
                                                        onkeyup="value = value.replace(/[^\d]/g,'')"
                                                        title="答案错误的话，请输入0">
                                              </el-input>
                                            </el-col>
                                            <el-col :span="4">
                                              <p style="padding-left: 10px; margin-top:10px;font-size: 16px;">
                                                分
                                              </p>
                                            </el-col>
                                          </el-col>

                                        </template>
                                      </el-col>
                                      <el-col :span="6" v-if="('null' != fdata.ur)&&currentType!='pinglun'">
                                        <template>
                                          <img
                                            v-bind:src="require('@/assets/images/images/' +(fdata.ur==''?'false':fdata.ur)+ '.png')"
                                            width="30px;"/>
                                          <template v-if="('false' != fdata.ur)">
                                            <b>+&nbsp;{{ fdata.uf }}</b>&nbsp;分
                                          </template>
                                        </template>

                                      </el-col>

                                    </el-row>
                                    <el-row>
                                      <el-col v-if="('true' == pd.PUBLISHANSWER)">
                                        <span class="text-success mb-1"
                                              style="padding-left: 20px;"><br>[
                                              正确答案：{{ fdata.answer }} ]</span>
                                      </el-col>
                                    </el-row>


                                    <template
                                      v-if="('true' == pd.PUBLISHANSWER)"><br><span
                                      class="text-primary mb-1">[
                                                                                答案解析：{{ fdata.remarks }}
                                                                                ]</span></template>
                                  </template>
                                </template>
                              </li>
                            </ul>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div style="text-align:center" v-if="currentType == 'pinglun'">
                      <el-button @click="subAch" type="primary" size="mini">提交成绩</el-button>
                    </div>
                  </el-card>
                </el-col>

                <el-button
                  type="primary"
                  v-if="currentType != 'read' && currentType != 'pinglun'"
                  style="background:#748892;border-color:#748892;margin-top:10px"
                  v-print="printObj"
                >打印试卷
                </el-button>
              </el-row>
            </div>

          </div>
        </div>
      </div>
      <!-- 分析统计 -->
      <el-dialog :visible.sync="staticsable" v-if="staticsable" append-to-body :close-on-click-modal="false"
                 class="hgExam" :before-close="beforeClose1" title="分析统计">
        <!-- 答对答错饼图 -->
        <el-card>
          <echarts-vue :chartData="optionP"/>
        </el-card>
        <!-- 选项的柱状分析 -->
        <el-card style="margin-top:10px;" v-if="fbar">
          <echarts-vue :chartData="optionC"/>
        </el-card>
      </el-dialog>
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
      default: '/testpaper/view',//页面请求地址
      type: String
    },
    examId: {
      default: undefined,//页面请求地址
      type: String
    },
    FID: {
      default: null,
      type: String
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
    },
    ACID: {//试卷ID
      default: '',
      type: String
    }
  },
  data() {
    return {
      serverUrl: process.env.VUE_APP_BASE_API,
      TESTPAPER_ID: '',	//主键ID
      pd: {},				//存放字段参数
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
      // 打印试卷配置
      printObj: {
        id: "paper",
        preview: false,
        popTitle: '',
        // extraCss: "https://cdn.bootcdn.net/ajax/libs/animate.css/4.1.1/animate.compat.css, https://cdn.bootcdn.net/ajax/libs/hover.css/2.3.1/css/hover-min.css",
        // extraHead: '<meta http-equiv="Content-Language"content="zh-cn"/>',

      }

    }
  },

  methods: {
    //提交大题评分
    subBig(event, FRACTION, BIGID, userScore, id) {
      if ('' == userScore) return false;
      if (FRACTION < userScore) {
        this.$modal.msgWarning(`已超过满分${FRACTION}分`)
        this.$refs[id][0].focus()
        userScore = 0
        return false;
      } else if (event.currentTarget.value < 0) {
        this.$modal.msgWarning('分值不能小于0')
        this.$refs[id][0].focus()
        userScore = 0
        return false;
      } else {
        let RESULT = "true";
        if (event.currentTarget.value == 0) {
          RESULT = "false";
        }
        serice({
          method: 'put',
          url: '/bigquestionfo',
          data: {
            bigquestionfoId: BIGID,
            score: event.currentTarget.value,
            result: RESULT,
            tm: new Date().getTime()
          }
        }).then(res => {
          let {code, msg} = res;
          if (code != 200) return this.$modal.msgError(msg)
        })
      }
    },
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
    //提交成绩
    subAch() {
      for (let i = 0; i < document.getElementsByName('NSCORE').length; i++) {
        if ('' == document.getElementsByName('NSCORE')[i].value ||
          'undefined' == document.getElementsByName('NSCORE')[i].value ||
          undefined == document.getElementsByName('NSCORE')[i].value ||
          null == document.getElementsByName('NSCORE')[i].value
        ) {
          this.$modal.msgWarning('这个题还未评分')
          document.getElementsByName('NSCORE')[i].focus();
          return false;
        }
      }
      swal({
        title: "",
        text: "确定要提交成绩吗?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          serice({
            method: "post",
            url: '/achievement/edit',
            data: {
              achievementId: this.ACID,
              examinationrecordId: this.EXID,
              passingscore: this.PASSINGSCORE,
              tm: new Date().getTime()
            }
          }).then(res => {
            let {code, msg} = res;
            if (code != 200) return this.$message.error(msg)
            swal("评阅完成!", "已转移到成绩管理列表中", "success");
            this.$emit("uploadList")
            this.closeDialog()
          })
        }
      });
    },


    //统计
    statistics(QID, FNUM, TYPE, FRACTION) {
      let arrPData1 = [];
      let arrPData2 = [];
      this.optionP = {
        title: {
          text: '答案正确和错误的比例',
          subtext: '',
          left: 'center',
          textStyle: {
            color: 'black'
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: arrPData1
        },
        series: [
          {
            name: '统计结果',
            type: 'pie',
            radius: '70%',
            center: ['50%', '60%'],
            data: arrPData2,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      };
      //柱状图
      let arrCData1 = [];
      let arrCData2 = [];
      this.optionC = {
        title: {
          text: '各选项选择的人数',
          subtext: '',
          left: 'center',
          textStyle: {
            color: 'black'
          }
        },
        color: ['#3398DB'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: arrCData1,
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '人数',
            type: 'bar',
            barWidth: '60%',
            data: arrCData2,
            itemStyle: {
              normal: {
                color: function (d) {
                  return "#" + Math.floor(Math.random() * (256 * 256 * 256 - 1)).toString(16);
                }
              }
            },
          }
        ]
      };
      serice({
        method: 'post',
        url: '/achievement/statistics',
        data: {
          testpaperId: this.TESTPAPER_ID,
          questionsId: QID,
          fnum: FNUM,
          type: TYPE,
          fraction: FRACTION,
          tm: new Date().getTime()
        },

      }).then(res => {
        let data = res;
        if ("success" == data.result) {
          for (let n = 25; n > 0; n--) {
            arrPData1.splice(n, 1);
            arrPData2.splice(n, 1);
            arrCData1.splice(n, 1);
            arrCData2.splice(n, 1);
          }
          arrPData1 = ["答对人数", "答错人数"];
          arrPData2[0] = {value: data.right, name: '答对人数'};
          arrPData2[1] = {value: data.wrong, name: '答错人数'};
          if (TYPE == 'D' || TYPE == 'E' || TYPE == 'F') {
            this.fbar = false;
            arrPData1 = ["满分人数", "零分人数", "未满分人数"];
            arrPData2[0] = {value: data.right, name: '满分人数'};
            arrPData2[1] = {value: data.wrong, name: '零分人数'};
            arrPData2[2] = {value: data.middle, name: '未满分人数'};
          }
          if (TYPE == 'A' || TYPE == 'B') {
            this.fbar = true;
            for (let i = 0; i < FNUM; i++) {
              arrCData1[i] = data.tlist[i];
              arrCData2[i] = {value: data.vlist[i], name: '人数'};
            }
          }
          if (TYPE == 'C') this.fbar = false;
        }
        this.staticsable = true;
      })
    },

    //收藏试题
    collection(TITLE, QID, TYPE, CID) {
      //发送 post 请求
      serice({
        method: 'post', url: '/collection', data: {
          title: TITLE,
          questionsId: QID,
          type: TYPE,
          tm: new Date().getTime()
        }
      }).then(res => {
        if (res.code == 200) {
          this.$message.success("收藏成功")
        } else {
          this.$message.error("收藏失败")
        }
      })
    },
    //根据主键ID获取数据
    getData() {
      let curData = {
        testpaperId: this.TESTPAPER_ID,
        examId: this.examId,
        tm: new Date().getTime()
      }
      if (this.EXID) {
        curData.examinationrecordId = this.EXID;
      }
      let bool = false;
      if (this.dataUrl == '/testpaper/view') {
        bool = true;
      } else {
        bool = false;
      }
      //发送 post 请求
      serice.post(this.dataUrl, curData).then(res => {
        if (bool) {
          let {code, data, msg} = res;
          if (code != 200) return this.$message.error(msg)
          for (let i in data.testPaperInfo) {
            this.pd[i.toLocaleUpperCase()] = data.testPaperInfo[i]
          }
          //参数map
          this.varList = data.allTiInfo.map(item => {
            let obj = {}
            for (let i in item) {
              obj[i.toLocaleUpperCase()] = item[i]
            }
            return obj
          });
          this.printObj.popTitle = data.testPaperInfo.title
        } else {
          let {result, ...data} = res;
          if (result != 200) return
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

          });
        }

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

<style scoped lang="scss">
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
<!--打印机样式-->
<style media="print" scoped>
@page {
  size: auto;
  margin: 3mm;
}
</style>

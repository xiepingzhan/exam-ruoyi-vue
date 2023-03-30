<template>
  <!-- 答题 -->
  <el-drawer :withHeader="false" size="100%" append-to-body :close-on-press-escape="false" :modal="false"
             :show-close="false" :visible.sync="visible">
    <!--         &lt;!&ndash; 头像 &ndash;&gt;-->
    <!--         <div class="avatar-container" style="position:absolute;top:0;left:0;    ">-->
    <!--            <div class="avatar-wrapper">-->
    <!--                <img :src="avatar" class="user-avatar" alt="用户头像">-->
    <!--            </div>-->
    <!--        </div>-->
    <div class="huaru-main" :key="currentKey">
      <!-- 右上角的计时器和题序号 -->
      <div class="huaru-right-top-corner">
        <div class="huaru-right-div">考试剩余时间：<span id="timer"/></div>
        <div class="huaru-right-div alert alert-primary" role="alert" id="fix"
             style="margin-top: -10px;margin-bottom: 5px;"/>
        <!--              头像-->
        <div
          class="avatar-container"
          style="
                      position: absolute;
                      bottom: 0;
                      right: -30px;
                      top: calc(100% - 12px);
                      margin-top:0;">
          <div class="avatar-wrapper">
            <img :src="avatar" class="user-avatar" alt="用户头像">
          </div>
        </div>
        <div class="huaru-right-div">
          页面字号：&nbsp;[&nbsp;
          <a @click="doZoom(14);" style="cursor:pointer;">小</a>&nbsp;
          <a @click="doZoom(20);" style="cursor:pointer;">中</a>&nbsp;
          <a @click="doZoom(26);" style="cursor:pointer;">大</a>
          &nbsp;]
        </div>
      </div>
      <!-- 主体 -->
      <el-row id="huaru-test-main">
        <el-col>
          <el-card>
            <!-- [加载状态 ] start -->
            <div v-show="loading">
              <div class="d-flex justify-content-center">
                <div class="spinner-border" style="width: 3rem; height: 3rem;" role="status">
                  <span class="sr-only">Loading...</span>
                </div>
              </div>
            </div>
            <br>
            <!-- [ 加载状态  ] End -->
            <div style="width: 100%;text-align: center;">
              <h4>{{ pd.title }}</h4>
            </div>
            <!-- 满分情况-- -->
            <div style="width: 100%;text-align: center;">
              <p class="text-muted mb-0">
                {{ pd.remarks }}&nbsp;&nbsp;(&nbsp;满分{{
                  pd.totalscore
                }}分，考试时间{{ pd.duration }}分钟&nbsp;)
              </p>
            </div>
            <br>
            <ul style="margin-left: -40px; list-style-type:none;">
              <li v-for="(data, index) in varList" :key="index">
                <ul style="margin-left: -20px;">
                  <li v-for="(fdata, findex) in data.allTi" :key="findex"
                      style="list-style-type:none;margin-top: 5px;display: none;"
                      v-bind:id="'falt' + index + '' + findex">
                    <h4 style="margin-top: 10px;">
                      <b>{{ data.title }}</b>&nbsp;
                      <font color="#808080">
                        ({{ data.remarks }}&nbsp;每题{{ data.fraction }}分，{{ data.totalscore }})
                      </font>
                    </h4>
                    <template v-if="data.type == 'F'">
                      <!-- 带有富文本框的题目-----复合体 -->
                      <el-row class="fuheti">
                        <el-col :span="0.5">
                          {{ findex + 1 }} .
                        </el-col>
                        <el-col :span="23.5">
                                                    <span
                                                      v-html="fdata.title.split('../../plugins/ueditor').join(serverurl + 'plugins/ueditor')"
                                                      v-bind:id="'t' + index + '' + findex"></span>
                        </el-col>
                      </el-row>
                    </template>
                    <template v-else>
                      {{ findex + 1 }} . <span
                      v-html="fdata.title.split('../../plugins/ueditor').join(serverurl + 'plugins/ueditor')"
                      v-bind:id="'t' + index + '' + findex"></span>
                    </template>
                    <template v-if="'' != fdata.filepath && null != fdata.filepath">
                      <br>
                      &nbsp;&nbsp;&nbsp;<img style="width:150px;height:120px;"
                                             v-bind:src="serverurl+fdata.filepath">
                    </template>
                    <template>
                      <div style="margin-top: 5px;margin-left: 20px;" v-html="fdata.html"/>
                    </template>
                    <template v-if="data.type == 'B'"><input type="hidden"
                                                             v-bind:id="'FIf' + index + findex" value=""/></template>
                    <template v-if="data.type == 'D'">
                      <br>
                      <div style="height:20px;width:100%;"></div>
                      <el-input
                        @blur="subBig($event, index, findex)"
                        :name="fdata.completionId"
                        type="textarea"
                        maxlength="100"
                        show-word-limit
                        v-model="fdata.tvalue"
                        title="多处空格的答案用中文输入法下逗号，隔开"
                        placeholder="多处空格的答案用中文输入法下逗号，隔开"
                        style="width:calc(100% - 40px)"/>
                    </template>
                    <template v-if="data.type == 'E' || data.type == 'F'">
                      <br>
                      <div style="height:20px;width:100%;" v-if="data.type == 'E'"></div>
                      <div style="float:left;width:40px;">答：</div>
                      <el-input type="textarea"
                                show-word-limit :rows="4" v-model="fdata.tvalue"
                                title="多处空格的答案用中文输入法下逗号，隔开"
                                placeholder="多处空格的答案用中文输入法下逗号，隔开"
                                @blur="subBig($event, index, findex)"
                                :name="(fdata.largequestionId || fdata.compoundquestionId)"
                                maxlength="2000" style="width:calc(100% - 40px);"/>
                    </template>
                  </li>
                </ul>
              </li>
            </ul>
            <div style="width: 100%;text-align: center;">
              <el-button v-show="fnext && gnext"
                         v-on:click="nextQuestions" size="mini" type="primary">下一题
              </el-button>
            </div>
            <div style="width: 100%;text-align: center;">
              <el-button
                v-show="bsub && fend == false && fnext == false" v-on:click="subTextPage" size="mini"
                type="primary">提交试卷
              </el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <yl-dialog-vue ref="yulan" v-if="ylable" dataUrl="/achievement/view" currentType="read" :FID="FID" :EXID="EXID"
                   :PASSONOT="PASSONOT" :SCORE="SCORE" @closeDialog="ylable = false"/>
    <!-- 考试结果 -->
    <result-dialog-vue v-if="fend" :score="SCORE" :passonot="PASSONOT" :zs="ZS" :frepeat="FREPEAT" :ftwice="FTWICE"
                       @onceAgain="onceAgain" @closeDialog="fend = false" @lookingBack="lookingBack"
                       @closeDrawer="closeDrawer"/>
  </el-drawer>
</template>
<script>
window.onbeforeunload = function (event) {
  return ""
};//页面离开或者刷新的时候提示

// 屏蔽鼠标右键功能
document.oncontextmenu = new Function("event.returnValue=false;");
document.onselectstart = new Function("event.returnValue=false;");
let locat = (window.location + '').split('views')[0];
let ftimer = null;

import '@/plugins/sweetalert/js/sweetalert.min.js'
import jquery from 'jquery';
import resultDialogVue from './resultDialog.vue';
import ylDialogVue from '../../ylDialog.vue';

import mixin from '@/mixins/view-examination.js'
import {mapGetters} from 'vuex';


export default {
  components: {
    resultDialogVue,
    ylDialogVue
  },
  computed: {
    ...mapGetters(['avatar'])
  },
  mixins: [mixin],
  data() {
    return {
      nquesid: 'falt00',	//当前试题ID
      gfix: 1,				//序号
      zfix: 1,				//序号
      fnext: true,			//下一题按钮
      gnext: false,		//下一题按钮

      loading: true
    }
  },
  methods: {
    //下一题
    nextQuestions() {
      jquery('#' + this.nquesid).hide();
      this.nquesid = jquery('#ggbb' + (this.gfix + 1)).val();
      jquery('#' + jquery('#ggbb' + (this.gfix + 1)).val()).show();
      this.gnext = false;
      if (this.gfix == (this.zfix - 1)) {
        this.fnext = false;
      } else {
        this.gfix++;
      }
    },

    //状态
    intHtml(ilist) {
      let st = '<ul class="pagination justify-content-center" style="margin-bottom: -1px;">';
      let en = '</ul>';
      let str = '', fix = 1;
      for (let i = 0; i < ilist.length; i++) {
        for (let j = 0; j < ilist[i].tqList.length; j++) {
          str += '<li class="page-item"><input type="hidden" name="finput" value="falt' + i + '' + j + '" id="ggbb' + fix + '" /><input type="hidden" name="finput" value="0" id="igf' + i + '' + j + '" /><a href="#t' + i + '' + j + '" class="page-link" style="width:42px;text-align:center;" id="gf' + i + '' + j + '">' + fix + '</a></li>';
          if (fix > 3 && fix % 4 == 0) {
            str += '</ul><ul class="pagination justify-content-center" style="margin-bottom: -1px;">';
          }
          fix++;
          this.zfix++;
        }
      }
      jquery('#fix').html(st + str + en);
    },

    //单选和判断选中
    selection1(value, fa, qid, id2) {
      jquery('#g' + id2).css("background-color", "#80E000");
      this.fsub(value, fa, qid, 'smallquestionte');
      jquery('#ig' + id2).val(1);
      this.gnext = true;
      if (this.gfix == (this.zfix - 1)) {
        this.fnext = false;
      }
    },

    //复选选中
    selection2(value, id, id2, fa, qid) {
      let str = jquery('#FI' + id2).val();
      if (document.querySelector('#' + id).checked) {
        str = str + value + ',fh,';
      } else {
        str = str.replace(value + ',fh,', '');
      }
      jquery('#FI' + id2).val(str);
      let arrANSWER = str.split(',fh,');
      let stra = (arrANSWER.sort());
      this.fsub(stra.join(''), fa, qid, 'smallquestionte');
      if ("" == stra.join('')) {
        jquery('#g' + id2).css("background-color", "white");
        jquery('#ig' + id2).val(0);
        this.gnext = false;

      } else {
        jquery('#g' + id2).css("background-color", "#80E000");
        jquery('#ig' + id2).val(1);
        this.gnext = true;
        if (this.gfix == (this.zfix - 1)) {
          this.fnext = false;
        }
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      setTimeout(() => {
        jquery("#falt00").show();

      }, 800)
    })
  },

}
</script>
<style scoped>

</style>

<style lang="scss" scoped>
@import "../../../../../assets/fonts/material/css/materialdesignicons.min.css";
@import "../../../../../assets/fonts/fontawesome/css/fontawesome-all.min.css";

.huaru-main {
  position: relative;

  .huaru-right-top-corner {
    position: fixed;
    top: 0;
    right:20px;
    min-widthwidth: 220px;
    height: auto;
    z-index: 2000;

    .huaru-right-div:first-of-type,
    .huaru-right-div:last-of-type {
      background: #e2e3e5;
      border: 1px solid #e2e3e5
    }

    .huaru-right-div:nth-of-type(2) {
      background: #cce5ff;
      border: 1px solid #cce5ff;

      ul {
        list-style: none;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
        padding: 0 !important;

        &::after {
          content: "";
          display: block;
          flex: 21 1 auto;
        }

        li {
          flex: 1;
          flex-basis: 40px;
          height: 40px;
          line-height: 40px;
          background: white;
          text-align: center;
          color: #007bff;
          border: 1px solid #dee2e6;

          &.selected {
            background-color: rgb(128, 224, 0);
          }

          &:hover {
            background: #e9ecef;
          }
        }
      }
    }

    .huaru-right-div {
      padding: 15px 20px;
      margin-bottom: 1rem;
      font-size: 14px !important;
    }
  }
}

.fuheti {
  ::v-deep.el-col span > p {
    margin: 0;
  }
}

::v-deep .el-drawer__body {
  position: relative !important;
}

.avatar-container {
  margin-right: 30px;

  .avatar-wrapper {
    margin-top: 5px;
    position: relative;

    .user-avatar {
      cursor: pointer;
      width: 60px;
      height: 60px;
      border-radius: 10px;
    }

    .el-icon-caret-bottom {
      cursor: pointer;
      position: absolute;
      right: -20px;
      top: 25px;
      font-size: 12px;
    }
  }
}
::v-deep .alert {
  margin-top: -10px;
  margin-bottom: 5px;
}

::v-deep .pagination.justify-content-center {
  margin-bottom: -1px;
}

::v-deep .page-link {
  width: 42px;
  text-align: center;
}
//::v-deep .radio .cr{
//  position: relative;
//  padding-left:10px!important;
//  padding-right: 18px;
//}
::v-deep .radio input[type=radio] + .cr:before {
  background: pink;
  position: absolute;
  bottom: 0;
  left: -18px;
  display: none;
}

::v-deep .radio input[type=radio] + .cr::after {
  //width: 12px;
  //height: 12px;
  position: absolute !important;
  top: 5px !important;
  left: -16px !important;
  display: none;

}

::v-deep .radio input[type=radio] {
  display: inline-block;
}

::v-deep .d-inline {
  font-size: 14px;
}

::v-deep .radio input[type=radio] + .cr {
  transform: translate(3px,-3px);
  display: inline-block;
}
</style>

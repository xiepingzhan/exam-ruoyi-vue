<template>
  <!-- 答题 -->
  <el-drawer :withHeader="false" size="100%" append-to-body :close-on-press-escape="false" :modal="false"
             :show-close="false" :visible.sync="visible">
    <div class="huaru-main" :key="currentKey">
      <!-- 右上角的计时器和题序号 -->
      <div class="huaru-right-top-corner">
        <div class="huaru-right-div">考试剩余时间：<span id="timer"></span></div>
        <div class="huaru-right-div alert alert-primary" role="alert" id="fix">
        </div>
        <!-- 头像 -->
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

      <el-row id="huaru-test-main">
        <el-col>
          <el-card type="border-card">
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
            <!-- 满分说明 -->
            <div style="width: 100%;text-align: center;">
              <p class="text-muted mb-0">
                {{ pd.remarks }}&nbsp;&nbsp;(&nbsp;满分{{
                  pd.totalscore
                }}分，考试时间{{ pd.duration }}分钟&nbsp;)
              </p>
            </div>
            <br>
            <!-- 题目类型 -->
            <ul style="margin-left: -30px;">
              <li v-for="(data, index) in varList" :key="index">
                <h4 style="margin-top: 10px;">
                  <b>{{ data.title }}</b>&nbsp;
                  <font color="#808080">
                    ({{ data.remarks }}&nbsp;每题{{ data.fraction }}分，{{ data.totalscore }})
                  </font>
                </h4>
                <ul style="margin-left: -20px;">
                  <li v-for="(fdata, findex) in data.allTi" :key="findex"
                      style="list-style-type:none;margin-top: 5px;">
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

                    <template v-if="data.type == 'A' || data.type == 'C'">
                      <div style="display: flex;margin-top: 5px;margin-left: 20px;"
                           v-html="fdata.html">
                      </div>
                    </template>
                    <template v-else-if="data.type == 'B'">
                      <div style="margin-top: 5px;margin-left: 20px;" v-html="fdata.html">
                      </div>
                    </template>
                    <template v-if="data.type == 'B'">
                      <input type="hidden" v-bind:id="'FIf' + index + findex" value=""/>
                    </template>
                    <template v-if="data.type == 'D'">
                      <br>
                      <div style="height:20px;width:100%;"></div>
                      <div style="float:left;width:40px;"> 答：</div>
                      <el-input @blur="subBig($event, index, findex)"
                                :name="fdata.completionId" type="textarea"
                                :rows="2"
                                resize="none"
                                maxlength="100"
                                v-model="fdata.tvalue"
                                show-word-limit
                                title="多处空格的答案用中文输入法下逗号，隔开"
                                placeholder="多处空格的答案用中文输入法下逗号，隔开"
                                style="width:calc(100% - 40px);"/>
                      <br>
                    </template>
                    <template v-if="data.type == 'E' || data.type == 'F'">
                      <br>
                      <div style="height:20px;width:100%;" v-if="data.type == 'E'"></div>
                      <div style="float:left;width:40px;"> 答：</div>
                      <el-input type="textarea" v-model="fdata.tvalue"
                                @blur="subBig($event, index, findex)"
                                :name="(fdata.largequestionId || fdata.compoundquestionId)"
                                maxlength="2000" show-word-limit :rows="4" resize="none"
                                placeholder="多处空格的答案用中文输入法下逗号，隔开" style="width:calc(100% - 40px);"/>
                    </template>
                  </li>
                </ul>
              </li>
            </ul>
            <div style="width: 100%;text-align: center;">
              <!-- 提交试卷 -->
              <el-button v-show="bsub && fend == false" @click="subTextPage" type="primary" size="mini"
                         style="margin: 0 auto;">提交试卷
              </el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <yl-dialog ref="yulan" v-if="ylable" :FID="FID" dataUrl="/achievement/view" currentType="read" :EXID="EXID"
               :PASSONOT="PASSONOT" :SCORE="Number(SCORE)" @closeDialog="ylable = false"/>
    <!-- 考试结果 -->
    <result-dialog-vue v-if="fend" :score="SCORE" :passonot="PASSONOT" :zs="ZS" :frepeat="FREPEAT" :ftwice="FTWICE"
                       @onceAgain="onceAgain" @closeDialog="fend = false" @lookingBack="lookingBack"
                       @closeDrawer="closeDrawer"/>
  </el-drawer>
</template>
<script>
import mixin from '@/mixins/view-examination'
import resultDialogVue from './resultDialog.vue';
import {mapGetters} from 'vuex';

export default {
  mixins: [mixin],
  computed: {
    ...mapGetters(['avatar'])
  },
  components: {
    resultDialogVue
  },
}
</script>
<style scoped>

</style>

<style lang="scss" scoped>
@import "../../../../../assets/fonts/material/css/materialdesignicons.min.css";
@import "../../../../../assets/fonts/fontawesome/css/fontawesome-all.min.css";

ul {
  list-style: none;
}

.huaru-main {
  position: relative;

  .huaru-right-top-corner {
    position: fixed;
    top: 0;
    right: 20px;
    min-width: 220px;
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

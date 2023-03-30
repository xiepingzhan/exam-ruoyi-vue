window.onbeforeunload = function (event) {
  return ""
}; //页面离开或者刷新的时候提示

// 屏蔽鼠标右键功能
document.oncontextmenu = new Function("event.returnValue=false;");
document.onselectstart = new Function("event.returnValue=false;");
let locat = (window.location + '').split('views')[0];
let ftimer = null;

import serice from '@/utils/request'
import '@/plugins/sweetalert/js/sweetalert.min.js'
import jquery from 'jquery';
import {
  scrollTo
} from '@/utils/scroll-to'

import ylDialog from '@/views/modules/hgExam-ui/ylDialog.vue';




export default {
  watch: {
    EXID(newV) {
      if (newV) {
        this.$nextTick(() => {
          this.currentKey++;
          this.init()
          if (this.type == 'single') {
            jquery("#falt00").show();
          } else {
            scrollTo(0, 800)
          }
        })
      }
    }

  },
  props: {
    type: {
      default: 'single',
      type: String,
    },
    // 作答ID
    EXID: {
      default: null,
      type: String
    },
    // 试卷ID
    TESTPAPER_ID: {
      default: null,
      type: String
    },
    examId:{
      default: undefined,
      type: String
    }
  },
  components: {
    ylDialog
  },
  data() {
    return {
      FID: null,
      ylable: false,
      currentKey: 1, //格式化關鍵詞
      curTimer: null,
      visible: true,
      arLetter: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"],
      QID: '', //试题ID
      EVALUATIONRESULTS: 'A', //出成绩方式 A考完直接出,B人工阅卷后出
      FREPEAT: true, //是否可以重复进行考试(每人)
      FTWICE: true, //补考一次
      FACE: true, //人脸识别
      times: 1, //当前验证次数
      finterval: 60000, //间隔毫秒
      SCORE: '0', //得分
      ZS: 0, //考试次数
      PASSONOT: '', //是否及格
      pd: [], //存放字段参数
      varList: [], //试卷试题
      serverurl: '', //后台服务地址
      USERNAME: '', //用户名
      fend: false, //是否结束
      isok: false, //判断是否最后提交试卷
      bsub: true, //提交试卷按钮
      loading: true
    }
  },
  methods: {
    //关闭考试入口---退出考试
    closeDrawer() {
      // this.$router.push({name:'Testpaper_my'})
      window.close()
    },
    //初始执行
    init() {
      // this.serverurl = window.base.httpurl;
      this.serverurl = process.env.VUE_APP_BASE_API;
      if (null != this.TESTPAPER_ID && undefined != this.TESTPAPER_ID && "" != this.TESTPAPER_ID) {
        this.getData();
      }
    },

    //读取试题
    getData() {
      serice.post('/testpaper/view', {
        testpaperId: this.TESTPAPER_ID,
        examinationrecordId: this.EXID,
        examId:this.examId,
        tm: new Date().getTime()
      }).then(res => {
        let {
          code,
          msg,
          data
        } = res;
        if (code != 200) return this.$message.error(msg)
        this.pd = data.testPaperInfo; //参数map
        this.varList = data.allTiInfo.map((da, index) => {
          da.tqList = da.allTi.map((fdata, findex) => {
            let QID = '';
            if (da.type == 'A') QID = fdata.singleelectionId;
            if (da.type == 'B') QID = fdata.multipleselectionId;
            if (da.type == 'C') QID = fdata.judgementquestionId;
            if (da.type == "D") QID = fdata.completionId;
            if (da.type == "E") QID = fdata.largequestionId;
            if (da.type == "F") QID = fdata.compoundquestionId;
            if (undefined != fdata.foption && fdata.foption.length < 101) {
              fdata.html = this.formatOption(fdata.foption.split(',fh,'), '', index, findex, da.type, this.compileStr(';B;' + fdata.answer), QID);

            } else if (undefined != fdata.foption && fdata.foption.length > 100) {
              fdata.html = this.formatOption(fdata.foption.split(',fh,'), '<br>', index, findex, da.type, this.compileStr(';B;' + fdata.answer), QID);

            }
            if (da.type == 'C') fdata.html = this.formatOption('', '', index, findex, da.type, this.compileStr(';B;' + fdata.answer), QID)
            return fdata
          })
          return da;
        }); //试卷试题
        this.timer(data.testPaperInfo.duration - data.DTIME); //考试时间
        this.finterval = (data.testPaperInfo.duration * 1000 * 60) / 2; //间隔时间是考试总时间的一半，开始验证一次，中途验证一次，最后验证一次
        this.FREPEAT = data.testPaperInfo.frepeat == 'true' ? true : false; //是否可以重复进行考试(每人)
        this.FTWICE = data.testPaperInfo.ftwice == 'true' ? true : false; //是否可以补考一次
        // // this.FACE = data.testPaperInfo.face == 'true' ? true : false;		//人脸识别
        // if (!this.FACE) {
        //     this.bsub = true;
        //     jquery("#rlsb").hide();
        // } else {
        //     this.getUsername();
        // }
        // this.getUsername();

        this.EVALUATIONRESULTS = data.testPaperInfo.evaluationresults;
        this.intHtml(data.allTiInfo);
        this.loading = false;
      })
    },

    //单选多选题判断题的选项格式处理
    formatOption(arField, br, fi1, fi2, type, fa, qid) {
      let str = "";
      if (type == 'C') {
        str += '<div  class="radio radio-primary d-inline"><input data-txtype="C" data-selection="true"  data-fa="' + fa + '" data-qid="' + qid + '" data-id2="f' + fi1 + fi2 + '"  type="radio" name="radio-p-' + fi1 + fi2 + '" id="f' + fi1 + fi2 + '1"><label for="f' + fi1 + fi2 + '1" class="cr">正确</label></div>   ';
        str += '<div  class="radio radio-primary d-inline"><input data-txtype="C" data-selection="false"  data-fa="' + fa + '" data-qid="' + qid + '" data-id2="f' + fi1 + fi2 + '" type="radio" name="radio-p-' + fi1 + fi2 + '" id="f' + fi1 + fi2 + '2"><label for="f' + fi1 + fi2 + '2" class="cr">错误</label></div>';
      } else {
        for (let i = 0; i < arField.length; i++) {
          if (type == 'A') {
            str += '<div class="radio radio-primary d-inline">' +
              '<input data-txtype="A" data-selection="' + this.arLetter[i] + '"  data-fa="' + fa + '" data-qid="' + qid + '" data-id2="f' + fi1 + fi2 + '"  type="radio" name="radio-p-' + fi1 + fi2 + '" id="f' + fi1 + fi2 + i + '" /><label for="f' + fi1 + fi2 + i + '" class="cr">' + arField[i] + '&nbsp;&nbsp;&nbsp;&nbsp;' + br + '</label></div>';
          } else {
            str += '<div  class="checkbox checkbox-primary checkbox-fill d-inline"><input data-txtype="B" data-selection="' + this.arLetter[i] + '"  data-fa="' + fa + '" data-qid="' + qid + '" data-id2="f' + fi1 + fi2 + '" data-id="' + 'f' + fi1 + fi2 + i + '" type="checkbox" name="radio-p-' + fi1 + fi2 + '" id="f' + fi1 + fi2 + i + '"><label for="f' + fi1 + fi2 + i + '" class="cr">' + arField[i] + '&nbsp;&nbsp;&nbsp;&nbsp;' + br + '</label></div>';
          }
        }
      }
      return str;
    },

    //单个提交答案
    fsub(a, b, q, u) {
      serice({
        method: 'post',
        url: u + '/edit',
        data: {
          examId:this.examId,
          exId: this.EXID,
          qId: q,
          a: a,
          b: this.uncompileStr(b),
          tm: new Date().getTime()
        }
      })
    },

    //大题
    subBig(event, fi1, fi2) {
      if ("" != event.currentTarget.value) {
        jquery('#gf' + fi1 + '' + fi2).css("background-color", "#80E000");
        this.fsub(event.currentTarget.value, 'F', event.currentTarget.name, 'bigquestionte');
        jquery('#igf' + fi1 + '' + fi2).val(1);
      } else {
        jquery('#gf' + fi1 + '' + fi2).css("background-color", "white");
        jquery('#igf' + fi1 + '' + fi2).val(0);
      }
      this.gnext = true;
      if (this.gfix == (this.zfix - 1)) {
          this.fnext = false;
      }
    },

    compileStr(code) {
      let c = String.fromCharCode(code.charCodeAt(0) + code.length);
      for (let i = 1; i < code.length; i++) {
        c += String.fromCharCode(code.charCodeAt(i) + code.charCodeAt(i - 1));
      }
      return escape(c);
    },

    uncompileStr(code) {
      code = unescape(code);
      let c = String.fromCharCode(code.charCodeAt(0) - code.length);
      for (let i = 1; i < code.length; i++) {
        c += String.fromCharCode(code.charCodeAt(i) - c.charCodeAt(i - 1));
      }
      return c;
    },

    //倒计时
    timer(intDiff) {
      let fen = intDiff - 1;
      let miao = 60;
      this.curTimer = setInterval(() => {
        miao--;
        jquery('#timer').html('<b>' + fen + '</b> 分  ' + '<b>' + miao + '</b> 秒');
        if (miao == 0) {
          miao = 60;
          fen--;
          if (fen < 0) {
            swal("考试时间超时!", "此页面将会关闭!", "warning");
            clearInterval(this.curTimer)

            // setTimeout(() => {
            //   //自动提交试卷
            //   this.goSubTextPage()
            // }, 1000);
          } else if (fen == 4) {
            swal("还有最后5分钟!", "请抓紧时间作答", "warning");
          }
        }
        //自动提交
        if(miao==1&&fen==0){
          clearInterval(this.curTimer)
          this.goSubTextPage()
        }
      }, 1000);
    },

    //状态
    intHtml(ilist) {
      let st = '<ul class="pagination justify-content-center">';
      let en = '</ul>';
      let str = '',
        fix = 1;
      for (let i = 0; i < ilist.length; i++) {
        for (let j = 0; j < ilist[i].allTi.length; j++) {
          str += '<li class="page-item"><input type="hidden" name="finput" value="0" id="igf' + i + '' + j + '" /><a href="#t' + i + '' + j + '" class="page-link" id="gf' + i + '' + j + '">' + fix + '</a></li>';
          if (fix > 3 && fix % 4 == 0) {
            str += '</ul><ul class="pagination justify-content-center">';
          }
          fix++;
        }
      }
      jquery('#fix').html(st + str + en);
    },

    //提交试卷
    subTextPage() {
      // for (let i = 0; i < document.getElementsByName('finput').length; i++) {
      //   if (0 == document.getElementsByName('finput')[i].value) {
      //
      //     swal("还有未答的题目!", "请完成作答再提交", "warning");
      //     jquery("#" + document.getElementsByName('finput')[i].id).focus();
      //     return false;
      //   }
      // }
      swal({
        title: "确定要提交试卷吗?",
        text: "",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          clearInterval(this.curTimer)
          // if (this.FACE) {
          //     this.creatQr();	//生成二维码
          //     jquery("#rlsb").show();
          //     this.isok = true;
          // } else {
          //     this.goSubTextPage();
          // }
          this.goSubTextPage();

        }
      });
    },

    //执行提交试卷
    async goSubTextPage() {
     let data = await serice({
        method: 'post',
        url: '/examinationrecord/edit',
        data: {
          examId:this.examId,
          examinationrecordId: this.EXID,
          testpaperId: this.pd.testpaperId,
          duration: this.pd.duration,
          tm: new Date().getTime()
        }
      })
        if ("success" == data.result) {
          if ('A' == this.EVALUATIONRESULTS) { //考完直接出成绩时
            this.getAch(); //获取本次考试的成绩
          } else {

            swal({
              title: "提交成功",
              text: "请到（我的成绩）菜单查看结果，此页面将会关闭!",
              icon: "success",
            }).then((willDelete) => {
              if (willDelete) {
                this.closeDrawer(); //关闭页面
              }
            })

          }
        } else if ("fail" == data.result) {
          swal({
            title: "提交失败！",
            text: '考试时间超时,此页面将会关闭!',
            icon: 'warning',
            dangerMode: true
          }).then(val => {
            if (val) {
              this.closeDrawer()
            }
          })
        }
    },

    //获取本次考试的成绩
    getAch() {
      serice({
        method: 'post',
        url: '/achievement/getAchByRecordId',
        data: {
          examId:this.examId,
          examinationrecordId: this.EXID,
          tm: new Date().getTime()
        }
      }).then(res => {
        if (200 == res.code) {
          this.SCORE = res.data.score; //得分
          this.PASSONOT = res.data.passonot; //是否及格
          if (this.FREPEAT && this.FTWICE) { //当可以重复考试，并且允许补考时，才计算已经考试次数
            this.getCount();
          }
          this.fend = true;
        }
      })
    },

    //获取本次考试的次数
    getCount() {
      serice({
        method: 'post',
        url: '/examinationrecord/getCount',
        data: {
          examId:this.examId,
          testpaperId: this.TESTPAPER_ID,
          tm: new Date().getTime()
        }
      }).then(res => {
        let data = res;
        if (200 == data.code) {
          this.ZS = data.data; //已经考试次数
        }
      })
    },

    //试题回看页面
    lookingBack() {
      this.FID = this.TESTPAPER_ID;
      this.ylable = true;
      this.$nextTick(() => {
        this.$refs.yulan.visible = true;
        // this.closeDrawer()
      })

    },

    //再考一次
    onceAgain() {
      serice({
        method: 'post',
        url: '/examinationrecord',
        data: {
          examId:this.examId,
          testpaperId: this.TESTPAPER_ID,
          tm: new Date().getTime()
        }
      }).then(res => {
        let data = res;
        if (200 == data.code) {
          // 清空，重新來過
          this.$emit("changeData", this.EXID, data.data.examinationrecordId)
          this.$emit('uploadList')
          this.fend = false;
        }
      })
    },
    doZoom(size) {
      document.querySelector('#huaru-test-main').style.fontSize = size + 'px'
    },
    //获取当前用户用户名
    getUsername() {
      serice({
        method: 'get',
        // /system/group/info
        // url: '/user/getUsername',
        url: '/system/group/info',
      }).then(res => {
        let {
          code,
          msg,
          data
        } = res;
        if (code != 200) return;
        this.USERNAME = data.username
        // if (res.result == 'success') {
        //     this.USERNAME = res.USERNAME;	//用户名
        //     // this.creatQr();	//生成二维码
        // }
      })
    },

    //单选和判断选中
    selection1(value, fa, qid, id2) {
      jquery('#ig' + id2).val(1);
      jquery('#g' + id2).css("background-color", "#80E000");
      this.fsub(value, fa, qid, 'smallquestionte');
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
      } else {
        jquery('#g' + id2).css("background-color", "#80E000");
        jquery('#ig' + id2).val(1);
      }
    },
    eventClick(event) {
      let target = event.target;
      // 判断事件源是input不，如果是，根据对象上的元素获取事件；
      // 否则找寻子元素有没有input
      let inputObj = null;
      if (target.nodeName.toLocaleLowerCase() == 'input') {
        inputObj = target;
      } else {
        inputObj = null;
      }
      if (!inputObj) return;
      let txType = inputObj.dataset.txtype;
      let selection = inputObj.dataset.selection;
      let fa = inputObj.dataset.fa;
      let qid = inputObj.dataset.qid;
      let id2 = inputObj.dataset.id2;
      let id = inputObj.dataset.id;
      if (txType && (txType.toLocaleUpperCase() == 'A' || txType.toLocaleUpperCase() == "C")) {
        this.selection1(selection, fa, qid, id2);
      } else if (txType && txType.toLocaleUpperCase() == "B") {
        this.selection2(selection, id, id2, fa, qid)
      }
    }
  },

  mounted() {
    this.init();
    this.$nextTick(() => {
      let that = this;
      setTimeout(() => {
        document.addEventListener('click', that.eventClick)
      }, 300)
    })

  },
  beforeDestroy() {
    document.removeEventListener('click',this.eventClick)
    clearInterval(this.curTimer)
  }
}

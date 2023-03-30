import '@/plugins/sweetalert/js/sweetalert.min.js'
import jquery from 'jquery'
import serice from '@/utils/request'
import sortList from '@/views/modules/hgExam-ui/achievementSortList.vue'
import ylDialog from '@/views/modules/hgExam-ui/ylDialog.vue'
import {hgSerice} from '@/utils/request'

export default {
  components: {sortList, ylDialog},
  props: {
    FID: {
      default: null, type: String
    }, examId: {
      default: undefined, type: String
    },
  },
  data() {
    return {
      ylObj: {
        FID: '',
        currentType: undefined,
        PASSONOT: undefined,
        SCORE: undefined,
        EXID: undefined,
        PASSINGSCORE: undefined,
        ACID: undefined
      },
      sortable: false,
      ylAble: false,
      msg: 'manage',
      form: {
        keywords: '', passonot: '', sjId: '', state: ''
      },

      rules: {
        keywords: [{required: false, trigger: 'blur'}],
        passonot: [{required: false, trigger: 'blur'}],
        sjId: [{required: false, trigger: 'blur'}],
      },
      typeList: [{dictValue: 'yes', dictLabel: '及格'}, {dictValue: 'no', dictLabel: '不及格'},],
      stateList: [{dictValue: 'out', dictLabel: '已完成'}, {dictValue: 'notout', dictLabel: '待评阅'},],
      total: 0,
      queryParams: {
        pageNum: 1, pageSize: 10
      },

      // 原生
      sjList: [],
      varList: [],	//list
      rankingList: [],//排名列表
      username: '',	//查看人用户名
      page: [],		//分页类
      // KEYWORDS: '',	//检索条件,关键词
      // PASSONOT: '',	//及格否
      PASSINGSCORE: 0,	//及格线
      PASSNUM: 0,		//及格人数
      forder: '',	//排序,de:默认按照时间排序
      fromlocal: true,	//从正在考试或者历史试卷中打开成绩窗口进入时改为false
      del: true,		//删
      toExcel: true,	//导出到excel权限
      loading: false,	//加载状态
      TESTPAPER_ID: '',//试卷ID

    }
  }, methods: {

    searchBtn() {
      this.getList()
    }, refreshBtn() {
      this.resetForm('myForm')
      if (null != this.msg) {
        if ('admin' == this.msg) this.form.state = "notout";
        if ('manage' == this.msg) this.form.state = "out";
      }
      this.getList()
    }, //初始执行
    init() {
      if (null != this.msg) {
        if ('admin' == this.msg) this.form.state = "notout";
        if ('manage' == this.msg) this.form.state = "out";
      }
      if (null != this.FID) {
        this.fromlocal = false;
        this.TESTPAPER_ID = this.FID;
      }
      this.getList();
      // 试卷检索
      // if (this.fromlocal) this.getTest();
    },

    //获取列表
    getList() {
      if (this.fromlocal) this.TESTPAPER_ID = this.form.sjId;
      if (null == this.TESTPAPER_ID) this.TESTPAPER_ID = '';
      if ('null' == this.TESTPAPER_ID) this.TESTPAPER_ID = "";
      serice.post(`/achievement/list?pageNum=${this.queryParams.pageNum}&pageSize=${this.queryParams.pageSize}`, {
        keywords: this.form.keywords,
        passonot: this.form.passonot,
        state: this.form.state,
        msg: this.msg,
        forder: this.forder,
        testpaperId: this.TESTPAPER_ID,
        examId: this.examId,
        tm: new Date().getTime()
      }).then(res => {
        let {code, total, msg, rows} = res;
        if (code != 200) return this.$message.error(msg)
        this.total = total;
        this.varList = rows;
        //检索
        this.arrNum = []
      })
    }, rowspan() {
      // 位置索引
      let position = 0;
      this.varList.forEach((row, index) => {
        if (index == 0) {
          this.arrNum = [].concat(1)
          position = 0;
        } else {
          if (this.varList[index].title == this.varList[index - 1].title) {
            this.arrNum[position] += 1;
            this.arrNum.push(0)//占位
          } else {
            this.arrNum.push(1);
            position = index;
          }
        }
      })
    }, ranking(TESTPAPER_ID, USERNAME, PASSINGSCORE) {
      this.sortable = true;
      this.$nextTick(() => {
        this.$refs.rank.visible = true;
        this.$refs.rank.ranking(TESTPAPER_ID, USERNAME, PASSINGSCORE)
      })
    },


    //查看试卷
    view(id, EXID, PASSONOT, SCORE) {
      this.ylAble = true;
      this.ylObj = {
        FID: id,
        currentType: 'read',
        PASSONOT: PASSONOT,
        SCORE: SCORE,
        EXID: EXID,
        PASSINGSCORE: undefined,
        ACID: undefined
      }

      this.$nextTick(() => {
        this.$refs.ylDialog.visible = true;
        this.$refs.ylDialog.title = '查看试卷';

      })
    },

    //评阅试卷
    correct(id, EXID, PASSONOT, SCORE, PASSINGSCORE, ACID) {
      this.ylAble = true;
      this.ylObj = {
        FID: id,
        currentType: 'pinglun',
        PASSONOT: PASSONOT,
        SCORE: SCORE,
        EXID: EXID,
        PASSINGSCORE: PASSINGSCORE,
        ACID: ACID
      }

      this.$nextTick(() => {
        this.$refs.ylDialog.visible = true;
        this.$refs.ylDialog.title = '评阅试卷';

      })
    },

    //查看用户
    viewUser(USERNAME) {
      if ('admin' == USERNAME) {
        swal("禁止查看!", "不能查看admin用户!", "warning");
        return;
      }
      var diag = new top.Dialog();
      diag.Drag = true;
      diag.Title = "资料";
      diag.URL = '../../sys/user/user_view.html?USERNAME=' + USERNAME;
      diag.Width = 600;
      diag.Height = 319;
      diag.Modal = true;			//有无遮罩窗口
      diag.CancelEvent = function () { //关闭事件
        diag.close();
      };
      diag.show();
    },

    //删除
    goDel(id, eid) {
      swal({
        title: '确定要删除吗?', text: "也会同时删除相应考试记录!", icon: "warning", buttons: true, dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          this.loading = true;
          serice({
            method: 'post', url: "/achievement/delete", data: {
              achievementId: id, examinationrecordId: eid, tm: new Date().getTime()
            }
          }).then(res => {
            let {code, msg} = res;
            if (code != 200) return this.$message.error(msg);
            swal("删除成功", "已经从列表中删除!", "success")
            this.getList()
          })
        }
      });
    },

    //调用试卷列表(正在考试和历史试卷)
    getTest() {

      let formData = new FormData();
      formData.append('tm', new Date().getTime())
      hgSerice.post('/testpaper/achList', formData).then(data => {
        return
        this.sjList = data.map(item => {
          let {TITLE, TESTPAPER_ID, ...obj} = item;
          return {
            ...obj, dictValue: TESTPAPER_ID, dictLabel: TITLE
          }
        })
      })
    },

    //导出excel
    goExcel() {
      swal({
        title: '', text: '确定要导出到excel吗?', icon: "warning", buttons: true, dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          window.location.href = process.env.VUE_APP_BASE_API + '/achievement/excel?state=' + this.form.state;
        }
      });
    },
  },

  mounted() {
    this.init();
  }

}

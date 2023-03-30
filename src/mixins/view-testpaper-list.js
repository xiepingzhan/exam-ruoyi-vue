import serice from '@/utils/request'
import '@/plugins/sweetalert/js/sweetalert.min.js'

import ylDialogVue from '@/views/modules/hgExam-ui/ylDialog.vue'
import modalMo from '@/views/modules/hgExam-ui/modalMo.vue'
import {
  listData
} from '@/api/system/dict/data'

export default {
  dicts:['testpapertype','test_type'],
  components: {
    ylDialogVue,
    modalMo,
    achieveDialog: resolve => require(['@/views/modules/hgExam-ui/achieveDialog.vue'], resolve)
  },

  data() {
    return {
      isList:false,
      examId:undefined,//考试ID
      defaultUrl: '/testpaper/list',//後臺請求接口
      STATE: "edit",
      form: {
        title: '',
        type: '',
        examName:undefined
      },
      rules: {
        title: [{required: false, trigger: 'blur'}],
        type: [{required: false, trigger: 'blur'}],
      },
      tableList: [],
      roleList: [],
      total: 0,
      queryParams: {
        pageNum: 1,
        pageSize: 10
      },
      ntime: 0,		//当前日期
      FID: null,//预览ID
      ylable: false,
      TESTPAPER_ID: null,
      msg: null,
      achieveAble: false,
      // 操作权限 暂定======后期通过若依自带的权限进行判断
      edit: true,
      alist: true,//成绩
      del: true,//删除
      modalable: false,
      selection: []
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    //选中事件
    selectChange(rows) {
      this.selection = rows;
    },
    viewDx(id) {
      this.modalable = true;
      this.$nextTick(() => {
        this.$refs.modalMo.visible = true
        this.$refs.modalMo.viewDx(id);
      })
    },
    changeId(value) {
      this.TESTPAPER_ID = value;
    },
    //预览试卷
    view(row) {
      if (row.totalscore === 0) return this.$modal.msgWarning("请添加试题，再预览试卷")

      // FID
      this.FID = row.testpaperId;
      this.ylable = true;
      this.$nextTick(() => {
        this.$refs.yulan.visible = true;
      })

    },

    //此试卷成绩
    achievement({testpaperId,examId}=row) {
      this.msg = 'manage';
      this.TESTPAPER_ID = testpaperId;
      this.examId = examId;
      this.achieveAble = true;
      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs.achieve.visible = true;
        }, 300)
      })
    },

    //修改
    goEdit(id) {
      this.$router.push({name: 'Testpaper_edit', query: {id}})
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
          serice.delete('/testpaper/' + id).then(data => {
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

    //发放试卷
    grant(row) {
      if (row.totalscore === 0) return this.$modal.msgWarning("请添加试题，再发放试卷")
      swal({
        title: '',
        text: "确定要发放此试卷吗?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          serice.put('/examobj/modified/examState', {
            examId: row.examId,
            state: 'release',
            tm: new Date().getTime()
          }).then(data => {
            if (200 == data.code) {
              swal("操作成功", "此试卷已进入正在考试列表中.", "success");
              this.initList();
            } else {
              swal("操作失败!", "", "warning");
            }
          })
        }
      });
    },

    //结束考试
    goEnd(id) {
      swal({
        title: '',
        text: "确定要终止考试吗?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          serice.put('/examobj/modified/examState', {
            examId: id,
            state: 'end',
            tm: new Date().getTime()
          }).then(data => {
            if (data.code == 200) {
              swal("操作成功", "此试卷已进入历史考试列表中.", "success");
              this.initList();
            } else {
              swal("操作失败!", "", "warning");
            }
          })
        }
      });
    },

    //复制试卷
    goCopy(id) {
      swal({
        title: '',
        text: "确定要复制此试卷吗?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          serice.post('/testpaper/copy',
            {
              testpaperId: id,
              tm: new Date().getTime()
            }).then(data => {
            // this.loading = false;
            if (200 == data.code) {
              swal("操作成功", "复制的试卷已进入试卷列表中.", "success");
              this.initList()
            } else {
              swal("操作失败!", "", "warning");
            }

          })
        }
      });
    },
    searchBtn() {
      this.initList();
    },
    refreshBtn() {
      this.resetForm('myForm');
      this.initList()
    },
    init() {
      let query = this.$route.query;
      if (query && query.state) this.STATE = query.state;
      this.initList()
      let date = new Date();
      this.ntime = Number(this.dateFormat("YYYYmmdd", date));

    },
    //日期格式化
    dateFormat(fmt, date) {
      let ret;
      const opt = {
        "Y+": date.getFullYear().toString(),        // 年
        "m+": (date.getMonth() + 1).toString(),     // 月
        "d+": date.getDate().toString(),            // 日
        "H+": date.getHours().toString(),           // 时
        "M+": date.getMinutes().toString(),         // 分
        "S+": date.getSeconds().toString()          // 秒
      };
      for (let k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt);
        if (ret) {
          fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
        }
      }
      return fmt;
    },
    // 获取 试卷模板
     async initPaperTemplate() {
        let formData = new FormData();
        formData.append('title', this.form.title);
        formData.append('state', this.STATE);
        formData.append('papertype', this.form.type);
        formData.append('tm', new Date().getTime());
        formData.append('pageSize', this.queryParams.pageSize)
        formData.append('pageNum', this.queryParams.pageNum)
        //成绩管理  我的成绩  评阅试卷  isWhat 类型分类
        if (this.isWhat) {
          formData.append('isWhat', this.isWhat)
        }

        let res = await serice({
          method: 'post',
          url: this.defaultUrl,
          data: formData
        })
          let {code, total, msg, rows} = res;
          if (200 == code) {
            this.tableList = rows;
            this.total = total;
          } else {
            this.$message.error(msg)
          }
      },
    //  获取试卷列表（不分页）
    getTestPaper() {
      let formData = new FormData();
      formData.append('state', this.STATE);
      formData.append('papertype', this.form.type);
      formData.append('tm', new Date().getTime());
      formData.append('pageSize', 1000000)
      formData.append('pageNum', 1)
      //成绩管理  我的成绩  评阅试卷  isWhat 类型分类
      if (this.isWhat) {
        formData.append('isWhat', this.isWhat)
      }

      serice({
        method: 'post',
        url: this.defaultUrl,
        data: formData
      }).then(data => {
        let {code, total, msg, rows} = data;
        if (200 == code) {
          this.testPaperList = rows;
        } else {
          this.$message.error(msg)
        }
      })

    },
    //获取试卷列表数据
    initList() {

      if(this.isList){
        //试卷模板列表
        this.initPaperTemplate()
      }else{
        this.initOtherList()
      }
    },
    async initOtherList(){
      let params = {
        ...this.queryParams,
        ...this.form,
        state: this.STATE,//考试状态
        'tm': new Date().getTime()
      }
      //成绩相关 评阅
      if(this.isWhat){
        params.isWhat = this.isWhat
      }
      if (this.form.testpaperId) {
        params.title = this.testPaperList.find(item => item.testpaperId === this.form.testpaperId).title
      }
      if (this.form.groups_old) {
        params.groupstr = this.form.groups_old.join(',')
      }
      let res = await serice({
        method: 'get',
        url: '/examobj/examlist',
        params
      })
      let {code, total, msg, rows} = res;
      if (200 == code) {
        this.tableList = rows;
        this.total = total;
      } else {
        this.$message.error(msg)
      }
    },
  }
}

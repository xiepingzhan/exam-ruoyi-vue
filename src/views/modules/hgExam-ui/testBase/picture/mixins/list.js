
import {
  getPage,delTree,
  putFile
} from '@/api/hgExam-ui/testpaper_picture.js'
import jquery from 'jquery';
export default {
  props: ['PICTURE_ID', 'win'], //win代表是否由弹框过来
  watch: {
    PICTURE_ID(newV) {
      if (newV) {
        // console.log(newV, 111)
        this.init()
        this.isFirst = true;
      }
    }
  },
  data() {
    return {
      isFirst:false,//是否第一次展开
      varList: [],
      keywords: '',
      selection: [], //选中数据
      isShow: false, //是否从弹窗进入
      serverurl: '', //服务地址
      total: 0,
      queryParams: {
        pageSize: 10,
        pageNum: 1
      },
      uploadable: false, //上传开关
    }
  },
  methods: {
    refreshData() {
      this.keywords = "";
      this.getList()
    },
    //初始执行
    init() {
      if ('yes' == this.win) {
        this.isShow = true;
        this.showCount = 12;
      }
      //   console.log(this.PICTURE_ID, "list")
      this.serverurl = process.env.VUE_APP_BASE_API;
      this.getList();
    },

    uploadThem(){
      this.getList()
      this.$emit('uploadTree')
    },
    //获取列表
    getList() {
      if (this.PICTURE_ID == undefined) return;
      let params = {
        parentId: this.PICTURE_ID,
        title: this.keywords,
        tm: new Date().getTime()
      }
      getPage(params).then(res => {
        let {
          code,
          msg,
          rows,
          total
        } = res;
        if (code != 200) return this.$modal.msgError(msg)
        this.varList = rows;
        // 分页待联调
        this.total = total;
      })
    },

    //批量上传
    goUpload() {
      //带引入组件
      this.uploadable = true;
      this.$nextTick(() => {
        this.$refs.uploadDialog.visible = true;
      })
    },

    //删除
    goDel(Id, filepath) {
      if (null == filepath) {
        filepath = '';
      }
      swal({
        title: '',
        text: "确定要删除吗?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          
          delTree(Id).then(res => {
            let data = res;
            if ("success" == data.result) {
              swal("删除成功", "已经从列表中删除!", "success");
              this.getList();
              this.$emit('uploadTree')
            }
          })
        }
      });
    },
    handleSelection(rows) {
      this.selection = rows;
    },
    //批量操作
    makeAll(msg) {
      if (this.selection.length == 0) return this.$message.warning("选择要执行的数据")
      swal({
        title: '',
        text: msg,
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          let ids = this.selection.map(item => item.id)
          let data_ids = ids.join(',')
          delTree(data_ids).then(res => {
            if (res.code != 200) return this.$modal.msgError(res.msg)
            this.$modal.msgSuccess("刪除成功")
            this.getList()
            this.$emit('uploadTree')
          })
        }
      });
    },

    //修改
    toEdit(data, ID) {
      let PICTURE_ID = data.id;
      var title = jquery("#title" + ID).val();
      title = '' == title ? '未命名' : title;
      var remarks = jquery("#remarks" + ID).val();
      remarks = '' == remarks ? '(未填写)' : remarks;
      let {
        originalFileName,
        remark,
        ...other
      } = data;
      let params = {
        ...other,
        originalFileName: title,
        remark: remarks
      }
      putFile(params).then(res=>{
        let {code,msg} = res;
        if(code!=200)return this.$modal.msgError(msg)
        jquery("#titlew" + ID).hide();
        jquery("#remarksw" + ID).hide();
        this.getList();
        this.$emit('uploadTree')
      })
    },

    //打开修改窗口
    openEdit(WID, ID) {
      jquery("#" + WID).show();
      jquery("#" + ID).focus();
    },

    //关闭修改窗口
    closeEdit(ID) {
      jquery("#" + ID).hide();
    },

    //显示图片
    showImg(path, TPID, event) {
      console.log(event, "enent")
      jquery("#" + TPID).html('<img width="300" src="' + path + '">');
      jquery("#" + TPID)[0].style.top = event.clientY - 80 + "px"
      jquery("#" + TPID)[0].style.left = event.clientX - 200 + "px"
      jquery("#" + TPID).show();
    },

    //隐藏图片
    hideImg(TPID) {
      jquery("#" + TPID).hide();
    },

    //选定图片
    fix(value) {
      this.$emit('changeFilePath', value)
    },

    //下载
    downloadFile(url) {
      swal({
        title: '',
        text: '确定要下载此图片吗?',
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          this.$download.resource(process.env.VUE_APP_BASE_API+url)
        }
      });
    },

  },

  mounted() {
    this.init();
  }
}

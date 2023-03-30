import service from "@/utils/request";

export default {
  data(){
    return{
      uploadAble:false,

      // 遮罩层
      loading: false,
      // 选中数组
      ids: [],
      //选中数据
      selection:[],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      //列表数据
        datalist:[],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      exportUrl:{
        list:'',
        info:'',
        add:'',
        edit:'',
        delete:'',
        import:'',
        fileName:'',
        download:'/system/export'
      },
      currentId:undefined,//当前对象ID
      currentObj:null,
      queryForm:{}
    }
  },
  created() {
    this.getList();
  },
  methods:{
    //列表点击事件---触发选中
    rowClick(row,column,event){
      this.$refs.myTable.toggleRowSelection(row);
    },
    /** 查询【请填写功能名称】列表 */
    getList() {
      // this.loading = true;
      return
      service({method:'get',url:this.exportUrl.list,params:{...this.queryParams,...this.queryForm}}).then(res=>{
        let {code,msg,rows,total} = res;
        this.loading = false;
        if(code!=200)return false
        this.datalist = rows;
        this.total = total
      })
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      if(this.$refs.resourceHeader){
        this.$refs.resourceHeader.clearSelected()
      }
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.achievementId)
      this.selection = selection;
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },

    /** 新增按钮操作 */
    handleAdd(llabel) {
      this.currentId = undefined;
      this.currentObj = undefined;
      this.open = true;
      this.$nextTick(()=>{
        this.$refs[llabel].init();
      })
    },
    /** 修改按钮操作 */
    handleUpdate(row,llabel) {
      this.open = true;
      this.currentId = '001212212';
      this.currentObj = row;
      this.$nextTick(()=>{
        this.$refs[llabel].init();
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.achievementId || this.ids;
      this.$modal.confirm('是否确认删除【请填写功能名称】编号为"' + achievementIds + '"的数据项？').then(_=>{
        service({method:'delete',url:`${this.exportUrl.delete}/${ids.join(',')}`}).then(res=> {
          let {code, msg} = res;
          if (code != 200) return false;
          this.$modal.msgSuccess("删除成功");
        })
      })
    },
    /*导入*/
    handleImport() {
      this.uploadAble = true;
      this.$nextTick(() => {
        this.$refs.myImport.visible = true;
      })
    },
    /** 导出按钮操作 */
    handleExport(prefixValue){
      this.download(this.exportUrl.download, {
        ...this.queryParams
      }, `${prefixValue}_${new Date().getTime()}.xlsx`)
    }
  }
}

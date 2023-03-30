import FileImport from '@/components/FileImport/index.vue'

export default{
    components:{FileImport},
    data(){
        return{
            uploadAble:false,
            requestParams:{
                // 基本地址
                baseUrl:'/system/group',
                // 文件名称
                fileName:''
            }
        }
    },
    methods: {
      handleImport() {
        this.uploadAble = true;
        this.$nextTick(() => {
          this.$refs.myImport.visible = true;
        })
      },
      /** 导出按钮操作 */
      handleExport() {
        this.download(this.requestParams.baseUrl+'/export', {
          ...this.queryParams
        }, `${this.requestParams.fileName}_${new Date().getTime()}.xlsx`)
      }
    }
}
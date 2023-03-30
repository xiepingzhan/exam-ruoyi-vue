import resourceHeader from '@/components/ResourceHeader/index'
import resource_type from "@/mixins/resource_type";
//共同导入 查询头
export default{
  mixins:[resource_type],
  components:{
    resourceHeader
  },
  data(){
    return {
      //显示过滤文本
      isShowText:false,
      //默认的占位符
      fileTypeName:'文件',
    }
  },
  methods:{
    toggleShowSearchText(){
      if(this.queryForm.name!=undefined&&this.queryForm.name!='')return
      this.isShowText = !this.isShowText;
    },
    handleClick(item){
      if(!item){
      //  清除选中
      }else{
      //  选中
        console.log(item,'item类型')
      }

    }
  }
}

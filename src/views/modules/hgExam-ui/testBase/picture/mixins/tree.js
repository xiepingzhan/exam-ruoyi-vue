import { getTree } from "@/api/hgExam-ui/testpaper_picture";


export default {
  data() {
    return {
        PICTURE_ID:undefined,//主键ID
        PARENT_ID: undefined,//上级ID
        serverurl:"",//服务地址
        treeData:[]
    }
  },
  methods: {
    // 初始化树
    initTree() {
    getTree().then(res => {
       let {code,msg,data} = res;
       if(code!=200) return this.$modal.msgError(msg)
       this.treeData = data;
      })
    },

  },
  mounted() {
    this.initTree()
  }
}

import service from "@/utils/request";
export default {
  data(){
    return{
      //总体库
      exam_data:{
        A:[
          {
            topicType:1,
            topicName:'《海上风险规则》',
            topicNum:10
          },
          {
            topicType:2,
            topicName:'《海上风险规则》',
            topicNum:20
          },
          {
            topicType:3,
            topicName:'《海上风险规则》',
            topicNum:30
          }
        ],
        B:[
          {
            topicType:1,
            topicName:'《风险规则》',
            topicNum:10
          },
          {
            topicType:2,
            topicName:'《海上规则》',
            topicNum:20
          },
          {
            topicType:3,
            topicName:'《海风规则》',
            topicNum:30
          }
        ],
        C:[
          {
            topicType:1,
            topicName:'《海上风险规则1》',
            topicNum:10
          },
          {
            topicType:2,
            topicName:'《海上风险规则2》',
            topicNum:20
          },
          {
            topicType:3,
            topicName:'《海上风险规则3》',
            topicNum:30
          }
        ]
      }
    }
  },
  methods:{
    async getQuestion(type){
     let res =await service({
        method:'get',
        url:'/question/query/'+type
      })
     if(res.code!=200) return
      this.topList = res.data;
     // debugger
    }
  }

}

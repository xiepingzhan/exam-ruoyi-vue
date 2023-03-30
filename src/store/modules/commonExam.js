const state = {
  examObj: {
    questionInfo: {
          }
  }
}
const dd = {
  A:{
    questionPool:[],
    // test
  }
}

const mutations = {
  changeExamObj(state,msg){
    state.examObj = msg
  }
}
export default {
  state,
  mutations
}

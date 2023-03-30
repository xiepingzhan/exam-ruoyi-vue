//合并单元格
export default {
  data(){
    return{
      formatObj:{
        label:'varList',//列表数据字段名,
        list:['title','username']
      },
    }
  },
  methods:{
    /**
     * 递归查找合并项的最大索引
     * prop 对应字段,
     * val 当前数值,
     * index索引
     * bool对应判断字段
     * list 对应table数据列表名
     * */
    recursionFindIndex(prop,val,index,list,bool){
      if(this[list][index]){
        if(this[list][index][prop]==val){
          this.$set(this[list][index],bool,true)
          return this.recursionFindIndex(prop,val,(index+1),list,bool)
        }else{
          return index;
        }
      }else{
        //  数组中没对应的值
        return index;
      }
    },
    spanMethod({row,column,rowIndex,columnIndex}){
      for(let item  of this.formatObj.list){
        if(column.property==item&&!row['isFill'+item]){
          // 渲染合并后的
          let index = this.recursionFindIndex(item,row[item],(rowIndex+1),this.formatObj.label,('isFill'+item))
          let resetNum = index - rowIndex;
          return [resetNum,1]
        }else if(column.property==item&&row['isFill'+item]){
          // 合并的不进行渲染
          return [0,0]
        }
      }
      return
      this.formatList.forEach(item=>{
        return function (){

        }
      })

    },
  }
}

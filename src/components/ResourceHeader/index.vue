<template>
<div class="resource-header">
  <div
    v-for="(item,index) in menuList"
    :key="index"
    @click="handleClick(item)"
  >
    <div class="div1"
         :style="{width:width+'px',height:height+'px'}"
    >
      <img :src="item.src" alt="">
      <div class="txt" :title="item.text">{{item.text}}</div>
    </div>

  </div>
</div>
</template>

<script>
  import jQ from 'jquery'
export default {
  name: "index",
  props:{
    width:{
      type:Number,
      default:90
    },
    height:{
      type:Number,
      default:90
    },
    menuList:{
      type:Array,
      default:()=>[]
    }
  },
  mounted(){
    jQ('.resource-header>div').click(function () {
      jQ('.resource-header>div').find('.div1').toggleClass('myClick',false)
      jQ(this).find('.div1').toggleClass('myClick')
    })
  },
  methods:{
    //清除选中
    clearSelected(){
      jQ('.resource-header>div').find('.div1').toggleClass('myClick',false)
      this.$emit("handleClick",null)
    },
    //选中
    handleClick(item){
      this.$emit("handleClick",item)
    },
  }
}
</script>

<style scoped lang="scss">
.resource-header {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
  background: #f6f9fc;
  box-sizing: border-box;
  margin-bottom:10px;
  &>div{
    padding:10px 5px;
    box-sizing: border-box;
  }
  &>div:first-of-type{
    padding-left: 10px;
  }

  .myClick {
    border-color: #00afff !important;
    box-shadow: 0 0 5px 1px #00afff !important;
    color: #00afff !important;
  }
  & .div1 {
    width: 150px;
    height: 100px;

    background: white;
    border: 1px solid white;
    padding: 10px;
    box-sizing: border-box;
    border-radius: 10px;
    box-shadow: 1px 1px 2px 1px darkgray, -1px -1px 2px 1px darkgray;
    &:hover {
      border-color: #00afff;
      box-shadow: 0 0 5px 1px #00afff;
      cursor: pointer;
    }

    & > img {
      width: 100%;
      height: calc(100% - 20px);
    }

    .txt {
      height: 20px;
      line-height: 20px;
      //background: red;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      text-align: center;
    }

  }
}
</style>

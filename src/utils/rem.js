// rem 等比适配配置文件

//基准大小
const baseSize = 16
 //设置rem 函数
function setRem(){
//  当前也买你跨度相当于1920宽的缩放比例，可根据自己需要更改
    const scale = document.documentElement.clientWidth / 1920
    document.documentElement.style.fontSize = baseSize * Math.min(scale,2) + 'px'
}
//初始化
setRem()
window.onresize = function (){
  setRem()
}

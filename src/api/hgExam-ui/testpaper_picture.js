import request from '@/utils/request';
// 获取图片分裂库
export const getTree =()=>{
    return request({
        method:"get",
        url:'/system/file/tree',
        params:{
            tm:new Date().getTime()
        }
    })
}
// 新增图片分类   新增图片
export const saveFile = (data)=>{
    return request({
        method:'post',
        url:'/system/file/saveFile',
        data
    })
}
// 修改圖片庫分離
export const putFile = (data) =>{
    return request({
        method:'put',
        url:'/system/file',
        data
    })
}
// 获取图片库信息
export const getFile = (id) =>{
    return request({
        method:'get',
        url:'/system/file/'+id,
        
    })
}
// 删除树节点
export const delTree =(ids)=>{
    return request({
        method:'delete',
        url:'/system/file/deleteById/'+ids
    })
}
// 查询图片列表--
export const getPage = (data)=>{
    return request({
        method:'get',
        url:"/system/file/list",
        params:data
    })
}
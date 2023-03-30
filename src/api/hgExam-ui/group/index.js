import request from '@/utils/request'

// 查询人员-分组列表
export function listGroup(query) {
  return request({
    url: '/system/group/list',
    method: 'get',
    params: query
  })
}

// 查询人员-分组详细
export function getGroup(groupId) {
  return request({
    url: '/system/group/' + groupId,
    method: 'get'
  })
}

// 新增人员-分组
export function addGroup(data) {
  return request({
    url: '/system/group',
    method: 'post',
    data: data
  })
}

// 修改人员-分组
export function updateGroup(data) {
  return request({
    url: '/system/group',
    method: 'put',
    data: data
  })
}

// 删除人员-分组
export function delGroup(groupId) {
  return request({
    url: '/system/group/' + groupId,
    method: 'delete'
  })
}

/*获取人员分组信息----单纯的文件名 */
export const getImportInfo = (params)=>{
  return request({
    url:'/system/group/importInfo',
    method:'get',
    params
  })
}
/*获取人员分组的详细信息 */
export const getOnceImportInfo = (params)=>{
  return request({
    url:'system/group/onceImportInfo',
    params,
    method:'get'
  })
}

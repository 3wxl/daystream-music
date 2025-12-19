import request from "@/utils/request";
// 获取动态列表
export function GetDynamicList(data:{role?:number,key?:string,pageNum:number,pageSize:number}) {
  return request(
    `/admincommunity/list`,
    'post',
    data
  )
}

// 删除动态
export function DeleteDynamicApi(id:string) {
  return request(
    `/admincommunity/deleted?id=${id}`,
    'get'
  )
}

// 批量删除动态
export function DeleteDynamicListApi(ids:string[]) {
  return request(
    `/admincommunity/deleteBatch`,
    'post',
    {ids}
  )
}

// 获取动态详情
export function GetDynamicDetailApi(id:string) {
  return request(
    `/admincommunity/detailPost?id=${id}`,
    'get'
  )
}

// 更新动态
export function UpdateDynamicDataApi(data:{id:string,title?:string,content?:string}) {
  return request(
    `/admincommunity/updatePost`,
    'post',
    data
  )
}

// 修改动态状态
export function UpdateDynamicStateApi(id:string) {
  return request(
    `/admincommunity/banPost?id=${id}`,
    'get'
  )
}


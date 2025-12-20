// 动态审核管理部分的APi

import request from "@/utils/request";
// 获取动态列表
export function GetDynamicReviewList(data:{statis?:number,role?:number,key?:string,pageNum:number,pageSize:number}) {
  return request(
    `/communityApply/list`,
    'post',
    data
  )
}


export function PassBatchApi(ids:string[]) {     // 批量通过动态
  return request(
    `/communityApply/passBatch`,
    'post',
    {ids}
  )
}

export function RejectBatchBatchApi(ids:string[]) {     // 批量驳回动态
  return request(
    `/communityApply/rejectBatch`,
    'post',
    {ids}
  )
}

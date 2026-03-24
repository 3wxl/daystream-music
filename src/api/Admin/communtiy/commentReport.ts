import request from "@/utils/request";
// 获取举报评论列表
export function GetCommentReportListApi(data:{status?:number,key?:string,pageNum:number,pageSize:number,reason?:number}) {
  return request(
    `/report/getReportList`,
    'post',
    data
  )
}

// 获取举报评论详情
export function GetReportDetailApi(id:string) {
  return request(
    `/report/getDetaiReport?id=${id}`,
    'get'
  )
}

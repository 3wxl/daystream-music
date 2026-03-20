import request from "@/utils/request";
// 获取评论列表
export function GetCommentList(data:{type?:number,keyword?:string,pageNum:number,pageSize:number}) {
  return request(
    `/Admincomment/list`,
    'post',
    data
  )
}

// 删除评论（也可以批量）
export function deleteCommentApi(commentId:number[]) {
  return request(
    `/Admincomment/deleteComment`,
    'post',
    {commentId}
  )
}

// 获取评论详情
export function GetCommentDetailApi(id:number) {
  return request(
    `/Admincomment/detailComment?id=${id}`,
    'get',
  )
}

// 修改评论
export function updateCommentApi(data:{id:number,content:string}) {
  return request(
    `/Admincomment/updateComment`,
    'post',
    data
  )
}

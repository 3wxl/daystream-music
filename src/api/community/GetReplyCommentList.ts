// 获取子评论

import request from '@/utils/request'
export function GetReplyCommentList(data:{parentId:string;lastId?:string;size:number}) {
  return request(
    '/comment/getReplyCommentList',
    'post',
    data
  )
}

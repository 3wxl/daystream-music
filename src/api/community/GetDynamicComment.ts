// 获取动态的一级评论

import request from '@/utils/request'

export function GetDynamicComment(data:{targetId:string,targetType:number,lastId?:string,size:number}) {
  return request(
    `/comment/getCommentList`,
    'post',
    data
  )
}

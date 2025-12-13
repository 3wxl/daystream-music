// 评论操作
import request from '@/utils/request'

// 获取动态的一级评论
export function GetDynamicComment(data:{targetId:string,targetType:number,lastId?:string,size:number}) {
  return request(
    `/comment/getCommentList`,
    'post',
    data
  )
}

// 发布评论
export function DynamicCommentRelease(data:{targetId:string,targetType:number,content:string}) {
  return request(
    `/comment/releaseComment`,
    'post',
    data
  )
}

// 获取子评论列表
export function GetReplyCommentList(data:{parentId:string;lastId?:string;size:number}) {
  return request(
    '/comment/getReplyCommentList',
    'post',
    data
  )
}

// 回复评论
export function ReplyComment(data:{parentId:string,content:string}) {
  return request(
    '/comment/replyComment',
    'post',
    data
  )
}

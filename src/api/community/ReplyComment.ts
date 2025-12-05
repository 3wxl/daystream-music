// 回复评论

import request from '@/utils/request'

export function ReplyComment(data:{parentId:string,content:string}) {
  return request(
    '/comment/replyComment',
    'post',
    data
  )
}

// 对动态进行评论

import request from '@/utils/request'

export function DynamicCommentRelease(data:{targetId:string,targetType:number,content:string}) {
  return request(
    `/comment/releaseComment`,
    'post',
    data
  )
}

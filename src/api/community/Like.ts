
// 点赞
import request from '@/utils/request'

export function Like(submitData:{targetId:string,targetType:number}) {
  return request(
    '/community/getAllPost',
    'post',
    submitData
  )
}

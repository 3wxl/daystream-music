// 动态操作相关的api
import request from '@/utils/request'

// 关注他人
export function FollowOther(userId:number) {
  return request(
    `/userbase/follow?userId=${userId}`,
    'get'
  )
}

export function UnFollowOther(userId:number) {
  return request(
    `/userbase/unfollow?userId=${userId}`,
    'get'
  )
}

// 点赞
export function Like(submitData:{targetId:string,targetType:number}) {
  return request(
    '/userbase/likerecord',
    'post',
    submitData
  )
}

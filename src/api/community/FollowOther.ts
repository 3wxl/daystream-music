// 关注他人

import request from '@/utils/request'

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

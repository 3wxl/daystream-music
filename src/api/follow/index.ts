import request from '@/utils/request'
import type {
  FollowListParams,
  FollowListResp,
  MusicianItem,
  NormalUserItem,
} from '@/types/follow/index'

// 获取关注的音乐人列表
export const getFollowMusician = (params: FollowListParams): Promise<FollowListResp> => {
  return request<FollowListResp>('/userbase/getFollowMusician', 'POST', {
    ...params,
  }).then((res) => res.data)
}

// 获取关注的普通用户列表
export const getFollowNormal = (params: FollowListParams): Promise<FollowListResp> => {
  return request<FollowListResp>('/userbase/getFollowNormal', 'POST', {
    ...params,
  }).then((res) => res.data)
}

// 关注接口（通用）
export const followUser = (userId: number): Promise<any> => {
  return request('/userbase/follow', 'GET', { userId }).then((res) => res.data)
}

// 取消关注接口（通用）
export const cancelFollow = (userId: number): Promise<any> => {
  return request('/userbase/unfollow', 'GET', { userId }).then((res) => res.data)
}

// 获取粉丝列表（关注我的人）
export const getFollower = (params: FollowListParams): Promise<FollowListResp> => {
  return request<FollowListResp>('/userbase/getFollowedList', 'POST', {
    ...params,
  }).then((res) => res.data)
}

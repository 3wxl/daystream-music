// 关注列表通用接口参数
export interface FollowListParams {
  lastId?: string | null
  size?: number
}

// 关注列表响应数据 - 根据后端返回格式调整
export interface FollowListResp {
  success: boolean
  errorMsg: string
  dateList: Array<{
    id: number
    username: string
    avatar: string
    introduction: string
    userStatus: number
    followTime?: string
    fansCount?: number
    // 其他可能存在的字段...
  }>
  hasMore: boolean
  lastId?: string
  total?: number
}

// 音乐人（歌手）类型
export interface MusicianItem {
  id: number
  username: string
  avatar: string
  introduction: string
  userStatus: number
  genre?: string
  songCount?: number
  fansCount?: number
  isOnline?: boolean
  followTime?: string
}

// 普通用户类型
export interface NormalUserItem {
  id: number
  username: string
  avatar: string
  introduction: string
  userStatus: number
  verified?: boolean
  posts?: number
  playListCount?: number
  fansCount?: number
  isMutual?: boolean
  followTime?: string
  dynamicCount?: number
}

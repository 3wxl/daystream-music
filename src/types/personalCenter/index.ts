/**
 * 用户信息VO（接口返回类型）
 */
export interface UserInfoVO {
  id?: bigint | number // 兼容JSONBig解析的大数字
  username?: string
  avatar?: string
  gender?: string // 男/女/保密
  introduction?: string // 个性签名（对应页面的signature）
  isVip?: boolean
  vipExpireTime?: string
  email?: string
  phone?: string
  totalPoint?: number
  walletBalance?: number // 音浪
  createdTime?: string
  userRole?: string[]
  followCount?: number // 关注数
  fansCount?: number // 粉丝数
  likedCount?: number // 获赞数
  playCount?: number // 播放量
  createdCount?: number // 作品数
  bgImg?: string // 背景图
  lastLoginTime?: string
  lastCheckinTime?: string
  updatedTime?: string
}

/**
 * 修改个人信息参数（接口请求类型）
 */
export interface UpdateUserInfoParams {
  username: string // 对应username
  introduction: string // 对应introduction
  gender: string // 男/女/保密（前端展示用）
}

/**
 * 编辑表单类型（对应EditDialog的表单）
 */
export interface EditForm {
  name: string // 对应username
  signature: string // 对应introduction
  gender: string // 男/女/保密（前端展示用）
  lastCheckinTime: string
  lastLoginTime: string
  updatedTime?: string
  vipExpireTime?: string
  walletBalance: number // 音浪
  createdTime?: string
}

/**
 * 上传图片响应类型
 */
export interface UploadImageResponse {
  url: string // 图片地址
}

export type MusicVO = {
  id: number
  name: string
  artist: string
  album: string
  cover: string
  duration: number
  tags: string[]
  isLiked: boolean
}

// 分页响应类型
export type PageRespListMusicVO = {
  records: MusicVO[]
  total: number
  size: number
  current: number
  pages: number
}

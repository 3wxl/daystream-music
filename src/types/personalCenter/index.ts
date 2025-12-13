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
  userRole?: string
  followCount?: number // 关注数
  fansCount?: number // 粉丝数
  likeCount?: number // 获赞数
  playCount?: number // 播放量
  createdCount?: number // 作品数
  backgroundImage?: string // 背景图
  lastLoginTime?: string
  lastCheckinTime?: string
  updatedTime?: string
  onlineStatus?: number
}

export interface UpdateUserInfoParams {
  username?: string // 可选（接口定义为可选）
  gender?: string // 后端要求：0-未知,1-男,2-女
  introduction?: string // 可选
  phone?: string // 可选
  avatarFile?: File // 头像文件（前端上传用）
  backgroundImageFile?: File // 背景图文件（前端上传用）
  // 注意：avatar/backgroundImage 由后端返回，前端不传
}

/**
 * 编辑表单类型（对应EditDialog的表单）
 */
export interface EditForm {
  name: string // 对应username
  signature: string // 对应introduction
  gender: string // 前端展示：男/女/未知
  lastCheckinTime: string
  lastLoginTime: string
  updatedTime?: string
  vipExpireTime?: string
  walletBalance: number
  createdTime?: string
  phone?: string
}
/**
 * 上传图片响应类型
 */
export interface UploadImageResponse {
  url: string // 图片地址
}

export type MusicVO = {
  id: number
  albumId: number
  albumName: string | null
  bpm: number
  commentCount: number
  coverUrl: string
  duration: string // 后端返回的是"04:10"格式字符串
  isLiked: 0 | 1 // 0=未喜欢，1=已喜欢
  isVip: 0 | 1 // 0=非VIP，1=VIP
  likeCount: number
  musicName: string
  musicianId: { s: number; e: number; c: number[] } | number // 兼容BigNumber和普通数字
  musicianName: string | null
  createTime?: string | number
}

export interface GetMyLikeSongsParams {
  pageNum: number
  pageSize?: number
}

export interface GetMyLikeSongsResponse {
  success: boolean
  errorMsg?: string
  data: {
    records: MusicVO[]
    total: number
    size: number
    current: number
    pages: number
  }
}

export interface LikeRecordParams {
  targetId: string | number
  targetType: 1 | 2 // 1-音乐 2-评论
}
export interface LikeRecordResponse {
  success: boolean
  errorMsg?: string
  data: {
    islike: boolean // 是否点赞（true=已点赞，false=取消点赞）
    likecount: number // 最新点赞数
    msg?: string // 状态提示
  }
  errCode?: string
}
import type { Data } from '@/utils/request'

/** 收藏歌单请求参数（游标分页） */
export interface CollectPlaylistReq {
  pageNum: number
  pageSize?: number
}

/**
 * 创建歌单请求参数（页码分页）
 */
export interface CreatePlaylistReq {
  pageNum: number
  pageSize?: number
}

/**
 * 歌单VO（接口返回的歌单信息）
 */

/**
 * 歌单分页响应结构（通用）
 */
export interface PlaylistPageResp {
  records: PlaylistVO[][] | PlaylistVO[] // 兼容二维/一维数组
  total: number
  size: number
  current: number
  pages: number
}

/**
 * 收藏歌单响应类型（根据你的实际API响应）
 */
export interface CollectPlaylistResp {
  success: boolean
  errorMsg?: string
  data?: PlaylistPageResp // 收藏歌单返回分页结构
}

/**
 * 创建歌单响应类型（根据你的实际API响应）
 */
export interface CreatePlaylistResp {
  success?: boolean
  errorMsg?: string
  data?: PlaylistPageResp // 创建歌单也返回分页结构
}

// 或者使用 Data 包装器
export type CollectPlaylistResp2 = Data<PlaylistPageResp>
export type CreatePlaylistResp2 = Data<PlaylistPageResp>

export interface CreatePlaylistParams {
  id?: number
  name: string
  cover: string
  description: string
  isPublic?: number // 1-公开，0-私有，默认1
  tagIds?: number[]
}

// 确保PlaylistVO类型存在
export interface PlaylistVO {
  id: number
  name: string
  cover: string
  description?: string
  playCount?: number
  isPublic?: number
  tagIds?: number[]
  createTime?: string
  updateTime?: string
  success?: boolean
  erroeMsg?: string
}
export interface DailyListenDataVO {
  count: number // 听歌次数
  seconds: number // 听歌时长（秒）
}

// 新增：本周每日听歌响应类型
export interface WeeklyDailyListenResp {
  success: boolean
  errorMsg?: string
  data: DailyListenDataVO[] // 每日数据数组 [周一, 周二, ..., 周日]
  total?: number // 本周总次数
  errCode?: string

  records: MusicTagRatioVO[]
}

// 新增：音乐标签占比VO
export interface MusicTagRatioVO {
  tagName: string // 标签名称（如"流行"、"摇滚"）
  count: number // 播放次数
  ratio: number // 占比（百分比）
}

// 新增：本周标签占比响应类型
export interface WeeklyTagRatioResp {
  success: boolean
  errorMsg?: string
  data: MusicTagRatioVO[]
  total?: number // 总播放次数
  errCode?: string
  records: MusicTagRatioVO[]
}

// 补充：修改原有听歌次数类型（适配真实接口返回）
// 替换原有的 getWeeklyDailyListenCount 返回类型
export interface WeeklyListenCountResp {
  success: boolean
  errorMsg?: string
  data: DailyListenDataVO[] // 改为对象数组，而非纯数字数组
  total?: number
  errCode?: string
}
export interface AlbumVO {
  id: number
  albumName: string
  musicianId: number
  coverUrl: string
  releaseDate: string
  introduction: string
  status: number
  collectCount: number
  commentCount: number
  musicCount: number
  musicianName: string
  playCount?: string
}
export interface CollectAlbumResp {
  success: boolean
  errorMsg?: string
  data: {
    records: AlbumVO[]
    total: number
    size: number
    current: number
    pages: number
  }
  errCode?: string
}
export interface AlbumCardVO {
  id: number
  name: string
  artist: string // 歌手名（接口返回musicianId，这里先占位，后续可通过musicianId查询）
  cover: string
  songCount: number
  playCount: string // 播放量（接口无此字段，可默认显示或后续扩展）
  collectTime: string // 收藏时间（接口无此字段，可默认显示）
}
// ========== 新增：歌单详情相关类型 ==========
/**
 * 歌单详情请求参数（路径+查询参数）
 */
export interface PlaylistDetailParams {
  playlistId: number | string // 路径参数：歌单ID
  pageNum: number // 查询参数：页码
  pageSize: number // 查询参数：页大小
}

/**
 * 歌曲详情VO（歌单详情中的歌曲信息）
 */
export interface MusicDetailVO {
  id: number
  musicName: string
  albumId: number
  musicianId: number
  coverUrl: string
  bpm: number
  isVip: 0 | 1
  likeCount: number
  commentCount: number
  duration: string
  isLiked: 0 | 1
  albumName: string
  musicianName: string
  audioList: string[]
}

/**
 * 分页响应-歌曲VO
 */
export interface PageRespMusicVO {
  records: MusicDetailVO[]
  total: number
  size: number
  current: number
  pages: number
}

/**
 * 歌单详情VO
 */
export interface PlaylistDetailVO {
  name: string
  creator: string
  avatar: string
  cover: string
  description: string
  musicCount: number
  playCount: number
  createdTime: string
  commentCount: number
  collectionCount: number
  musicDetailVOList: PageRespMusicVO
}

/**
 * 歌单详情接口响应类型
 */
export interface PlaylistDetailResponse {
  success: boolean
  errorMsg?: string
  data: PlaylistDetailVO
  errCode?: string
}

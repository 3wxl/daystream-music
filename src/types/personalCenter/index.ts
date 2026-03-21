/**
 * 基础类型（抽离通用类型）
 */
type IDType = number | string | bigint // 兼容所有ID类型
type BooleanNumber = 0 | 1 // 数字布尔值（0=否，1=是）
type PublicStatus = 0 | 1 // 公开状态（0=私有，1=公开）

/**
 * 用户信息VO（接口返回类型）
 */
export interface UserInfoVO {
  id?: IDType // 兼容大数字/普通数字/字符串
  username?: string
  avatar?: string
  gender?: string // 男/女/保密
  introduction?: string // 个性签名
  isVip?: boolean
  vipExpireTime?: string // ISO时间字符串
  email?: string
  phone?: string
  totalPoint?: number // 积分
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
  likePlaylistId?: string
}

/**
 * 用户信息编辑参数（前端提交给后端）
 */
export interface UpdateUserInfoParams {
  username?: string
  gender?: '0' | '1' | '2' // 后端要求：0-未知,1-男,2-女
  introduction?: string
  phone?: string
  avatarFile?: File // 头像文件
  backgroundImageFile?: File // 背景图文件
}

/**
 * 编辑表单类型（前端展示用）
 */
export interface EditForm {
  name: string // 对应username
  signature: string // 对应introduction
  gender: string // 男/女/未知
  lastCheckinTime: string
  lastLoginTime: string
  updatedTime?: string
  vipExpireTime?: string
  walletBalance: number
  createdTime?: string
  phone?: string
}

/**
 * 图片上传响应
 */
export interface UploadImageResponse {
  url: string // 图片CDN地址
}

/**
 * 基础歌曲VO（通用歌曲信息）
 */
export interface BaseMusicVO {
  id: IDType // 必选：歌曲ID
  musicName: string // 必选：歌曲名
  albumId: number // 必选：专辑ID
  albumName: string | null // 专辑名（可能为空）
  musicianId: IDType // 音乐人ID（兼容所有类型，移除错误的对象类型）
  musicianName: string | null // 音乐人名称
  coverUrl: string // 封面URL
  duration: string // 时长 "04:10" 格式
  bpm: number // 节奏BPM
  isVip: BooleanNumber // 是否VIP歌曲
  isLiked: BooleanNumber // 是否点赞
  likeCount: number // 点赞数
  commentCount: number // 评论数
  createTime?: string | number // 创建时间
}

/**
 * 歌曲VO（列表展示用）
 */
export interface MusicVO extends BaseMusicVO {
  audioList?: string[] // 音频类型列表 ["标准", "高清"]
}

/**
 * 播放用歌曲VO（带音频地址）
 */
export interface MusicPlayVO extends BaseMusicVO {
  audioList: string[] // 音频类型列表 ["标准", "高清"]
  audioUrl: string // 音频播放地址
  total?: number
  errCode?: string
}

/**
 * 歌曲详情VO（包含歌词、标签等）
 */
export interface MusicDetailVO extends BaseMusicVO {
  lyricType?: 'lrc' | 'krc' | 'txt' | 'none' // 歌词类型
  lyricUrl?: string // 歌词文件URL
  syncLyric?: Array<{ time: number; text: string }>
  rawLyricText?: string // 纯文本歌词
  tags?: Array<{
    id: number
    tagName: string
    category?: string
  }> // 歌曲标签
  introduction?: string // 歌曲介绍
  releaseDate?: string // 发布日期
  playCount?: number // 播放量
  collectCount?: number // 收藏数
  shareCount?: number // 分享数
  durationSeconds?: number // 时长（秒，前端计算）
  vipInfo?: {
    level?: number
    expireTime?: string
    benefits?: string[]
  }
  audioQuality?: {
    bitrate?: number
    format?: string
    sampleRate?: number
    channels?: number
  }
}

/**
 * 原始歌词行DTO（后端返回：毫秒级时间）
 */
export interface LyricLineRawDTO {
  time: number // 必选：毫秒数（核心修正！之前错误定义为string）
  text: string // 必选：歌词文本
  translation?: string // 翻译
  romaji?: string // 罗马音
  startTime?: number
  endTime?: number
  isMain?: boolean
}

/**
 * 格式化歌词行DTO（前端展示用：分秒字符串）
 */
export interface LyricLineDTO {
  time: string // 格式化时间 "00:00.00"
  text: string
  translation?: string
  romaji?: string
  startTime?: number
  endTime?: number
  isMain?: boolean
}

/**
 * 歌词完整数据
 */
export interface LyricData {
  rawText: string
  lines: LyricLineDTO[]
  hasTranslation: boolean
  type: string
  totalDuration?: number
}

/**
 * 分页响应通用类型
 */
export interface PageResp<T> {
  records: T[] // 数据列表
  total: number // 总条数
  size: number // 页大小
  current: number // 当前页
  pages: number // 总页数
}

/**
 * 我的喜欢歌曲相关
 */
export interface GetMyLikeSongsParams {
  pageNum: number
  pageSize?: number
}

export interface GetMyLikeSongsResponse {
  success: boolean
  errorMsg?: string
  data: PageResp<MusicVO>
  errCode?: string
}

/**
 * 点赞相关
 */
export interface LikeRecordParams {
  targetId: IDType
  targetType: 1 | 2 // 1-音乐 2-评论
}

export interface LikeRecordResponse {
  success: boolean
  errorMsg?: string
  data: {
    islike?: boolean
    likecount?: number
    msg?: string
  }
  errCode?: string
}

/**
 * 歌单相关
 */
export interface PlaylistVO {
  id: number // 歌单ID
  name: string // 歌单名称
  cover: string // 封面URL
  description?: string // 描述
  playCount?: number // 播放量
  isPublic?: PublicStatus // 公开状态
  tagIds?: number[] // 标签ID列表
  createTime?: string // 创建时间
  updateTime?: string // 更新时间
}

export interface CreatePlaylistParams {
  id?: number
  name: string // 必选：歌单名
  cover: string // 必选：封面URL
  description: string // 必选：描述
  isPublic?: PublicStatus // 默认1-公开
  tagIds?: number[]
}

export interface CollectPlaylistReq extends PageParams {}
export interface CreatePlaylistReq extends PageParams {}

// 通用分页参数
export interface PageParams {
  pageNum: number
  pageSize?: number
}

export interface PlaylistPageResp extends PageResp<PlaylistVO> {}

export interface CollectPlaylistResp {
  success: boolean
  errorMsg?: string
  data?: PlaylistPageResp
  errCode?: string
}

export interface CreatePlaylistResp {
  success: boolean
  errorMsg?: string
  data?: PlaylistPageResp
  errCode?: string
}

/**
 * 歌单详情相关
 */
export interface PlaylistDetailParams {
  playlistId: IDType
  pageNum: number
  pageSize: number
}

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
  musicDetailVOList: PageResp<MusicDetailVO> // 歌单内歌曲列表
}

export interface PlaylistDetailResponse {
  success: boolean
  errorMsg?: string
  data: PlaylistDetailVO
  errCode?: string
}

/**
 * 歌单收藏者相关
 */
export interface SearchUserVO {
  id: IDType
  username: string // 修正：统一为username（之前是userName）
  avatar: string
  gender?: 0 | 1 | 2 // 0-未知，1-男，2-女
  introduction?: string
}

export interface PlaylistCollectionsResponse {
  success: boolean
  errorMsg?: string
  data: SearchUserVO[]
  total?: number
  errCode?: string
}

export interface Collector {
  id: number
  avatarUrl: string
  name: string
  collectTime: number
  signature?: string
  followStatus: boolean
}

/**
 * 专辑相关
 */
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
  data: PageResp<AlbumVO>
  errCode?: string
}

export interface AlbumCardVO {
  id: number
  name: string
  artist: string
  cover: string
  songCount: number
  playCount: string
  collectTime: string
}

/**
 * 听歌统计相关
 */
export interface DailyListenDataVO {
  count: number // 听歌次数
  seconds: number // 听歌时长（秒）
}

export interface WeeklyDailyListenResp {
  success: boolean
  errorMsg?: string
  data: DailyListenDataVO[] // 每日数据 [周一, 周二, ..., 周日]
  total?: number // 本周总次数
  errCode?: string
}

export interface MusicTagRatioVO {
  tagName: string
  count: number
  ratio: number
}

export interface WeeklyTagRatioResp {
  success: boolean
  errorMsg?: string
  data: MusicTagRatioVO[]
  total?: number
  errCode?: string
}
export interface Collector {
  id: number
  avatar: string
  collectPlaylistCount: number
  fansCount: number
  gender: number
  introduction: string
  userName: string
}

// ========== 音乐人作品相关类型 ==========
export interface MusicTagVO {
  id?: number
  tagName?: string
}

export interface LyricLineDTO {
  time?: number // 时间戳（毫秒）
  text?: string // 歌词内容
}

export interface MusicDetailVO {
  id?: number // 主键ID
  musicName?: string // 歌曲名
  albumId?: number // 所属专辑ID
  musicianId?: number // 音乐人ID
  coverUrl?: string // 封面URL
  bpm?: number // 节奏（BPM）
  isVip?: number // 是否VIP专属（0-否，1-是）
  likeCount?: number // 点赞量
  commentCount?: number // 评论量
  duration?: string // 时长（秒）
  isLiked?: number // 是否点赞（0-未点赞，1-已点赞）
  albumName?: string // 所属专辑名字
  musicianName?: string // 作者名字（音乐人名称）
  audioList?: string[] // 音频类型列表
  tags?: MusicTagVO[] // 歌曲标签
  lyricType?: string // 歌词文件类型
  lyricUrl?: string // 歌词文件地址
  syncLyric?: LyricLineDTO[] // 同步歌词
  rawLyricText?: string // 纯文本歌词
  playCount?: number // 播放量（兼容原有字段）
  releaseTime?: string // 发布时间（兼容原有字段）
  isOnline?: boolean // 上下架状态（兼容原有字段）
}

export interface PageRespListMusicDetailVO {
  records?: MusicDetailVO[][] // 数据列表（二维数组兼容）
  total?: number // 总记录数
  size?: number // 每页显示数量
  current?: number // 当前页码
  pages?: number // 总页数
}

export interface GetMyMusicParams {
  pageNum: number
  pageSize: number
}

export interface GetMyMusicResponse {
  success?: boolean
  errorMsg?: string
  data?: PageRespListMusicDetailVO
  errCode?: string
  total?: number
}

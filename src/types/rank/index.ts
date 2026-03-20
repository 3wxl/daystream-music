// 排行榜相关类型定义

// 歌曲信息
interface MusicInfo {
  id: number
  musicName: string
  albumId: number
  musicianId: number
  coverUrl: string
  bpm: number
  isVip: number
  likeCount: number
  commentCount: number
  duration: string
  isLiked: number
  albumName: string
  musicianName: string
  audioList: string[]
}

// 榜单信息
interface RankVO {
  id: number
  name: string
  description: string
  updateTime?: string
  musicList: MusicInfo[]
}

// 歌手信息
interface MusicianVO {
  id: number
  userId: number
  stageName: string
  avatar: string
  totalFans: number
  hotMusics: string[]
}

// 榜单映射
type RankVOMap = {
  [key: string]: RankVO
}

// 排行榜主页响应数据
interface RankHomeVO {
  rankVOMap: RankVOMap
  musicianList: MusicianVO[]
  total?: number
}
export type { MusicInfo, RankVO, MusicianVO, RankVOMap, RankHomeVO }

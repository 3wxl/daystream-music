export interface Playlist {
  id: number
  name: string
  coverImg: string
  playCount: number
  createTime: string
  creator: {
    nickname: string
  }
}

export interface PlaylistQueryParams {
  page: number
  limit: number
  order: 'hot' | 'new'
  cat?: string // category/tag
}

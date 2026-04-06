import request from '@/utils/request'

// 获取所有音乐人
export const getAllMusician = (pageNum: number, pageSize: number) => {
  return request('/getAllMusician', 'post', {
    pageNum,
    pageSize,
  })
}

// 获取具体音乐人详情
export const getMusicianDetail = (musicianId: string) => {
  return request('/getMusicianDetail', 'get', {
    musicianId,
  })
}

// 获取歌手的专辑 (歌手详情页专辑Tab使用)
export const getOtherAlbum = (userId: number, pageNum: number, pageSize: number) => {
  return request('/api/album/query-other-album', 'get', {
    userId,
    pageNum,
    pageSize,
  })
}

// 获取歌手的音乐 (歌手详情页歌曲Tab使用)
export const getMusicianMusic = (musicianId: number, pageNum: number, pageSize: number) => {
  return request('/musician/home/getMyMusic', 'get', {
    musicianId,
    pageNum,
    pageSize,
  })
}

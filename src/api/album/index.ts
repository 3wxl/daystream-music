import request from '@/utils/request'

export const getAlbum = (pageNum:string, pageSize:string) => {
  return request('/api/album/query-public-album', 'get', {
    pageNum,
    pageSize,
  })
}


export const getAlbumDetail = (albumId: string) => {
  return request(`/musician/home/getAlbumDetail/${albumId}`, 'get')
}

// 创建歌单
export const createAlbum = (album: any) => {
  return request('/api/album/create-album', 'post', album)
}

// 查询指定音乐人的专辑
export const getMusicianAlbum = (musicianId: string,pageNum: string,pageSize: string) => {
  return request(
    '/musician/home/getMusicianAlbum',
    'get',
    {
      musicianId,
      pageNum,
      pageSize,
    }
  )
}

// 查询我的专辑
export const getMyAlbum = (pageNum:string, pageSize:string) => {
  return request('/api/album/query-my-album', 'get', {
    pageNum,
    pageSize,
  })
}
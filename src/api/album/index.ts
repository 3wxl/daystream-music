import request from '@/utils/request'

export const getAlbum = (pageNum:string, pageSize:string) => {
  return request('/api/album/query-public-album', 'get', {
    pageNum,
    pageSize,
  })
}

// export const getAlbumDetail = (albumId: string) => {
//   return request(`/musician/home/getAlbumDetail/${albumId}`, 'get')
// }

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
export const getMyAlbum = (userId: string | number, pageNum: string, pageSize: string) => {
  return request('/api/album/query-my-album', 'get', {
    userId,
    pageNum,
    pageSize,
  })
}

// 查询专辑的详细内容
export const getAlbumDetail = (albumId: string) => {
  return request('/api/album/get-album-detail', 'get', { albumId })
}

// 修改专辑元数据
export const updateAlbum = (data: FormData) => {
  return request('/api/album/update-album', 'post', data)
}

// 关联歌曲到专辑
export const bindSongsToAlbum = (albumId: number | string, musicIds: number[]) => {
  return request(`/${albumId}/songs/bind`, 'post', musicIds)
}

// 删除专辑
export const deleteAlbum = (albumId: number | string) => {
  return request('/api/album/delete-album', 'get', { albumId })
}
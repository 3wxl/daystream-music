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

import request from '@/utils/request'

export const getAlbumDetail = (albumId:string) => {
  return request(`/api/album/get-album-detail/${albumId}`, 'get')
}

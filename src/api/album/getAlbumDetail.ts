import request from '@/utils/request'

export const getAlbumDetail = (albumId:string) => {
  return request(`/musician/home/getAlbumDetail${albumId}`, 'get')
}

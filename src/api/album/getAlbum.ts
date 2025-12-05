import request from "@/utils/request";

export const getAlbum = (pageNum,pageSize) => {
  return request(
    '/api/album/query-public-album', 
    'get', 
    {
    pageNum,
    pageSize,
  })
};
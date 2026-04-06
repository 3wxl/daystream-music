import request from '@/utils/request'
import type {
  MusicTagVO,
  LyricLineDTO,
  MusicDetailVO,
  PageRespListMusicDetailVO,
  GetMyMusicParams,
  GetMyMusicResponse,
  ApplyMusicianParams,
} from '@/types/personalCenter/musician/index'

export const getMyMusic = async (params: GetMyMusicParams): Promise<GetMyMusicResponse> => {
  return await request<PageRespListMusicDetailVO>(
    '/musician/home/getMyMusic',
    'GET',
    // GET 请求不需要 body，直接不传 / 传 null 都行
    undefined,
    {
      params, // query 参数放这里 ✅ 自动拼接 ?pageNum=1&pageSize=10
    },
  )
}

export const applyMusician = (params: ApplyMusicianParams) => {
  return request('/applyMusician', 'POST', params)
}
export function updateImage(submitData: FormData) {
  return request('/community/updateImage', 'post', submitData)
}
export const getMyAlbums = (params: { pageNum: number; pageSize?: number; userId: number }) => {
  return request(
    '/api/album/query-my-album', // url
    'GET', // method
    undefined, // submitData (GET无请求体)
    {
      showLoading: true,
      noToken: false,
      params: { ...params }, // GET请求参数
    },
  )
}

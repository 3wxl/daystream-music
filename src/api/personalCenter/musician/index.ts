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
    undefined, // GET 请求没有 body 数据
    {
      params, // 查询参数放在这里
      headers: {
        'Content-Type': 'application/json',
      },
    },
  )
}

export const applyMusician = (params: ApplyMusicianParams) => {
  return request('/applyMusician', 'POST', params)
}
export function updateImage(submitData: FormData) {
  return request('/community/updateImage', 'post', submitData)
}

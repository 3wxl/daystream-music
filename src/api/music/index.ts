import request from '@/utils/request'
import type { MusicPlayVO, MusicDetailVO } from '@/types/personalCenter'

/**
 * 获取音乐播放链接
 * @param params musicId + quality
 * @returns 播放链接及歌曲信息
 */
export const getMusicPlayUrl = (params: { musicId: number | string; quality: number }) => {
  return request<{
    success: boolean
    errorMsg?: string
    data?: MusicPlayVO
    errCode?: string
  }>(
    '/music/play', // 接口地址
    'POST', // 请求方法
    params, // 请求参数
    {
      showLoading: true,
      returnFullResponse: false,
    },
  )
}
export const getMusicDetail = (musicId: string) => {
  return request<{
    success: boolean
    errorMsg?: string
    data?: MusicDetailVO
    errCode?: string
  }>(
    `/music/one/${musicId}`,
    'GET',
    {},
    {
      showLoading: false,
      returnFullResponse: false,
    },
  )
}

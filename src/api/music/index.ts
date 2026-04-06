import type { MusicDetailVO, MusicPlayVO } from '@/types/personalCenter'
import type { MusicUploadRequest } from '@/types/personalCenter/musician'
import request from '@/utils/request'

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

// 上传音乐
export function uploadMusic(data: FormData) {
  return request('/music/upload', 'post', data, { showLoading: true,timeout:350000 })
}


// 分页查询我的音乐作品
export function getMyMusicList(pageNum: number, pageSize: number) {
  return request<any>('/musician/home/getMyMusic', 'post', {
    pageNum,
    pageSize,
  })
}

// 获取我的专辑列表
export function getMyAlbums(pageNum:number,pageSize:number) {
  return request<any[]>('/music/albums', 'get',{pageNum,pageSize})
}

import axios from 'axios'

// 下载音乐（直接使用axios，避免响应拦截器干扰）
export const downloadMusic = (musicId: string, quality: number) => {
  return axios({
    url: '/api/music/downloadMusic',
    method: 'GET',
    params: {
      musicId,
      quality,
    },
    responseType: 'blob',
    headers: {
      Authorization: localStorage.getItem('auth_token') || '',
    },
  })
}

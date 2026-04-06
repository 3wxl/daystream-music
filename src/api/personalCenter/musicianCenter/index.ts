import request from '@/utils/request'

// 获取四位音乐人
export const getFourMusician = () => {
  return request('/getFourMusician', 'GET', undefined, {
    showLoading: true,
    noToken: false,
  })
}

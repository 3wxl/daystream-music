import request from '@/utils/request'
// 获取用户信息
export const getUserInfo = () => {
  return request('/userbase/getUserInfo', 'get')
}

// 获取首页推荐音乐
export const getRecommendMusic = () => {
  return request('/user/recommend', 'get')
}
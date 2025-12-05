import request from '@/utils/request'

export const getRecommendMusic = () => {
  return request(
    '/user/recommend',
    'get'
  )
}
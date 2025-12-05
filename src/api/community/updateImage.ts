// 获取动态列表，展示在/community/CommunityDisplay页
import request from '@/utils/request'

export function updateImage(submitData:{"file":FormData}) {
  return request(
    '/community/updateImage',
    'post',
    submitData
  )
}

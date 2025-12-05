// 获取动态列表，展示在/community/CommunityDisplay页
import request from '@/utils/request'

export function DeleteImage(fileUrl:string) {
  return request(
    `/community/deleteImage?fileUrl=${fileUrl}`,
    'delete',
  )
}

// 图片操作
import request from '@/utils/request'

//图片上传
export function updateImage(submitData:{"file":FormData}) {
  return request(
    '/community/updateImage',
    'post',
    submitData
  )
}
// 删除图片
export function DeleteImage(fileUrl:string) {
  return request(
    `/community/deleteImage?fileUrl=${fileUrl}`,
    'delete',
  )
}

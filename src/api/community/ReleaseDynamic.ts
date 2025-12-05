// 获取动态列表，展示在/community/CommunityDisplay页
import request from '@/utils/request'

export function ReleaseDynamic(data:{title:string,content:string,images?:string[]}) {
  return request(
    `/community/postSocialUpdate`,
    'post',
    data
  )
}

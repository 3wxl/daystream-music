// 获取动态列表，展示在/community/CommunityDisplay页
import request from '@/utils/request'

export function GetDynamicDetail(postId:string) {
  return request(
    `/community/getDetailPost`,
    'get',
    {postId}
  )
}

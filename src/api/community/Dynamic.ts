// 动态相关的api
import request from '@/utils/request'

// 获取动态列表，展示在/community/CommunityDisplay页
export function GetDynamicDetail(postId:string) {
  return request(
    `/community/getDetailPost`,
    'get',
    {postId}
  )
}

// 获取动态列表
export function getDynamicList(submitData:{"userId"?:number,"keyWord"?:string,"lastId"?:string,"pageSize":number}) {
  return request(
    '/community/getAllPost',
    'post',
    submitData
  )
}

// 发布动态
export function ReleaseDynamic(data:{targetId:string,targetType:number,content:string}) {
  return request(
    `/comment/releaseComment`,
    'post',
    data
  )
}

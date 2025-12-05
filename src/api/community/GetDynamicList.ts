// 获取动态列表，展示在/community/CommunityDisplay页
import request from '@/utils/request'

export function getDynamicList(submitData:{"userId"?:number,"keyWord"?:string,"lastId"?:string,"pageSize":number}) {
  return request(
    '/community/getAllPost',
    'post',
    submitData
  )
}

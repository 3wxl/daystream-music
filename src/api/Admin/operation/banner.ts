// banner首页轮播图api

import request from "@/utils/request";

// 获取轮播图列表
export function GetBannerListAPI(page:number,pageSize:number) {
  return request(
    `/operations/banner/list?page=${page}&pageSize=${pageSize}`,
    'get'
  )
}

// 添加轮播图
export function AddBannerAPI(data:any) {
  return request(
    '/operations/banner',
    'post',
    data
  )
}

// banner首页轮播图api

import request from "@/utils/request";
import { fa } from "element-plus/es/locale/index.mjs";

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

// 搜索获取轮播图列表
export function SearchBannerListAPI(page:number,pageSize:number,keyword?:string) {
  return request(
    `/operations/banner/search?page=${page}&pageSize=${pageSize}&keyword=${keyword}`,
    'get'
  )
}

// 删除轮播图
export function DeleteBannerAPI(id:number) {
  return request(
    `/operations/banner/${id}`,
    'delete'
  )
}

// 批量删除轮播图
export function BatchDeleteBannerAPI(array:number[]) {
  return request(
    `/operations/banner/batch`,
    'delete',
    [...array] ,
    { isParams: false }
  )
}

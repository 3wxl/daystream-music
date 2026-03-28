import request from "@/utils/request";

export interface Banner {
  id: number;
  title: string;
  imageUrl: string;
  linkUrl: string;
  sortOrder: number;
  status: number;
  actionType: string;
  targetId: number | string;
  createTime: string;
  updateTime: string;
}

export interface BannerList {
  records: Banner[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

// 获取轮播图列表
export function getBannerList(page: number, pageSize: number) {
  return request<BannerList>(
    `/operations/banner/list?page=${page}&pageSize=${pageSize}`,
    'get'
  );
}

// 获取轮播图详情
export function getBannerDetail(id: number | string) {
  return request<Banner>(
    `/operations/banner/${id}`,
    'get'
  );
}

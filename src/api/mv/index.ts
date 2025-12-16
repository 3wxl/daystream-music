import request from '@/utils/request'

// 热门MV
export function getHotMv(pageSize: string, pageNum: string) {
  return request('/mv/hot', 'get', {
    pageSize,
    pageNum,
  })
}

// 最新MV
export function getNewMv(pageSize: string, pageNum: string) {
  return request('/mv/new', 'get', {
    pageSize,
    pageNum,
  })
}

// VIP专属MV
export function getVipMv(pageSize: string, pageNum: string) {
  return request('/mv/vip', 'get', {
    pageSize,
    pageNum,
  })
}

// MV详情
export function getMvDetail(mvid: string) {
  return request(`/mv/detail/${mvid}`, 'get')
}

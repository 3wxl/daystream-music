import request from '@/utils/request'
import type { PageRespSeckillActivityVO, PageRespOrderDetailVO } from '@/types/vip/vipExchange'

export const buyVip = (packageName: string) => {
  return request('/vip/order/buyVip', 'GET', undefined, {
    params: {
      packageName,
    },
  })
}

// 获取所有秒杀商品
export const getAllSeckill = (pageNum: number = 1, pageSize: number = 10) => {
  return request<PageRespSeckillActivityVO>('/vip/core/seckill/all', 'GET', undefined, {
    params: {
      pageNum,
      pageSize,
    },
  })
}

// 获取即将开启的秒杀商品
export const getUpcomingSeckill = (pageNum: number = 1, pageSize: number = 10) => {
  return request<PageRespSeckillActivityVO>('/vip/core/seckill/upcoming', 'GET', undefined, {
    params: {
      pageNum,
      pageSize,
    },
  })
}

// 获取正在进行中的秒杀商品
export const getOngoingSeckill = (pageNum: number = 1, pageSize: number = 10) => {
  return request<PageRespSeckillActivityVO>('/vip/core/seckill/ongoing', 'GET', undefined, {
    params: {
      pageNum,
      pageSize,
    },
  })
}

// 秒杀商品购买
export const purchaseSeckill = (seckillActivityId: number) => {
  return request('/seckill/purchase', 'GET', undefined, {
    params: {
      seckillActivityId,
    },
  })
}

// 获取用户历史订单
export const getUserOrderHistory = (pageNum: number = 1, pageSize: number = 10) => {
  return request<PageRespOrderDetailVO>('/vip/order/getUserOrderHistory', 'GET', undefined, {
    params: {
      pageNum,
      pageSize,
    },
  })
}

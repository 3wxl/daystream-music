import request from '@/utils/request'
import type { RankHomeVO } from '@/types/rank'
import type { Data } from '@/utils/request'

// 获取排行榜主页数据
export const getRankHome = async (): Promise<Data<RankHomeVO>> => {
  const response = await request<RankHomeVO>('/rank/home', 'get')
  return response
}

import type { UserInfoVO } from '@/types/personalCenter'
export interface CheckInStatusVO {
  checkedIn: boolean // 注意字段名是 checkedIn，不是 isCheckedIn
  continuousDays: number
  monthCheckInDays: number
  tomorrowSignInReward: number
  currentWaves: number
}

// 移除 Data 类型，直接使用 BaseResponse
export interface BaseResponse<T = any> {
  success: boolean
  errorMsg?: string | null
  data?: T
  total?: number | null
  errCode?: string | null
}
export type Data<T = unknown> = {
  success: boolean
  errorMsg: string | null
  data: T
  total?: number | null
  errCode?: number | null | string
}
// src/types/checkIn/index.ts
export interface VipPrivilege {
  icon: string
  title: string
  description?: string
}

// 后端返回的用户任务状态列表结构
export interface UserTaskVO {
  id: number // 主键ID
  taskId: number // 关联task_config的任务ID
  taskName: string // 任务名称
  taskStatus: number // 任务状态：0=未完成，1=已完成，2=已领奖
  completeTime?: string // 任务完成时间（未完成则为NULL）
  rewardGetTime?: string | null // 奖励领取时间（未领奖则为NULL）
  taskDesc: string // 任务描述
  completeCondition: string // 任务完成条件
  reward: number // 任务音浪奖励
}

// 分页响应结构
export interface PageRespUserTaskVO {
  records: UserTaskVO[] // 数据列表
  total: number // 总记录数
  size: number // 每页显示数量
  current: number // 当前页码
  pages: number // 总页数
}

// 扩展 Task 类型（用于前端展示）
export interface Task {
  id: number
  title: string
  description: string
  icon: string
  reward: number
  completed: boolean
  taskKey: string // 任务唯一标识
  targetPath: string // 跳转路径
  validate?: (userInfo: UserInfoVO) => boolean // 校验任务是否完成的方法
  taskStatus?: number // 后端返回的任务状态
  rewardGetTime?: string | null
  rewardClaimed: boolean
}

export interface CoinRecord {
  id: number // 同样保持为 number 类型
  title: string
  time: string
  amount: number
  type: 'earn' | 'spend'
  icon: string
}

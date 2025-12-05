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
  errorMsg: string
  data: T
  total?: number
  errCode?: number
}
// src/types/checkIn/index.ts
export interface VipPrivilege {
  icon: string
  title: string
  description?: string
}
// src/types/checkIn/index.ts

export interface Task {
  id: number // 改为 number 类型以匹配实际使用
  title: string
  description: string
  icon: string
  reward: number
  completed: boolean
}

export interface CoinRecord {
  id: number // 同样保持为 number 类型
  title: string
  time: string
  amount: number
  type: 'earn' | 'spend'
  icon: string
}

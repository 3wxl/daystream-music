// 用户数据类型
export interface UserData {
  waves: number
  vipLevel: string
  vipDays: number
  username: string
}
export interface BaseFlashSale {
  id: string
  title: string
  subtitle: string // 改为必传，避免undefined
  originalPrice: number
  flashPrice: number
  total: number
  sold: number
  remaining: number
  timeLeft: number
  unit: '音浪' // 固定为字面量类型
}
export interface Countdown {
  days?: string
  hours: string
  minutes: string
  seconds: string
}

// VIP特权类型
export interface VipPrivilege {
  id: number
  icon: string
  title: string
  description: string
}

// VIP套餐选项类型（仅保留音浪兑换）
export interface VipPackageOption {
  type: 'waves' // 移除'money'类型，仅保留音浪兑换
  label: string
  description: string
  price: string // 格式如"180音浪"
  waves: number // 音浪数值
}

// VIP套餐类型
export interface VipPackage {
  id: string
  type: 'BASIC' | 'SECKILL'
  title: string
  description: string
  price: string // 音浪数值字符串（如"180"）
  originalPrice?: string // 原价音浪数值字符串（如"250"）
  unit: '音浪' // 统一为音浪单位
  dailyPrice: string // 日均音浪（如"6.0"）
  discount?: number
  recommended: boolean
  exchangeOptions: VipPackageOption[] // 仅包含音浪兑换选项
  wavesPrice: number // 新增：音浪价格数值（用于计算）
  days: number // 新增：套餐天数（用于计算日均消耗）
}

// 音浪兑换选项类型
export interface ExchangeOption {
  label: string
  value: number
  waves: number
}

export interface ExchangeRecord {
  orderNo: string
  orderType: string
  productName: string
  totalAmount: string
  payAmount: string
  price: string
  quantity: number
  statusDesc: string
  createdTime: string
  effectiveTime: string
  expireTime: string
  payTime: string
}
export type FlashSale = UpcomingFlashSale | OngoingFlashSale

// 后端返回的秒杀活动VO
export interface SeckillActivityVO {
  activityId: number
  activityName: string
  productType: number
  productId: number
  originalPrice: number
  seckillPrice: number
  totalStock: number
  remainingStock: number
  startTime: string
  endTime: string
  status: number
  message: string
  productName?: string // 可选字段，兜底用
}

// 分页响应结构
export interface PageRespSeckillActivityVO {
  records: SeckillActivityVO[]
  total: number
  size: number
  current: number
  pages: number
}

// API响应结构（与request.ts中的Data<T>保持一致）
export interface ApiResponse<T> {
  success: boolean
  errorMsg?: string
  data: T
  total?: number
  errCode?: string
}

// 快捷操作类型
export interface QuickAction {
  id: number
  icon: string
  label: string
  action: string
}

// 优惠券类型（金额统一为音浪）
export interface Coupon {
  id: number
  name: string // 如"新人音浪券"
  amount: number // 音浪数值
  minAmount: number // 最低使用音浪数值
}

// 购买结果类型（仅保留音浪兑换）
export interface PurchaseResult {
  type: 'waves' // 移除'money'类型
  package: VipPackage | null
  waves: number // 音浪消耗数值
  success: boolean
}

// 兑换结果类型
export interface ExchangeResult {
  option: ExchangeOption | undefined
  wavesUsed: number
  daysAdded: number
}

// 事件类型（移除在线支付相关）
export interface SelectPackageEvent {
  pkg: VipPackage
}

export interface SelectOptionEvent {
  pkgId: string
  optionType: 'waves' // 移除'money'类型
}

export interface FlashSaleEvent {
  flash: FlashSale
}

export interface QuickActionEvent {
  action: QuickAction
}

// 订单详情类型
export interface OrderDetailVO {
  orderNo: string
  orderType: string
  productName: string
  totalAmount: string
  payAmount: string
  price: string
  quantity: number
  statusDesc: string
  createdTime: string
  effectiveTime: string
  expireTime: string
  payTime: string
}

// 分页响应结构
export interface PageRespOrderDetailVO {
  records: OrderDetailVO[]
  total: number
  size: number
  current: number
  pages: number
}
export interface OngoingFlashSale extends BaseFlashSale {}

// 3. 即将秒杀：有startTime
export interface UpcomingFlashSale extends BaseFlashSale {
  startTime: string
}

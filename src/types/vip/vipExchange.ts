// 用户数据类型
export interface UserData {
  waves: number
  vipLevel: string
  vipDays: number
  username: string
}

// 倒计时类型
export interface Countdown {
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
  type: 'month' | 'quarter' | 'year' | 'permanent'
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
  id?: string
  date?: string
  status?: 'success' | 'failed'
  type: string
  amount: number
  unit: string
  waves?: number
  price?: string // ✅ 新增这一行允许 price 字段存在
}

// 秒杀活动类型（价格统一为音浪）
export interface FlashSale {
  id: string
  title: string
  subtitle: string
  originalPrice: number // 音浪数值
  flashPrice: number // 音浪数值
  total: number
  sold: number
  remaining: number
  timeLeft: number
  unit: '音浪' // 新增：明确单位为音浪
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

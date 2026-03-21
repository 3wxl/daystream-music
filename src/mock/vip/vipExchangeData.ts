// @/mock/vip/vipExchangeData.ts
import type {
  VipPrivilege,
  FlashSale,
  VipPackage,
  ExchangeOption,
  ExchangeRecord,
  QuickAction,
  Coupon,
} from '@/types/vip/vipExchange'

// VIP特权数据（保持不变）
export const vipPrivileges: VipPrivilege[] = [
  {
    id: 1,
    icon: 'icon-music',
    title: '无损音质',
    description: '享受FLAC无损音质，体验CD级音乐享受',
  },
  {
    id: 2,
    icon: 'icon-download',
    title: '无限下载',
    description: 'VIP歌曲任意下载，随时随地畅听',
  },
  {
    id: 3,
    icon: 'icon-crown',
    title: '专属标识',
    description: '尊贵VIP标识，彰显独特身份',
  },
]

// 秒杀活动数据（保持不变）
export const flashSales: FlashSale[] = [
  {
    id: 'flash1',
    title: '年卡VIP',
    subtitle: '限时秒杀特惠',
    originalPrice: 1980,
    flashPrice: 980,
    total: 100,
    sold: 78,
    remaining: 22,
    timeLeft: 7200,
    unit: '音浪',
    startTime: '2024-01-01T00:00:00',
  },
  {
    id: 'flash2',
    title: '季卡VIP',
    subtitle: '新人专享福利',
    originalPrice: 680,
    flashPrice: 280,
    total: 200,
    sold: 189,
    remaining: 11,
    timeLeft: 3600,
    unit: '音浪',
    startTime: '2024-01-01T00:00:00',
  },
  {
    id: 'flash3',
    title: '月卡VIP',
    subtitle: '新人专享福利',
    originalPrice: 680,
    flashPrice: 280,
    total: 200,
    sold: 189,
    remaining: 11,
    timeLeft: 3600,
    unit: '音浪',
    startTime: '2024-01-01T00:00:00',
  },
]

// 替换为图片对应的VIP套餐数据（所有单位已改为音浪）
export const vipPackages: VipPackage[] = [
  // 对应图片id=1：VIP一个月
  {
    id: '1',
    type: 'BASIC',
    title: 'VIP一个月',
    description: '30天VIP会员服务',
    price: '25',
    originalPrice: '30',
    unit: '音浪', // 已改为音浪
    dailyPrice: (25 / 30).toFixed(2),
    discount: Number(((25 / 30) * 10).toFixed(1)),
    recommended: false,
    wavesPrice: 25, // 同步改为音浪数值
    days: 30,
    exchangeOptions: [
      {
        type: 'waves', // 统一为音浪兑换
        label: '音浪兑换',
        description: '使用账户音浪直接兑换，即时到账',
        price: '25音浪', // 已改为音浪
        waves: 25,
      },
    ],
  },
  // 对应图片id=2：VIP三个月
  {
    id: '2',
    type: 'BASIC',
    title: 'VIP三个月',
    description: '90天VIP会员服务',
    price: '68',
    originalPrice: '80',
    unit: '音浪', // 已改为音浪
    dailyPrice: (68 / 90).toFixed(2),
    discount: Number(((68 / 80) * 10).toFixed(1)),
    recommended: false,
    wavesPrice: 68, // 同步改为音浪数值
    days: 90,
    exchangeOptions: [
      {
        type: 'waves', // 统一为音浪兑换
        label: '音浪兑换',
        description: '使用账户音浪直接兑换，即时到账',
        price: '68音浪', // 已改为音浪
        waves: 68,
      },
    ],
  },
  // 对应图片id=3：VIP一年
  {
    id: '3',
    type: 'BASIC',
    title: 'VIP一年',
    description: '365天VIP会员服务',
    price: '198',
    originalPrice: '240',
    unit: '音浪', // 已改为音浪
    dailyPrice: (198 / 365).toFixed(2),
    discount: Number(((198 / 240) * 10).toFixed(1)),
    recommended: true, // 可设为推荐项
    wavesPrice: 198, // 同步改为音浪数值
    days: 365,
    exchangeOptions: [
      {
        type: 'waves', // 统一为音浪兑换
        label: '音浪兑换',
        description: '使用账户音浪直接兑换，即时到账',
        price: '198音浪', // 已改为音浪
        waves: 198,
      },
    ],
  },
]

// 音浪兑换选项（保持不变）
export const exchangeOptions: ExchangeOption[] = [
  { label: '7天VIP', value: 7, waves: 700 },
  { label: '15天VIP', value: 15, waves: 1350 },
  { label: '30天VIP', value: 30, waves: 2500 },
  { label: '90天VIP', value: 90, waves: 7000 },
  { label: '180天VIP', value: 180, waves: 13000 },
]

// 初始兑换记录（更新为符合ExchangeRecord接口的格式）
export const initialExchangeRecords: ExchangeRecord[] = [
  {
    orderNo: 'ORD202401151430001',
    orderType: '音浪兑换',
    productName: 'VIP一个月',
    totalAmount: '30',
    payAmount: '30',
    price: '2500',
    quantity: 1,
    statusDesc: '已支付',
    createdTime: '2024-01-15T14:30:00',
    effectiveTime: '2024-01-15T14:30:00',
    expireTime: '2025-01-15T14:30:00',
    payTime: '2024-01-15T14:30:00',
  },
  {
    orderNo: 'ORD202401101015001',
    orderType: '音浪兑换',
    productName: 'VIP一年',
    totalAmount: '365',
    payAmount: '365',
    price: '12800',
    quantity: 1,
    statusDesc: '已支付',
    createdTime: '2024-01-10T10:15:00',
    effectiveTime: '2024-01-10T10:15:00',
    expireTime: '2025-01-10T10:15:00',
    payTime: '2024-01-10T10:15:00',
  },
  {
    orderNo: 'ORD202401051645001',
    orderType: '音浪兑换',
    productName: 'VIP七天',
    totalAmount: '7',
    payAmount: '7',
    price: '700',
    quantity: 1,
    statusDesc: '已支付',
    createdTime: '2024-01-05T16:45:00',
    effectiveTime: '2024-01-05T16:45:00',
    expireTime: '2024-01-12T16:45:00',
    payTime: '2024-01-05T16:45:00',
  },
  {
    orderNo: 'ORD202401010900001',
    orderType: '秒杀',
    productName: 'VIP三个月',
    totalAmount: '90',
    payAmount: '90',
    price: '2800',
    quantity: 1,
    statusDesc: '已支付',
    createdTime: '2024-01-01T09:00:00',
    effectiveTime: '2024-01-01T09:00:00',
    expireTime: '2024-04-01T09:00:00',
    payTime: '2024-01-01T09:00:00',
  },
]

// 快捷操作（保持不变）
export const quickActions: QuickAction[] = [
  { id: 1, icon: 'icon-signin', label: '每日签到', action: 'signin' },
  { id: 2, icon: 'icon-task', label: '任务中心', action: 'task' },
  { id: 3, icon: 'icon-waves', label: '音浪商城', action: 'wavesShop' },
  { id: 4, icon: 'icon-help', label: '客服帮助', action: 'help' },
]

// 优惠券（保持不变）
export const coupons: Coupon[] = [
  { id: 1, name: '新人音浪券', amount: 50, minAmount: 200 },
  { id: 2, name: 'VIP专属音浪券', amount: 100, minAmount: 500 },
  { id: 3, name: '节日音浪券', amount: 80, minAmount: 300 },
]

// 导出所有数据
export default {
  vipPrivileges,
  flashSales,
  vipPackages,
  exchangeOptions,
  initialExchangeRecords,
  quickActions,
  coupons,
}

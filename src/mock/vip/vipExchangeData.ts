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

// VIP特权数据
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

// 秒杀活动数据
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
  },
]

// VIP套餐数据
export const vipPackages: VipPackage[] = [
  {
    id: 'month1',
    type: 'month',
    title: '月度VIP',
    description: '30天VIP会员服务',
    price: '180',
    originalPrice: '250',
    unit: '音浪',
    dailyPrice: '6.0',
    discount: 7.2,
    recommended: false,
    wavesPrice: 180,
    days: 30,
    exchangeOptions: [
      {
        type: 'waves',
        label: '音浪兑换',
        description: '使用账户音浪直接兑换，即时到账',
        price: '180音浪',
        waves: 180,
      },
    ],
  },
  {
    id: 'month2',
    type: 'month',
    title: '双月VIP',
    description: '60天VIP会员服务',
    price: '300',
    originalPrice: '500',
    unit: '音浪',
    dailyPrice: '5.0',
    discount: 6,
    recommended: true,
    wavesPrice: 300,
    days: 60,
    exchangeOptions: [
      {
        type: 'waves',
        label: '音浪兑换',
        description: '使用账户音浪直接兑换，即时到账',
        price: '300音浪',
        waves: 300,
      },
    ],
  },
  {
    id: 'quarter1',
    type: 'quarter',
    title: '季度VIP',
    description: '90天VIP会员服务',
    price: '450',
    originalPrice: '750',
    unit: '音浪',
    dailyPrice: '5.0',
    discount: 6,
    recommended: false,
    wavesPrice: 450,
    days: 90,
    exchangeOptions: [
      {
        type: 'waves',
        label: '音浪兑换',
        description: '使用账户音浪直接兑换，即时到账',
        price: '450音浪',
        waves: 450,
      },
    ],
  },
  {
    id: 'year1',
    type: 'year',
    title: '年度VIP',
    description: '365天VIP会员服务',
    price: '1280',
    originalPrice: '1980',
    unit: '音浪',
    dailyPrice: '3.5',
    discount: 6.5,
    recommended: true,
    wavesPrice: 1280,
    days: 365,
    exchangeOptions: [
      {
        type: 'waves',
        label: '音浪兑换',
        description: '使用账户音浪直接兑换，即时到账',
        price: '1280音浪',
        waves: 1280,
      },
    ],
  },
]

// 音浪兑换选项
export const exchangeOptions: ExchangeOption[] = [
  { label: '7天VIP', value: 7, waves: 700 },
  { label: '15天VIP', value: 15, waves: 1350 },
  { label: '30天VIP', value: 30, waves: 2500 },
  { label: '90天VIP', value: 90, waves: 7000 },
  { label: '180天VIP', value: 180, waves: 13000 },
]

// 初始兑换记录
export const initialExchangeRecords: ExchangeRecord[] = [
  {
    id: '1',
    type: '音浪兑换VIP',
    date: '2024-01-15 14:30',
    amount: 30,
    unit: '天',
    waves: 2500,
    status: 'success',
  },
  {
    id: '2',
    type: '音浪兑换年度VIP',
    date: '2024-01-10 10:15',
    amount: 365,
    unit: '天',
    waves: 12800,
    status: 'success',
  },
  {
    id: '3',
    type: '音浪兑换VIP',
    date: '2024-01-05 16:45',
    amount: 7,
    unit: '天',
    waves: 700,
    status: 'success',
  },
  {
    id: '4',
    type: '秒杀季度VIP（音浪兑换）',
    date: '2024-01-01 09:00',
    amount: 90,
    unit: '天',
    waves: 2800,
    status: 'success',
  },
]

// 快捷操作
export const quickActions: QuickAction[] = [
  { id: 1, icon: 'icon-signin', label: '每日签到', action: 'signin' },
  { id: 2, icon: 'icon-task', label: '任务中心', action: 'task' },
  { id: 3, icon: 'icon-waves', label: '音浪商城', action: 'wavesShop' },
  { id: 4, icon: 'icon-help', label: '客服帮助', action: 'help' },
]

// 优惠券
export const coupons: Coupon[] = [
  { id: 1, name: '新人音浪券', amount: 50, minAmount: 200 },
  { id: 2, name: 'VIP专属音浪券', amount: 100, minAmount: 500 },
  { id: 3, name: '节日音浪券', amount: 80, minAmount: 300 },
]

// 如果需要，也可以导出所有数据作为一个对象
export default {
  vipPrivileges,
  flashSales,
  vipPackages,
  exchangeOptions,
  initialExchangeRecords,
  quickActions,
  coupons,
}

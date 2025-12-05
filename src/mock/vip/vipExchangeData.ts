import type {
  VipPrivilege,
  FlashSale,
  VipPackage,
  ExchangeOption,
  ExchangeRecord,
  QuickAction,
  Coupon,
} from '@/types/vip/vipExchange'

// VIP特权数据（保持不变，与组件特权标签对应）
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

// 秒杀活动数据（改为音浪展示，移除人民币符号）
export const flashSales: FlashSale[] = [
  {
    id: 'flash1',
    title: '年卡VIP',
    subtitle: '限时秒杀特惠',
    originalPrice: 1980, // 原198元 → 1980音浪（1元=10音浪）
    flashPrice: 980, // 原98元 → 980音浪
    total: 100,
    sold: 78,
    remaining: 22,
    timeLeft: 7200,
    unit: '音浪', // 新增单位标识
  },
  {
    id: 'flash2',
    title: '季卡VIP',
    subtitle: '新人专享福利',
    originalPrice: 680, // 原68元 → 680音浪
    flashPrice: 280, // 原28元 → 280音浪
    total: 200,
    sold: 189,
    remaining: 11,
    timeLeft: 3600,
    unit: '音浪',
  },
  {
    id: 'flash3', // 修复重复id
    title: '月卡VIP',
    subtitle: '新人专享福利',
    originalPrice: 680, // 原68元 → 680音浪
    flashPrice: 280, // 原28元 → 280音浪
    total: 200,
    sold: 189,
    remaining: 11,
    timeLeft: 3600,
    unit: '音浪',
  },
]

// VIP套餐数据（核心修改：移除在线支付，仅保留音浪兑换，统一格式）
export const vipPackages: VipPackage[] = [
  {
    id: 'month1',
    type: 'month',
    title: '月度VIP',
    description: '30天VIP会员服务',
    price: '180', // 原¥18 → 180音浪（去掉人民币符号）
    originalPrice: '250', // 原¥25 → 250音浪
    unit: '音浪', // 单位改为音浪
    dailyPrice: '6.0', // 原¥0.6 → 6.0音浪/天（去掉人民币符号）
    discount: 7.2,
    recommended: false,
    wavesPrice: 180, // 新增音浪价格字段（用于直接展示）
    days: 30, // 新增天数字段（用于计算日均消耗）
    exchangeOptions: [
      // 仅保留音浪兑换选项
      {
        type: 'waves',
        label: '音浪兑换',
        description: '使用账户音浪直接兑换，即时到账',
        price: '180音浪', // 完整价格展示
        waves: 180, // 音浪数值
      },
    ],
  },
  {
    id: 'month2',
    type: 'month',
    title: '双月VIP',
    description: '60天VIP会员服务',
    price: '300', // 原¥30 → 300音浪
    originalPrice: '500', // 原¥50 → 500音浪
    unit: '音浪',
    dailyPrice: '5.0', // 原¥0.5 → 5.0音浪/天
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
    price: '450', // 原¥45 → 450音浪
    originalPrice: '750', // 原¥75 → 750音浪
    unit: '音浪',
    dailyPrice: '5.0', // 原¥0.5 → 5.0音浪/天
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
    price: '1280', // 原¥128 → 1280音浪
    originalPrice: '1980', // 原¥198 → 1980音浪
    unit: '音浪',
    dailyPrice: '3.5', // 原¥0.35 → 3.5音浪/天
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

// 音浪兑换选项（保持不变，与快速兑换组件对应）
export const exchangeOptions: ExchangeOption[] = [
  { label: '7天VIP', value: 7, waves: 700 },
  { label: '15天VIP', value: 15, waves: 1350 },
  { label: '30天VIP', value: 30, waves: 2500 },
  { label: '90天VIP', value: 90, waves: 7000 },
  { label: '180天VIP', value: 180, waves: 13000 },
]

// 初始兑换记录（统一音浪展示，移除在线支付相关记录）
export const initialExchangeRecords: ExchangeRecord[] = [
  {
    id: 1,
    type: '音浪兑换VIP',
    date: '2024-01-15 14:30',
    amount: 30,
    unit: '天',
    waves: 2500,
    status: 'success',
  },
  {
    id: 2,
    type: '音浪兑换年度VIP', // 修改类型描述
    date: '2024-01-10 10:15',
    amount: 365,
    unit: '天',
    waves: 12800, // 改为音浪数值
    status: 'success',
  },
  {
    id: 3,
    type: '音浪兑换VIP',
    date: '2024-01-05 16:45',
    amount: 7,
    unit: '天',
    waves: 700,
    status: 'success',
  },
  {
    id: 4,
    type: '秒杀季度VIP（音浪兑换）', // 修改类型描述
    date: '2024-01-01 09:00',
    amount: 90,
    unit: '天',
    waves: 2800, // 改为音浪数值
    status: 'success',
  },
]

// 快捷操作（保持不变）
export const quickActions: QuickAction[] = [
  { id: 1, icon: 'icon-signin', label: '每日签到', action: 'signin' },
  { id: 2, icon: 'icon-task', label: '任务中心', action: 'task' },
  { id: 3, icon: 'icon-waves', label: '音浪商城', action: 'wavesShop' },
  { id: 4, icon: 'icon-help', label: '客服帮助', action: 'help' },
]

// 优惠券（修改为音浪优惠券，适配音浪支付场景）
export const coupons: Coupon[] = [
  { id: 1, name: '新人音浪券', amount: 50, minAmount: 200 }, // 5元→50音浪，20元→200音浪
  { id: 2, name: 'VIP专属音浪券', amount: 100, minAmount: 500 }, // 10元→100音浪，50元→500音浪
  { id: 3, name: '节日音浪券', amount: 80, minAmount: 300 }, // 8元→80音浪，30元→300音浪
]

// 修正导入顺序 + 补全缺失依赖
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import type { Ref } from 'vue'
import { ElMessage } from 'element-plus'
import {
  buyVip,
  getAllSeckill,
  getUpcomingSeckill,
  getOngoingSeckill,
  purchaseSeckill,
  getUserOrderHistory,
} from '@/api/vip'
import { getUserInfo } from '@/api/personalCenter'
import { useCheckInStore } from '@/stores/checkIn'
import { useFlashSaleReminderStore } from '@/stores/flashSaleReminder'
import type {
  VipPackage,
  PurchaseResult,
  ExchangeOption,
  UserData,
  ExchangeResult,
  FlashSale,
  ExchangeRecord,
  Countdown,
} from '@/types/vip/vipExchange'

// ========== 类型补充（适配后端返回结构） ==========
// 扩展UserInfo类型（匹配后端返回）
import type { UserInfoVO } from '@/types/personalCenter'

interface ApiUserInfo extends UserInfoVO {
  avatar: string
  backgroundImage: string
  createdTime: string
  email: string
  fansCount: number
  followCount: number
  gender: string
  id: number
  introduction: string
  isVip: boolean
  lastCheckinTime: string
  lastLoginTime: string
  likeCount: number
  likePlaylistId: string
  onlineStatus: number
  phone: string
  totalPoint: number // 积分（可映射为音浪）
  updatedTime: string
  userRole: string
  username: string
  vipExpireTime: string // VIP过期时间
  walletBalance: number // 钱包余额
}

// 秒杀活动类型定义
interface BaseFlashSale {
  id: string
  title: string
  subtitle: string
  originalPrice: number
  flashPrice: number
  total: number
  sold: number
  remaining: number
  timeLeft: number
  unit: string
}

interface OngoingFlashSale extends BaseFlashSale {}

interface UpcomingFlashSale extends BaseFlashSale {
  startTime: string // 即将开始的秒杀活动才有此字段
}

// ========== 1. 倒计时逻辑（无调整） ==========
export function useCountdown() {
  const countdown = ref('00:00:00')
  let timer: number | null | ReturnType<typeof setInterval> = null

  const formatCountdown = (seconds: number) => {
    if (seconds <= 0) return '00:00:00'
    const h = Math.floor(seconds / 3600)
      .toString()
      .padStart(2, '0')
    const m = Math.floor((seconds % 3600) / 60)
      .toString()
      .padStart(2, '0')
    const s = (seconds % 60).toString().padStart(2, '0')
    return `${h}:${m}:${s}`
  }

  const initCountdown = (remainingSeconds = 7200) => {
    if (timer) clearInterval(timer as number)
    countdown.value = formatCountdown(remainingSeconds)
    timer = setInterval(() => {
      remainingSeconds -= 1
      countdown.value = formatCountdown(remainingSeconds)
      if (remainingSeconds <= 0 && timer) {
        clearInterval(timer as number)
        timer = null
      }
    }, 1000)
  }

  onUnmounted(() => {
    if (timer) clearInterval(timer as number)
  })

  initCountdown()

  return {
    countdown,
    initCountdown,
  }
}

// ========== 2. 用户数据逻辑（核心修复Pinia使用方式） ==========
export function useUserData() {
  // 实例化签到Store（关键修复：必须调用useCheckInStore()获取实例）
  const checkInStore = useCheckInStore()

  // 初始状态（匹配后端字段）
  const userInfo = ref<ApiUserInfo>({
    avatar: '',
    backgroundImage: '',
    createdTime: '',
    email: '',
    fansCount: 0,
    followCount: 0,
    gender: '',
    id: 0,
    introduction: '',
    isVip: false,
    lastCheckinTime: '',
    lastLoginTime: '',
    likeCount: 0,
    likePlaylistId: '',
    onlineStatus: 0,
    phone: '',
    totalPoint: 0, // 积分（音浪）
    updatedTime: '',
    userRole: '普通用户',
    username: '游客',
    vipExpireTime: '',
    walletBalance: 0,
  })

  // 加载并同步用户信息（适配后端返回结构）
  const loadUserInfo = async () => {
    try {
      const userRes = await getUserInfo()
      console.log('用户信息接口返回数据:', userRes)
      if (userRes && userRes.success && userRes.data) {
        const data = userRes.data
        userInfo.value = {
          ...userInfo.value,
          ...data,
          id: Number(data.id), // 修复 bigint -> number 类型不匹配问题
          // 确保totalPoint为数字类型
          totalPoint: typeof data.totalPoint === 'number' ? data.totalPoint : 0,
        }
        console.log('更新后的用户信息:', userInfo.value.walletBalance)
        // 同步用户信息到签到store
        if (typeof data.totalPoint === 'number') {
          checkInStore.currentWaves = data.totalPoint
        } else {
          console.warn('totalPoint is not a valid number:', data.totalPoint)
          checkInStore.currentWaves = 0 // 设置默认值
        }
      }
    } catch (error) {
      console.error('加载用户信息失败:', error)
      ElMessage.error('加载用户信息失败')
    }
  }

  // 计算VIP剩余天数（核心适配）
  const getVipRemainingDays = (): number => {
    if (!userInfo.value.isVip || !userInfo.value.vipExpireTime) return 0
    const expireTime = new Date(userInfo.value.vipExpireTime).getTime()
    const now = new Date().getTime()
    const diffDays = Math.ceil((expireTime - now) / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays : 0
  }

  // 响应式用户数据（整合后端+签到store）
  const userData = computed(() => ({
    // 基础信息
    username: userInfo.value.username,
    avatar: userInfo.value.avatar,
    userRole: userInfo.value.userRole,
    // VIP相关
    isVip: userInfo.value.isVip,
    vipRemainingDays: getVipRemainingDays(),
    vipExpireTime: userInfo.value.vipExpireTime,
    // 资产相关（音浪=积分，钱包余额单独存储）
    waves: userInfo.value.totalPoint, // 音浪映射totalPoint
    walletBalance: userInfo.value.walletBalance,
    // 签到相关（从签到store同步 - 修复：使用实例化的store）
    currentWaves: checkInStore.currentWaves || userInfo.value.totalPoint,
    continuousDays: checkInStore.continuousDays || 0,
    isCheckedIn: checkInStore.isCheckedIn || false,
    tomorrowSignInReward: checkInStore.tomorrowSignInReward || 0,
    monthCheckInDays: checkInStore.monthCheckInDays || 0,
  }))

  // 更新音浪数（同步到本地+签到store+后端，需补充更新接口）
  const updateWaves = async (delta: number) => {
    try {
      // 本地更新
      userInfo.value.totalPoint += delta
      if (userInfo.value.totalPoint < 0) userInfo.value.totalPoint = 0
      // 同步到签到store - 修复：使用实例化的store
      checkInStore.currentWaves = userInfo.value.totalPoint

      // 补充：调用后端更新积分接口（需新增API）
      // const res = await updateUserPoint({ point: userInfo.value.totalPoint })
      // if (!res.success) {
      //   ElMessage.error('更新音浪失败')
      //   // 回滚
      //   userInfo.value.totalPoint -= delta
      //   checkInStore.currentWaves = userInfo.value.totalPoint
      // }
    } catch (error) {
      console.error('更新音浪失败:', error)
      ElMessage.error('更新音浪失败')
    }
  }

  // 更新VIP状态（同步过期时间）
  const updateVipStatus = (isVip: boolean, expireTime: string) => {
    userInfo.value.isVip = isVip
    userInfo.value.vipExpireTime = expireTime
    // VIP状态信息已更新到userInfo中，无需同步到checkInStore
  }

  return {
    userInfo, // 原始后端数据
    userData, // 整合后的响应式数据
    loadUserInfo, // 加载用户信息方法
    updateWaves, // 更新音浪方法
    updateVipStatus, // 更新VIP状态方法
    getVipRemainingDays, // 获取VIP剩余天数方法
  }
}

// 修改 useVipPackages 函数中的 selectedPackageType 类型定义：
export function useVipPackages(initialPackages: VipPackage[]) {
  // 将类型改为与 pkg.type 兼容（假设 pkg.type 是 'BASIC' | 'SECKILL'）
  const selectedPackageType = ref<'BASIC' | 'SECKILL'>('BASIC')

  const selectedPackage = ref<string>('')
  const selectedOption = ref<Record<string, 'waves'>>({})

  const filteredPackages = computed(() => {
    return initialPackages.filter((pkg) => pkg.type === selectedPackageType.value)
  })

  const selectPackageHook = (pkg: VipPackage) => {
    selectedPackage.value = pkg.id
  }

  const selectOptionHook = (pkgId: string, optionType: 'waves') => {
    selectedOption.value[pkgId] = optionType
  }

  return {
    selectedPackageType,
    selectedPackage,
    selectedOption,
    filteredPackages,
    selectPackageHook,
    selectOptionHook,
  }
}

// ========== 4. 兑换记录逻辑 ==========
export function useExchangeRecords(initialRecords: ExchangeRecord[]) {
  const exchangeRecords = ref<ExchangeRecord[]>(initialRecords)
  const loading = ref(false)
  const currentPage = ref(1)
  const pageSize = ref(10)
  const total = ref(0)
  const hasMore = ref(true)

  const addRecord = (
    record: Omit<
      ExchangeRecord,
      'orderNo' | 'createdTime' | 'statusDesc' | 'effectiveTime' | 'expireTime' | 'payTime'
    >,
  ) => {
    const now = new Date()
    const orderNo = `temp_${now.getTime()}`
    exchangeRecords.value.unshift({
      orderNo,
      createdTime: now.toISOString(),
      effectiveTime: now.toISOString(),
      expireTime: now.toISOString(),
      payTime: now.toISOString(),
      statusDesc: '已支付',
      ...record,
    })
  }

  const updateRecordStatus = (orderNo: string, statusDesc: string) => {
    const index = exchangeRecords.value.findIndex((r) => r.orderNo === orderNo)
    if (index > -1 && exchangeRecords.value[index]) {
      exchangeRecords.value[index].statusDesc = statusDesc
    }
  }

  // 从API获取历史订单
  const fetchOrderHistory = async (page: number = 1, loadMore: boolean = false) => {
    if (loading.value) return

    loading.value = true

    try {
      const response = await getUserOrderHistory(page, pageSize.value)
      console.log('订单历史数据:', response)
      if (response.success && response.data) {
        // 后端返回的数据已经符合ExchangeRecord接口格式
        const orderRecords: ExchangeRecord[] = response.data.records || []

        // 更新记录
        if (loadMore) {
          exchangeRecords.value = [...exchangeRecords.value, ...orderRecords]
        } else {
          exchangeRecords.value = orderRecords
        }

        // 更新分页信息
        total.value = response.data.total || 0
        currentPage.value = response.data.current || page
        hasMore.value = currentPage.value * pageSize.value < total.value
      } else {
        console.error('获取历史订单失败:', response.errorMsg)
      }
    } catch (error) {
      console.error('获取历史订单时发生错误:', error)
    } finally {
      loading.value = false
    }
  }

  // 加载更多订单
  const loadMoreOrders = () => {
    if (!hasMore.value || loading.value) return
    fetchOrderHistory(currentPage.value + 1, true)
  }

  // 刷新订单列表
  const refreshOrders = () => {
    fetchOrderHistory(1, false)
  }

  // 页面加载时自动获取历史订单
  onMounted(() => {
    fetchOrderHistory()
  })

  return {
    exchangeRecords,
    loading,
    hasMore,
    addRecord,
    updateRecordStatus,
    loadMoreOrders,
    refreshOrders,
  }
}

// ========== 5. 秒杀活动逻辑（适配后端接口） ==========
export function useFlashSales() {
  const ongoingSales = ref<OngoingFlashSale[]>([])
  const upcomingSales = ref<UpcomingFlashSale[]>([])
  const loading = ref(false)
  //正在秒杀
  const ongoingCurrentPage = ref(1)
  const ongoingPageSize = ref(10)
  const ongoingTotal = ref(0)
  const ongoingTotalPages = ref(0)
  const ongoingLoading = ref(false)
  //即将秒杀
  const upcomingCurrentPage = ref(1)
  const upcomingPageSize = ref(10)
  const upcomingTotal = ref(0)
  const upcomingTotalPages = ref(0)
  const upcomingLoading = ref(false)

  // 倒计时数据
  const countdown = ref<Countdown>({
    hours: '00',
    minutes: '00',
    seconds: '00',
  })

  // 即将秒杀的倒计时数据
  const upcomingCountdown = ref<Countdown>({
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00',
  })

  // 倒计时定时器
  let countdownTimer: number | null = null
  let upcomingCountdownTimer: number | null = null

  // 导入提醒store
  const reminderStore = useFlashSaleReminderStore()
  // 确保reminderStore存在且方法可用
  if (!reminderStore || typeof reminderStore.isReminded !== 'function') {
    console.error('reminderStore初始化失败或缺少必要方法')
  }

  // 更新倒计时（正在秒杀）
  const updateCountdown = () => {
    const now = new Date()
    let hasExpired = false

    // 更新每个正在进行的秒杀商品的剩余时间
    ongoingSales.value = ongoingSales.value.map((sale) => {
      const endTime = new Date(now.getTime() + sale.timeLeft * 1000)
      const newTimeLeft = Math.max(0, Math.floor((endTime.getTime() - now.getTime()) / 1000))

      // 检查是否有活动过期
      if (sale.timeLeft > 0 && newTimeLeft === 0) {
        hasExpired = true
      }

      return {
        ...sale,
        timeLeft: newTimeLeft,
      }
    })

    // 计算整体倒计时（取最近结束的活动时间）
    if (ongoingSales.value.length > 0) {
      const nearestEndTime = Math.min(...ongoingSales.value.map((sale) => sale.timeLeft))
      const hours = Math.floor(nearestEndTime / 3600)
        .toString()
        .padStart(2, '0')
      const minutes = Math.floor((nearestEndTime % 3600) / 60)
        .toString()
        .padStart(2, '0')
      const seconds = Math.floor(nearestEndTime % 60)
        .toString()
        .padStart(2, '0')

      countdown.value = {
        hours,
        minutes,
        seconds,
      }
    }

    // 如果有活动过期，刷新正在进行的秒杀活动
    if (hasExpired) {
      fetchOngoingSeckill()
    }
  }

  // 更新即将秒杀的倒计时
  const updateUpcomingCountdown = () => {
    // 如果有即将开始的秒杀商品，计算距离第一个开始的时间
    if (upcomingSales.value.length > 0) {
      let hasStarted = false
      const startedSales: string[] = []

      // 更新每个即将开始的秒杀商品的剩余时间
      upcomingSales.value = upcomingSales.value.map((sale) => {
        const now = new Date()
        const actualStartTime = new Date(sale.startTime) // 使用活动的实际开始时间
        const newTimeLeft = Math.max(
          0,
          Math.floor((actualStartTime.getTime() - now.getTime()) / 1000),
        )
        // 检查是否有活动开始
        if (sale.timeLeft > 0 && newTimeLeft === 0) {
          hasStarted = true
          startedSales.push(sale.id)
        }

        return {
          ...sale,
          timeLeft: newTimeLeft,
        }
      })

      // 检查已开始的活动是否有设置提醒（现由全局提醒store处理）
      // 这里保持原有逻辑作为备用，确保用户在当前页面时仍能收到通知
      startedSales.forEach((id) => {
        if (reminderStore.isReminded(id)) {
          ElMessage({
            type: 'success',
            message: `您关注的秒杀活动 "${upcomingSales.value.find((s) => s.id === id)?.title}" 已经开始啦！`,
            duration: 5000,
            grouping: true,
          })
          // 活动开始后移除提醒
          reminderStore.removeReminder(id)
        }
      })

      // 找到最早开始的秒杀商品
      if (upcomingSales.value.length === 0) return
      const earliestSale = upcomingSales.value.reduce((prev, current) => {
        return new Date(prev.timeLeft * 1000 + Date.now()) <
          new Date(current.timeLeft * 1000 + Date.now())
          ? prev
          : current
      })

      const now = new Date().getTime()
      const startTime = new Date(now + earliestSale.timeLeft * 1000).getTime()
      const timeLeft = Math.max(0, Math.floor((startTime - now) / 1000))

      const days = Math.floor(timeLeft / (3600 * 24))
        .toString()
        .padStart(2, '0')
      const hours = Math.floor((timeLeft % (3600 * 24)) / 3600)
        .toString()
        .padStart(2, '0')
      const minutes = Math.floor((timeLeft % 3600) / 60)
        .toString()
        .padStart(2, '0')
      const seconds = Math.floor(timeLeft % 60)
        .toString()
        .padStart(2, '0')
      upcomingCountdown.value = {
        days,
        hours,
        minutes,
        seconds,
      }

      // 如果有活动开始，刷新正在进行和即将开始的秒杀活动
      if (hasStarted) {
        console.log('有活动开始', startedSales)
        setTimeout(() => {
          fetchOngoingSeckill()
          fetchUpcomingSeckill()
        }, 1000)
      }
    }
  }

  // 开始倒计时
  const startCountdown = () => {
    // 先停止已有定时器，确保每次都能正确启动
    stopCountdown()

    updateCountdown()
    countdownTimer = window.setInterval(updateCountdown, 1000)
  }

  // 开始即将秒杀的倒计时
  const startUpcomingCountdown = () => {
    // 先停止已有定时器，确保每次都能正确启动
    stopUpcomingCountdown()

    updateUpcomingCountdown()
    upcomingCountdownTimer = window.setInterval(updateUpcomingCountdown, 1000)
  }

  // 停止倒计时
  const stopCountdown = () => {
    if (countdownTimer) {
      clearInterval(countdownTimer)
      countdownTimer = null
    }
  }

  // 停止即将秒杀的倒计时
  const stopUpcomingCountdown = () => {
    if (upcomingCountdownTimer) {
      clearInterval(upcomingCountdownTimer)
      upcomingCountdownTimer = null
    }
  }

  // 移除组件挂载时的自动启动，避免与页面onMounted中的数据加载冲突
  // 倒计时将在数据加载完成后由fetchOngoingSeckill/fetchUpcomingSeckill启动

  // 组件卸载时停止倒计时
  onUnmounted(() => {
    stopCountdown()
    stopUpcomingCountdown()
  })

  // 从后端API获取正在进行中的秒杀商品
  const fetchOngoingSeckill = async (page?: number) => {
    const targetPage = page || 1
    // 避免重复加载
    if (ongoingLoading.value || (page && targetPage > ongoingTotalPages.value)) return
    console.log(page)
    try {
      ongoingLoading.value = true
      const response = await getOngoingSeckill(targetPage, ongoingPageSize.value)
      console.log('正在秒杀的商品', response)
      if (response && response.success && response.data) {
        const { records, total: totalCount, pages } = response.data
        // 如果是第一页或未提供页码，则替换数据，否则追加数据
        const mappedOngoingRecords = records.map((record) => ({
          id: record.activityId.toString(),
          title: record.activityName || '', // 兜底空字符串
          subtitle: record.message || '', // 兜底空字符串，避免undefined
          originalPrice: record.originalPrice,
          flashPrice: record.seckillPrice,
          total: record.totalStock,
          sold: record.totalStock - record.remainingStock,
          remaining: record.remainingStock,
          timeLeft: calculateTimeLeft(record.startTime, record.endTime, record.status),
          unit: '音浪' as const, // 明确指定为字面量类型
        }))
        if (targetPage === 1) {
          ongoingSales.value = mappedOngoingRecords // 第一页直接替换
        } else {
          // 过滤重复数据（根据id去重）
          const newRecords = mappedOngoingRecords.filter(
            (item) => !ongoingSales.value.some((exist) => exist.id === item.id),
          )
          ongoingSales.value = [...ongoingSales.value, ...newRecords] // 追加新数据
        }
        ongoingTotal.value = totalCount
        ongoingTotalPages.value = pages
        ongoingCurrentPage.value = targetPage

        // 开始倒计时
        startCountdown()
        ongoingLoading.value = false
      } else {
        ElMessage.error(response?.errorMsg || '获取正在进行中的秒杀商品失败')
      }
    } catch (error) {
      console.error('获取正在进行中的秒杀商品失败:', error)
      ElMessage.error('网络异常，获取正在进行中的秒杀商品失败')
    } finally {
      loading.value = false
    }
  }

  // 从后端API获取即将开启的秒杀商品
  const fetchUpcomingSeckill = async (page?: number) => {
    const targetPage = page || 1
    if (upcomingLoading.value || (page && targetPage > upcomingTotalPages.value)) return

    try {
      upcomingLoading.value = true
      const response = await getUpcomingSeckill(targetPage, upcomingPageSize.value)
      console.log('即将开启的秒杀商品列表:', response)

      if (response && response.success && response.data) {
        const { records, total: totalCount, pages } = response.data
        const mappedUpcomingRecords = records.map((record) => ({
          id: record.activityId.toString(),
          title: record.activityName || '',
          subtitle: record.message || '', // 兜底空字符串
          originalPrice: record.originalPrice,
          flashPrice: record.seckillPrice,
          total: record.totalStock,
          sold: record.totalStock - record.remainingStock,
          remaining: record.remainingStock,
          timeLeft: calculateTimeLeft(record.startTime, record.endTime, record.status),
          startTime: record.startTime, // 必传字段
          unit: '音浪' as const, // 固定类型
        }))

        // 分页加载逻辑（同正在秒杀）
        if (targetPage === 1) {
          upcomingSales.value = mappedUpcomingRecords
        } else {
          const newRecords = mappedUpcomingRecords.filter(
            (item) => !upcomingSales.value.some((exist) => exist.id === item.id),
          )
          upcomingSales.value = [...upcomingSales.value, ...newRecords]
        }

        // 更新分页状态
        upcomingTotal.value = totalCount
        upcomingTotalPages.value = pages
        upcomingCurrentPage.value = targetPage

        // 启动倒计时
        startUpcomingCountdown()
      } else {
        ElMessage.error(response?.errorMsg || '获取即将开启的秒杀商品失败')
      }
    } catch (error) {
      console.error('获取即将开启的秒杀商品失败:', error)
      ElMessage.error('网络异常，获取即将开启的秒杀商品失败')
    } finally {
      upcomingLoading.value = false
    }
  }

  // 计算剩余时间
  const calculateTimeLeft = (startTime: string, endTime: string, status: number): number => {
    const now = new Date().getTime()
    let targetTime: number

    try {
      if (status === 0) {
        // 未开始，计算距离开始的时间
        targetTime = new Date(startTime).getTime()
      } else {
        // 进行中或已结束，计算距离结束的时间
        targetTime = new Date(endTime).getTime()
      }

      return Math.max(0, Math.floor((targetTime - now) / 1000))
    } catch (error) {
      console.error('计算时间失败:', error, startTime, endTime)
      return 0
    }
  }

  const handleFlashSaleHook = async (flashId: string, userWaves: number) => {
    try {
      // 查找秒杀活动（同时检查进行中和即将开始的）
      let flash =
        ongoingSales.value.find((s) => s.id === flashId) ||
        upcomingSales.value.find((s) => s.id === flashId)
      if (!flash) {
        ElMessage.error('秒杀活动不存在')
        return false
      }
      if (flash.remaining <= 0) {
        ElMessage.error('秒杀库存不足')
        return false
      }
      if (userWaves < (flash.flashPrice as number)) {
        // 增加类型断言
        // 校验音浪
        console.log('用户音浪:', userWaves, '秒杀价格:', flash.flashPrice)
        ElMessage.error('音浪不足，无法参与秒杀')
        return false
      }
      console.log(parseInt(flashId))
      // 调用真实的秒杀接口
      const res = await purchaseSeckill(parseInt(flashId))
      console.log('秒杀接口响应:', res)
      if (!res.success) {
        ElMessage.error(res.errorMsg || '秒杀失败')
        return false
      }

      // 更新本地库存和已售数量
      flash.sold += 1
      flash.remaining -= 1

      ElMessage.success('秒杀成功')
      return true
    } catch (error) {
      console.error('秒杀失败:', error)
      // 不再显示重复的错误提示，因为request.ts已经处理了后端返回的错误信息
      return false
    }
  }

  // 设置提醒
  const setReminder = (sale: UpcomingFlashSale) => {
    reminderStore.setReminder(sale.id, sale.title)
  }

  // 检查是否已设置提醒
  const isReminded = (id: string) => {
    return reminderStore.isReminded(id)
  }

  return {
    ongoingSales,
    flashSales: ongoingSales,
    upcomingSales,
    ongoingCurrentPage,
    ongoingPageSize,
    ongoingTotal,
    ongoingTotalPages,
    ongoingLoading,
    // 分页状态（即将秒杀）
    upcomingCurrentPage,
    upcomingPageSize,
    upcomingTotal,
    upcomingTotalPages,
    upcomingLoading,
    countdown,
    countdownData: countdown,
    upcomingCountdown,
    fetchOngoingSeckill,
    fetchUpcomingSeckill,
    handleFlashSale: handleFlashSaleHook,
    startCountdown,
    stopCountdown,
    startUpcomingCountdown,
    stopUpcomingCountdown,
    setReminder,
    isReminded,
  }
}

// ========== 6. 购买确认逻辑（适配VIP过期时间） ==========
export function usePurchase() {
  const showConfirmDialog = ref(false)
  const selectedVipPackage = ref<VipPackage | null>(null)
  const selectedOptionType = ref<'waves'>('waves')
  const selectedOptionPrice = ref('')
  const selectedOptionWaves = ref(0)
  const selectedCoupon = ref<number | null>(null)
  const isProcessing = ref(false)

  const openPurchaseDialog = (pkg: VipPackage, optionType: 'waves' = 'waves') => {
    selectedVipPackage.value = pkg
    selectedOptionType.value = optionType

    const waveOption = pkg.exchangeOptions?.find((opt) => opt.type === 'waves')
    if (waveOption) {
      selectedOptionPrice.value = waveOption.price
      selectedOptionWaves.value = waveOption.waves
    } else if (pkg.wavesPrice) {
      selectedOptionPrice.value = `${pkg.wavesPrice}音浪`
      selectedOptionWaves.value = pkg.wavesPrice
    }

    showConfirmDialog.value = true
  }

  const confirmPurchase = async (
    pkg?: VipPackage,
  ): Promise<{ success: boolean; expireTime?: string }> => {
    const targetPkg = pkg || selectedVipPackage.value
    if (!targetPkg) {
      ElMessage.error('请选择VIP套餐')
      return { success: false }
    }

    try {
      isProcessing.value = true
      const packageName = getPackageNameByType(targetPkg)
      const response = await buyVip(packageName)

      if (response.success) {
        isProcessing.value = false
        showConfirmDialog.value = false
        // 返回新的VIP过期时间（后端返回）
        return {
          success: true,
          expireTime: response.data as string,
        }
      } else {
        ElMessage.error(response.errorMsg || '购买失败，请稍后重试')
        isProcessing.value = false
        return { success: false }
      }
    } catch (error: any) {
      console.error('VIP购买失败:', error)
      ElMessage.error(error.message || '网络异常，购买失败')
      isProcessing.value = false
      return { success: false }
    }
  }

  const getPackageNameByType = (pkg: VipPackage): string => {
    switch (pkg.id) {
      case 'month1':
        return '月度VIP'
      case 'month2':
        return '双月VIP'
      case 'quarter1':
        return '季度VIP'
      case 'year1':
        return '年度VIP'
      default:
        return pkg.title || '未知套餐'
    }
  }

  return {
    showConfirmDialog,
    selectedVipPackage,
    selectedOptionType,
    selectedOptionPrice,
    selectedOptionWaves,
    selectedCoupon,
    isProcessing,
    openPurchaseDialog,
    confirmPurchase,
  }
}

// ========== 7. 音浪兑换逻辑（适配后端音浪字段） ==========
export function useWavesExchange(
  exchangeOptions: ExchangeOption[],
  userData: Ref<ReturnType<typeof useUserData>['userData']['value']>,
) {
  const exchangeDuration = ref<number | null>(null)
  const isExchanging = ref(false)

  const selectedExchangeOption = computed(() => {
    return exchangeOptions.find((opt) => opt.value === exchangeDuration.value)
  })

  const requiredWaves = computed(() => {
    return selectedExchangeOption.value?.waves || 0
  })

  const handleExchange = async (updateWaves: (delta: number) => Promise<void>) => {
    if (!selectedExchangeOption.value) {
      ElMessage.error('请选择兑换时长')
      return { option: undefined, wavesUsed: 0, daysAdded: 0 }
    }
    if (userData.value.waves < selectedExchangeOption.value.waves) {
      ElMessage.error('音浪不足，无法兑换')
      return { option: undefined, wavesUsed: 0, daysAdded: 0 }
    }

    try {
      isExchanging.value = true
      const response = await buyVip(`${selectedExchangeOption.value.label}VIP`)
      if (response.success) {
        // 扣减音浪
        await updateWaves(-selectedExchangeOption.value.waves)
        ElMessage.success(`成功兑换${selectedExchangeOption.value.label}！`)

        const result: ExchangeResult = {
          option: selectedExchangeOption.value,
          wavesUsed: selectedExchangeOption.value.waves,
          daysAdded: selectedExchangeOption.value.value,
        }
        isExchanging.value = false
        return result
      } else {
        ElMessage.error(response.errorMsg || '兑换失败')
        isExchanging.value = false
        return { option: undefined, wavesUsed: 0, daysAdded: 0 }
      }
    } catch (error) {
      ElMessage.error('网络异常，兑换失败')
      isExchanging.value = false
      return { option: undefined, wavesUsed: 0, daysAdded: 0 }
    }
  }

  return {
    exchangeDuration,
    requiredWaves,
    isExchanging,
    selectedExchangeOption,
    handleExchange,
  }
}

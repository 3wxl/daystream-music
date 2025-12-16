// @/composables/useVipExchange.ts
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import type { Ref } from 'vue'
import type {
  UserData,
  VipPackage,
  FlashSale,
  ExchangeOption,
  ExchangeRecord,
  PurchaseResult,
  ExchangeResult,
} from '@/types/vip/vipExchange'

// 用户数据管理
export function useUserData() {
  const userData: Ref<UserData> = ref({
    waves: 15000,
    vipLevel: '1',
    vipDays: 15,
    username: '音乐爱好者',
  })

  // 更新音浪
  const updateWaves = (amount: number): void => {
    const newWaves = userData.value.waves + amount
    if (newWaves < 0) {
      ElMessage.error('音浪不足')
      return
    }
    userData.value.waves = newWaves
  }

  // 更新VIP天数
  const updateVipDays = (days: number): void => {
    userData.value.vipDays += days

    // 根据天数更新VIP等级
    const totalDays = userData.value.vipDays
    if (totalDays > 365) {
      userData.value.vipLevel = '3'
    } else if (totalDays > 90) {
      userData.value.vipLevel = '2'
    } else {
      userData.value.vipLevel = '1'
    }
  }

  return {
    userData,
    updateWaves,
    updateVipDays,
  }
}

// 倒计时管理
export function useCountdown() {
  const countdown = ref('')
  let timer: NodeJS.Timeout | null = null

  // 更新倒计时显示
  const updateCountdown = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // 启动倒计时
  const startCountdown = (initialSeconds: number = 86400): void => {
    let seconds = initialSeconds

    const update = () => {
      countdown.value = updateCountdown(seconds)
      seconds--

      if (seconds < 0) {
        if (timer) {
          clearInterval(timer)
          timer = null
        }
        // 重置倒计时
        startCountdown(86400)
      }
    }

    // 立即更新一次
    update()

    // 每秒更新
    timer = setInterval(update, 1000)
  }

  onMounted(() => {
    startCountdown()
  })

  onUnmounted(() => {
    if (timer) {
      clearInterval(timer)
    }
  })

  return {
    countdown,
  }
}

// VIP套餐管理
export function useVipPackages(packages: VipPackage[]) {
  const selectedPackageType = ref<'month' | 'quarter' | 'year' | 'permanent'>('month')
  const selectedPackage: Ref<VipPackage | null> = ref(null)
  const selectedOption = ref<Record<string, 'waves'>>({}) // 只保留音浪选项

  // 过滤套餐
  const filteredPackages = computed(() => {
    return packages.filter((pkg) => pkg.type === selectedPackageType.value)
  })

  // 选择套餐
  const selectPackage = (pkg: VipPackage): void => {
    selectedPackage.value = pkg
    // 默认选择音浪兑换选项
    if (pkg.id) {
      selectedOption.value[pkg.id] = 'waves'
    }
  }

  // 选择兑换选项（只支持音浪）
  const selectOption = (pkgId: string, optionType: 'waves'): void => {
    if (optionType !== 'waves') {
      console.warn('只支持音浪兑换')
      return
    }
    selectedOption.value[pkgId] = 'waves'
  }

  return {
    selectedPackageType,
    selectedPackage,
    selectedOption,
    filteredPackages,
    selectPackage,
    selectOption,
  }
}

// 音浪兑换管理
export function useWavesExchange(exchangeOptions: ExchangeOption[], userData: Ref<UserData>) {
  const exchangeDuration = ref<number | null>(null)
  const isExchanging = ref(false)
  const selectedExchangeOption = ref<ExchangeOption | null>(null)

  // 计算所需音浪
  const requiredWaves = computed(() => {
    if (!exchangeDuration.value) return 0
    const option = exchangeOptions.find((opt) => opt.value === exchangeDuration.value)
    return option ? option.waves : 0
  })

  // 更新兑换时长
  const updateExchangeDuration = (duration: number | null): void => {
    exchangeDuration.value = duration
    selectedExchangeOption.value = exchangeOptions.find((opt) => opt.value === duration) || null
  }

  // 处理音浪兑换
  const handleExchange = async (): Promise<ExchangeResult> => {
    if (!exchangeDuration.value || !selectedExchangeOption.value) {
      throw new Error('请选择兑换时长')
    }

    // 检查音浪是否足够
    if (userData.value.waves < requiredWaves.value) {
      throw new Error('音浪不足，无法兑换')
    }

    isExchanging.value = true

    try {
      // 模拟API调用
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // 扣除音浪
      userData.value.waves -= requiredWaves.value

      // 计算增加的VIP天数
      const daysAdded = exchangeDuration.value

      return {
        option: selectedExchangeOption.value,
        wavesUsed: requiredWaves.value,
        daysAdded,
      }
    } catch (error) {
      console.error('兑换失败:', error)
      throw error
    } finally {
      isExchanging.value = false
    }
  }

  return {
    exchangeDuration,
    requiredWaves,
    isExchanging,
    selectedExchangeOption,
    updateExchangeDuration,
    handleExchange,
  }
}

// 购买管理
export function usePurchase() {
  const showConfirmDialog = ref(false)
  const selectedVipPackage = ref<VipPackage | null>(null)
  const selectedOptionType = ref<'waves' | null>(null)
  const selectedOptionPrice = ref('')
  const selectedOptionWaves = ref(0)
  const selectedCoupon = ref<number | null>(null)
  const isProcessing = ref(false)

  // 打开购买对话框
  const openPurchaseDialog = (pkg: VipPackage, optionType: 'waves'): void => {
    selectedVipPackage.value = pkg
    selectedOptionType.value = optionType

    // 设置价格
    if (optionType === 'waves') {
      selectedOptionPrice.value = `${pkg.price}音浪`
      selectedOptionWaves.value = pkg.wavesPrice
    }

    showConfirmDialog.value = true
  }

  // 确认购买（音浪兑换）
  const confirmPurchase = async (): Promise<PurchaseResult> => {
    if (!selectedVipPackage.value || selectedOptionType.value !== 'waves') {
      throw new Error('购买信息不完整')
    }

    isProcessing.value = true

    try {
      // 模拟API调用
      await new Promise((resolve) => setTimeout(resolve, 1500))

      return {
        type: 'waves',
        package: selectedVipPackage.value,
        waves: selectedOptionWaves.value,
        success: true,
      }
    } catch (error) {
      console.error('购买失败:', error)
      throw error
    } finally {
      isProcessing.value = false
      showConfirmDialog.value = false
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

// 兑换记录管理
export function useExchangeRecords(initialRecords: ExchangeRecord[]) {
  const exchangeRecords = ref<ExchangeRecord[]>(initialRecords)

  // 添加记录
  const addRecord = (recordData: {
    type: string
    amount: number
    unit: string
    waves?: number
    price?: string
  }): void => {
    const newRecord: ExchangeRecord = {
      id: Date.now().toString(),
      type: recordData.type,
      date: new Date().toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }),
      amount: recordData.amount,
      unit: recordData.unit,
      waves: recordData.waves,
      price: recordData.price,
      status: 'success',
    }

    exchangeRecords.value.unshift(newRecord)

    // 保持最多10条记录
    if (exchangeRecords.value.length > 10) {
      exchangeRecords.value = exchangeRecords.value.slice(0, 10)
    }
  }

  // 更新记录状态
  const updateRecordStatus = (recordId: string, status: 'success' | 'failed'): void => {
    const record = exchangeRecords.value.find((r) => r.id === recordId)
    if (record) {
      record.status = status
    }
  }

  return {
    exchangeRecords,
    addRecord,
    updateRecordStatus,
  }
}

// 秒杀活动管理
export function useFlashSales(initialSales: FlashSale[]) {
  const sales = ref(initialSales)
  const processingFlashId = ref<string | null>(null)

  // 处理秒杀
  const handleFlashSale = async (flashId: string): Promise<boolean> => {
    const sale = sales.value.find((s) => s.id === flashId)
    if (!sale) {
      throw new Error('秒杀活动不存在')
    }

    if (sale.remaining <= 0) {
      throw new Error('已售罄')
    }

    processingFlashId.value = flashId

    try {
      // 模拟API调用
      await new Promise((resolve) => setTimeout(resolve, 800))

      // 更新库存
      sale.remaining -= 1
      sale.sold += 1

      ElMessage.success(`成功秒杀${sale.title}！`)
      return true
    } catch (error) {
      console.error('秒杀失败:', error)
      ElMessage.error('秒杀失败，请重试')
      return false
    } finally {
      processingFlashId.value = null
    }
  }

  return {
    sales,
    processingFlashId,
    handleFlashSale,
  }
}

// 优惠券管理
export function useCoupons() {
  const coupons = ref([
    { id: 1, name: '新人音浪券', amount: 50, minAmount: 200 },
    { id: 2, name: 'VIP专属音浪券', amount: 100, minAmount: 500 },
    { id: 3, name: '节日音浪券', amount: 80, minAmount: 300 },
  ])

  // 获取可用优惠券
  const getAvailableCoupons = (amount: number) => {
    return coupons.value.filter((coupon) => amount >= coupon.minAmount)
  }

  // 应用优惠券
  const applyCoupon = (couponId: number, amount: number) => {
    const coupon = coupons.value.find((c) => c.id === couponId)
    if (!coupon) {
      throw new Error('优惠券不存在')
    }

    if (amount < coupon.minAmount) {
      throw new Error(`金额未达到优惠券使用门槛（${coupon.minAmount}音浪）`)
    }

    return Math.max(0, amount - coupon.amount)
  }

  return {
    coupons,
    getAvailableCoupons,
    applyCoupon,
  }
}

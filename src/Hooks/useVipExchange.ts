import type { Ref } from 'vue'

import type {
  UserData,
  Countdown,
  VipPackage,
  VipPackageOption,
  ExchangeOption,
  ExchangeRecord,
  FlashSale,
  Coupon,
  PurchaseResult,
  ExchangeResult,
} from '@/types//vip/vipExchange'

// 用户数据管理
export function useUserData(initialData?: Partial<UserData>) {
  const userData: Ref<UserData> = ref({
    waves: 12580,
    vipLevel: '黄金VIP',
    vipDays: 15,
    username: '音乐爱好者',
    ...initialData,
  })

  const updateWaves = (amount: number): void => {
    userData.value.waves = Math.max(0, userData.value.waves + amount)
  }

  const updateVipDays = (days: number): void => {
    userData.value.vipDays = Math.max(0, userData.value.vipDays + days)
  }

  const updateVipLevel = (level: string): void => {
    userData.value.vipLevel = level
  }

  return {
    userData,
    updateWaves,
    updateVipDays,
    updateVipLevel,
  }
}

// 倒计时管理
export function useCountdown(
  initialHours: number = 2,
  initialMinutes: number = 30,
  initialSeconds: number = 15,
) {
  const countdown: Ref<Countdown> = ref({
    hours: initialHours.toString().padStart(2, '0'),
    minutes: initialMinutes.toString().padStart(2, '0'),
    seconds: initialSeconds.toString().padStart(2, '0'),
  })

  let interval: number | null = null

  const startCountdown = (): void => {
    interval = setInterval(() => {
      let seconds =
        parseInt(countdown.value.hours) * 3600 +
        parseInt(countdown.value.minutes) * 60 +
        parseInt(countdown.value.seconds)

      if (seconds > 0) {
        seconds--
        const hours = Math.floor(seconds / 3600)
        const minutes = Math.floor((seconds % 3600) / 60)
        const secs = seconds % 60

        countdown.value = {
          hours: hours.toString().padStart(2, '0'),
          minutes: minutes.toString().padStart(2, '0'),
          seconds: secs.toString().padStart(2, '0'),
        }
      } else {
        stopCountdown()
        ElMessage.warning('秒杀活动已结束')
      }
    }, 1000)
  }

  const stopCountdown = (): void => {
    if (interval) {
      clearInterval(interval)
      interval = null
    }
  }

  const resetCountdown = (
    hours: number = initialHours,
    minutes: number = initialMinutes,
    seconds: number = initialSeconds,
  ): void => {
    countdown.value = {
      hours: hours.toString().padStart(2, '0'),
      minutes: minutes.toString().padStart(2, '0'),
      seconds: seconds.toString().padStart(2, '0'),
    }
    stopCountdown()
    startCountdown()
  }

  onMounted(() => {
    startCountdown()
  })

  onUnmounted(() => {
    stopCountdown()
  })

  return {
    countdown,
    startCountdown,
    stopCountdown,
    resetCountdown,
  }
}

// VIP套餐管理
export function useVipPackages(packages: VipPackage[]) {
  const selectedPackageType = ref<'month' | 'quarter' | 'year' | 'permanent'>('month')
  const selectedPackage = ref<string>('')
  const selectedOption = ref<Record<string, 'money' | 'waves'>>({})

  const filteredPackages = computed(() => {
    return packages.filter((pkg) => pkg.type === selectedPackageType.value)
  })

  const selectPackage = (pkg: VipPackage): void => {
    selectedPackage.value = pkg.id
    if (!selectedOption.value[pkg.id]) {
      const firstOption = pkg.exchangeOptions?.[0]
      if (firstOption) {
        selectedOption.value[pkg.id] = firstOption.type
      }
    }
  }

  const selectOption = (pkgId: string, optionType: 'money' | 'waves'): void => {
    selectedOption.value[pkgId] = optionType
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
  const requiredWaves = ref<number>(0)
  const isExchanging = ref<boolean>(false)

  const selectedExchangeOption = computed(() => {
    return exchangeOptions.find((opt) => opt.value === exchangeDuration.value)
  })

  const calculateExchangeWaves = (): void => {
    const option = selectedExchangeOption.value
    requiredWaves.value = option?.waves || 0
  }

  const handleExchange = (): Promise<ExchangeResult> => {
    return new Promise((resolve, reject) => {
      if (!exchangeDuration.value) {
        ElMessage.warning('请选择兑换时长')
        reject(new Error('未选择兑换时长'))
        return
      }

      if (userData.value.waves < requiredWaves.value) {
        ElMessage.error('音浪不足，请签到获取更多音浪')
        reject(new Error('音浪不足'))
        return
      }

      isExchanging.value = true

      setTimeout(() => {
        const option = selectedExchangeOption.value

        if (!option) {
          isExchanging.value = false
          reject(new Error('兑换选项不存在'))
          return
        }

        userData.value.waves -= requiredWaves.value
        userData.value.vipDays += option.value

        isExchanging.value = false

        resolve({
          option,
          wavesUsed: requiredWaves.value,
          daysAdded: option.value,
        })
      }, 1500)
    })
  }

  watch(exchangeDuration, calculateExchangeWaves)

  return {
    exchangeDuration,
    requiredWaves,
    isExchanging,
    selectedExchangeOption,
    handleExchange,
  }
}

// 购买管理
export function usePurchase() {
  const showConfirmDialog = ref<boolean>(false)
  const selectedVipPackage = ref<VipPackage | null>(null)
  const selectedOptionType = ref<'waves' | 'money'>('waves')
  const selectedOptionPrice = ref<string>('')
  const selectedOptionWaves = ref<number>(0)
  const selectedCoupon = ref<number | null>(null)
  const isProcessing = ref<boolean>(false)

  const openPurchaseDialog = (pkg: VipPackage, optionType: 'waves' | 'money'): void => {
    selectedVipPackage.value = pkg
    selectedOptionType.value = optionType

    const option = pkg.exchangeOptions.find((opt) => opt.type === optionType)
    if (option) {
      selectedOptionPrice.value = option.price
      selectedOptionWaves.value = option.waves || 0
    }

    showConfirmDialog.value = true
  }

  const closePurchaseDialog = (): void => {
    showConfirmDialog.value = false
    selectedVipPackage.value = null
    selectedCoupon.value = null
  }

  //   const handlePurchase = (): Promise<PurchaseResult> => {
  //     return new Promise((resolve) => {
  //       isProcessing.value = true

  //       setTimeout(() => {
  //         isProcessing.value = false
  //         closePurchaseDialog()

  //         if (selectedOptionType.value === 'waves') {
  //           resolve({
  //             type: 'waves',
  //             package: selectedVipPackage.value,
  //             waves: selectedOptionWaves.value,
  //             success: true,
  //           })
  //         } else {
  //           resolve({
  //             type: 'money',
  //             package: selectedVipPackage.value,
  //             price: parseFloat(selectedOptionPrice.value.replace('¥', '')),
  //             success: true,
  //           })
  //         }
  //       }, 2000)
  //     })
  //   }

  return {
    showConfirmDialog,
    selectedVipPackage,
    selectedOptionType,
    selectedOptionPrice,
    selectedOptionWaves,
    selectedCoupon,
    isProcessing,
    openPurchaseDialog,
    closePurchaseDialog,
    // handlePurchase,
  }
}

// 兑换记录管理
export function useExchangeRecords(initialRecords: ExchangeRecord[] = []) {
  const exchangeRecords = ref<ExchangeRecord[]>([
    {
      id: 1,
      type: '音浪兑换VIP',
      date: '2024-01-15 14:30',
      amount: 30,
      unit: '天',
      waves: 2500,
      status: 'success',
    },
    ...initialRecords,
  ])

  const addRecord = (
    record: Omit<ExchangeRecord, 'id' | 'date' | 'status'> & Partial<ExchangeRecord>,
  ): void => {
    exchangeRecords.value.unshift({
      id: Date.now(),
      date: new Date().toLocaleString('zh-CN'),
      status: 'success',
      ...record,
    })
  }

  const updateRecordStatus = (id: number, status: 'success' | 'pending' | 'failed'): void => {
    const record = exchangeRecords.value.find((r) => r.id === id)
    if (record) {
      record.status = status
    }
  }

  const deleteRecord = (id: number): void => {
    const index = exchangeRecords.value.findIndex((r) => r.id === id)
    if (index !== -1) {
      exchangeRecords.value.splice(index, 1)
    }
  }

  const getRecordById = (id: number): ExchangeRecord | undefined => {
    return exchangeRecords.value.find((r) => r.id === id)
  }

  return {
    exchangeRecords,
    addRecord,
    updateRecordStatus,
    deleteRecord,
    getRecordById,
  }
}

// 秒杀活动管理
export function useFlashSales(flashSales: FlashSale[]) {
  const sales = ref<FlashSale[]>([...flashSales])

  const handleFlashSale = (flashId: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      const flash = sales.value.find((s) => s.id === flashId)

      if (!flash) {
        reject(new Error('秒杀活动不存在'))
        return
      }

      if (flash.remaining === 0) {
        ElMessage.warning('该秒杀商品已售罄')
        reject(new Error('已售罄'))
        return
      }

      setTimeout(() => {
        flash.sold += 1
        flash.remaining -= 1

        ElMessage.success('秒杀成功！')
        resolve(true)
      }, 1000)
    })
  }

  return {
    sales,
    handleFlashSale,
  }
}

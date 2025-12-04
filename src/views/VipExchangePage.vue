<template>
  <div class="vip-exchange-page">
    <!-- 背景装饰 -->
    <BackgroundDecor />

    <!-- 顶部导航 -->
    <!-- <HeaderNav :user-data="userData" @go-back="goBack" /> -->

    <!-- 主内容区 -->
    <main class="relative container mx-auto px-12 py-8">
      <!-- VIP特权展示 -->
      <VipPrivileges
        :privileges="vipPrivileges"
        @scroll-to-packages="scrollToVipPackages"
        @show-privilege-detail="showPrivilegeDetail"
      />

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- 左侧：VIP套餐选择 -->
        <div class="lg:col-span-2 space-y-8">
          <!-- 秒杀活动 -->
          <FlashSale
            :flash-sales="flashSales"
            :countdown="countdown"
            @flash-sale="handleFlashSale"
          />

          <!-- 普通VIP套餐 -->
          <VipPackages
            ref="vipPackagesRef"
            :packages="vipPackages"
            :selected-package-type="selectedPackageType"
            :selected-package="selectedPackage"
            :selected-options="selectedOption"
            @update:selected-package-type="updatePackageType"
            @select-package="selectPackage"
            @select-option="selectOption"
            @purchase="handlePurchase"
          />
        </div>

        <!-- 右侧：兑换记录和快捷操作 -->
        <div class="space-y-6">
          <!-- 音浪兑换区 -->
          <WavesExchange
            :user-data="userData"
            :exchange-options="exchangeOptions"
            :exchange-duration="exchangeDuration"
            :required-waves="requiredWaves"
            :is-exchanging="isExchanging"
            @update:exchange-duration="updateExchangeDuration"
            @exchange="handleWavesExchange"
          />

          <!-- 最近兑换记录 -->
          <ExchangeRecords :records="exchangeRecords" @record-click="handleRecordClick" />

          <!-- 快捷操作 -->
          <!-- <QuickActions :actions="quickActions" @quick-action="handleQuickAction" /> -->
        </div>
      </div>
    </main>

    <!-- 购买确认对话框 -->
    <!-- <PurchaseDialog
      v-model="showConfirmDialog"
      :selected-package="selectedVipPackage"
      :selected-option-type="selectedOptionType"
      :selected-option-price="selectedOptionPrice"
      :selected-option-waves="selectedOptionWaves"
      :coupons="coupons"
      :selected-coupon="selectedCoupon"
      :is-processing="isProcessing"
      @update:selected-coupon="updateSelectedCoupon"
      @confirm="confirmPurchase"
      @cancel="showConfirmDialog = false"
    /> -->
  </div>
</template>

<script setup lang="ts">
import VipPackages from '@/components/vip/VipPackages.vue'
// 导入hooks
import {
  useUserData,
  useCountdown,
  useVipPackages,
  useWavesExchange,
  usePurchase,
  useExchangeRecords,
  useFlashSales,
} from '@/Hooks/useVipExchange'

// 导入数据
import {
  vipPrivileges,
  flashSales as flashSalesData,
  vipPackages,
  exchangeOptions,
  initialExchangeRecords,
  quickActions,
  coupons,
} from '@/mock/vip/vipExchangeData'

// 导入类型
import type {
  VipPrivilege,
  FlashSale,
  VipPackage,
  ExchangeRecord,
  QuickAction,
  ExchangeResult,
  PurchaseResult,
} from '@/types/vip/vipExchange'

const router = useRouter()

// 使用hooks
const { userData, updateWaves, updateVipDays } = useUserData()
const { countdown } = useCountdown()

const {
  selectedPackageType,
  selectedPackage,
  selectedOption,
  filteredPackages,
  selectPackage: selectPackageHook,
  selectOption: selectOptionHook,
} = useVipPackages(vipPackages)

const {
  exchangeDuration,
  requiredWaves,
  isExchanging,
  selectedExchangeOption,
  handleExchange: handleWavesExchangeHook,
} = useWavesExchange(exchangeOptions, userData)

const {
  showConfirmDialog,
  selectedVipPackage,
  selectedOptionType,
  selectedOptionPrice,
  selectedOptionWaves,
  selectedCoupon,
  isProcessing,
  openPurchaseDialog,
  handlePurchase: handlePurchaseHook,
} = usePurchase()

const { exchangeRecords, addRecord, updateRecordStatus } =
  useExchangeRecords(initialExchangeRecords)

const { sales: flashSales, handleFlashSale: handleFlashSaleHook } = useFlashSales(flashSalesData)

// 计算属性
const filteredVipPackages = filteredPackages

const selectedCouponAmount = computed(() => {
  if (!selectedCoupon.value) return 0
  const coupon = coupons.find((c) => c.id === selectedCoupon.value)
  return coupon ? coupon.amount : 0
})

const finalPrice = computed(() => {
  if (!selectedOptionPrice.value) return '0.00'
  const price = parseFloat(selectedOptionPrice.value.replace('¥', ''))
  return Math.max(0, price - selectedCouponAmount.value).toFixed(2)
})

// 引用

const vipPackagesRef = ref<InstanceType<typeof VipPackages> | null>(null)
// 方法
const goBack = (): void => {
  router.back()
}

const scrollToVipPackages = (): void => {
  if (vipPackagesRef.value) {
    vipPackagesRef.value.scrollTo()
  }
}

const showPrivilegeDetail = (privilege: VipPrivilege): void => {
  ElMessage.info(`查看${privilege.title}详情`)
}

const validPackageTypes = ['month', 'quarter', 'year', 'permanent'] as const

const updatePackageType = (value: string): void => {
  if (validPackageTypes.includes(value as any)) {
    selectedPackageType.value = value as (typeof validPackageTypes)[number]
  } else {
    console.warn('Invalid package type:', value)
  }
}

const selectPackage = (pkg: VipPackage): void => {
  selectPackageHook(pkg)
}

const selectOption = (params: { pkgId: string; optionType: 'money' | 'waves' }): void => {
  selectOptionHook(params.pkgId, params.optionType)
}

const handleFlashSale = async (flash: FlashSale): Promise<void> => {
  try {
    const success = await handleFlashSaleHook(flash.id)

    if (success) {
      // 添加兑换记录
      addRecord({
        type: `秒杀${flash.title}`,
        amount: flash.id === 'flash1' ? 365 : 90,
        unit: '天',
        price: flash.flashPrice,
      })

      // 更新用户VIP天数
      if (flash.id === 'flash1') {
        updateVipDays(365)
      } else if (flash.id === 'flash2') {
        updateVipDays(90)
      }
    }
  } catch (error) {
    console.error('秒杀失败:', error)
  }
}

const updateExchangeDuration = (value: number | null): void => {
  exchangeDuration.value = value
}

const handleWavesExchange = async (): Promise<void> => {
  try {
    const result: ExchangeResult = await handleWavesExchangeHook()

    // 添加兑换记录
    addRecord({
      type: '音浪兑换VIP',
      amount: result.daysAdded,
      unit: '天',
      waves: result.wavesUsed,
    })

    ElMessage.success(`成功兑换${result.option?.label}VIP！`)
  } catch (error) {
    console.error('兑换失败:', error)
  }
}

const handlePurchase = (pkg: VipPackage): void => {
  const optionType = selectedOption.value[pkg.id] || 'money'
  openPurchaseDialog(pkg, optionType)
}

const confirmPurchase = async (): Promise<void> => {
  try {
    const result: PurchaseResult = await handlePurchaseHook()

    if (result.success) {
      if (result.type === 'waves' && result.waves) {
        // 音浪兑换成功
        updateWaves(-result.waves)

        // 根据套餐类型增加VIP天数
        let daysToAdd = 0
        switch (result.package?.type) {
          case 'month':
            daysToAdd = result.package.id === 'month2' ? 60 : 30
            break
          case 'quarter':
            daysToAdd = 90
            break
          case 'year':
            daysToAdd = 365
            break
        }

        if (daysToAdd > 0) {
          updateVipDays(daysToAdd)

          // 添加记录
          addRecord({
            type: '音浪兑换VIP',
            amount: daysToAdd,
            unit: '天',
            waves: result.waves,
          })
        }

        ElMessage.success('音浪兑换成功！')
      } else if (result.type === 'money' && result.price) {
        // 在线支付成功
        // 根据套餐类型增加VIP天数
        let daysToAdd = 0
        switch (result.package?.type) {
          case 'month':
            daysToAdd = result.package.id === 'month2' ? 60 : 30
            break
          case 'quarter':
            daysToAdd = 90
            break
          case 'year':
            daysToAdd = 365
            break
        }

        if (daysToAdd > 0) {
          updateVipDays(daysToAdd)

          // 添加记录
          addRecord({
            type: '购买VIP套餐',
            amount: daysToAdd,
            unit: '天',
            price: result.price,
          })
        }

        ElMessage.success('支付成功！VIP已开通')
      }
    }
  } catch (error) {
    console.error('购买失败:', error)
  }
}

const handleRecordClick = (record: ExchangeRecord): void => {
  console.log('点击记录:', record)
  ElMessage.info(`查看${record.type}详情`)
}

const handleQuickAction = (action: QuickAction): void => {
  switch (action.action) {
    case 'signin':
      ElMessage.info('跳转到签到页面')
      router.push('/signin')
      break
    case 'task':
      ElMessage.info('跳转到任务中心')
      break
    case 'wavesShop':
      ElMessage.info('跳转到音浪商城')
      break
    case 'help':
      ElMessage.info('联系客服')
      break
  }
}

const updateSelectedCoupon = (value: number | null): void => {
  selectedCoupon.value = value
}

// 生命周期
onMounted(() => {
  console.log('VIP兑换页面加载完成')
})
</script>

<style scoped>
.vip-exchange-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f172a 0%, #000 50%, #0f172a 100%);
  position: relative;
  overflow-x: hidden;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .vip-exchange-page {
    padding-bottom: 80px;
  }

  .grid {
    gap: 1rem;
  }

  .text-3xl {
    font-size: 1.5rem;
  }

  .text-2xl {
    font-size: 1.25rem;
  }
}

/* 页面加载动画 */
.vip-exchange-page::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:
    radial-gradient(circle at 20% 80%, rgba(139, 92, 246, 0.1), transparent 40%),
    radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.1), transparent 40%);
  pointer-events: none;
}

/* 全局动画效果 */
@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes glow {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

.float-animation {
  animation: float 3s ease-in-out infinite;
}

.glow-animation {
  animation: glow 2s ease-in-out infinite;
}

/* 卡片悬停效果 */
.hover-lift {
  transition: all 0.3s ease;
}

.hover-lift:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #8b5cf6, #3b82f6);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #7c3aed, #2563eb);
}
</style>

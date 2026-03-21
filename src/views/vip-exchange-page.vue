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

      <div class="space-y-0">
        <!-- 秒杀活动和最近兑换记录左右分布 -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- 左侧：秒杀活动 -->
          <div class="lg:col-span-2 space-y-8">
            <!-- 即将开启的秒杀活动 -->
            <UpcomingFlashSales
              :upcoming-flash-sales="upcomingSales"
              :countdown="upcomingCountdown"
              :set-reminder="setReminder"
              :is-reminded="isReminded"
              @flash-sale="handleFlashSale"
            />

            <!-- 秒杀活动 -->
            <FlashSale
              :flash-sales="flashSales.slice(0, 3)"
              :countdown="countdownData"
              @flash-sale="handleFlashSale"
            />
          </div>

          <!-- 右侧：最近兑换记录 -->
          <div>
            <ExchangeRecords
              :records="exchangeRecords"
              :loading="recordsLoading"
              :has-more="recordsHasMore"
              @record-click="handleRecordClick"
              @load-more="loadMoreOrders"
              @refresh="refreshOrders"
            />
          </div>
        </div>

        <!-- 普通VIP套餐 -->
        <VipPackages
          ref="vipPackagesRef"
          :packages="vipPackages"
          :selected-package="selectedPackage"
          :selected-options="selectedWavesOptions"
          @select-package="selectPackage"
          @select-option="selectOption"
          @purchase="handlePurchase"
        />
      </div>
    </main>

    <!-- 购买确认对话框 -->
    <PurchaseDialog
      v-model="showConfirmDialog"
      :selected-package="selectedVipPackage"
      :selected-option-type="selectedOptionType"
      :selected-option-price="selectedOptionPrice"
      :selected-option-waves="selectedOptionWaves"
      :is-processing="isProcessing"
      @confirm="confirmPurchase"
      @cancel="handleDialogCancel"
    />
  </div>
</template>

<script setup lang="ts">
// 导入hooks
import {
  useCountdown,
  useExchangeRecords,
  useFlashSales,
  usePurchase,
  useUserData,
  useVipPackages,
  useWavesExchange,
} from '@/composables/useVipExchange'

// 导入数据
import {
  coupons,
  exchangeOptions,
  initialExchangeRecords,
  vipPackages,
  vipPrivileges,
} from '@/mock/vip/vipExchangeData'

// 导入类型
import type {
  ExchangeRecord,
  ExchangeResult,
  FlashSale,
  QuickAction,
  VipPackage,
  VipPrivilege,
} from '@/types/vip/vipExchange'
import { buyVip } from '@/api/vip'
const router = useRouter()

// 使用hooks
const {
  userData,
  updateWaves,
  updateVipStatus, // 替换不存在的updateVipDays
  loadUserInfo, // 可选：页面挂载时加载用户信息
} = useUserData()
const { countdown } = useCountdown()
onMounted(() => {
  loadUserInfo() // 加载后端用户数据
  fetchOngoingSeckill() // 加载正在进行的秒杀商品
  fetchUpcomingSeckill() // 加载即将开启的秒杀商品
  console.log('VIP兑换页面加载完成')
})
const {
  selectedPackageType,
  selectedPackage,
  selectedOption,
  filteredPackages,
  selectPackageHook,
  selectOptionHook,
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
  confirmPurchase: confirmPurchaseHook,
} = usePurchase()

// 获取兑换记录相关功能
const {
  exchangeRecords,
  addRecord,
  updateRecordStatus,
  loading: recordsLoading,
  hasMore: recordsHasMore,
  loadMoreOrders,
  refreshOrders,
} = useExchangeRecords(initialExchangeRecords)

const {
  ongoingSales: flashSales,
  upcomingSales,
  countdown: countdownData,
  upcomingCountdown,
  ongoingLoading,
  upcomingLoading,
  fetchUpcomingSeckill,
  fetchOngoingSeckill,
  handleFlashSale: handleFlashSaleHook,
  setReminder,
  isReminded,
} = useFlashSales()

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

const handlePurchase = (pkg: VipPackage): void => {
  // 打开购买对话框，而不是直接购买
  openPurchaseDialog(pkg, 'waves')
}

const confirmPurchase = async (): Promise<void> => {
  try {
    isProcessing.value = true

    // 调用usePurchase中的确认购买方法
    const result = await confirmPurchaseHook()
    console.log('确认购买结果:', result)
    if (result.success && selectedVipPackage.value) {
      // 更新用户音浪
      updateWaves(-selectedOptionWaves.value)

      // 根据套餐类型增加VIP天数
      let daysToAdd = selectedVipPackage.value.days || 0

      if (daysToAdd > 0) {
        // 使用API返回的过期时间更新VIP状态
        updateVipStatus(true, result.expireTime || '')

        // 添加兑换记录（只有支付成功才添加）
        addRecord({
          orderType: '音浪兑换',
          productName: selectedVipPackage.value.title,
          totalAmount: daysToAdd.toString(),
          payAmount: daysToAdd.toString(),
          price: selectedOptionWaves.value.toString(),
          quantity: 1,
        })
        // 更新刚添加的记录状态为"已支付"
        const now = new Date()
        const orderNo = `temp_${now.getTime()}`
        updateRecordStatus(orderNo, '已支付')
      }

      ElMessage.success('VIP购买成功！')
      showConfirmDialog.value = false
    }
  } catch (error) {
    console.error('购买失败:', error)
    ElMessage.error('购买失败，请稍后重试')
  } finally {
    isProcessing.value = false
  }
}

const handleDialogCancel = (): void => {
  // 直接关闭对话框，不添加任何记录
  showConfirmDialog.value = false
}

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

const selectPackage = (pkg: VipPackage): void => {
  selectPackageHook(pkg)
}

const selectOption = (params: { pkgId: string; optionType: 'waves' }): void => {
  selectOptionHook(params.pkgId, params.optionType)
}

const handleFlashSale = async (flash: FlashSale): Promise<void> => {
  try {
    const success = await handleFlashSaleHook(flash.id, userData.value.waves)
    console.log(flash)
    console.log('秒杀成功:', success)
    if (success) {
      // 添加兑换记录
      addRecord({
        orderType: '秒杀',
        productName: `秒杀${flash.title}`,
        totalAmount: `${flash.id === 'flash1' ? 365 : 90}`,
        payAmount: `${flash.flashPrice}`,
        price: `${flash.flashPrice}`,
        quantity: 1,
      })

      // 更新用户VIP天数
      if (flash.id === 'flash1') {
        updateVipStatus(true, '')
      } else if (flash.id === 'flash2') {
        updateVipStatus(true, '')
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
    isExchanging.value = true

    // 调用音浪兑换API（如果需要单独的API，否则复用buyVip）
    const packageName = `${selectedExchangeOption.value?.label || ''}`
    const response = await buyVip(packageName)

    if (response.success) {
      const result: ExchangeResult = await handleWavesExchangeHook(updateWaves)

      // 添加兑换记录
      addRecord({
        orderType: '音浪兑换',
        productName: `${result.option?.label || ''}VIP`,
        totalAmount: `${result.daysAdded}`,
        payAmount: `${result.wavesUsed}`,
        price: `${result.wavesUsed}`,
        quantity: 1,
      })

      ElMessage.success(`成功兑换${result.option?.label}VIP！`)
    } else {
      ElMessage.error(response.errorMsg || '兑换失败')
    }
  } catch (error) {
    console.error('兑换失败:', error)
    ElMessage.error('兑换失败，请稍后重试')
  } finally {
    isExchanging.value = false
  }
}

const handleRecordClick = (record: ExchangeRecord): void => {
  console.log('点击记录:', record)
  ElMessage.info(`查看${record.orderType}详情`)
}
const selectedWavesOptions = computed<Record<string, 'waves'>>(() => {
  const result: Record<string, 'waves'> = {}
  for (const key in selectedOption.value) {
    if (selectedOption.value[key] === 'waves') {
      result[key] = 'waves'
    }
  }
  return result
})
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

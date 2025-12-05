<template>
  <div ref="containerRef" class="vip-packages-section">
    <div class="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
      <div>
        <h3
          class="text-xl md:text-2xl font-bold mb-1 bg-gradient-to-r from-pink-600 via-pink-500 to-pink-400 bg-clip-text text-transparent animate-gradient-x"
        >
          普通VIP套餐
        </h3>
        <p class="text-gray-400 text-sm flex items-center gap-2">
          <i class="iconfont icon-diamond text-pink-500 text-xs"></i>
          选择适合您的VIP套餐，解锁更多特权
        </p>
      </div>
      <el-radio-group
        :model-value="selectedPackageType"
        size="small"
        class="border border-pink-500/20 rounded-lg bg-gray-900/80 p-1 backdrop-blur-sm"
        @change="handlePackageTypeChange"
      >
        <el-radio-button
          v-for="(item, key) in packageTypeMap"
          :key="key"
          :value="key"
          class="transition-all duration-300 radio-button text-xs hover:bg-pink-500/10"
        >
          <span class="flex items-center gap-1">
            <i :class="['iconfont text-xs', item.icon]"></i>
            {{ item.label }}
          </span>
        </el-radio-button>
      </el-radio-group>
    </div>

    <!-- VIP套餐卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
      <div
        v-for="(pkg, index) in filteredPackages"
        :key="pkg.id"
        :class="[
          'relative p-4 md:p-5 rounded-xl border-2 transition-all duration-500 cursor-pointer transform hover:-translate-y-1 vip-package-card group',
          selectedPackage === pkg.id
            ? 'border-pink-500 bg-gradient-to-br from-pink-500/15 via-gray-900/80 to-pink-400/15 ring-1 ring-pink-500/30'
            : 'border-white/10 hover:border-pink-500/50 bg-gradient-to-br from-gray-900/70 to-black/60',
        ]"
        :style="{ animationDelay: `${index * 150}ms` }"
        @click="handleSelectPackage(pkg)"
      >
        <!-- 背景光效层 -->
        <div
          class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        >
          <div
            class="absolute -inset-[1px] bg-gradient-to-r from-pink-600/10 via-pink-500/5 to-pink-400/10 rounded-xl blur-sm"
          ></div>
        </div>

        <!-- 推荐标签 -->
        <div
          v-if="pkg.recommended"
          class="absolute top-4 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-pink-600 to-pink-400 text-xs font-semibold shadow-lg shadow-pink-600/30 recommended-tag flex items-center gap-1"
        >
          <i class="iconfont icon-trophy text-yellow-300 text-xs"></i>
          推荐
        </div>

        <div class="mb-4 relative z-10">
          <div class="flex items-center justify-between mb-2">
            <h4
              class="text-lg md:text-xl font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-pink-300 group-hover:to-pink-200 group-hover:bg-clip-text transition-all duration-300"
            >
              {{ pkg.title }}
            </h4>
            <span
              v-if="pkg.discount"
              class="px-2 py-0.5 rounded-full bg-pink-600/20 text-pink-400 text-xs border border-pink-500/30 discount-tag flex items-center gap-1"
            >
              <i class="iconfont icon-fire text-xs"></i>
              {{ pkg.discount }}折
            </span>
          </div>
          <p class="text-gray-400 text-xs line-clamp-2 leading-relaxed">
            {{ pkg.description || '享受VIP专属特权，高清音质、无损下载、专属曲库等' }}
          </p>
        </div>

        <!-- 价格区域 -->
        <div class="mb-4 relative z-10">
          <div class="flex items-baseline gap-1 mb-1">
            <span class="text-2xl md:text-3xl font-bold text-white price-glow">
              <span class="text-xs text-pink-400 mr-1">♪</span>
              {{ pkg.wavesPrice || Math.floor(Number(pkg.price) * 10) }}
            </span>
            <span class="text-gray-400 text-xs">音浪</span>
            <span
              v-if="pkg.originalPrice"
              class="text-xs text-gray-500 line-through ml-2 original-price"
            >
              {{ Math.floor(Number(pkg.originalPrice) * 10) }}音浪
            </span>
          </div>
          <div class="text-xs text-gray-400 flex items-center gap-1">
            <i class="iconfont icon-calendar text-pink-400 text-xs"></i>
            平均
            <span class="text-pink-400 font-medium">{{
              (
                Number(pkg.wavesPrice || Math.floor(Number(pkg.price) * 10)) / (pkg.days || 30)
              ).toFixed(1)
            }}</span
            >音浪/天
          </div>
        </div>

        <!-- 核心特权提示 -->
        <div class="mb-4 relative z-10">
          <div class="flex flex-wrap gap-1.5 mb-3">
            <span
              class="px-2 py-0.5 bg-pink-600/10 text-pink-300 text-xs rounded-full border border-pink-500/20"
            >
              无损音质
            </span>
            <span
              class="px-2 py-0.5 bg-pink-600/10 text-pink-300 text-xs rounded-full border border-pink-500/20"
            >
              专属曲库
            </span>
            <span
              class="px-2 py-0.5 bg-pink-600/10 text-pink-300 text-xs rounded-full border border-pink-500/20"
            >
              免广告
            </span>
          </div>
        </div>

        <!-- 音浪支付选项 -->
        <div class="space-y-2 relative z-10">
          <div
            class="p-3 rounded-lg border transition-all duration-300 cursor-pointer option-item group"
            :class="[
              selectedOptions[pkg.id] === 'waves'
                ? 'border-pink-500 bg-pink-600/10 ring-1 ring-pink-500/30'
                : 'border-white/5 hover:border-pink-500/30 hover:bg-white/5',
            ]"
            @click.stop="handleSelectOption(pkg.id, 'waves')"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div
                  :class="[
                    'w-5 h-5 rounded-full border-2 flex items-center justify-center option-radio transition-all duration-300',
                    selectedOptions[pkg.id] === 'waves'
                      ? 'border-pink-500 bg-pink-500 scale-110'
                      : 'border-gray-600 group-hover:border-pink-400',
                  ]"
                >
                  <i
                    v-if="selectedOptions[pkg.id] === 'waves'"
                    class="iconfont icon-check text-xs text-white animate-scale-in"
                  ></i>
                </div>
                <div>
                  <div
                    class="font-medium text-white text-sm group-hover:text-pink-300 transition-colors duration-300"
                  >
                    音浪兑换
                  </div>
                  <div class="text-xs text-gray-400">即时到账</div>
                </div>
              </div>
              <div class="text-right">
                <div class="font-semibold text-white text-sm">
                  <span class="text-xs text-pink-400 mr-0.5">♪</span
                  >{{ pkg.wavesPrice || Math.floor(Number(pkg.price) * 10) }}
                </div>
                <div class="text-xs text-pink-400 flex items-center justify-end gap-0.5 mt-0.5">
                  <i class="iconfont icon-waves text-xs"></i>
                  安全
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 购买按钮 - 修改为黑粉配色 -->
        <button
          class="w-full mt-4 relative overflow-hidden package-button group py-2.5 px-4 rounded-xl text-sm font-medium transition-all duration-300"
          :disabled="!selectedOptions[pkg.id]"
          :class="[
            !selectedOptions[pkg.id]
              ? 'opacity-60 cursor-not-allowed bg-gray-800/50 text-gray-400 border border-gray-700/50'
              : selectedPackage === pkg.id
                ? 'bg-gradient-to-r from-pink-600 to-pink-400 text-white border-pink-500/30 hover:shadow-[0_0_20px_rgba(236,72,153,0.3)]'
                : 'bg-gray-900/80 text-pink-300 border border-pink-500/20 hover:bg-pink-500/10 hover:border-pink-500/40',
          ]"
          @click.stop="handlePurchase(pkg)"
        >
          <!-- 按钮光效 -->
          <div
            v-if="selectedOptions[pkg.id] && selectedPackage === pkg.id"
            class="absolute inset-0 bg-gradient-to-r from-pink-400/0 via-white/10 to-pink-200/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          ></div>

          <!-- 按钮内容 -->
          <span class="relative z-10 flex items-center justify-center gap-1.5">
            <i class="iconfont icon-waves text-sm"></i>
            {{
              !selectedOptions[pkg.id]
                ? '选择兑换方式'
                : selectedPackage === pkg.id
                  ? '立即兑换'
                  : '选择此套餐'
            }}
            <i
              v-if="selectedPackage === pkg.id"
              class="iconfont icon-arrow-right text-xs ml-1 group-hover:translate-x-1 transition-transform"
            ></i>
          </span>

          <!-- 按钮边框光效 -->
          <div
            v-if="selectedOptions[pkg.id] && selectedPackage === pkg.id"
            class="absolute -inset-[1px] bg-gradient-to-r from-pink-400/40 via-pink-300/40 to-pink-400/40 rounded-xl -z-10 opacity-0 group-hover:opacity-100 blur transition-all duration-300"
          ></div>
        </button>
      </div>
    </div>

    <!-- 支付弹框 -->
    <el-dialog
      v-model="isPaymentDialogOpen"
      title="音浪兑换VIP套餐"
      :width="selectedPackage ? '450px' : '380px'"
      :before-close="handleDialogClose"
      class="payment-dialog"
      custom-class="wave-payment-dialog"
    >
      <div v-if="selectedPackage" class="payment-content">
        <!-- 套餐信息 -->
        <div
          class="package-info mb-5 p-4 rounded-xl border border-pink-500/20 bg-gradient-to-br from-gray-900/80 to-black/80"
        >
          <div class="flex items-center gap-3 mb-3">
            <div
              class="w-10 h-10 rounded-full bg-gradient-to-r from-pink-600 to-pink-600 flex items-center justify-center"
            >
              <i class="iconfont icon-vip text-white text-lg"></i>
            </div>
            <div>
              <h4 class="text-lg font-bold text-white">{{ selectedPackageInfo?.title }}</h4>
              <p class="text-gray-400 text-sm">
                {{ selectedPackageInfo?.description || 'VIP专属特权套餐' }}
              </p>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-3 text-xs">
            <div class="flex items-center gap-2">
              <i class="iconfont icon-calendar text-pink-400 text-xs"></i>
              <span class="text-gray-300">有效期：</span>
              <span class="text-white">{{ selectedPackageInfo?.unit || '30天' }}</span>
            </div>
            <div class="flex items-center gap-2">
              <i class="iconfont icon-waves text-pink-400 text-xs"></i>
              <span class="text-gray-300">兑换价格：</span>
              <span class="text-white font-medium">
                {{
                  selectedPackageInfo?.wavesPrice ||
                  Math.floor(Number(selectedPackageInfo?.price) * 10)
                }}音浪
              </span>
            </div>
          </div>
        </div>

        <!-- 支付确认 -->
        <div class="payment-confirm p-4 rounded-xl border border-white/10 bg-gray-900/80">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-3">
              <div
                class="w-8 h-8 rounded-full border border-pink-500/30 bg-pink-600/20 flex items-center justify-center"
              >
                <i class="iconfont icon-waves text-pink-400 text-base"></i>
              </div>
              <div>
                <div class="text-white font-medium text-sm">音浪支付</div>
                <div class="text-xs text-gray-400">
                  当前账户音浪：<span class="text-pink-400">{{ userWaves || '0' }}</span>
                </div>
              </div>
            </div>
            <div class="text-right">
              <div class="text-xs text-gray-300">应付金额</div>
              <div class="text-xl font-bold text-white">
                <span class="text-pink-400 text-xs mr-0.5">♪</span
                >{{
                  selectedPackageInfo?.wavesPrice ||
                  Math.floor(Number(selectedPackageInfo?.price) * 10)
                }}
              </div>
            </div>
          </div>

          <div class="flex gap-3">
            <!-- 修改取消按钮为黑粉配色 -->
            <button
              type="button"
              class="flex-1 py-2.5 px-4 text-sm rounded-xl transition-all duration-300 cancel-button"
              @click="handleDialogClose"
            >
              取消
            </button>
            <button
              type="button"
              class="flex-1 py-2.5 px-4 text-sm rounded-xl transition-all duration-300 confirm-button relative overflow-hidden group"
              :disabled="
                !(
                  userWaves &&
                  Number(userWaves) >=
                    Number(
                      selectedPackageInfo?.wavesPrice ||
                        Math.floor(Number(selectedPackageInfo?.price) * 10),
                    )
                )
              "
            >
              <!-- 按钮背景光效 -->
              <div
                class="absolute inset-0 bg-gradient-to-r from-pink-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              ></div>

              <span class="relative z-10 flex items-center justify-center gap-1.5">
                <i class="iconfont icon-check-circle text-sm"></i>
                确认兑换
              </span>

              <!-- 按钮边框光效 -->
              <div
                class="absolute -inset-[1px] bg-gradient-to-r from-pink-400/50 via-pink-300/50 to-pink-400/50 rounded-xl -z-10 opacity-0 group-hover:opacity-100 blur transition-all duration-300"
              ></div>
            </button>
          </div>
        </div>
      </div>
      <div v-else class="empty-state flex flex-col items-center justify-center py-8">
        <div class="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mb-3">
          <i class="iconfont icon-package text-gray-500 text-xl"></i>
        </div>
        <p class="text-gray-400 text-sm text-center">请先选择要兑换的VIP套餐</p>
        <button
          type="button"
          class="mt-3 py-2 px-4 text-sm rounded-xl transition-all duration-300 cancel-button"
          @click="handleDialogClose"
        >
          返回选择
        </button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { VipPackage } from '@/types/vip/vipExchange'

interface Props {
  packages: VipPackage[]
  selectedPackageType: string
  selectedPackage: string
  selectedOptions: Record<string, 'waves'>
  userWaves?: string | number
}

interface Emits {
  (e: 'update:selectedPackageType', value: string): void
  (e: 'selectPackage', pkg: VipPackage): void
  (e: 'selectOption', params: { pkgId: string; optionType: 'waves' }): void
  (e: 'purchase', pkg: VipPackage): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const packageTypeMap = ref({
  month: { label: '月卡', icon: 'icon-month' },
  quarter: { label: '季卡', icon: 'icon-quarter' },
  year: { label: '年卡', icon: 'icon-year' },
  permanent: { label: '永久', icon: 'icon-permanent' },
})

const isPaymentDialogOpen = ref(false)
const selectedPackageInfo = ref<VipPackage | null>(null)
const userWaves = ref<string | number>(props.userWaves || '0')
const containerRef = ref<HTMLElement | null>(null)

const filteredPackages = computed(() => {
  return props.packages.filter((pkg) => pkg.type === props.selectedPackageType)
})

onMounted(() => {
  if (props.selectedPackage) {
    const selectedPkg = props.packages.find((pkg) => pkg.id === props.selectedPackage)
    if (selectedPkg) {
      selectedPackageInfo.value = selectedPkg
    }
  }
  userWaves.value = props.userWaves || '0'
})

const handlePackageTypeChange = (value: string): void => {
  emit('update:selectedPackageType', value)
}

const handleSelectPackage = (pkg: VipPackage): void => {
  emit('selectPackage', pkg)
  selectedPackageInfo.value = pkg
}

const handleSelectOption = (pkgId: string, optionType: 'waves'): void => {
  emit('selectOption', { pkgId, optionType })
}

const handlePurchase = (pkg: VipPackage): void => {
  selectedPackageInfo.value = pkg
  isPaymentDialogOpen.value = true
}

const handleDialogClose = (): void => {
  isPaymentDialogOpen.value = false
}

const scrollTo = (): void => {
  if (containerRef.value) {
    containerRef.value.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

defineExpose({
  scrollTo,
})
</script>

<style scoped>
@keyframes gradientX {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateX(-50%) translateY(0);
  }
  50% {
    transform: translateX(-50%) translateY(-3px);
  }
}

@keyframes shake {
  0%,
  100% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(-2deg);
  }
  75% {
    transform: rotate(2deg);
  }
}

@keyframes scaleIn {
  0% {
    transform: scale(0);
  }
  70% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes priceGlow {
  0%,
  100% {
    filter: drop-shadow(0 0 6px rgba(236, 72, 153, 0.2));
  }
  50% {
    filter: drop-shadow(0 0 10px rgba(236, 72, 153, 0.3));
  }
}

@keyframes cardSlideIn {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 取消按钮样式 */
.cancel-button {
  background: linear-gradient(to right, rgba(31, 41, 55, 0.8), rgba(17, 24, 39, 0.8));
  color: #9ca3af;
  border: 1px solid rgba(156, 163, 175, 0.2);
  font-weight: 500;
}

.cancel-button:hover {
  background: linear-gradient(to right, rgba(55, 65, 81, 0.8), rgba(31, 41, 55, 0.8));
  color: #f3f4f6;
  border-color: rgba(236, 72, 153, 0.3);
  transform: translateY(-1px);
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.2);
}

/* 确认按钮样式 */
.confirm-button {
  background: linear-gradient(to right, rgba(236, 72, 153, 0.9), rgba(168, 85, 247, 0.9));
  color: white;
  border: 1px solid rgba(236, 72, 153, 0.4);
  font-weight: 500;
}

.confirm-button:hover:not(:disabled) {
  background: linear-gradient(to right, rgb(219, 39, 119), rgb(147, 51, 234));
  transform: translateY(-1px);
  box-shadow: 0 5px 15px rgba(236, 72, 153, 0.3);
}

.confirm-button:disabled {
  background: linear-gradient(to right, rgba(236, 72, 153, 0.3), rgba(168, 85, 247, 0.3));
  color: rgba(255, 255, 255, 0.5);
  border-color: rgba(236, 72, 153, 0.2);
  cursor: not-allowed;
  opacity: 0.7;
}

.vip-package-card {
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.vip-package-card:hover {
  box-shadow:
    0 15px 35px rgba(0, 0, 0, 0.4),
    0 0 20px rgba(236, 72, 153, 0.15);
}

.animate-gradient-x {
  background-size: 200% 200%;
  animation: gradientX 8s ease infinite;
}

.recommended-tag {
  animation: float 3s ease-in-out infinite;
  z-index: 10;
  background: linear-gradient(to right, #ec4899, #db2777) !important;
}

.discount-tag {
  animation: shake 2s infinite;
}

.original-price {
  position: relative;
}

.original-price::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 1px;
  background-color: currentColor;
  opacity: 0.7;
  transform: rotate(-10deg);
}

.option-item {
  transition: all 0.2s ease;
}

.option-item:hover {
  transform: translateX(3px);
}

.option-radio {
  transition: all 0.2s ease;
}

.price-glow {
  animation: priceGlow 3s ease-in-out infinite;
}

.package-button {
  position: relative;
  overflow: hidden;
  transition: all 0.2s ease;
  font-weight: 500;
}

.package-button:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 5px 15px rgba(236, 72, 153, 0.2);
}

.package-button:disabled {
  cursor: not-allowed;
}

.group {
  opacity: 0;
  transform: translateY(15px);
  animation: cardSlideIn 0.4s ease forwards;
}

/* Element UI 样式覆盖 */
:deep(.el-radio-button__inner) {
  background: transparent !important;
  border: none !important;
  color: #9ca3af !important;
  transition: all 0.2s ease !important;
  padding: 6px 12px !important;
  font-size: 12px !important;
}

:deep(.el-radio-button.is-active .el-radio-button__inner) {
  background: linear-gradient(
    to right,
    rgba(236, 72, 153, 0.15),
    rgba(219, 39, 119, 0.15)
  ) !important;
  color: #f9a8d4 !important;
  box-shadow: 0 0 0 1px rgba(236, 72, 153, 0.3) !important;
  border: none !important;
}

:deep(.el-radio-group) {
  background: rgba(17, 24, 39, 0.8) !important;
  border: 1px solid rgba(236, 72, 153, 0.2) !important;
}

:deep(.el-dialog) {
  background: #111827 !important;
  border: 1px solid rgba(236, 72, 153, 0.2) !important;
  border-radius: 16px !important;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

:deep(.el-dialog__header) {
  padding: 20px 24px !important;
  border-bottom: 1px solid rgba(236, 72, 153, 0.1) !important;
  background: linear-gradient(to right, rgba(17, 24, 39, 0.9), rgba(31, 41, 55, 0.9)) !important;
  border-radius: 16px 16px 0 0 !important;
}

:deep(.el-dialog__title) {
  color: #f3f4f6 !important;
  font-size: 18px !important;
  font-weight: 600 !important;
  background: linear-gradient(to right, #ec4899, #f472b6) !important;
  -webkit-background-clip: text !important;
  background-clip: text !important;
  color: transparent !important;
}

:deep(.el-dialog__body) {
  color: #f3f4f6 !important;
  padding: 24px !important;
  background: linear-gradient(to bottom, rgba(17, 24, 39, 0.95), rgba(31, 41, 55, 0.95)) !important;
}

:deep(.el-dialog__close) {
  color: rgba(243, 244, 246, 0.6) !important;
  font-size: 18px !important;
  width: 32px !important;
  height: 32px !important;
  border-radius: 50% !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

:deep(.el-dialog__close:hover) {
  color: #ec4899 !important;
  background: rgba(236, 72, 153, 0.1) !important;
}

@media (max-width: 768px) {
  .vip-package-card {
    padding: 16px !important;
  }

  .text-lg {
    font-size: 1rem !important;
  }

  .text-2xl {
    font-size: 1.5rem !important;
  }

  .text-3xl {
    font-size: 1.75rem !important;
  }

  :deep(.el-dialog) {
    width: 90% !important;
    margin: 0 auto !important;
    max-width: 400px !important;
  }

  :deep(.el-dialog__title) {
    font-size: 16px !important;
  }
}
</style>

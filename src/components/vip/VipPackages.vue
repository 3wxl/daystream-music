<template>
  <div ref="containerRef" class="vip-packages-section">
    <div class="mb-6">
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

    <!-- VIP套餐卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
      <div
        v-for="(pkg, index) in props.packages"
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
              {{ pkg.wavesPrice }}
            </span>
            <span class="text-gray-400 text-xs">音浪</span>
            <span
              v-if="pkg.originalPrice"
              class="text-xs text-gray-500 line-through ml-2 original-price"
            >
              {{ Math.floor(Number(pkg.originalPrice)) }}音浪
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

        <!-- 兑换按钮 -->
        <button
          class="w-full mt-4 relative overflow-hidden package-button group py-2.5 px-4 rounded-xl text-sm font-medium transition-all duration-300"
          :class="[
            'bg-gradient-to-r from-pink-600 to-pink-400 text-white border-pink-500/30 hover:shadow-[0_0_20px_rgba(236,72,153,0.3)]',
          ]"
          @click.stop="emit('purchase', pkg)"
        >
          <!-- 按钮光效 -->
          <div
            class="absolute inset-0 bg-gradient-to-r from-pink-400/0 via-white/10 to-pink-200/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          ></div>

          <!-- 按钮内容 -->
          <span class="relative z-10 flex items-center justify-center gap-1.5">
            <i class="iconfont icon-waves text-sm"></i>
            立即兑换
            <i
              class="iconfont icon-arrow-right text-xs ml-1 group-hover:translate-x-1 transition-transform"
            ></i>
          </span>

          <!-- 按钮边框光效 -->
          <div
            class="absolute -inset-[1px] bg-gradient-to-r from-pink-400/40 via-pink-300/40 to-pink-400/40 rounded-xl -z-10 opacity-0 group-hover:opacity-100 blur transition-all duration-300"
          ></div>
        </button>
      </div>
    </div>

    <!-- 支付弹框 -->
  </div>
</template>

<script setup lang="ts">
import type { VipPackage } from '@/types/vip/vipExchange'
import { buyVip } from '@/api/vip'
interface Props {
  packages: VipPackage[]
  selectedPackage: string
  selectedOptions: Record<string, 'waves'>
  userWaves?: string | number
}

interface Emits {
  (e: 'selectPackage', pkg: VipPackage): void
  (e: 'selectOption', params: { pkgId: string; optionType: 'waves' }): void
  (e: 'purchase', pkg: VipPackage): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const selectedPackageInfo = ref<VipPackage | null>(null)
const userWaves = ref<string | number>(props.userWaves || '0')
const containerRef = ref<HTMLElement | null>(null)

onMounted(() => {
  if (props.selectedPackage) {
    const selectedPkg = props.packages.find((pkg) => pkg.id === props.selectedPackage)
    if (selectedPkg) {
      selectedPackageInfo.value = selectedPkg
    }
  }
  userWaves.value = props.userWaves || '0'
})

const handleSelectPackage = (pkg: VipPackage): void => {
  emit('selectPackage', pkg)
  selectedPackageInfo.value = pkg
}

const handleSelectOption = (pkgId: string, optionType: 'waves'): void => {
  emit('selectOption', { pkgId, optionType })
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

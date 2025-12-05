<template>
  <div class="mb-12">
    <!-- 头部区域 -->
    <div class="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-3">
      <div class="space-y-1">
        <div class="flex items-center gap-3 flex-wrap">
          <div class="relative">
            <h2 class="text-2xl font-bold text-white tracking-tight pl-1">
              限时秒杀
              <span class="absolute -top-6 -right-5 md:-right-4">
                <span
                  class="inline-block px-1 py-0.5 text-xs font-bold bg-gradient-to-r from-pink-500 to-pink-300 text-white rounded-md animate-pulse shadow-lg shadow-pink-500/20"
                >
                  HOT
                </span>
              </span>
            </h2>
          </div>
          <div class="hidden md:flex items-center gap-2 mt-1 md:mt-0">
            <div class="flex items-center gap-1">
              <div class="w-1.5 h-1.5 bg-pink-500 rounded-full animate-pulse"></div>
              <span class="text-xs text-gray-400">正在进行中</span>
            </div>
          </div>
        </div>
        <p class="text-gray-400 text-sm flex items-center gap-1">
          <i class="iconfont icon-vip text-pink-400 text-xs"></i>
          VIP专享特权，错过再等一年
        </p>
      </div>

      <!-- 倒计时 -->
      <div class="w-full md:w-auto hidden lg:flex items-center">
        <div
          class="bg-gray-900/90 backdrop-blur-md rounded-lg p-3 border border-white/5 shadow-xl shadow-pink-500/5 transition-all duration-300 hover:border-pink-500/20 w-full md:w-auto"
        >
          <div class="flex items-center gap-1 mb-1">
            <i class="iconfont icon-time text-pink-400 text-sm"></i>
            <span class="text-xs font-medium text-gray-300">倒计时</span>
          </div>
          <div class="flex items-center gap-1">
            <div class="flex flex-col items-center">
              <div class="bg-gray-800 rounded-md px-2 py-1 min-w-[48px] shadow-inner">
                <span class="text-lg font-bold text-white font-mono">{{
                  countdown.hours.toString().padStart(2, '0')
                }}</span>
              </div>
              <span class="text-xs text-gray-500 mt-0.5">时</span>
            </div>
            <span class="text-lg text-gray-600 font-bold">:</span>
            <div class="flex flex-col items-center">
              <div class="bg-gray-800 rounded-md px-2 py-1 min-w-[48px] shadow-inner">
                <span class="text-lg font-bold text-white font-mono">{{
                  countdown.minutes.toString().padStart(2, '0')
                }}</span>
              </div>
              <span class="text-xs text-gray-500 mt-0.5">分</span>
            </div>
            <span class="text-lg text-gray-600 font-bold">:</span>
            <div class="flex flex-col items-center">
              <div class="bg-gray-800 rounded-md px-2 py-1 min-w-[48px] shadow-inner">
                <span class="text-lg font-bold text-white font-mono">{{
                  countdown.seconds.toString().padStart(2, '0')
                }}</span>
              </div>
              <span class="text-xs text-gray-500 mt-0.5">秒</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 秒杀商品网格 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="(flash, index) in flashSales"
        :key="flash.id"
        class="group relative overflow-hidden rounded-xl bg-gray-900/50 transition-all px-2 duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-pink-500/10"
        :style="{ animationDelay: `${index * 150}ms` }"
      >
        <!-- 背景渐变层 -->
        <div
          class="absolute inset-0 bg-gradient-to-br from-gray-900/95 via-gray-900/80 to-black/90 backdrop-blur-sm rounded-xl border border-white/5 group-hover:border-pink-500/30 transition-all duration-500"
        ></div>

        <!-- 背景光效 -->
        <div
          class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        >
          <div
            class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-pink-500/50 to-transparent"
          ></div>
          <div
            class="absolute -inset-[1px] bg-gradient-to-br from-pink-500/10 via-pink-300/5 to-rose-400/10 rounded-xl blur-sm"
          ></div>
          <!-- 角落光效 -->
          <div class="absolute top-0 left-0 w-32 h-32 bg-pink-500/5 rounded-br-full blur-2xl"></div>
          <div
            class="absolute bottom-0 right-0 w-32 h-32 bg-pink-300/5 rounded-tl-full blur-2xl"
          ></div>
        </div>

        <!-- 火爆标签 -->
        <div class="absolute top-2 left-2 z-10">
          <div class="relative">
            <div
              class="px-2.5 py-1 bg-gradient-to-r from-pink-600 to-pink-400 text-white text-[10px] font-bold rounded-tr-md rounded-br-md shadow-lg transform -rotate-2"
            >
              限时秒杀
            </div>
            <div
              class="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-pink-300 rounded-full animate-pulse"
            ></div>
          </div>
        </div>

        <!-- 折扣标签 -->
        <div class="absolute top-2 right-2 z-10">
          <div
            class="relative w-14 h-14 bg-gradient-to-br from-pink-500 to-pink-300 rounded-full flex items-center justify-center shadow-lg shadow-pink-500/30"
          >
            <div class="text-white font-bold text-xs transform -rotate-8 text-center leading-tight">
              {{
                Math.max(1, Math.round((1 - flash.flashPrice / flash.originalPrice) * 100))
              }}%<br /><span class="text-[10px]">OFF</span>
            </div>
            <div class="absolute -top-0.5 -right-0.5 w-3 h-3 bg-white rounded-full shadow-sm"></div>
          </div>
        </div>

        <!-- 卡片内容 -->
        <div class="relative p-5 pt-10">
          <!-- 标题区域 -->
          <div class="mb-4">
            <h3
              class="text-base font-bold text-white mb-1 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-pink-300 group-hover:to-pink-100 group-hover:bg-clip-text transition-all duration-300"
            >
              {{ flash.title }}
            </h3>
            <p class="text-gray-400 text-xs leading-relaxed line-clamp-2">
              {{ flash.subtitle || '优质商品，限时特惠' }}
            </p>
          </div>

          <!-- 价格区域 -->
          <div class="mb-4 flex flex-wrap items-baseline gap-2">
            <div class="flex items-baseline gap-1">
              <span class="text-xl font-bold text-white relative">
                <span class="text-xs text-pink-400 mr-0.5">¥</span>
                {{ flash.flashPrice.toFixed(2) }}
                <span
                  class="absolute -bottom-0.5 left-0 right-0 h-px bg-gradient-to-r from-pink-500/60 to-pink-300/60 blur-sm"
                ></span>
              </span>
              <span class="text-sm text-gray-500 line-through"
                >¥{{ flash.originalPrice.toFixed(2) }}</span
              >
            </div>
            <div class="ml-auto flex items-center gap-1">
              <span
                class="px-2 py-0.5 bg-gradient-to-r from-pink-500/10 to-pink-300/10 text-pink-300 text-xs font-medium rounded-full border border-pink-500/20"
              >
                省{{ (flash.originalPrice - flash.flashPrice).toFixed(0) }}元
              </span>
            </div>
          </div>

          <!-- 库存进度条 -->
          <div class="mb-4">
            <div class="flex items-center justify-between text-xs mb-1.5 flex-wrap gap-1">
              <div class="flex items-center gap-1">
                <i class="iconfont icon-fire text-pink-400 text-xs"></i>
                <span class="text-gray-300"
                  >已抢 {{ Math.min(flash.sold, flash.total) }}/{{ flash.total }}</span
                >
              </div>
              <div class="flex items-center gap-1">
                <i class="iconfont icon-warning text-pink-400 text-xs"></i>
                <span class="text-pink-300 font-medium"
                  >剩 {{ Math.max(0, flash.remaining) }} 份</span
                >
              </div>
            </div>

            <!-- 进度条 -->
            <div class="relative h-1.5 bg-gray-800 rounded-full overflow-hidden shadow-inner">
              <div
                class="absolute inset-0 bg-gradient-to-r from-pink-500 via-pink-400 to-pink-300 rounded-full transition-all duration-1000 ease-out"
                :style="{
                  width: `${Math.min(100, Math.max(0, (flash.sold / flash.total) * 100))}%`,
                }"
              >
                <div
                  class="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"
                ></div>
              </div>
              <!-- 进度条边框 -->
              <div
                class="absolute inset-0 rounded-full border border-gray-700/50 pointer-events-none"
              ></div>
            </div>
          </div>

          <!-- 按钮区域 -->
          <button
            class="group relative w-full py-2 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/20"
            :disabled="flash.remaining <= 0"
            @click="handleFlashSale(flash)"
          >
            <!-- 按钮背景 -->
            <div
              class="absolute inset-0 bg-gradient-to-r from-pink-500 to-pink-300 group-hover:from-pink-500 group-hover:to-pink-300 transition-all duration-300"
              :class="{ 'opacity-70': flash.remaining <= 0 }"
            ></div>

            <!-- 按钮光效 -->
            <div
              class="absolute inset-0 bg-gradient-to-r from-pink-400/0 via-pink-400/20 to-pink-300/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            ></div>

            <!-- 按钮内容 -->
            <div class="relative flex items-center justify-center gap-1.5 text-white">
              <i class="iconfont icon-flash text-sm"></i>
              <span class="text-sm font-semibold">
                {{ flash.remaining <= 0 ? '已售罄' : '立即抢购' }}
              </span>
            </div>

            <!-- 按钮边框光效 -->
            <div
              class="absolute -inset-[1px] bg-gradient-to-r from-pink-500 via-pink-400 to-pink-300 rounded-lg -z-10 opacity-0 group-hover:opacity-100 blur transition-all duration-300"
            ></div>

            <!-- 已售罄遮罩 -->
            <div
              v-if="flash.remaining <= 0"
              class="absolute inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center pointer-events-none"
            >
              <span class="text-sm font-semibold text-gray-400">已售罄</span>
            </div>
          </button>

          <!-- 底部提示 -->
          <div v-if="flash.remaining > 0" class="mt-3.5 text-center">
            <div
              class="inline-flex items-center gap-1 text-xs text-gray-400 bg-gray-800/50 px-2 py-0.5 rounded-full"
            >
              <i class="iconfont icon-user text-pink-400 text-xs"></i>
              <span>{{ Math.min(flash.remaining * 3, 99) }}+ 人正在抢购</span>
            </div>
          </div>
        </div>

        <!-- 卡片底部分割线 -->
        <div
          class="absolute bottom-0 left-5 right-5 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent"
        ></div>
      </div>
    </div>

    <!-- 底部说明 -->
    <div class="mt-6 text-center">
      <div
        class="inline-flex items-center gap-2 px-4 py-1.5 bg-gray-900/50 rounded-full backdrop-blur-sm border border-gray-800 shadow-lg"
      >
        <i class="iconfont icon-info text-pink-400 text-xs"></i>
        <span class="text-xs text-gray-400">每位用户限购1份，活动结束恢复原价</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FlashSale, Countdown } from '@/types/vip/vipExchange'
import { onMounted, ref } from 'vue'

interface Props {
  flashSales: FlashSale[]
  countdown: Countdown
}

interface Emits {
  (e: 'flashSale', flash: FlashSale): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const handleFlashSale = (flash: FlashSale): void => {
  if (flash.remaining <= 0) return
  emit('flashSale', flash)
}

const cardsAnimated = ref(false)
onMounted(() => {
  setTimeout(() => {
    cardsAnimated.value = true
  }, 100)
})
</script>

<style scoped>
/* 卡片进入动画 */
.group {
  opacity: 0;
  transform: translateY(15px);
  animation: cardSlideIn 0.4s ease forwards;
}

@keyframes cardSlideIn {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 进度条光效动画 */
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.animate-shimmer {
  animation: shimmer 2s infinite linear;
}

/* 按钮悬停效果 */
button:not(:disabled):hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 20px -5px rgba(236, 72, 153, 0.3);
}

/* 折扣标签动画 */
.relative.w-14 {
  animation: discountFloat 2s ease-in-out infinite;
}

@keyframes discountFloat {
  0%,
  100% {
    transform: rotate(-3deg) scale(1);
  }
  50% {
    transform: rotate(3deg) scale(1.03);
  }
}

/* 价格数字动画 */
@keyframes priceGlow {
  0%,
  100% {
    filter: drop-shadow(0 0 5px rgba(236, 72, 153, 0.2));
  }
  50% {
    filter: drop-shadow(0 0 10px rgba(236, 72, 153, 0.4));
  }
}

.text-xl.font-bold {
  animation: priceGlow 2s ease-in-out infinite;
}

/* 火爆标签动画 */
.animate-pulse {
  animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
    transform: scale(1) rotate(-2deg);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.03) rotate(-2deg);
  }
}

/* 响应式调整 */
@media (max-width: 1024px) {
  .lg\:grid-cols-3 {
    grid-template-columns: repeat(2, 1fr) !important;
  }
}

@media (max-width: 768px) {
  .md\:grid-cols-2 {
    grid-template-columns: 1fr !important;
  }

  .text-2xl {
    font-size: 1.4rem !important;
  }

  .text-base {
    font-size: 0.95rem !important;
  }

  .p-5 {
    padding: 1rem !important;
    padding-top: 1.75rem !important;
  }

  /* 移动端折扣标签尺寸优化 */
  .relative.w-14 {
    width: 12px !important;
    height: 12px !important;
  }

  .text-xs {
    font-size: 0.7rem !important;
  }
}

@media (max-width: 480px) {
  .text-2xl {
    font-size: 1.2rem !important;
  }

  .text-base {
    font-size: 0.9rem !important;
  }

  .min-w-\[48px\] {
    min-width: 36px !important;
    padding: 0.5rem 0.2rem !important;
  }

  .text-lg.font-bold {
    font-size: 0.95rem !important;
  }
}

/* 自定义滚动条 */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #ec4899, #f9a8d4);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #db2777, #f472b6);
}

/* 全局阴影优化 */
.shadow-lg {
  box-shadow:
    0 6px 10px -3px rgba(0, 0, 0, 0.2),
    0 2px 4px -1px rgba(0, 0, 0, 0.1);
}

.shadow-xl {
  box-shadow:
    0 10px 15px -5px rgba(0, 0, 0, 0.2),
    0 5px 6px -3px rgba(0, 0, 0, 0.1);
}

.shadow-inner {
  box-shadow: inset 0 1px 2px 0 rgba(0, 0, 0, 0.15);
}

/* 按钮disabled状态样式 */
button:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

/* 倒计时数字样式 */
.font-mono {
  letter-spacing: 0.5px;
}

/* 标签z-index确保在最上层 */
.z-10 {
  z-index: 10 !important;
}

/* 行高优化 */
.leading-relaxed {
  line-height: 1.5;
}

.leading-tight {
  line-height: 1.2;
}

/* 字体抗锯齿 */
* {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>

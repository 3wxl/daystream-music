<template>
  <div class="flash-sale-detail-container space-y-12 px-4 py-8">
    <!-- 即将开始的秒杀（顶部） -->
    <section class="upcoming-flash-sales" v-if="props.upcomingSales.length > 0">
      <div class="section-header mb-6">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-3">
            <h2 class="text-2xl md:text-3xl font-bold text-white tracking-tight">即将秒杀</h2>
            <span
              class="inline-block px-2 py-1 text-sm font-bold bg-gradient-to-r from-blue-500 to-blue-300 text-white rounded-lg"
            >
              COMING
            </span>
          </div>
          <p class="text-gray-400 text-sm hidden md:block">设置提醒，不错过任何优惠</p>
        </div>
      </div>

      <!-- 即将开始的秒杀商品 - 横向滚动卡片（缩小版） -->
      <div class="relative">
        <div
          ref="upcomingScrollContainer"
          class="overflow-x-auto pb-6"
          @scroll="handleUpcomingScroll"
        >
          <div class="flex gap-3 min-w-max">
            <div
              v-for="(sale, index) in props.upcomingSales"
              :key="sale.id"
              class="group relative overflow-hidden rounded-xl bg-gray-900/80 backdrop-blur-sm border border-blue-500/20 transition-all duration-500 hover:border-blue-400/50 hover:shadow-xl hover:shadow-blue-500/10 w-[220px] flex-shrink-0"
              :style="{ animationDelay: `${index * 100}ms` }"
            >
              <!-- 顶部渐变条 + 背景装饰 -->
              <!-- <div
                class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-blue-300"
              ></div> -->
              <div class="absolute inset-0 opacity-5 pointer-events-none">
                <div
                  class="absolute top-1/4 left-1/4 w-12 h-12 border-2 border-blue-400 rounded-full"
                ></div>
                <div
                  class="absolute bottom-1/4 right-1/4 w-10 h-10 border-2 border-blue-400 rounded-lg rotate-12"
                ></div>
              </div>

              <!-- 标签 -->
              <div class="absolute top-2 left-2 z-10">
                <div
                  class="px-2 py-0.5 bg-gradient-to-r from-blue-600 to-blue-400 text-white text-xs font-bold rounded-lg shadow-lg"
                >
                  即将开始
                </div>
              </div>

              <!-- 卡片内容 -->
              <div class="relative p-4 pt-8">
                <!-- 商品信息 -->
                <div class="mb-3">
                  <h3
                    class="text-sm font-bold text-white mb-1.5 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-300 group-hover:to-blue-100 group-hover:bg-clip-text transition-all duration-300 line-clamp-2"
                  >
                    {{ sale.title }}
                  </h3>
                  <p class="text-gray-400 text-[10px] leading-relaxed line-clamp-2">
                    {{ sale.subtitle || '优质商品，即将特惠，限时抢购' }}
                  </p>
                </div>

                <!-- 价格 -->
                <div class="mb-3 flex items-baseline gap-2">
                  <span class="text-lg font-bold text-white">
                    <span class="text-xs text-blue-400">¥</span>
                    {{ sale.flashPrice.toFixed(2) }}
                  </span>
                  <span class="text-xs text-gray-500 line-through">
                    ¥{{ sale.originalPrice.toFixed(2) }}
                  </span>
                </div>

                <!-- 开始倒计时 -->
                <div class="mb-4">
                  <div class="text-[10px] text-gray-400 mb-1 flex items-center gap-1">
                    <i class="iconfont icon-clock text-blue-400 text-xs"></i>
                    <span>距离开始</span>
                  </div>
                  <div class="flex items-center gap-1">
                    <div class="bg-gray-800 rounded-lg px-2 py-1 min-w-[22px] text-center">
                      <span class="text-[10px] font-bold text-white font-mono">{{
                        getCountdownDays(sale.timeLeft)
                      }}</span>
                    </div>
                    <span class="text-[10px] text-gray-600">天</span>
                    <div class="bg-gray-800 rounded-lg px-2 py-1 min-w-[22px] text-center">
                      <span class="text-[10px] font-bold text-white font-mono">{{
                        getCountdownHours(sale.timeLeft)
                      }}</span>
                    </div>
                    <span class="text-[10px] text-gray-600">:</span>
                    <div class="bg-gray-800 rounded-lg px-2 py-1 min-w-[22px] text-center">
                      <span class="text-[10px] font-bold text-white font-mono">{{
                        getCountdownMinutes(sale.timeLeft)
                      }}</span>
                    </div>
                    <span class="text-[10px] text-gray-600">:</span>
                    <div class="bg-gray-800 rounded-lg px-2 py-1 min-w-[22px] text-center">
                      <span class="text-[10px] font-bold text-white font-mono">{{
                        getCountdownSeconds(sale.timeLeft)
                      }}</span>
                    </div>
                  </div>
                </div>

                <!-- 操作按钮 -->
                <button
                  class="group relative w-full py-0.5 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30 text-[10px]"
                  @click="props.setReminder(sale)"
                >
                  <div
                    class="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-300 group-hover:from-blue-600 group-hover:to-blue-400 transition-all duration-300"
                  ></div>
                  <div
                    class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  ></div>
                  <div
                    class="relative flex items-center justify-center gap-1.5 text-white font-semibold"
                  >
                    <i class="iconfont icon-bell text-xs">&#xe890;</i>
                    <span>{{ props.isReminded(sale.id) ? '已设置提醒' : '设置提醒' }}</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 滚动提示 -->
        <!-- <div
          class="hidden md:block absolute top-1/2 right-2 -translate-y-1/2 w-7 h-7 bg-gray-900/90 rounded-full flex items-center justify-center text-gray-400"
        >
          <i class="iconfont icon-arrow-right text-[10px]"></i>
        </div> -->
      </div>

      <!-- 加载更多按钮 -->
    </section>

    <!-- 即将开始的秒杀（顶部）- 空状态 -->
    <section class="upcoming-flash-sales" v-else>
      <div
        class="text-center py-12 bg-gray-900/50 backdrop-blur-sm rounded-xl border border-white/5"
      >
        <div
          class="w-16 h-16 bg-gray-800/50 rounded-full mx-auto mb-4 flex items-center justify-center"
        >
          <i class="iconfont text-gray-500" style="font-size: 26px">&#xe61e;</i>
        </div>
        <h3 class="text-lg font-bold text-white mb-2">暂无即将开始的秒杀</h3>
        <p class="text-gray-400 text-sm">请关注后续活动通知</p>
      </div>
    </section>

    <!-- 正在进行的秒杀 -->
    <section class="ongoing-flash-sales" v-if="props.flashSales.length > 0">
      <div class="section-header mb-6">
        <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div class="space-y-1">
            <div class="flex items-center gap-3 flex-wrap">
              <h2 class="text-2xl md:text-3xl font-bold text-white tracking-tight">正在秒杀</h2>
              <span
                class="inline-block px-2 py-1 text-sm font-bold bg-gradient-to-r from-pink-500 to-pink-300 text-white rounded-lg animate-pulse"
              >
                LIVE
              </span>
            </div>
            <p class="text-gray-400 text-sm">立即抢购，限时特惠，手慢无</p>
          </div>

          <!-- 全局倒计时 -->
          <!-- <div class="w-full md:w-auto">
            <div
              class="bg-gray-900/90 backdrop-blur-md rounded-lg p-3 border border-white/5 shadow-xl shadow-pink-500/10"
            >
              <div class="flex items-center gap-2 mb-1">
                <i class="iconfont icon-time text-pink-400 text-sm"></i>
                <span class="text-xs font-medium text-gray-300">本场结束</span>
              </div>
              <div class="flex items-center gap-1.5">
                <div class="flex flex-col items-center">
                  <div class="bg-gray-800 rounded-lg px-2 py-1.5 min-w-[48px] shadow-inner">
                    <span class="text-lg font-bold text-white font-mono">{{
                      props.countdownData.hours.padStart(2, '0')
                    }}</span>
                  </div>
                  <span class="text-xs text-gray-500 mt-1">时</span>
                </div>
                <span class="text-lg text-gray-600 font-bold">:</span>
                <div class="flex flex-col items-center">
                  <div class="bg-gray-800 rounded-lg px-2 py-1.5 min-w-[48px] shadow-inner">
                    <span class="text-lg font-bold text-white font-mono">{{
                      props.countdownData.minutes.padStart(2, '0')
                    }}</span>
                  </div>
                  <span class="text-xs text-gray-500 mt-1">分</span>
                </div>
                <span class="text-lg text-gray-600 font-bold">:</span>
                <div class="flex flex-col items-center">
                  <div class="bg-gray-800 rounded-lg px-2 py-1.5 min-w-[48px] shadow-inner">
                    <span class="text-lg font-bold text-white font-mono">{{
                      props.countdownData.seconds.padStart(2, '0')
                    }}</span>
                  </div>
                  <span class="text-xs text-gray-500 mt-1">秒</span>
                </div>
              </div>
            </div>
          </div> -->
          <!-- 加载更多指示器 -->
          <!-- <div
            v-if="upcomingLoading"
            class="flex-shrink-0 w-[220px] h-40 flex items-center justify-center"
          >
            <div
              class="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"
            ></div>
          </div> -->
        </div>
      </div>

      <!-- 正在进行的秒杀商品 - 流式列表 -->
      <div class="space-y-4">
        <div
          v-for="(flash, index) in props.flashSales"
          :key="flash.id"
          class="group relative overflow-hidden rounded-xl bg-gray-900/80 backdrop-blur-sm border border-pink-500/20 transition-all duration-500 hover:border-pink-400/50 hover:shadow-xl hover:shadow-pink-500/10 p-4"
          :style="{ animationDelay: `${index * 100}ms` }"
        >
          <!-- 顶部渐变条 + 背景装饰 -->
          <!-- <div
            class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 to-pink-300"
          ></div> -->
          <div class="absolute inset-0 opacity-5 pointer-events-none">
            <div
              class="absolute top-1/4 right-1/4 w-14 h-14 border-2 border-pink-300 rounded-full"
            ></div>
            <div
              class="absolute bottom-1/4 left-1/4 w-10 h-10 border-2 border-pink-300 rounded-lg -rotate-12"
            ></div>
          </div>

          <!-- 内容区域 -->
          <div class="relative grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <!-- 左侧：商品信息 + 价格 -->
            <div class="md:col-span-8 space-y-3">
              <!-- 标签和标题 -->
              <div class="flex flex-wrap items-center gap-2">
                <div
                  class="inline-block px-2 py-1 bg-gradient-to-r from-pink-600 to-pink-400 text-white text-xs font-bold rounded-lg shadow-lg"
                >
                  限时秒杀
                </div>
                <h3
                  class="text-lg font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-pink-300 group-hover:to-pink-100 group-hover:bg-clip-text transition-all duration-300"
                >
                  {{ flash.title }}
                </h3>
              </div>

              <!-- 描述和价格 -->
              <div class="flex flex-wrap items-center gap-4">
                <p
                  class="text-gray-400 text-sm leading-relaxed line-clamp-1 md:line-clamp-2 flex-1"
                >
                  {{ flash.subtitle || '优质商品，限时特惠，库存有限，先到先得' }}
                </p>
                <div class="flex items-baseline gap-2">
                  <span class="text-xl font-bold text-white">
                    <span class="text-sm text-pink-400">¥</span>
                    {{ flash.flashPrice.toFixed(2) }}
                  </span>
                  <span class="text-sm text-gray-500 line-through">
                    ¥{{ flash.originalPrice.toFixed(2) }}
                  </span>
                </div>
              </div>
            </div>

            <!-- 右侧：折扣 + 库存 + 按钮 -->
            <div
              class="md:col-span-4 flex flex-col md:flex-row items-stretch md:items-center gap-3"
            >
              <!-- 折扣标签 -->
              <div
                class="relative w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-300 rounded-full flex items-center justify-center shadow-lg flex-shrink-0"
              >
                <div class="text-white font-bold text-xs transform -rotate-12 text-center">
                  {{
                    Math.max(1, Math.round((1 - flash.flashPrice / flash.originalPrice) * 100))
                  }}%<br /><span class="text-[8px]">OFF</span>
                </div>
              </div>

              <!-- 库存信息 -->
              <div class="flex-1 min-w-[120px]">
                <div class="flex items-center justify-between text-xs mb-1">
                  <span class="text-gray-300"
                    >已抢 {{ Math.min(flash.sold, flash.total) }}/{{ flash.total }}</span
                  >
                  <span class="text-pink-300 font-medium"
                    >剩 {{ Math.max(0, flash.remaining) }} 份</span
                  >
                </div>
                <div class="relative h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    class="absolute inset-0 bg-gradient-to-r from-pink-500 via-pink-400 to-pink-300 rounded-full transition-all duration-1000 ease-out"
                    :style="{
                      width: `${Math.min(100, Math.max(0, (flash.sold / flash.total) * 100))}%`,
                    }"
                  ></div>
                </div>
              </div>

              <!-- 抢购按钮 -->
              <button
                class="group relative w-full md:w-auto px-4 py-2 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/30 flex-shrink-0"
                :disabled="flash.remaining <= 0"
                @click="$emit('flashSale', flash)"
              >
                <div
                  class="absolute inset-0 bg-gradient-to-r from-pink-500 to-pink-300 group-hover:from-pink-600 group-hover:to-pink-400 transition-all duration-300"
                  :class="{ 'opacity-70': flash.remaining <= 0 }"
                ></div>
                <div
                  class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                ></div>
                <div
                  class="relative flex items-center justify-center gap-1.5 text-white font-semibold text-sm"
                >
                  <i class="iconfont icon-flash text-sm"></i>
                  <span>{{ flash.remaining <= 0 ? '已售罄' : '抢购' }}</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 正在进行的秒杀 - 空状态 -->
    <section class="ongoing-flash-sales" v-else>
      <div
        class="text-center py-12 bg-gray-900/50 backdrop-blur-sm rounded-xl border border-white/5"
      >
        <div
          class="w-16 h-16 bg-gray-800/50 rounded-full mx-auto mb-4 flex items-center justify-center"
        >
          <i class="iconfont text-gray-500" style="font-size: 26px">&#xe8b6;</i>
        </div>
        <h3 class="text-lg font-bold text-white mb-2">暂无正在进行的秒杀</h3>
        <p class="text-gray-400 text-sm">敬请期待更多秒杀活动</p>
      </div>
    </section>

    <div class="mt-8 text-center">
      <button
        v-if="hasMoreOngoing"
        @click="loadMoreOngoing"
        :disabled="ongoingLoading"
        class="group relative px-6 py-2 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/30"
      >
        <div
          class="absolute inset-0 bg-gradient-to-r from-pink-500 to-pink-300 group-hover:from-pink-600 group-hover:to-pink-400 transition-all duration-300"
          :class="{ 'opacity-70': ongoingLoading }"
        ></div>
        <div
          class="relative flex items-center justify-center gap-1.5 text-white font-semibold text-sm"
        >
          <i v-if="ongoingLoading" class="iconfont icon-loading text-sm animate-spin"></i>
          <i v-else class="iconfont icon-arrow-down text-sm"></i>
          <span>{{ ongoingLoading ? '加载中...' : '加载更多' }}</span>
        </div>
      </button>
      <div v-else class="text-gray-500 text-sm">
        <i class="iconfont icon-check-circle text-xs mr-1"></i>
        已加载全部
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FlashSale, Countdown, UpcomingFlashSale } from '@/types/vip/vipExchange'

interface Props {
  flashSales?: FlashSale[]
  upcomingSales?: FlashSale[]
  countdownData?: Countdown
  upcomingCountdown?: Countdown
  setReminder: (sale: UpcomingFlashSale) => void // 使用全局类型
  isReminded: (id: string) => boolean
  // 分页状态（保留）
  ongoingCurrentPage: number
  ongoingTotalPages: number
  ongoingLoading: boolean
  upcomingCurrentPage: number
  upcomingTotalPages: number
  upcomingLoading: boolean
}

interface Emits {
  (e: 'flashSale', flash: FlashSale): void
  (e: 'loadMoreUpcoming', page: number): void
  (e: 'loadMoreOngoing', page: number): void
}

// 设置默认值以避免undefined错误
const props = withDefaults(defineProps<Props>(), {
  flashSales: () => [],
  upcomingSales: () => [],
  countdownData: () => ({ hours: '00', minutes: '00', seconds: '00' }),
  upcomingCountdown: () => ({ hours: '00', minutes: '00', seconds: '00' }),
  ongoingCurrentPage: 1,
  ongoingTotalPages: 0,
  ongoingLoading: false,
  upcomingCurrentPage: 1,
  upcomingTotalPages: 0,
  upcomingLoading: false,
})
const emit = defineEmits<Emits>()

// 滚动容器引用
const upcomingScrollContainer = ref<HTMLElement | null>(null)

// 计算是否有更多数据
const hasMoreOngoing = computed(() => {
  return props.ongoingCurrentPage < props.ongoingTotalPages
})
const hasMoreUpcoming = computed(() => {
  return props.upcomingCurrentPage < props.upcomingTotalPages
})

// 滚动事件处理
const handleUpcomingScroll = () => {
  if (!upcomingScrollContainer.value || props.upcomingLoading || !hasMoreUpcoming.value) return

  const container = upcomingScrollContainer.value
  const { scrollLeft, clientWidth, scrollWidth } = container

  // 当滚动到离右侧50px时触发加载更多
  if (scrollWidth - scrollLeft - clientWidth < 50) {
    loadMoreUpcoming()
  }
}

// 加载更多即将秒杀数据
const loadMoreUpcoming = () => {
  if (props.upcomingLoading || !hasMoreUpcoming.value) return
  const nextPage = props.upcomingCurrentPage + 1
  emit('loadMoreUpcoming', nextPage)
}

// 加载更多正在秒杀
const loadMoreOngoing = () => {
  if (props.ongoingLoading || !hasMoreOngoing.value) return
  const nextPage = props.ongoingCurrentPage + 1
  console.log(nextPage)
  emit('loadMoreOngoing', nextPage)
}

// 倒计时计算函数
const getCountdownDays = (timeLeft: number): string => {
  return Math.floor(timeLeft / (3600 * 24))
    .toString()
    .padStart(2, '0')
}

const getCountdownHours = (timeLeft: number): string => {
  return Math.floor((timeLeft % (3600 * 24)) / 3600)
    .toString()
    .padStart(2, '0')
}

const getCountdownMinutes = (timeLeft: number): string => {
  return Math.floor((timeLeft % 3600) / 60)
    .toString()
    .padStart(2, '0')
}

const getCountdownSeconds = (timeLeft: number): string => {
  return Math.floor(timeLeft % 60)
    .toString()
    .padStart(2, '0')
}
</script>

<style scoped>
.flash-sale-detail-container {
  background-color: #0a0a0f;
  min-height: 100%;
}

/* 卡片入场动画 */
.group {
  opacity: 0;
  transform: translateY(10px);
  animation: slideInUp 0.5s ease forwards;
}

@keyframes slideInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 隐藏滚动条 */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* 即将秒杀部分的自定义滚动条 */
.upcoming-flash-sales .overflow-x-auto::-webkit-scrollbar {
  height: 2px !important; /* 细滚动条 */
}

.upcoming-flash-sales .overflow-x-auto::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05); /* 淡灰色轨道 */
  border-radius: 2px;
}

.upcoming-flash-sales .overflow-x-auto::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.15); /* 淡色滑块 */
  border-radius: 2px;
}

.upcoming-flash-sales .overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.25); /* 悬停时稍微变亮 */
}

/* 响应式适配 */
@media (max-width: 768px) {
  .text-3xl {
    font-size: 1.75rem !important;
  }

  .md\:grid-cols-12 {
    grid-template-columns: 1fr !important;
  }

  .md\:col-span-8,
  .md\:col-span-4 {
    grid-column: span 1 !important;
  }

  .md\:flex-row {
    flex-direction: column !important;
  }

  .md\:w-auto {
    width: 100% !important;
  }
}

@media (max-width: 480px) {
  .text-2xl {
    font-size: 1.5rem !important;
  }

  .section-header {
    flex-direction: column !important;
    align-items: flex-start !important;
  }

  .flex-1.md\:flex-row {
    flex-direction: row !important;
    flex-wrap: wrap;
  }
}
</style>

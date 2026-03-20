<template>
  <div class="mb-8">
    <!-- 头部区域 -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-2">
        <h3 class="text-lg font-bold text-white tracking-tight">即将秒杀</h3>
        <span
          class="inline-block px-2 py-0.5 text-xs font-medium bg-gradient-to-r from-blue-500 to-blue-300 text-white rounded-md"
        >
          COMING
        </span>
      </div>
      <p class="text-gray-400 text-xs">提前预览，准备开抢</p>
    </div>

    <!-- 即将秒杀商品横向滚动 -->
    <div class="relative">
      <div ref="scrollContainer" class="overflow-x-auto pb-2" @scroll="handleScroll">
        <div class="flex gap-4 min-w-max" v-if="mergedUpcomingSales.length > 0">
          <div
            v-for="(flash, index) in mergedUpcomingSales"
            :key="flash.id"
            class="group relative overflow-hidden rounded-lg bg-gray-900/50 transition-all duration-500 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/10 min-w-[200px] max-w-[200px]"
            :style="{ animationDelay: `${index * 100}ms` }"
          >
            <!-- 背景渐变层 -->
            <div
              class="absolute inset-0 bg-gradient-to-br from-gray-900/95 via-gray-900/80 to-black/90 backdrop-blur-sm rounded-lg border border-white/5 group-hover:border-blue-500/30 transition-all duration-500"
            ></div>

            <!-- 背景光效 -->
            <div
              class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
            >
              <div
                class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"
              ></div>
              <div
                class="absolute -inset-[1px] bg-gradient-to-br from-blue-500/10 via-blue-300/5 to-blue-400/10 rounded-lg blur-sm"
              ></div>
            </div>

            <!-- 即将开始标签 -->
            <div class="absolute top-2 left-2 z-10">
              <div
                class="px-2 py-0.5 bg-gradient-to-r from-blue-600 to-blue-400 text-white text-[10px] font-bold rounded-md shadow-md"
              >
                即将开始
              </div>
            </div>

            <!-- 折扣标签 -->
            <!-- <div class="absolute top-2 right-2 z-10">
              <div
                class="relative w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-300 rounded-full flex items-center justify-center shadow-md shadow-blue-500/30"
              >
                <div class="text-white font-bold text-xs text-center leading-tight">
                  {{
                    Math.max(1, Math.round((1 - flash.flashPrice / flash.originalPrice) * 100))
                  }}%<br /><span class="text-[9px]">OFF</span>
                </div>
              </div>
            </div> -->

            <!-- 卡片内容 -->
            <div class="relative p-4 pt-8">
              <!-- 标题区域 -->
              <div class="mb-3">
                <h4
                  class="text-sm font-bold text-white mb-1 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-300 group-hover:to-blue-100 group-hover:bg-clip-text transition-all duration-300 line-clamp-1"
                >
                  {{ flash.title }}
                </h4>
                <p class="text-gray-400 text-xs line-clamp-2">
                  {{ flash.subtitle || '优质商品，限时特惠' }}
                </p>
              </div>

              <!-- 价格区域 -->
              <div class="mb-3 flex items-baseline gap-1">
                <span class="text-base font-bold text-white">
                  <span class="text-xs text-blue-400 mr-0.5">¥</span>
                  {{ flash.flashPrice.toFixed(2) }}
                </span>
                <span class="text-xs text-gray-500 line-through">
                  ¥{{ flash.originalPrice.toFixed(2) }}
                </span>
              </div>

              <!-- 开始倒计时 -->
              <div class="mb-3">
                <div class="text-xs text-gray-400 mb-1 flex items-center gap-1">
                  <i class="iconfont icon-clock text-blue-400 text-xs"></i>
                  <span>距离开始</span>
                </div>
                <div class="flex items-center gap-1">
                  <div class="bg-gray-800 rounded px-1.5 py-0.5 min-w-[24px] text-center">
                    <span class="text-xs font-bold text-white font-mono">{{
                      getSaleCountdown(flash.timeLeft).days
                    }}</span>
                  </div>
                  <span class="text-xs text-gray-600">天</span>
                  <div class="bg-gray-800 rounded px-1.5 py-0.5 min-w-[24px] text-center">
                    <span class="text-xs font-bold text-white font-mono">{{
                      getSaleCountdown(flash.timeLeft).hours
                    }}</span>
                  </div>
                  <span class="text-xs text-gray-600">:</span>
                  <div class="bg-gray-800 rounded px-1.5 py-0.5 min-w-[24px] text-center">
                    <span class="text-xs font-bold text-white font-mono">{{
                      getSaleCountdown(flash.timeLeft).minutes
                    }}</span>
                  </div>
                  <span class="text-xs text-gray-600">:</span>
                  <div class="bg-gray-800 rounded px-1.5 py-0.5 min-w-[24px] text-center">
                    <span class="text-xs font-bold text-white font-mono">{{
                      getSaleCountdown(flash.timeLeft).seconds
                    }}</span>
                  </div>
                </div>
              </div>

              <!-- 预约按钮 -->
              <button
                class="w-full py-1.5 px-3 rounded-md bg-blue-700/30 hover:bg-blue-700/40 text-white text-xs font-medium transition-all duration-300 border border-blue-700/30"
                @click="setReminder(flash)"
              >
                {{ isReminded(flash.id) ? '已提醒' : '提醒我' }}
              </button>
            </div>
          </div>
          <!-- 加载更多指示器 -->
          <div v-if="loading" class="flex-shrink-0 w-[200px] h-40 flex items-center justify-center">
            <div
              class="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"
            ></div>
          </div>
        </div>
        <!-- 空状态提示 -->
        <div
          v-else
          class="w-full h-60 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm rounded-lg border border-white/5"
        >
          <div class="text-center">
            <div
              class="w-12 h-12 bg-gray-800/50 rounded-full mx-auto mb-3 flex items-center justify-center"
            >
              <i class="iconfont text-blue-500 text-xl" style="font-size: 24px">&#xe61e;</i>
            </div>
            <h3 class="text-base font-bold text-white mb-1">暂无即将开始的秒杀</h3>
            <p class="text-gray-400 text-xs">敬请期待更多秒杀活动</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FlashSale, Countdown, UpcomingFlashSale } from '@/types/vip/vipExchange'
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { ElMessage } from 'element-plus'

// 定义props
interface Props {
  upcomingFlashSales: FlashSale[]
  countdown?: Countdown
  setReminder?: (sale: UpcomingFlashSale) => void
  isReminded?: (id: string) => boolean
  loadMoreUpcoming?: (page: number) => Promise<FlashSale[]>
}

// 接收props
const props = withDefaults(defineProps<Props>(), {
  upcomingFlashSales: () => [],
  loadMoreUpcoming: async () => [],
})

// 定义emit
const emit = defineEmits<{
  (e: 'update:upcomingFlashSales', value: FlashSale[]): void
  (e: 'loadMore', page: number): void
}>()

// 滚动容器引用
const scrollContainer = ref<HTMLElement | null>(null)

// 分页和加载状态
const currentPage = ref(1)
const loading = ref(false)
const hasMore = ref(true)

// 合并的即将秒杀商品列表
const mergedUpcomingSales = ref<FlashSale[]>(props.upcomingFlashSales)

// 监听props变化，更新合并列表
watch(
  () => props.upcomingFlashSales,
  (newSales) => {
    if (newSales && newSales.length > 0) {
      mergedUpcomingSales.value = newSales
    }
  },
  { immediate: true, deep: true },
)

// 计算每个商品的独立倒计时
const getSaleCountdown = (timeLeft: number): Countdown => {
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
  return { days, hours, minutes, seconds }
}

// 滚动事件处理
const handleScroll = () => {
  if (!scrollContainer.value || loading.value || !hasMore.value) return

  const container = scrollContainer.value
  const { scrollLeft, clientWidth, scrollWidth } = container

  // 当滚动到离右侧50px时触发加载更多
  if (scrollWidth - scrollLeft - clientWidth < 50) {
    loadMore()
  }
}

// 加载更多数据
const loadMore = async () => {
  if (loading.value || !hasMore.value) return

  loading.value = true
  try {
    currentPage.value++

    // 触发加载更多事件
    emit('loadMore', currentPage.value)

    // 调用父组件传入的加载更多方法
    const newItems = await props.loadMoreUpcoming(currentPage.value)

    if (newItems && newItems.length > 0) {
      // 避免重复添加
      const uniqueItems = newItems.filter(
        (newItem) => !mergedUpcomingSales.value.some((existing) => existing.id === newItem.id),
      )

      if (uniqueItems.length > 0) {
        mergedUpcomingSales.value = [...mergedUpcomingSales.value, ...uniqueItems]
        emit('update:upcomingFlashSales', mergedUpcomingSales.value)
      } else {
        hasMore.value = false
      }
    } else {
      hasMore.value = false
    }
  } catch (error) {
    console.error('加载更多数据失败:', error)
    currentPage.value--
    ElMessage.error('加载更多失败，请稍后再试')
  } finally {
    loading.value = false
  }
}

// 默认提醒函数
const localReminders = ref<Set<string>>(new Set())

const setReminder = (sale: FlashSale) => {
  if (props.setReminder) {
    props.setReminder(sale as UpcomingFlashSale)
  } else {
    // 本地默认实现
    localReminders.value.add(sale.id)
    ElMessage.success(`已设置提醒，活动开始前将通知您！`)
  }
}

const isReminded = (id: string) => {
  if (props.isReminded) {
    return props.isReminded(id)
  }
  return localReminders.value.has(id)
}
</script>

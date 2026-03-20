<template>
  <div
    class="flash-sale-detail-page bg-gradient-to-br from-gray-950 via-gray-900 to-black min-h-screen"
  >
    <!-- 背景装饰 -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <!-- 顶部渐变光效 -->
      <div
        class="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-purple-900/10 via-transparent to-transparent blur-3xl"
      ></div>
      <!-- 左侧光效 -->
      <div class="absolute top-1/3 left-0 w-96 h-96 bg-blue-900/10 rounded-full blur-3xl"></div>
      <!-- 右侧光效 -->
      <div class="absolute top-2/3 right-0 w-96 h-96 bg-pink-900/10 rounded-full blur-3xl"></div>
    </div>

    <!-- 主内容区 -->
    <main class="relative container mx-auto px-4 py-8">
      <!-- 页面标题 -->
      <div class="mb-12 text-center">
        <h1
          class="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-500 via-pink-300 to-blue-300 bg-clip-text text-transparent mb-4"
        >
          秒杀商品详情
        </h1>
        <p class="text-gray-400 text-sm md:text-base">查看所有即将开始和正在进行的秒杀商品</p>
      </div>

      <!-- 秒杀商品展示 -->
      <FlashSaleDetail
        :flash-sales="flashSales"
        :upcoming-sales="upcomingSales"
        :countdown-data="countdownData"
        :upcoming-countdown="upcomingCountdown"
        :set-reminder="setReminder"
        :is-reminded="isReminded"
        :ongoing-current-page="ongoingCurrentPage"
        :ongoing-total-pages="ongoingTotalPages"
        :ongoing-loading="ongoingLoading"
        :upcoming-current-page="upcomingCurrentPage"
        :upcoming-total-pages="upcomingTotalPages"
        :upcoming-loading="upcomingLoading"
        @flash-sale="handleFlashSale"
        @load-more-upcoming="handleLoadMoreUpcoming"
        @load-more-ongoing="handleLoadMoreOngoing"
      />
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import FlashSaleDetail from '@/components/vip/FlashSaleDetail.vue'
import { useFlashSales, useUserData } from '@/composables/useVipExchange'
import type { FlashSale, UpcomingFlashSale } from '@/types/vip/vipExchange'

// 使用秒杀相关的hook
const {
  flashSales,
  upcomingSales,
  countdownData,
  upcomingCountdown,
  fetchOngoingSeckill,
  fetchUpcomingSeckill,
  setReminder,
  isReminded,
  handleFlashSale: handleFlashSaleHook,
  // 分页状态
  ongoingCurrentPage,
  ongoingTotalPages,
  ongoingLoading,
  upcomingCurrentPage,
  upcomingTotalPages,
  upcomingLoading,
} = useFlashSales()
const { loadUserInfo, userData } = useUserData()
// 处理秒杀购买·
const handleFlashSale = async (flash: FlashSale): Promise<void> => {
  console.log('秒杀购买:', flash)
  // 调用真实的秒杀接口
  await loadUserInfo()
  handleFlashSaleHook(flash.id, userData.value.walletBalance)
}

// 处理加载更多即将秒杀数据
const handleLoadMoreUpcoming = (page: number): void => {
  console.log('加载更多即将秒杀数据，页码:', page)
  // 调用加载更多的方法
  fetchUpcomingSeckill(page)
}

// 处理加载更多正在秒杀数据
const handleLoadMoreOngoing = (page: number): void => {
  console.log('加载更多正在秒杀数据，页码:嗯嗯', page)
  // 调用加载更多的方法
  fetchOngoingSeckill(page)
}

// 页面加载时获取数据
onMounted(async () => {
  await loadUserInfo()
  fetchOngoingSeckill()
  fetchUpcomingSeckill()
})
</script>

<style scoped>
/* 页面级样式 */
.flash-sale-detail-page {
  /* 确保页面占满整个视口 */
  min-height: 100vh;
  /* 添加自定义滚动条 */
  scrollbar-width: thin;
  scrollbar-color: rgba(236, 72, 153, 0.5) rgba(17, 24, 39, 0.5);
}

.flash-sale-detail-page::-webkit-scrollbar {
  width: 8px;
}

.flash-sale-detail-page::-webkit-scrollbar-track {
  background: rgba(17, 24, 39, 0.5);
}

.flash-sale-detail-page::-webkit-scrollbar-thumb {
  background: rgba(236, 72, 153, 0.5);
  border-radius: 4px;
}

.flash-sale-detail-page::-webkit-scrollbar-thumb:hover {
  background: rgba(236, 72, 153, 0.7);
}
</style>

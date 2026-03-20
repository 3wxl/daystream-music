<template>
  <div
    class="p-6 rounded-2xl bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-lg border border-white/10 relative exchange-records-card"
  >
    <h3 class="text-xl font-bold mb-4 flex items-center gap-2 text-white">
      <i class="iconfont icon-history text-pink-400">&#xe654;</i>
      最近兑换记录
    </h3>

    <div class="space-y-3 h-[585px] overflow-y-auto pr-2 custom-scrollbar">
      <!-- 订单记录列表 - 仅保留已支付样式 -->
      <div
        v-for="record in records"
        :key="record.orderNo"
        class="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300 cursor-pointer relative group border-l-3 border-transparent hover:border-l-pink-500 hover:shadow-lg hover:bg-white/[0.08] hover:translate-x-1 overflow-hidden"
        @click="handleRecordClick(record)"
      >
        <!-- 流光效果背景 -->
        <div
          class="absolute inset-0 bg-gradient-to-r from-transparent via-pink-500/10 to-transparent opacity-0 group-hover:opacity-100 animate-recordShine pointer-events-none"
        ></div>

        <div class="flex items-center justify-between mb-1 relative z-10">
          <span
            class="font-medium group-hover:text-pink-300 transition-colors duration-300 text-white"
          >
            {{ record.productName }}
          </span>
          <span
            class="text-xs px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-400 border border-pink-500/30 relative overflow-hidden transition-all duration-300 group-hover:scale-105 group-hover:shadow-pink-500/20 group-hover:bg-pink-500/30 group-hover:border-pink-500/50"
          >
            <span class="absolute inset-0 bg-current opacity-10 rounded-full"></span>
            {{ record.statusDesc }}
          </span>
        </div>
        <div class="flex justify-between text-sm relative z-10">
          <span class="text-gray-400">
            {{ formatDate(record.createdTime) }}
          </span>
          <span class="font-semibold text-pink-400"> {{ record.price }}音浪 </span>
        </div>
        <!-- <div class="text-xs mt-1 flex justify-between relative z-10">
          <span class="text-gray-500">支付金额</span>
          <span class="flex items-center gap-1 text-pink-400">
            <i class="iconfont icon-waves text-xs animate-wavePulse"></i>
            {{ record.price }}音浪
          </span>
        </div> -->
      </div>

      <!-- 加载更多和加载状态 -->
      <div class="text-center py-4">
        <div v-if="loading" class="text-gray-400 text-sm">加载中...</div>
        <div
          v-else-if="hasMore"
          class="text-pink-400 text-sm cursor-pointer hover:text-pink-300 transition-colors"
          @click="handleLoadMore"
        >
          加载更多
        </div>
        <div v-else class="text-gray-500 text-sm">没有更多数据了</div>
      </div>

      <!-- 无记录时显示 -->
      <div
        v-if="records.length === 0 && !loading"
        class="text-center py-16 text-gray-500 h-full flex flex-col items-center justify-center animate-fadeIn"
      >
        <i class="iconfont icon-shoppingcart text-6xl mb-4 text-pink-400/80 animate-pulse"></i>
        <p class="text-lg font-medium text-white mb-2">快去抢购吧</p>
        <p class="text-sm text-gray-400">限时秒杀商品，错过再等一年</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ExchangeRecord } from '@/types/vip/vipExchange'

interface Props {
  records: ExchangeRecord[]
  loading?: boolean
  hasMore?: boolean
}

interface Emits {
  (e: 'recordClick', record: ExchangeRecord): void
  (e: 'loadMore'): void
  (e: 'refresh'): void
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  hasMore: false,
})
const emit = defineEmits<Emits>()

// 格式化日期时间
const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}`
}

const handleRecordClick = (record: ExchangeRecord): void => {
  emit('recordClick', record)
}

const handleLoadMore = (): void => {
  if (props.hasMore && !props.loading) {
    emit('loadMore')
  }
}
</script>

<style scoped>
/* 自定义工具类 - 因为 Tailwind 默认不包含这些，所以需要自定义 */
.border-l-3 {
  border-left-width: 3px;
}

/* 自定义动画 */
@keyframes recordShine {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

@keyframes wavePulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-recordShine {
  animation: recordShine 1.5s ease-out forwards;
}

.animate-wavePulse {
  animation: wavePulse 2s infinite ease-in-out;
}

.animate-fadeIn {
  animation: fadeIn 0.6s ease-out;
}

/* 滚动条样式优化 */
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #ec4899 rgba(255, 255, 255, 0.05);
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #ec4899, #f43f5e);
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #db2777, #e11d48);
}

/* 卡片背景光效 */
.exchange-records-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(236, 72, 153, 0.05), transparent);
  opacity: 0.5;
  z-index: -1;
  border-radius: inherit;
  pointer-events: none;
}

/* 确保伪元素不会干扰内容 */
.exchange-records-card {
  position: relative;
  isolation: isolate;
}

/* 确保流光效果在正确的位置 */
.group:hover .group-hover\:animate-recordShine {
  animation: recordShine 1.5s ease-out forwards;
}
</style>

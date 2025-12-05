<template>
  <div
    class="p-6 rounded-2xl bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-lg border border-white/10 exchange-records-card"
  >
    <h3 class="text-xl font-bold mb-4 flex items-center gap-2">
      <i class="iconfont icon-history text-pink-400"></i>
      最近兑换记录
    </h3>

    <div class="space-y-3 max-h-80 overflow-y-auto pr-2">
      <div
        v-for="record in records"
        :key="record.id"
        class="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300 cursor-pointer exchange-record-item"
        @click="handleRecordClick(record)"
      >
        <div class="flex items-center justify-between mb-1">
          <span
            class="font-medium text-white group-hover:text-pink-300 transition-colors duration-300"
          >
            {{ record.type }}
          </span>
          <span
            :class="[
              'text-xs px-2 py-0.5 rounded-full status-badge',
              record.status === 'success'
                ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30'
                : record.status === 'pending'
                  ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                  : 'bg-red-500/20 text-red-400 border border-red-500/30',
            ]"
          >
            {{ getStatusText(record.status) }}
          </span>
        </div>
        <div class="flex justify-between text-sm">
          <span class="text-gray-400">{{ record.date }}</span>
          <span :class="['font-semibold', record.amount > 0 ? 'text-pink-400' : 'text-yellow-400']">
            {{ record.amount > 0 ? '+' : '' }}{{ record.amount }}{{ record.unit }}
          </span>
        </div>
        <div class="text-xs text-gray-500 mt-1 flex justify-between">
          <span>消耗音浪</span>
          <span class="text-pink-400 flex items-center gap-1">
            <i class="iconfont icon-waves text-xs"></i>
            {{ record.waves }}音浪
          </span>
        </div>
      </div>

      <!-- 无记录时显示 -->
      <div v-if="records.length === 0" class="text-center py-6 text-gray-500 empty-state">
        <i class="iconfont icon-empty text-3xl mb-2 text-pink-400/50"></i>
        <p>暂无兑换记录</p>
        <p class="text-xs mt-1">快去兑换VIP享受专属特权吧～</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ExchangeRecord } from '@/types/vip/vipExchange'

interface Props {
  records: ExchangeRecord[]
}

interface Emits {
  (e: 'recordClick', record: ExchangeRecord): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const getStatusText = (status: string): string => {
  const statusMap: Record<string, string> = {
    success: '成功',
    pending: '处理中',
    failed: '失败',
  }
  return statusMap[status] || status
}

const handleRecordClick = (record: ExchangeRecord): void => {
  emit('recordClick', record)
}
</script>

<style scoped>
.exchange-records-card {
  position: relative;
}

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
}

.exchange-record-item {
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-left: 3px solid transparent;
  border-radius: 8px !important;
}

.exchange-record-item:hover {
  transform: translateX(5px);
  border-left-color: #ec4899;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  background-color: rgba(255, 255, 255, 0.08) !important;
}

.exchange-record-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(236, 72, 153, 0.08), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.exchange-record-item:hover::before {
  opacity: 1;
  animation: recordShine 1.5s ease-out forwards;
}

@keyframes recordShine {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.status-badge {
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.status-badge::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: currentColor;
  opacity: 0.1;
  border-radius: inherit;
}

.exchange-record-item:hover .status-badge {
  transform: scale(1.05);
  box-shadow: 0 0 5px rgba(236, 72, 153, 0.2);
}

/* 成功状态的特殊光效 */
.status-badge.bg-pink-500\/20:hover {
  background-color: rgba(236, 72, 153, 0.3) !important;
  border-color: rgba(236, 72, 153, 0.5) !important;
}

.empty-state {
  animation: fadeIn 0.6s ease-out;
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

/* 滚动条样式优化（改为粉色系） */
.exchange-records-card::-webkit-scrollbar {
  width: 6px;
}

.exchange-records-card::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
}

.exchange-records-card::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #ec4899, #f43f5e);
  border-radius: 4px;
}

.exchange-records-card::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #db2777, #e11d48);
}

/* 文本 hover 效果 */
.font-medium {
  transition: color 0.3s ease;
}

.exchange-record-item:hover .font-medium {
  color: #f9a8d4 !important;
}

/* 音浪图标样式 */
.icon-waves {
  animation: wavePulse 2s infinite ease-in-out;
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
</style>

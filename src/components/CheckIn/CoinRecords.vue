<template>
  <section class="animate-fade-in-up" :style="{ animationDelay: animationDelay }">
    <h2
      class="text-xl font-bold bg-gradient-to-r from-pink-500 to-pink-300 bg-clip-text text-transparent mb-4"
    >
      音浪记录
    </h2>

    <div
      class="bg-gray-800/50 backdrop-blur-md border border-gray-700/50 rounded-xl p-4 max-h-80 overflow-y-auto custom-scrollbar"
    >
      <div
        v-for="record in records"
        :key="record.id"
        class="flex items-center justify-between py-3 border-b border-gray-700/50 last:border-b-0 hover:bg-white/5 transition-colors cursor-pointer"
        @click="showRecordDetail(record)"
      >
        <div class="flex items-center gap-3">
          <div
            class="w-8 h-8 rounded-full flex items-center justify-center"
            :class="
              record.type === 'earn'
                ? 'bg-green-500/20 text-green-400'
                : 'bg-pink-400/20 text-pink-300'
            "
          >
            <i class="iconfont" style="font-size: 18px" v-html="record.icon"></i>
          </div>
          <div>
            <h4 class="font-medium text-white text-sm">{{ record.title }}</h4>
            <p class="text-gray-400 text-xs">{{ record.time }}</p>
          </div>
        </div>

        <div
          class="font-semibold"
          :class="record.type === 'earn' ? 'text-green-400' : 'text-pink-300'"
        >
          {{ record.type === 'earn' ? '+' : '-' }}{{ record.amount }}
          <i class="iconfont">&#xe6ac;</i>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { CoinRecord } from '@/types/checkIn/index.ts'

interface Props {
  records: CoinRecord[]
  animationDelay?: string
}

withDefaults(defineProps<Props>(), {
  animationDelay: '0.3s',
})

const emit = defineEmits<{
  'show-record': [record: CoinRecord]
}>()

const showRecordDetail = (record: CoinRecord) => {
  emit('show-record', record)
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(236, 72, 153, 0.3);
  border-radius: 3px;
  transition: all 0.3s ease;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(236, 72, 153, 0.5);
}
</style>

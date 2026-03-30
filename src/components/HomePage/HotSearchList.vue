<template>
  <div class="hot-search-list rounded-lg shadow-2xl border border-gray-700/50 overflow-hidden bg-gray-800">
    <!-- 没有输入关键字，显示热搜榜 -->
    <template v-if="!keyword">
      <div class="px-5 py-3 text-sm font-semibold text-gray-300 border-b border-gray-700/50 backdrop-blur-md bg-gray-800/90 flex justify-between items-center">
        <span>热搜榜</span>
        <span class="text-xs text-gray-500 font-normal">实时搜索热度</span>
      </div>
      <div class="max-h-[350px] overflow-y-auto custom-scrollbar bg-gray-800/95 py-2">
        <div 
          v-for="(item, index) in searchHotList" 
          :key="index"
          class="flex items-center justify-between px-5 py-2.5 hover:bg-gray-700/60 cursor-pointer transition-colors group"
        >
          <div class="flex items-center space-x-4 max-w-[75%]">
            <!-- 排名 -->
            <span 
              class="text-sm font-bold w-5 shrink-0 text-center"
              :class="{
                'text-red-500': index === 0,
                'text-orange-400': index === 1,
                'text-amber-400': index === 2,
                'text-gray-500 group-hover:text-gray-400': index > 2
              }"
            >
              {{ index + 1 }}
            </span>
            <!-- 关键字 -->
            <span class="text-sm text-gray-200 group-hover:text-white truncate">{{ item.keyword }}</span>
          </div>
          <!-- 搜索数 -->
          <div class="text-xs text-gray-500 group-hover:text-gray-400 shrink-0 flex items-center">
            <svg class="w-3 h-3 mr-1 opacity-70 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
            </svg>
            {{ formatCount(item.searchCount) }}
          </div>
        </div>
      </div>
    </template>

    <!-- 输入关键字，显示联想词列表 -->
    <template v-else>
      <div 
        class="px-5 py-3 text-sm text-gray-400 border-b border-gray-700/50 backdrop-blur-md bg-gray-800/90 truncate cursor-pointer hover:bg-gray-700/60"
      >
        <span class="text-blue-400">搜索</span> "{{ keyword }}"
      </div>
      <div class="max-h-[350px] overflow-y-auto custom-scrollbar bg-gray-800/95 py-1">
        <template v-if="suggestList && suggestList.length > 0">
          <div 
            v-for="(item, index) in suggestList" 
            :key="'suggest_' + index"
            class="flex items-center px-5 py-2.5 hover:bg-gray-700/60 cursor-pointer transition-colors group"
          >
            <svg class="w-4 h-4 mr-3 text-gray-500 group-hover:text-gray-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span class="text-sm text-gray-300 group-hover:text-white truncate">{{ item.keyword }}</span>
          </div>
        </template>
        <div v-else class="px-5 py-4 text-center text-sm text-gray-500">
          暂无搜索建议
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

const props = defineProps({
  searchHotList: {
    type: Array as () => any[],
    default: () => []
  },
  suggestList: {
    type: Array as () => any[],
    default: () => []
  },
  keyword: {
    type: String,
    default: ''
  }
})

// 将大数字格式化为 万
const formatCount = (count: number | string) => {
  const num = Number(count)
  if (isNaN(num)) return count
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w'
  }
  return num
}
</script>

<style lang="scss" scoped>
.hot-search-list {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  margin-top: 10px;
  z-index: 50;
  
  /* 滚动条 */
  .custom-scrollbar {
    &::-webkit-scrollbar {
      width: 5px;
    }
    &::-webkit-scrollbar-track {
      background: transparent;
    }
    &::-webkit-scrollbar-thumb {
      background-color: #374151; /* gray-700 */
      border-radius: 10px;
    }
    &::-webkit-scrollbar-thumb:hover {
      background-color: #4b5563; /* gray-600 */
    }
  }
}
</style>
<template>
  <header class="flex items-center justify-between w-full px-6 py-4 bg-gray-800 border-b border-gray-700/50">
    <!-- 左侧：Logo 和搜索 -->
    <div class="flex items-center flex-1 max-w-2xl">
      <h1 class="text-xl font-bold text-white mr-6 hidden md:block">Daystream Music</h1>
      <div class="flex items-center flex-1">
        <div class="relative flex-1 max-w-md">
          <input
            v-model="input"
            type="text"
            placeholder="心动"
            class="w-full px-4 py-2 pl-10 bg-gray-700 text-gray-200 placeholder-gray-400 rounded-full border border-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-600 focus:border-transparent transition-all"
          />
          <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
      </div>
    </div>

    <!-- 右侧：功能按钮 -->
    <div class="flex items-center space-x-3 ml-4">
      <button class="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors hidden md:block">
        下载桌面版
      </button>
      <div class="relative">
        <button class="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors flex items-center">
          单曲
          <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>
      </div>
      <router-link
        to="/UserAuth"
        class="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors"
      >
        登录
      </router-link>
      <button class="p-2 text-gray-300 hover:text-white transition-colors">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
        </svg>
      </button>
    </div>
  </header>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue';
import { ref } from 'vue';

const input = ref('')
</script>

<style lang="scss" scoped>
header {
  min-height: 64px;
}
</style>

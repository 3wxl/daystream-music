<template>
  <div class="flex items-start gap-4 justify-end">
    <div class="flex-1 max-w-3xl">
      <div class="relative">
        <!-- 用户消息气泡 -->
        <div
          class="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl rounded-tr-none p-5 border border-white/10 shadow-xl relative overflow-hidden group"
        >
          <!-- 光效背景 -->
          <div
            class="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
          ></div>

          <p class="leading-relaxed relative z-10 whitespace-pre-line">
            {{ message.content }}
          </p>

          <!-- 装饰角 -->
          <div
            class="absolute -top-3 -right-3 w-6 h-6 bg-gradient-to-br from-gray-800 to-gray-900 border-r border-b border-white/10 transform -rotate-45"
          ></div>
        </div>

        <!-- 时间戳 -->
        <div class="mt-2 flex items-center gap-2 text-xs text-gray-500 justify-end mr-4">
          <i class="iconfont icon-time">&#xe61e;</i>
          <span>{{ message.timestamp }}</span>
        </div>
      </div>
    </div>
    <div class="relative flex-shrink-0">
      <img
        :src="message.avatar"
        alt="用户头像"
        class="w-10 h-10 rounded-full object-cover border-2 border-blue-400 shadow-lg"
      />
      <div class="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-400 rounded-full"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Message } from '@/types/lyricAssistant'

interface Props {
  message: Message
}

defineProps<Props>()
</script>

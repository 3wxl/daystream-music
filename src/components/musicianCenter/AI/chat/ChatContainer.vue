<template>
  <div class="flex-1 overflow-y-auto p-6 space-y-8 relative custom-scrollbar">
    <!-- 加载状态 -->
    <div v-if="isLoading" class="flex items-start gap-4">
      <div class="relative flex-shrink-0">
        <div class="w-10 h-10 rounded-full bg-pink-400 flex items-center justify-center shadow-lg">
          <i class="iconfont icon-ai text-white">&#xe7a2;</i>
        </div>
        <div
          class="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-white"
        ></div>
      </div>
      <div class="flex-1 max-w-3xl">
        <div class="relative">
          <div
            class="bg-pink-400/10 rounded-2xl rounded-tl-none p-5 border border-pink-400/20 shadow-xl"
          >
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 bg-pink-400 rounded-full animate-pulse"></div>
              <div class="w-2 h-2 bg-pink-400 rounded-full animate-pulse delay-150"></div>
              <div class="w-1.5 h-1.5 bg-pink-400 rounded-full animate-pulse delay-300"></div>
              <span class="text-sm text-pink-300 ml-2">AI助手正在连接中...</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 欢迎消息 -->
    <WelcomeMessage
      v-if="showWelcome && !isLoading"
      :welcome-message="welcomeMessage"
      :avatar="aiAvatar"
    />

    <!-- 消息列表 -->
    <div v-for="msg in messages" :key="msg.id" :class="getMessageAnimationClass(msg)">
      <AIMessage
        v-if="msg.type === 'ai'"
        :message="msg"
        @play-lyric="$emit('play-lyric', $event)"
        @continue-creation="$emit('continue-creation')"
        @preview-song="$emit('preview-song')"
        @save-lyrics="$emit('save-lyrics')"
      />
      <UserMessage v-else :message="msg" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Message } from '@/types/lyricAssistant'

interface Props {
  messages: Message[]
  showWelcome?: boolean
  welcomeMessage?: string
  aiAvatar?: string
  isLoading?: boolean // 添加加载状态属性
}

interface Emits {
  (e: 'send-message', content: string): void
  (e: 'play-lyric', section: string): void
  (e: 'continue-creation'): void
  (e: 'preview-song'): void
  (e: 'save-lyrics'): void
}

withDefaults(defineProps<Props>(), {
  showWelcome: true,
  welcomeMessage:
    '你好呀～我是白昼音流音乐平台的专属AI助手，是懂音乐、有温度的问答伙伴哦！✨\n\n无论是想了解音乐知识，还是需要帮助操作平台功能，我都会尽力为你解答～\n\n希望对你有帮助～有疑问随时喊我呀～',
  aiAvatar: 'https://picsum.photos/id/237/200',
  isLoading: false,
})

defineEmits<Emits>()

const getMessageAnimationClass = (msg: Message) => {
  return msg.type === 'ai' ? 'animate-slide-in-left' : 'animate-slide-in-right'
}
</script>

<style scoped>
/* 消息动画 */
@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.animate-slide-in-left {
  animation: slideInLeft 0.6s ease-out forwards;
}

.animate-slide-in-right {
  animation: slideInRight 0.6s ease-out forwards;
}
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgba(75, 85, 99, 0.8) rgba(31, 41, 55, 0.1);
}

.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(31, 41, 55, 0.1);
  border-radius: 4px;
  margin: 4px 0;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, rgba(75, 85, 99, 0.8), rgba(107, 114, 128, 0.8));
  border-radius: 4px;
  border: 2px solid rgba(31, 41, 55, 0.1);
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, rgba(107, 114, 128, 0.9), rgba(156, 163, 175, 0.9));
}
</style>

<template>
  <div class="flex-1 overflow-y-auto p-6 space-y-8 relative custom-scrollbar">
    <!-- 欢迎消息 -->
    <WelcomeMessage v-if="showWelcome" :welcome-message="welcomeMessage" :avatar="aiAvatar" />

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
import type { Message } from '@/types/lyric-assistant'

interface Props {
  messages: Message[]
  showWelcome?: boolean
  welcomeMessage?: string
  aiAvatar?: string
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
    '你好！我是AI作词助手，擅长创作各种风格的歌词。你可以告诉我想要的主题、情感、风格，或者上传参考歌词，我会帮你创作出精彩的歌词作品！',
  aiAvatar: 'https://picsum.photos/id/237/200',
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

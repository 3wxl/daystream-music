<template>
  <div class="space-y-2">
    <div v-if="chatSessions.length === 0" class="text-center py-8 text-gray-500 text-sm">
      暂无历史对话
    </div>

    <div
      v-for="conversation in chatSessions"
      :key="conversation.id"
      class="p-4 rounded-lg bg-white/5 hover:bg-pink-400/10 border border-white/10 hover:border-pink-400/30 transition-all duration-300 cursor-pointer group relative overflow-hidden"
    >
      <div class="absolute top-0 right-0 w-24 h-24 bg-pink-500/5 rounded-bl-full -z-10"></div>

      <div class="flex items-start justify-between">
        <h4 class="text-white font-medium text-sm truncate max-w-[80%]">
          {{ conversation.title }}
        </h4>

        <!-- 👇 删除按钮：确保 stop 生效 -->
        <button
          @click.stop="$emit('delete-conversation', conversation.id)"
          class="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-400 transition-all duration-300 transform hover:scale-110 p-1 rounded-full hover:bg-red-400/10 z-10"
        >
          <i class="iconfont text-xs">&#xe607;</i>
        </button>
      </div>

      <div class="flex items-center justify-between mb-2">
        <span class="text-gray-400 text-xs">
          {{ conversation.createTime.replace('T', ' ') }}
        </span>
      </div>

      <!-- 👇 选择会话：把点击写在这里，不要用绝对定位遮罩！ -->
      <div
        class="absolute inset-0 cursor-pointer"
        @click="$emit('select-conversation', conversation)"
      ></div>
    </div>

    <div v-if="loading" class="text-center py-4 text-gray-400 text-sm">加载中...</div>
  </div>
</template>

<script setup lang="ts">
interface chatSessions {
  id: string
  title: string
  createTime: string
  updateTime: string
}

interface Props {
  chatSessions: chatSessions[]
  loading?: boolean
}

interface Emits {
  'select-conversation': [conversation: chatSessions]
  'delete-conversation': [conversationId: string]
}

defineProps<Props>()
defineEmits<Emits>()
</script>

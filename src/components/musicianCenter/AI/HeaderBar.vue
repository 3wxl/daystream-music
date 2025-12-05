<template>
  <header
    class="sticky top-0 z-10 border-b border-white/10 bg-gray-900/90 backdrop-blur-xl px-6 py-4 flex items-center justify-between"
  >
    <div class="flex items-center gap-3">
      <div class="relative">
        <div
          class="w-11 h-11 rounded-full bg-pink-400 flex items-center justify-center flex-shrink-0"
        >
          <i class="iconfont icon-ai text-white text-sm">&#xe7a2;</i>
        </div>
        <div
          class="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-900"
        ></div>
      </div>
      <div>
        <h1 class="font-semibold text-white text-lg">{{ userName }}</h1>
        <div class="flex items-center gap-2 mt-1">
          <span
            class="text-xs px-2 py-0.5 bg-pink-500/30 text-pink-200 rounded-full border border-pink-400/50"
          >
            {{ version }}
          </span>
          <div class="flex items-center gap-1">
            <span class="w-1.5 h-1.5 rounded-full" :class="statusClass"></span>
            <span class="text-xs text-gray-400">{{ userStatus }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="flex items-center gap-4">
      <button @click="$emit('show-history')" class="relative group">
        <div
          class="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-pink-500/20 transition-all duration-300 border border-white/10 hover:border-pink-400/50"
        >
          <i class="iconfont icon-history text-gray-400 group-hover:text-pink-300 transition-colors"
            >&#xe654;</i
          >
          <span class="text-sm">对话历史</span>
        </div>
      </button>
      <button
        @click="$emit('toggle-settings')"
        class="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/5"
      >
        <i class="iconfont icon-more text-xl">&#xe73a;</i>
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
interface Props {
  userName: string
  userStatus: '在线' | '离线' | '忙碌'
  version?: string
  avatar?: string
}

interface Emits {
  (e: 'show-history'): void
  (e: 'toggle-settings'): void
}

const props = withDefaults(defineProps<Props>(), {
  userName: 'AI 作词助手',
  userStatus: '在线',
  version: '专业版 · v2.0',
  avatar: 'https://picsum.photos/id/64/200',
})

defineEmits<Emits>()

const statusClass = computed(() => {
  switch (props.userStatus) {
    case '在线':
      return 'bg-green-500 animate-pulse'
    case '离线':
      return 'bg-red-500'
    case '忙碌':
      return 'bg-yellow-500 animate-pulse'
    default:
      return 'bg-gray-500'
  }
})
</script>

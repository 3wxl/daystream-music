<template>
  <div class="mb-6">
    <h3 class="text-white font-medium mb-3 flex items-center gap-2">
      <i class="iconfont icon-spark text-pink-300">&#xe6e8;</i>
      推荐创作主题
    </h3>
    <div class="space-y-2">
      <div
        v-for="theme in themes"
        :key="theme.id"
        @click="$emit('select-theme', theme)"
        class="p-3 rounded-lg bg-white/5 hover:bg-pink-400/10 border border-white/10 hover:border-pink-400/30 transition-all cursor-pointer group"
      >
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-lg bg-pink-400/20 flex items-center justify-center">
            <i class="iconfont text-pink-300 text-sm">{{ getIconChar(theme.iconCode) }}</i>
          </div>
          <div class="flex-1 min-w-0">
            <h4 class="text-white font-medium text-xs truncate">{{ theme.title }}</h4>
            <p class="text-gray-400 text-xs truncate">{{ theme.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Theme } from '@/types/lyric-assistant'

interface Props {
  themes: Theme[]
}

interface Emits {
  (e: 'select-theme', theme: Theme): void
}

defineProps<Props>()
defineEmits<Emits>()

const getIconChar = (iconCode: string): string => {
  const match = iconCode.match(/&#x([0-9a-f]+);/i)
  if (match) {
    return String.fromCodePoint(parseInt(match[1], 16))
  }
  return iconCode
}
</script>

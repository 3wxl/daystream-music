<template>
  <div
    class="hidden lg:flex w-[280px] flex-col border-l border-white/10 bg-gray-900/80 backdrop-blur-xl transition-all duration-300"
    :class="{ 'w-0': panelCollapsed, 'w-[280px]': !panelCollapsed }"
  >
    <div class="p-6 border-b border-white/10 flex-shrink-0">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-white font-semibold text-lg">创作灵感</h2>
      </div>
      <ThemeList :themes="themes" @select-theme="$emit('select-theme', $event)" />
      <button
        @click="$emit('start-quick-creation')"
        class="w-full py-2.5 rounded-lg bg-pink-400 hover:bg-pink-500 transition-all text-white font-medium flex items-center justify-center gap-2 text-sm mt-4"
      >
        <i class="iconfont icon-magic text-xs">&#xe6db;</i>
        灵感创作
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Theme } from '@/types/lyricAssistant'

interface Props {
  themes: Theme[]
  panelCollapsed?: boolean
}

interface Emits {
  (e: 'toggle-panel'): void
  (e: 'select-theme', theme: Theme): void
  (e: 'start-quick-creation'): void
}

withDefaults(defineProps<Props>(), {
  panelCollapsed: false,
})

defineEmits<Emits>()
</script>

<template>
  <footer class="sticky bottom-0 z-10 border-t border-white/10 p-6 bg-gray-900/90 backdrop-blur-xl">
    <div class="max-w-4xl mx-auto">
      <div class="relative">
        <!-- 输入框 -->
        <div class="relative group">
          <textarea
            ref="textareaRef"
            v-model="localValue"
            :placeholder="placeholder"
            :disabled="isLoading"
            class="w-full bg-gray-800/70 border border-white/10 rounded-2xl py-4 px-5 pr-48 text-white text-sm focus:outline-none focus:border-pink-400/50 resize-none transition-all duration-300 placeholder-gray-500 backdrop-blur-sm group-hover:border-pink-400/40 disabled:opacity-50 disabled:cursor-not-allowed"
            rows="1"
            @keydown.enter.exact.prevent="handleSend"
            @input="adjustTextareaHeight"
          ></textarea>

          <!-- 终止按钮 -->
          <div v-if="isLoading" class="absolute right-24 top-1/2 -translate-y-1/2">
            <button
              @click="$emit('stop')"
              class="w-8 h-8 rounded-full flex items-center justify-center bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 text-red-400 hover:text-red-300 transition-all duration-300"
            >
              <i class="iconfont icon-stop text-xs">&#xe60b;</i>
            </button>
          </div>

          <!-- 发送按钮 -->
          <div class="absolute right-4 top-1/2 -translate-y-1/2">
            <button
              @click="handleSend"
              :disabled="!canSend || isLoading"
              :class="[
                'w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300',
                canSend && !isLoading
                  ? 'bg-pink-400 hover:bg-pink-500 hover:shadow-lg hover:shadow-pink-400/30'
                  : 'bg-gray-700 cursor-not-allowed',
              ]"
            >
              <i v-if="!isLoading" class="iconfont icon-send text-white">&#xe893;</i>
              <div
                v-else
                class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
              ></div>
            </button>
          </div>
        </div>

        <!-- 快捷短语 -->
        <div class="flex flex-wrap gap-2 mt-3">
          <button
            v-for="phrase in quickPhrases"
            :key="phrase.id"
            :disabled="isLoading"
            @click="$emit('use-quick-phrase', phrase)"
            class="px-3 py-1.5 text-xs rounded-full bg-white/5 hover:bg-pink-400/20 text-pink-200 border border-white/10 hover:border-pink-400/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ phrase.text }}
          </button>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import type { QuickPhrase } from '@/types/lyricAssistant'

interface Props {
  modelValue: string
  placeholder?: string
  quickPhrases: QuickPhrase[]
  isLoading?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'send'): void
  (e: 'stop'): void
  (e: 'use-quick-phrase', phrase: QuickPhrase): void
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '描述你的创作想法...',
  isLoading: false,
})

const emit = defineEmits<Emits>()

const textareaRef = ref<HTMLTextAreaElement | null>(null)
const localValue = ref<string>(props.modelValue || '')
const canSend = computed(() => {
  return localValue.value && localValue.value.trim().length > 0 && !props.isLoading
})

watch(
  () => props.modelValue,
  (newVal) => {
    localValue.value = newVal || ''
  },
)

watch(localValue, (newVal) => {
  emit('update:modelValue', newVal || '')
})

const adjustTextareaHeight = (event: Event): void => {
  const textarea = event.target as HTMLTextAreaElement
  textarea.style.height = 'auto'
  const maxHeight = 150
  if (textarea.scrollHeight > maxHeight) {
    textarea.style.height = `${maxHeight}px`
    textarea.style.overflowY = 'auto'
  } else {
    textarea.style.height = `${textarea.scrollHeight}px`
    textarea.style.overflowY = 'hidden'
  }
}

const handleSend = (): void => {
  if (!canSend.value) return
  emit('send')
}

// 自动调整高度
watch(localValue, () => {
  nextTick(() => {
    if (textareaRef.value) {
      adjustTextareaHeight({ target: textareaRef.value } as any)
    }
  })
})
</script>

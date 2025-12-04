<template>
  <footer class="sticky bottom-0 z-10 border-t border-white/10 p-6 bg-gray-900/90 backdrop-blur-xl">
    <div class="max-w-4xl mx-auto">
      <div class="relative">
        <!-- 输入框 -->
        <div class="relative group">
          <textarea
            v-model="inputValue"
            :placeholder="placeholder"
            class="w-full bg-gray-800/70 border border-white/10 rounded-2xl py-4 px-5 pr-24 text-sm focus:outline-none focus:border-pink-400/50 resize-none transition-all duration-300 placeholder-gray-500 backdrop-blur-sm group-hover:border-pink-400/40"
            rows="1"
            @keydown.enter.exact.prevent="handleSend"
            @input="adjustTextareaHeight"
            ref="textareaRef"
          ></textarea>

          <!-- 快捷操作 -->
          <div class="absolute right-4 top-1/2 -translate-y-1/2">
            <button
              @click="handleSend"
              :disabled="!canSend"
              :class="[
                'w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300',
                canSend
                  ? 'bg-pink-400 hover:bg-pink-500 hover:shadow-lg hover:shadow-pink-400/30'
                  : 'bg-gray-700 cursor-not-allowed',
              ]"
            >
              <i class="iconfont icon-send text-white">&#xe893;</i>
            </button>
          </div>
        </div>

        <!-- 快捷短语 -->
        <div class="flex flex-wrap gap-2 mt-3">
          <button
            v-for="phrase in quickPhrases"
            :key="phrase.id"
            @click="$emit('use-quick-phrase', phrase)"
            class="px-3 py-1.5 text-xs rounded-full bg-white/5 hover:bg-pink-400/20 text-pink-200 border border-white/10 hover:border-pink-400/40 transition-all"
          >
            {{ phrase.text }}
          </button>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import type { QuickPhrase } from '@/types/lyricAssistant'

interface Props {
  modelValue: string
  placeholder?: string
  quickPhrases: QuickPhrase[]
}

interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'send'): void
  (e: 'attach-file'): void
  (e: 'use-quick-phrase', phrase: QuickPhrase): void
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '描述你的创作想法...',
})

const emit = defineEmits<Emits>()

const textareaRef = ref<HTMLTextAreaElement | null>(null)
const inputValue = ref<string>(props.modelValue || '')
const canSend = computed(() => {
  return inputValue.value && inputValue.value.trim().length > 0
})
watch(
  () => props.modelValue,
  (newVal) => {
    inputValue.value = newVal || ''
  },
)

watch(inputValue, (newVal) => {
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
</script>

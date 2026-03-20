<template>
  <div class="pt-8 border-t border-gray-200">
    <div
      class="flex flex-col-reverse md:flex-row justify-between items-center space-y-4 md:space-y-0 space-y-reverse"
    >
      <button
        type="button"
        @click="handleReset"
        class="px-8 py-3 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-all hover:shadow-md w-full md:w-auto flex items-center space-x-2"
      >
        <i class="iconfont icon-refresh text-base"></i>
        <span>重置表单</span>
      </button>

      <div class="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 w-full md:w-auto">
        <button
          type="button"
          @click="handlePreview"
          class="px-8 py-3 border border-purple-400 text-purple-600 rounded-xl font-medium hover:bg-purple-50 transition-all hover:shadow-md w-full md:w-auto flex items-center space-x-2"
        >
          <i class="iconfont icon-eye text-base">&#xe8bf;</i>
          <span>预览效果</span>
        </button>

        <button
          type="submit"
          :disabled="submitting"
          class="px-8 py-3 bg-gradient-to-r from-purple-200 to-pink-400 text-white rounded-xl font-medium hover:shadow-lg transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 w-full md:w-auto flex items-center justify-center space-x-2"
        >
          <span v-if="!submitting" class="flex items-center space-x-2">
            <span>确认并提交</span>
            <i class="iconfont icon-arrow-right text-base">&#xe61d;</i>
          </span>
          <span v-else class="flex items-center space-x-2">
            <i class="iconfont icon-loading animate-spin text-base">&#xe699;</i>
            <span>提交中...</span>
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  submitting: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['reset', 'preview', 'submit'])

const handleReset = () => {
  emit('reset')
}

const handlePreview = () => {
  emit('preview')
}

const handleSubmit = () => {
  emit('submit')
}
</script>

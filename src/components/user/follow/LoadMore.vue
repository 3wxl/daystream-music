<template>
  <div class="space-y-4">
    <button
      v-if="hasNext"
      @click="$emit('load-more')"
      :disabled="loading"
      class="px-6 py-2.5 text-sm rounded-full bg-gradient-to-r from-[#cd3181] to-[#ff8fab] text-white font-medium shadow-lg shadow-[#cd3181]/20 hover:shadow-[#cd3181]/30 transition-all duration-400 hover:-translate-y-1 active:scale-95 flex items-center gap-2 mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <i v-if="loading" class="iconfont icon-loading animate-spin"></i>
      {{ loading ? '加载中...' : '加载更多' }}
    </button>

    <div v-if="hasNext" class="text-center text-[#94a3b8] text-xs py-4">
      继续向下滚动加载更多...
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  hasNext: boolean
  loading: boolean
}>()

defineEmits<{
  'load-more': []
}>()
</script>

<style lang="scss" scoped></style>

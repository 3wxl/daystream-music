<template>
  <div
    class="fixed top-16 right-6 w-48 bg-gray-900/90 backdrop-blur-xl rounded-xl border border-white/10 shadow-2xl z-50 p-2"
  >
    <button
      @click="$emit('clear-history')"
      class="w-full text-left px-3 py-2 rounded-lg hover:bg-white/5 text-sm text-gray-300 flex items-center gap-2"
    >
      <i class="iconfont icon-clear">&#xe6a9;</i>
      <span>清空对话</span>
    </button>
    <button
      @click="$emit('export-data')"
      class="w-full text-left px-3 py-2 rounded-lg hover:bg-white/5 text-sm text-gray-300 flex items-center gap-2"
    >
      <i class="iconfont icon-export">&#xe620;</i>
      <span>导出数据</span>
    </button>
    <button
      @click="$emit('toggle-theme')"
      class="w-full text-left px-3 py-2 rounded-lg hover:bg-white/5 text-sm text-gray-300 flex items-center gap-2"
    >
      <i class="iconfont icon-theme">&#xe6c1;</i>
      <span>切换主题</span>
    </button>
    <div class="border-t border-white/10 mt-2 pt-2">
      <button
        @click="$emit('close')"
        class="w-full text-left px-3 py-2 rounded-lg hover:bg-white/5 text-sm text-gray-400 flex items-center gap-2"
      >
        <i class="iconfont icon-close">&#xe61a;</i>
        <span>关闭菜单</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Emits {
  (e: 'clear-history'): void
  (e: 'export-data'): void
  (e: 'toggle-theme'): void
  (e: 'close'): void
}

defineEmits<Emits>()
</script>

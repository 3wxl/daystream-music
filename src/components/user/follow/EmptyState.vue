<template>
  <div class="flex flex-col items-center justify-center py-24 text-center empty-state">
    <div
      class="w-28 h-28 rounded-full bg-gradient-to-r from-[#cd3181]/8 to-[#ff8fab]/8 flex items-center justify-center mb-8 shadow-lg shadow-[#cd3181]/5 animate-float icon-container"
    >
      <!-- 修复：图标字符直接写在标签内，样式通过class控制 -->
      <i class="iconfont text-5xl text-[#fff]/60" style="font-size: 60px">{{
        hasSearchQuery ? '&#xe64c;' : '&#xe625;'
      }}</i>
    </div>

    <h3 class="text-2xl font-medium mb-3 text-white">{{ title }}</h3>
    <p class="text-[#94a3b8] max-w-md mb-8 text-base leading-relaxed description">
      {{ description }}
    </p>

    <button
      @click="handleAction"
      class="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#cd3181] to-[#ff8fab] text-white font-medium shadow-lg shadow-[#cd3181]/20 hover:shadow-[#cd3181]/30 transition-all duration-400 hover:-translate-y-1 active:scale-95 flex items-center gap-2 action-btn"
    >
      <!-- 修复：按钮图标字符直接写在标签内 -->
      <i class="iconfont text-sm" style="font-size: 23px">{{
        hasSearchQuery ? '&#xe633;' : '&#xe660;'
      }}</i>
      {{ actionText }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  searchQuery: string
  activeTab: 'musicians' | 'users'
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'clear-search': []
  'go-discovery': []
}>()

// 计算是否有搜索关键词
const hasSearchQuery = computed(() => props.searchQuery.length > 0)

// 标题文本
const title = computed(() => {
  return hasSearchQuery.value ? '没有找到匹配结果' : '暂无关注内容'
})

// 描述文本
const description = computed(() => {
  if (hasSearchQuery.value) {
    return `未找到包含"${props.searchQuery}"的${props.activeTab === 'musicians' ? '歌手' : '用户'}，请尝试其他关键词`
  }
  return props.activeTab === 'musicians'
    ? '去发现更多优秀歌手并关注他们吧，第一时间获取新歌动态'
    : '去关注一些有趣的用户，分享你的音乐品味，丰富音乐社交'
})

// 按钮文本
const actionText = computed(() => {
  return hasSearchQuery.value ? '清除搜索' : '去发现'
})

// 按钮点击事件
const handleAction = () => {
  if (hasSearchQuery.value) {
    emit('clear-search')
  } else {
    emit('go-discovery')
  }
}
</script>

<style lang="scss" scoped>
.animate-float {
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}
</style>

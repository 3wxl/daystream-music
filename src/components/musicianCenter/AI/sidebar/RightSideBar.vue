<template>
  <div
    class="hidden lg:flex w-[280px] flex-col border-l border-white/10 bg-gray-900/80 backdrop-blur-xl transition-all duration-300"
    :class="{ 'w-0': panelCollapsed, 'w-[280px]': !panelCollapsed }"
  >
    <div class="p-4 border-b border-white/10 flex-shrink-0">
      <h2 class="text-white font-semibold text-lg">历史对话</h2>
    </div>

    <!-- ✅ 修复：正确使用 infinite-scroll 指令 -->
    <div
      ref="scrollContainer"
      class="flex-1 p-2 overflow-y-auto"
      v-infinite-scroll="loadMore"
      :infinite-scroll-disabled="disabled"
      :infinite-scroll-distance="10"
      :infinite-scroll-immediate="false"
    >
      <ThemeList
        :chatSessions="chatSessions"
        :loading="loading"
        @select-conversation="$emit('select-conversation', $event)"
        @delete-conversation="$emit('delete-conversation', $event)"
      />
    </div>
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
  panelCollapsed?: boolean
  hasMore?: boolean // 是否有更多数据
  isLoading?: boolean // 是否正在加载
}

interface Emits {
  'load-more': void
  'select-conversation': [conversation: chatSessions]
  'delete-conversation': [conversationId: string]
}

const props = withDefaults(defineProps<Props>(), {
  panelCollapsed: false,
  chatSessions: () => [],
  hasMore: true,
  isLoading: false,
})

const emit = defineEmits<Emits>()

const scrollContainer = ref<HTMLElement>()

// 计算是否禁用无限滚动
const disabled = computed(() => {
  return props.isLoading || !props.hasMore
})

const loadMore = () => {
  console.log('触底加载更多...', {
    isLoading: props.isLoading,
    hasMore: props.hasMore,
    currentLength: props.chatSessions.length,
  })

  // 如果正在加载或没有更多数据，不触发加载
  if (props.isLoading || !props.hasMore) {
    console.log('跳过加载：正在加载中或无更多数据')
    return
  }

  emit('load-more')
}
</script>

<style scoped>
/* 自定义滚动条样式 */
.overflow-y-auto {
  scroll-behavior: smooth;
}

/* 滚动条轨道 */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

/* 滚动条轨道 */
.overflow-y-auto::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 3px;
  margin: 10px 0;
}

/* 滚动条滑块 */
.overflow-y-auto::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
  transition: all 0.3s ease;
}

/* 滚动条滑块悬停 */
.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scaleX(1.2);
}

/* 滚动条角落 */
.overflow-y-auto::-webkit-scrollbar-corner {
  background: transparent;
}
</style>

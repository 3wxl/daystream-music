<template>
  <div class="group relative">
    <div
      class="relative overflow-hidden rounded-xl mb-2 aspect-square cursor-pointer bg-[#121225] border border-[rgba(205,49,129,0.05)] group-hover:border-[rgba(205,49,129,0.2)] transition-all duration-400 group-hover:shadow-lg group-hover:shadow-[#cd3181]/5"
      @click="$emit('click')"
    >
      <!-- 歌手头像 -->
      <img
        :src="item.avatar || getDefaultAvatar(item.username)"
        alt="歌手头像"
        class="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
      />
      <!-- 悬浮渐变层 -->
      <div
        class="absolute inset-0 bg-gradient-to-t from-[#0a0a14]/90 via-[#0a0a14]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-end pb-3"
      >
        <button
          class="w-10 h-10 rounded-full bg-gradient-to-r from-[#cd3181] to-[#ff8fab] flex items-center justify-center shadow-md shadow-[#cd3181]/25 transform translate-y-4 group-hover:translate-y-0 transition-all duration-400 hover:scale-105 active:scale-95"
        >
          <img src="../../../assets/线条小狗 (4)_爱给网_aigei_com.gif" alt="" class="w-6" />
        </button>
        <p class="text-[10px] text-white/80 mt-2">{{ formatNumber(item.fansCount || 0) }} 粉丝</p>
      </div>
      <!-- 在线状态 -->
      <div
        v-if="item.isOnline"
        class="absolute top-2 right-2 w-3 h-3 rounded-full bg-[#cd3181] border border-[rgba(255,138,171,0.5)] shadow-sm shadow-[#cd3181]/25 animate-pulse"
      ></div>
      <!-- 悬浮边框 -->
      <div
        class="absolute inset-0 border border-transparent rounded-xl group-hover:border-[#cd3181]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      ></div>
    </div>

    <!-- 歌手名称 -->
    <h4
      class="font-medium text-sm truncate text-white group-hover:text-[#ff8fab] transition-colors duration-300"
      v-html="highlightKeyword(props.item.username)"
    ></h4>
    <!-- 歌手类型 -->
    <p class="text-[#64748b] text-[10px] truncate mt-0.5">{{ item.genre || '音乐人' }}</p>

    <!-- 取消关注按钮 -->
    <button
      @click.stop="$emit('unfollow')"
      :disabled="unfollowLoading"
      class="mt-1.5 w-full py-1 text-[10px] rounded-full border border-[rgba(205,49,129,0.3)] text-[#cd3181] opacity-0 group-hover:opacity-100 transition-all duration-250 hover:bg-[rgba(205,49,129,0.1)] hover:border-[#cd3181] hover:text-[#ff8fab] transform translate-y-1.5 group-hover:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-0.5"
    >
      <i
        v-if="unfollowLoading"
        class="iconfont icon-loading animate-spin"
        style="font-size: 10px"
      ></i>
      {{ unfollowLoading ? '处理中...' : '取消关注' }}
    </button>

    <!-- 底部渐变下划线（原页面的hover效果） -->
    <div
      class="absolute bottom-0 left-1/2 transform -translate-x-1/2 scale-x-0 w-3/4 h-[1px] bg-gradient-to-r from-[#cd3181] to-[#ff8fab] rounded-full transition-transform duration-300 group-hover:scale-x-100"
    ></div>
  </div>
</template>

<script setup lang="ts">
// 修改 defineProps 部分，添加 searchQuery 属性
const props = defineProps<{
  item: {
    id: number
    username: string
    avatar?: string
    followerCount?: number
    genre?: string
    isOnline?: boolean
  }
  unfollowLoading?: boolean
  searchQuery?: string
}>()

defineEmits<{
  click: []
  unfollow: []
}>()

// 复用原页面的工具函数
const getDefaultAvatar = (name: string): string => {
  const colors = [
    'FF6B6B',
    '48DBFB',
    'FF9F43',
    '26C281',
    'D980FA',
    'FFC312',
    'C4E538',
    'FDA7DF',
    'ED4C67',
    '009432',
  ]
  const color = colors[Math.abs(name.charCodeAt(0)) % colors.length]
  const initials = name.charAt(0).toUpperCase()
  return `https://ui-avatars.com/api/?name=${initials}&background=${color}&color=fff&size=200`
}

const formatNumber = (num: number): string => {
  if (num >= 10000) return (num / 10000).toFixed(1) + 'w'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k'
  return num.toString()
}
const highlightKeyword = (text: string) => {
  if (!props.searchQuery || !text) return text

  const regex = new RegExp(`(${props.searchQuery})`, 'gi')
  return text.replace(
    regex,
    '<span class="bg-clip-text text-transparent bg-gradient-to-r from-[#cd3181] to-[#ff8fab] font-semibold">$1</span>',
  )
}
</script>

<style scoped>
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
    box-shadow: 0 0 0 0 rgba(205, 49, 129, 0.4);
  }
  50% {
    opacity: 0.56;
    box-shadow: 0 0 0 3px rgba(205, 49, 129, 0.1);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>

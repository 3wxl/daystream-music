<template>
  <div
    v-if="props.item"
    class="follow-item group"
    :class="{
      'animate-fade-in': props.index,
      'animate-delay': props.index,
    }"
  >
    <!-- 仅保留用户布局，移除音乐人相关代码 -->
    <div
      class="user-card bg-[#121225] rounded-2xl p-5 flex items-center gap-5 border border-[rgba(205,49,129,0.05)] hover:border-[rgba(205,49,129,0.2)] transition-all duration-500 hover:shadow-lg hover:shadow-[#cd3181]/5 hover:-translate-y-1 relative overflow-hidden cursor-pointer"
      @click="$emit('click')"
    >
      <!-- 背景装饰 -->
      <div
        class="absolute -right-20 -top-20 w-40 h-40 bg-[#cd3181]/5 rounded-full blur-2xl pointer-events-none"
      ></div>

      <!-- 用户头像 -->
      <div class="relative">
        <img
          :src="props.item.avatar"
          alt="用户头像"
          class="w-16 h-16 rounded-full object-cover border-2 border-transparent group-hover:border-[#cd3181] transition-all duration-400 shadow-md shadow-black/20"
        />
      </div>

      <!-- 用户信息 -->
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 mb-1.5">
          <h4
            class="font-medium text-base truncate text-white group-hover:text-[#ff8fab] transition-colors duration-300"
            v-html="highlightKeyword(props.item.username)"
          ></h4>
          <!-- 认证标识 -->
          <span
            v-if="props.item.verified"
            class="text-[#FA86A6] text-xs flex items-center justify-center w-5 h-5 rounded-full bg-[#cd3181]/10"
          >
            <i class="iconfont">&#xe640;</i>
          </span>
        </div>
        <!-- 个性签名 -->
        <p class="text-[#94a3b8] text-sm line-clamp-1 truncate italic">
          {{ props.item.introduction || '这个人很懒，什么都没写' }}
        </p>

        <!-- 用户数据统计 -->
        <div class="flex gap-5 mt-2.5">
          <span
            class="text-xs text-[#64748b] flex items-center gap-1.5 group-hover:text-[#8b5cf6] transition-colors"
          >
            <i class="iconfont" style="font-size: 20px">&#xe612;</i>
            {{ props.item.dynamicCount || 0 }} 动态
          </span>
          <span
            class="text-xs text-[#64748b] flex items-center gap-1.5 group-hover:text-[#cd3181] transition-colors"
          >
            <i class="iconfont" style="font-size: 23px">&#xe66a;</i>
            {{ props.item.playListCount || 0 }} 歌单
          </span>
        </div>
      </div>

      <!-- 操作按钮 -->
      <button
        @click.stop="$emit('unfollow')"
        :disabled="props.item.unfollowLoading"
        class="px-8 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-400 flex items-center gap-1.5 hover:shadow-lg hover:shadow-[#cd3181]/20 active:scale-95 relative disabled:opacity-50 disabled:cursor-not-allowed"
        style="
          background: rgba(205, 49, 129, 0.08);
          border: 1px solid rgba(205, 49, 129, 0.2);
          color: #cd3181;
        "
      >
        <span class="w-4 flex items-center justify-center">
          <i class="iconfont text-xs">&#xe62b;</i>
        </span>
        <span class="relative">
          <span
            class="transition-all duration-200 inline-block group-hover:opacity-0 group-hover:visibility-hidden"
            >已关注</span
          >
          <span
            class="absolute left-0 top-0 opacity-0 visibility-hidden transition-all duration-200 group-hover:opacity-100 group-hover:visibility-visible pointer-events-auto"
          >
            {{ props.item.unfollowLoading ? '处理中...' : '取消关注' }}
          </span>
        </span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  item: any
  index?: number
  searchQuery?: string
}

// 移除 itemType 相关定义，仅保留用户相关 props
const props = withDefaults(defineProps<Props>(), {
  index: 0,
  searchQuery: '',
})

defineEmits<{
  click: []
  unfollow: []
}>()

// const getDefaultAvatar = (name: string): string => {
//   const colors = [
//     'FF6B6B',
//     '48DBFB',
//     'FF9F43',
//     '26C281',
//     'D980FA',
//     'FFC312',
//     'C4E538',
//     'FDA7DF',
//     'ED4C67',
//     '009432',
//   ]
//   const color = colors[Math.abs(name.charCodeAt(0)) % colors.length]
//   const initials = name.charAt(0).toUpperCase()
//   return `https://ui-avatars.com/api/?name=${initials}&background=${color}&color=fff&size=300`
// }

const highlightKeyword = (text: string) => {
  if (!props.searchQuery || !text || !props.searchQuery.trim()) return text

  const query = props.searchQuery.trim()
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  return text.replace(
    regex,
    '<span class="bg-clip-text text-transparent bg-gradient-to-r from-[#cd3181] to-[#ff8fab] font-semibold">$1</span>',
  )
}
</script>

<style lang="scss" scoped>
// 简化动画样式，仅保留用户相关的 fadeInUp 动画
.follow-item.animate-fade-in {
  opacity: 0;
  animation: fadeInUp 0.5s ease-out forwards;
}

.follow-item.animate-delay {
  animation-delay: calc(v-bind('props.index') * 0.1s);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
    box-shadow: 0 0 0 0 rgba(205, 49, 129, 0.4);
  }
  50% {
    opacity: 0.56;
    box-shadow: 0 0 0 4px rgba(205, 49, 129, 0.1);
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>

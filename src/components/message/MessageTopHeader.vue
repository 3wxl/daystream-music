<template>
  <header class="h-[50px] border-b-1 border-[#1f2d3d]">
    <div class="flex h-full px-10 items-center gap-4">
      <div
        class="px-2 group cursor-pointer relative"
        @click="navigateTo(1, '/message/likeMessage')"
      >
        <div
          class="w-[100px] text-[16px] text-[#e5e7eb] flex items-center justify-center h-[48px] group-hover:text-pink-500 duration-300"
          :class="getCurrentRouteIndex() === 1 ? 'text-pink-500' : ''"
        >
          点赞
        </div>
        <div
          class="h-[2px] w-0 bg-pink-500 group-hover:w-full duration-300"
          :class="getCurrentRouteIndex() === 1 ? 'w-full' : ''"
        ></div>
      </div>

      <div
        class="px-2 group cursor-pointer relative"
        @click="navigateTo(2, '/message/commentMessage')"
      >
        <div
          class="w-[100px] text-[16px] text-[#e5e7eb] flex items-center justify-center h-[48px] group-hover:text-pink-500 duration-300"
          :class="getCurrentRouteIndex() === 2 ? 'text-pink-500' : ''"
        >
          评论
        </div>
        <div
          class="h-[2px] w-0 bg-pink-500 group-hover:w-full duration-300"
          :class="getCurrentRouteIndex() === 2 ? 'w-full' : ''"
        ></div>
      </div>

      <div
        class="px-2 group cursor-pointer relative"
        @click="navigateTo(3, '/message/followerMessage')"
      >
        <div
          class="w-[100px] text-[16px] text-[#e5e7eb] flex items-center justify-center h-[48px] group-hover:text-pink-500 duration-300"
          :class="getCurrentRouteIndex() === 3 ? 'text-pink-500' : ''"
        >
          我的粉丝
        </div>
        <div
          class="h-[2px] w-0 bg-pink-500 group-hover:w-full duration-300"
          :class="getCurrentRouteIndex() === 3 ? 'w-full' : ''"
        ></div>
      </div>

      <div
        class="px-2 group cursor-pointer relative"
        @click="navigateTo(4, '/message/privateLetter')"
      >
        <div
          class="w-[100px] text-[16px] text-[#e5e7eb] flex items-center justify-center h-[48px] group-hover:text-pink-500 duration-300"
          :class="getCurrentRouteIndex() === 4 ? 'text-pink-500' : ''"
        >
          私信
        </div>
        <div
          class="h-[2px] w-0 bg-pink-500 group-hover:w-full duration-300"
          :class="getCurrentRouteIndex() === 4 ? 'w-full' : ''"
        ></div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// 根据当前路由路径确定应该激活的索引
const getCurrentRouteIndex = () => {
  const path = route.path
  if (path.includes('/message/likeMessage')) return 1
  if (path.includes('/message/commentMessage')) return 2
  if (path.includes('/message/followerMessage')) return 3
  if (path.includes('/message/privateLetter')) return 4
  return 1 // 默认返回第一个
}

// 导航函数
const navigateTo = (index: number, path: string) => {
  router.push(path)
}
</script>

<style scoped>
/* 可以添加一些额外的样式优化 */
</style>

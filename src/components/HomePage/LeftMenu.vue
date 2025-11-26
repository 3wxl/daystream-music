<template>
  <div
    class="flex flex-col h-screen bg-gradient-to-b from-[#151a2d] via-[#101425] to-[#0b0f1b] border-r border-white/5 shadow-xl transition-all duration-300 text-gray-100"
    :class="isCollapse ? 'w-20' : 'w-56'"
  >
    <!-- Logo 区域 -->
    <div class="flex flex-col items-center justify-center gap-2 px-4 py-6 border-b border-white/5">
      <img
        :src="circleUrl"
        alt="Logo"
        class="w-12 h-12 rounded-2xl cursor-pointer shadow-lg ring-2 ring-white/10"
        @click="changeCollapse()"
      />
      <span v-if="!isCollapse" class="text-lg font-semibold tracking-wide text-white"
        >Daystream</span
      >
    </div>

    <!-- 导航菜单 -->
    <nav class="flex-1 py-6" :class="isCollapse ? 'px-2' : 'px-4'">
      <router-link
        v-for="item in menuItems"
        :key="item.path"
        :to="item.path"
        class="flex items-center gap-3 mb-2 rounded-2xl py-3 text-sm font-medium transition-all duration-200 text-gray-300 hover:bg-white/5 hover:text-white border border-transparent"
        :class="[
          isCollapse ? 'justify-center px-0' : 'px-4'
        ]"
        active-class="bg-pink-500/20 text-pink-200 shadow-lg shadow-pink-500/30 border border-pink-400/60"
      >
        <component :is="item.icon" class="w-5 h-5 shrink-0" />
        <span v-if="!isCollapse" class="whitespace-nowrap">{{ item.title }}</span>
      </router-link>
    </nav>

    <!-- 底部设置 -->
    <div class="px-4 py-6 border-t border-white/5">
      <router-link
        to="/UserAuth"
        class="flex items-center gap-3 rounded-2xl py-3 text-sm font-medium transition-all duration-200"
        :class="[
          $route.path === '/UserAuth'
            ? 'bg-pink-500/20 text-pink-200 shadow-lg shadow-pink-500/30 border border-pink-400/60'
            : 'text-gray-300 hover:bg-white/5 hover:text-white border border-transparent',
          isCollapse ? 'justify-center px-0' : 'px-4',
        ]"
      >
        <Setting class="w-5 h-5 shrink-0" />
        <span v-if="!isCollapse" class="whitespace-nowrap">设置</span>
      </router-link>
    </div>
  </div>
</template>

<script lang="ts" setup>
import circleUrl from '@/assets/logo.jpg'
import {
  House,
  Setting,
  Tickets,
  User,
  View,
  Histogram,
  ChatLineSquare,
} from '@element-plus/icons-vue'
import { ref } from 'vue'

const isCollapse = ref(false)

const menuItems = [
  { path: '/', title: '首页', icon: House },
  { path: '/Mv', title: '歌手', icon: View },
  { path: '/album', title: '专辑', icon: Tickets },
  { path: '/MusicRanking', title: '榜单', icon: Histogram },
  { path: '/User/PersonalCenter', title: '个人', icon: User },
  { path: '/community/CommunityDisplay', title: '社区', icon: ChatLineSquare },
]

const changeCollapse = () => {
  isCollapse.value = !isCollapse.value
}
</script>

<style scoped>
/* 确保图标和文字对齐 */
nav a {
  min-height: 44px;
}

</style>

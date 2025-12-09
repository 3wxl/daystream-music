<template>
  <header
    class="flex items-center justify-between w-full px-6 py-4 bg-gray-800 border-b border-gray-700/50"
  >
    <!-- 左侧：Logo 和搜索 -->
    <div class="flex items-center flex-1 max-w-2xl">
      <h1 class="text-xl font-bold text-white mr-6 hidden md:block">Daystream Music</h1>
      <div class="flex items-center flex-1">
        <search-input v-model="input" />
      </div>
    </div>

    <!-- 右侧：功能按钮 -->
    <div class="flex items-center space-x-3 ml-4">
      <router-link to="/VipExchangePage">
        <button
          class="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors hidden md:block"
        >
          商城
        </button>
      </router-link>
      <router-link to="/CheckIn">
        <button
          class="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors hidden md:block"
        >
          {{ isCheckedIn ? '已签到 ' : '签到' }}
        </button>
      </router-link>
      <router-link to="/musician/MusicianSettleIn">
        <button
          class="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors hidden md:block"
        >
          音乐人中心
        </button>
      </router-link>
      <router-link to="/message/likeMessage" class="relative">
        <button
          class="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors hidden md:block"
        >
          消息
        </button>
        <span class="top-0 -right-1 inline-block min-w-[15px] min-h-[15px] text-center line-clamp-1 rounded-[16px] p-[2px] text-white text-[11px]/[13px] absolute bg-red-600">99+</span>
      </router-link>
      <button
        class="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors hidden md:block"
      >
        当前音浪数：{{ currentWaves }}
      </button>
      <!-- <button
        class="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors hidden md:block"
      >
        下载桌面版
      </button>
      <div class="relative">
        <button
          class="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors flex items-center"
        >
          单曲
          <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
        </button>
      </div> -->
    </div>
    <div class="flex items-center space-x-4 ml-4">
      <!-- 身份跳转按钮 -->
      <template v-if="userStore.userInfo.userRole">
        <button
          v-if="userStore.userInfo.userRole.includes('管理员')"
          @click="goToAdmin"
          class="px-4 py-1.5 text-xs font-medium text-white bg-gray-700 border border-gray-600 rounded-full hover:bg-gray-600 transition-all"
        >
          管理后台
        </button>
      </template>

      <!-- 用户信息 -->
      <div class="flex items-center space-x-3 pl-4 border-l border-gray-700/50">
        <div class="hidden sm:flex flex-col items-end">
          <span class="text-sm font-medium text-gray-200">{{
            userStore.userInfo.username || '未登录'
          }}</span>
          <span class="text-xs text-gray-500" v-if="userStore.userInfo.userRole">{{
            userStore.userInfo.userRole
          }}</span>
        </div>
        <div class="relative group cursor-pointer">
          <div
            class="absolute -inset-0.5 bg-linear-to-r from-pink-600 to-purple-600 rounded-full opacity-75 group-hover:opacity-100 blur transition duration-200"
          ></div>
          <img
            :src="userStore.userInfo.avatar || 'https://placehold.co/100x100/333/FFF?text=User'"
            alt="User Avatar"
            class="relative w-9 h-9 rounded-full object-cover border-2 border-gray-800"
          />
        </div>
      </div>
      <!-- <router-link
        to="/UserAuth"
        class="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors"
      >
        登录
      </router-link> -->
      <!-- <button class="p-2 text-gray-300 hover:text-white transition-colors">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          ></path>
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          ></path>
        </svg>
      </button> -->
    </div>
  </header>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/stores/user'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const isCheckedIn = ref(window.localStorage.getItem('checkIn_status.isCheckedIn'))
const currentWaves = ref(window.localStorage.getItem('checkIn_status.currentWaves'))
const input = ref('')

const userStore = useUserStore()

const goToAdmin = () => {
  router.push('/admin')
}
// 后端接口返回的数据结构
// const user = ref({
//   id: null,
//   username: '',
//   avatar: '',
//   gender: '',
//   introduction: null,
//   isVip: false,
//   vipExpireTime: null,
//   email: '',
//   phone: null,
//   totalPoint: 0,
//   walletBalance: 0,
//   createdTime: '',
//   userRole: [] as string[],
// })
</script>

<style lang="scss" scoped>
header {
  min-height: 64px;
}
</style>

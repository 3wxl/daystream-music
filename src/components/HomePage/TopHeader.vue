<template>
  <header
    class="flex items-center justify-between w-full px-6 py-4 bg-gray-800 border-b border-gray-700/50"
  >
    <!-- 左侧：Logo 和搜索 -->
    <div class="flex items-center flex-1 max-w-2xl">
      <h1 class="text-xl font-bold text-white mr-6 hidden md:block">Daystream Music</h1>
      <div class="flex items-center flex-1">
        <div class="relative flex-1 max-w-md">
          <input
            v-model="input"
            type="text"
            placeholder="心动"
            class="w-full px-4 py-2 pl-10 bg-gray-700 text-gray-200 placeholder-gray-400 rounded-full border border-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-600 focus:border-transparent transition-all"
          />
          <Search
            class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
          />
        </div>
      </div>
    </div>

    <!-- 右侧：功能按钮 -->
    <div class="flex items-center space-x-4 ml-4">
      <!-- 身份跳转按钮 -->
      <template v-if="userStore.userInfo.userRole">
        <button
          v-if="userStore.userInfo.userRole.includes('音乐人')"
          class="px-4 py-1.5 text-xs font-medium text-white bg-linear-to-r from-purple-600 to-pink-600 rounded-full hover:from-purple-500 hover:to-pink-500 transition-all shadow-lg shadow-purple-900/20"
        >
          音乐人中心
        </button>
        <button
          v-else-if="userStore.userInfo.userRole.includes('管理员')"
          @click="goToAdmin"
          class="px-4 py-1.5 text-xs font-medium text-white bg-gray-700 border border-gray-600 rounded-full hover:bg-gray-600 transition-all"
        >
          管理后台
        </button>
      </template>

      <!-- 用户信息 -->
      <div class="flex items-center space-x-3 pl-4 border-l border-gray-700/50">
        <div class="hidden sm:flex flex-col items-end">
          <span class="text-sm font-medium text-gray-200">{{ userStore.userInfo.username || '未登录' }}</span>
          <span class="text-xs text-gray-500" v-if="userStore.userInfo.userRole">{{ userStore.userInfo.userRole[0] }}</span>
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
    </div>
  </header>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'

const router = useRouter()

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

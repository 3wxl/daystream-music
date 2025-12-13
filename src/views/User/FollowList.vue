<template>
  <div
    class="follow-page min-h-screen bg-[#0a0a14] text-white font-['Inter',sans-serif] overflow-x-hidden"
  >
    <!-- 背景渐变层 -->
    <div
      class="fixed inset-0 bg-gradient-to-br from-[#121225]/90 to-[#0a0a14]/95 bg-[radial-gradient(circle_at_30%_20%,rgba(205,49,129,0.1),transparent_40%)] pointer-events-none -z-10"
    ></div>

    <main class="container mx-auto px-4 py-12 relative pb-16">
      <!-- 标题区域 -->
      <div class="mb-8 text-center">
        <h2
          class="text-[clamp(1.5rem,4vw,2rem)] font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-white to-[#e2e8f0] tracking-tight"
        >
          我的关注
        </h2>
        <p class="text-[#94a3b8] max-w-md mx-auto text-sm md:text-sm leading-relaxed">
          管理你关注的歌手和用户，第一时间获取他们的最新动态
        </p>
        <div
          class="w-20 h-[2px] bg-gradient-to-r from-[#cd3181] to-[#ff8fab] mx-auto mt-4 rounded-full"
        ></div>
      </div>

      <!-- 标签切换和搜索 -->
      <div class="mb-8 relative flex flex-col md:flex-row items-center justify-between gap-4">
        <FollowTabs :active-tab="activeTab" @tab-change="switchTab" />

        <!-- 更新 FollowSearch 组件绑定 -->
        <FollowSearch
          v-model:modelValue="searchQuery"
          :active-tab="activeTab"
          :result-count="filteredItems.length"
          @search-focus="handleSearchFocus"
          @clear-search="clearSearch"
          @search="handleSearch"
        />
      </div>

      <!-- 内容区域 -->
      <div class="space-y-8">
        <!-- 音乐人列表 -->
        <div v-if="activeTab === 'musicians'" class="space-y-8">
          <!-- 加载状态 -->
          <div
            v-if="musicianLoading && musicianList.length === 0"
            class="flex justify-center py-12"
          >
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#cd3181]"></div>
          </div>

          <!-- 内容列表 - 使用原有网格布局 -->
          <!-- 内容列表 - 使用原有网格布局 -->
          <div
            class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 md:gap-4"
            ref="musicianContainer"
          >
            <MusicianGrid
              v-for="musician in filteredItems"
              :key="musician.id"
              :item="musician"
              :search-query="searchQuery"
              :unfollow-loading="unfollowLoading[musician.id] || false"
              @click="goToMusicianDetail(musician.id)"
              @unfollow="toggleFollow('musician', musician.id)"
            />
          </div>

          <!-- 加载更多 -->
          <LoadMore
            v-if="
              musicianHasNext &&
              musicianList.length > 0 &&
              (!searchQuery || (searchQuery && filteredItems.length > 0))
            "
            :has-next="musicianHasNext"
            :loading="musicianLoading"
            @load-more="loadMoreMusicians"
          />
        </div>

        <!-- 用户列表 -->
        <div v-else class="space-y-4">
          <!-- 加载状态 -->
          <div v-if="userLoading && userList.length === 0" class="flex justify-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#cd3181]"></div>
          </div>

          <!-- 内容列表 -->
          <UserList
            :items="filteredItems"
            :search-query="searchQuery"
            :loading="userLoading && userList.length === 0"
            @item-click="goToUserProfile"
            @unfollow="(id) => toggleFollow('user', id)"
          />

          <!-- 加载更多 -->
          <LoadMore
            v-if="
              userHasNext &&
              userList.length > 0 &&
              (!searchQuery || (searchQuery && filteredItems.length > 0))
            "
            :has-next="userHasNext"
            :loading="userLoading"
            @load-more="loadMoreUsers"
          />
        </div>

        <!-- 空状态 -->
        <EmptyState
          v-if="!musicianLoading && !userLoading && filteredItems.length === 0"
          :search-query="searchQuery"
          :active-tab="activeTab"
          @clear-search="clearSearch"
          @go-discovery="goToDiscovery"
        />
      </div>
    </main>

    <!-- 通知组件 -->
    <Notification ref="notificationInstance" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getFollowMusician, getFollowNormal, cancelFollow } from '@/api/follow/index'
import type { FollowListResp } from '@/types/follow/index'

const router = useRouter()

// 状态管理
const activeTab = ref<'musicians' | 'users'>('musicians')
const searchQuery = ref('')
const isSearchFocused = ref(false)
const notificationInstance = ref()

// 音乐人相关状态
const musicianList = ref<any[]>([])
const musicianLoading = ref(false)
const musicianHasNext = ref(false)
const musicianLastId = ref<string | null>(null)

// 用户相关状态
const userList = ref<any[]>([])
const userLoading = ref(false)
const userHasNext = ref(false)
const userLastId = ref<string | null>(null)

// 取消关注加载状态
const unfollowLoading = ref<Record<number, boolean>>({})
// 过滤后的列表项（支持搜索）
const filteredItems = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  let list: any[] = []

  if (activeTab.value === 'musicians') {
    list = musicianList.value || []
  } else {
    list = userList.value || []
  }

  if (!query) return list

  // 同时搜索用户名和简介
  return list.filter((item) => {
    const username = item.username?.toLowerCase() || ''
    const introduction = item.introduction?.toLowerCase() || ''
    return username.includes(query) || introduction.includes(query)
  })
})
console.log(searchQuery.value)
watch(
  () => searchQuery.value,
  (newQuery) => {
    if (newQuery.trim()) {
      // 有搜索词时触发动画
      triggerSearchAnimation()
      // 滚动到顶部
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  },
  { immediate: false },
)

// 提取动画逻辑为独立函数
const triggerSearchAnimation = () => {
  const container =
    activeTab.value === 'musicians'
      ? document.querySelector('.grid')
      : document.querySelector('.user-list-container')

  if (container) {
    container.classList.add('search-active')
    setTimeout(() => {
      container.classList.remove('search-active')
    }, 500)
  }
}

// 修改原有 handleSearch 函数（仅处理动画）
const handleSearch = () => {
  console.log('执行搜索，关键词:', searchQuery.value)
  triggerSearchAnimation()

  if (searchQuery.value.trim() && filteredItems.value.length > 0) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

// 修改清除搜索函数，添加更好的反馈
const clearSearch = () => {
  const hadQuery = searchQuery.value.length > 0
  searchQuery.value = ''

  if (hadQuery) {
    showNotification('已清除搜索')

    // 清除搜索动画效果
    const container =
      activeTab.value === 'musicians'
        ? document.querySelector('.grid')
        : document.querySelector('.user-list-container')

    if (container) {
      container.classList.add('clear-search')
      setTimeout(() => {
        container.classList.remove('clear-search')
      }, 300)
    }
  }
}

// 修改切换标签页的函数，确保搜索状态重置
const switchTab = async (tab: 'musicians' | 'users') => {
  const previousTab = activeTab.value
  activeTab.value = tab

  // 保存搜索状态以便在切换回来时恢复
  if (previousTab !== tab) {
    searchQuery.value = ''

    // 切换到对应标签时加载数据
    if (tab === 'musicians' && musicianList.value.length === 0) {
      await loadMusicians()
    } else if (tab === 'users' && userList.value.length === 0) {
      await loadUsers()
    }
  }

  // 切换到用户页时的动画效果
  if (tab === 'users') {
    nextTick(() => {
      const userItems = document.querySelectorAll('.user-card')
      userItems.forEach((item, index) => {
        const el = item as HTMLElement
        el.style.opacity = '0'
        el.style.transform = 'translateY(20px)'
        setTimeout(() => {
          el.style.opacity = '1'
          el.style.transform = 'translateY(0)'
        }, index * 100)
      })
    })
  }
}

// 修改空状态显示逻辑
const showEmptyState = computed(() => {
  return !musicianLoading.value && !userLoading.value && filteredItems.value.length === 0
})

// 生命周期：初始化 + 无限滚动
onMounted(async () => {
  // 初始化加载当前标签数据
  await (activeTab.value === 'musicians' ? loadMusicians() : loadUsers())

  // 延迟初始化滚动监听
  nextTick(() => {
    setupInfiniteScroll()
  })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

// 无限滚动逻辑
const setupInfiniteScroll = () => {
  window.addEventListener('scroll', handleScroll)
}

const handleScroll = () => {
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
  const windowHeight = window.innerHeight
  const scrollHeight = document.documentElement.scrollHeight

  // 距离底部100px时触发加载
  if (scrollTop + windowHeight >= scrollHeight - 100) {
    if (activeTab.value === 'musicians') {
      if (musicianHasNext.value && !musicianLoading.value && musicianList.value.length > 0) {
        loadMoreMusicians()
      }
    } else {
      if (userHasNext.value && !userLoading.value && userList.value.length > 0) {
        loadMoreUsers()
      }
    }
  }
}

// 加载音乐人数据
const loadMusicians = async (isLoadMore = false) => {
  if (musicianLoading.value) return

  try {
    musicianLoading.value = true

    const params = {
      lastId: isLoadMore ? musicianLastId.value : null,
      size: 12, // 改成和原本页面一样
    }

    const res = await getFollowMusician(params)
    console.log('音乐人API响应:', res)

    if (res.dateList && res.dateList.length > 0) {
      const { dateList, hasMore, lastId } = res

      if (isLoadMore) {
        musicianList.value = [...musicianList.value, ...dateList]
      } else {
        musicianList.value = dateList || []
      }

      musicianHasNext.value = hasMore || false
      musicianLastId.value = lastId || null
    } else if (!isLoadMore) {
      musicianList.value = []
      musicianHasNext.value = false
    }
  } catch (error) {
    console.error('加载音乐人失败:', error)
    ElMessage.error('加载失败，请稍后重试')
  } finally {
    musicianLoading.value = false
  }
}

// 加载用户数据
const loadUsers = async (isLoadMore = false) => {
  if (userLoading.value) return

  try {
    userLoading.value = true

    const params = {
      lastId: isLoadMore ? userLastId.value : null,
      size: 10,
    }

    const res = await getFollowNormal(params)
    console.log('用户API响应:', res)

    if (res.dateList && res.dateList.length > 0) {
      const { dateList, hasMore, lastId } = res

      if (isLoadMore) {
        userList.value = [...userList.value, ...dateList]
      } else {
        userList.value = dateList || []
      }

      userHasNext.value = hasMore || false
      userLastId.value = lastId || null
    } else if (!isLoadMore) {
      userList.value = []
      userHasNext.value = false
    }
  } catch (error) {
    console.error('加载用户失败:', error)
    ElMessage.error('加载失败，请稍后重试')
  } finally {
    userLoading.value = false
  }
}

// const switchTab = async (tab: 'musicians' | 'users') => {
//   activeTab.value = tab
//   searchQuery.value = ''

//   if (tab === 'musicians' && musicianList.value.length === 0) {
//     await loadMusicians()
//   } else if (tab === 'users' && userList.value.length === 0) {
//     await loadUsers()
//   }

//   if (tab === 'users') {
//     nextTick(() => {
//       const userItems = document.querySelectorAll('.user-card')
//       userItems.forEach((item, index) => {
//         const el = item as HTMLElement
//         el.style.opacity = '0'
//         el.style.transform = 'translateY(20px)'
//         setTimeout(() => {
//           el.style.opacity = '1'
//           el.style.transform = 'translateY(0)'
//         }, index * 100)
//       })
//     })
//   }
// }

// 加载更多封装
const loadMoreMusicians = () => loadMusicians(true)
const loadMoreUsers = () => loadUsers(true)

// 搜索焦点处理
// const handleSearchFocus = (isFocused: boolean) => {
//   isSearchFocused.value = isFocused
// }

// 取消关注逻辑
const toggleFollow = async (type: 'musician' | 'user', id: number) => {
  try {
    unfollowLoading.value[id] = true

    const res = await cancelFollow(id)

    if (type === 'musician') {
      musicianList.value = musicianList.value.filter((item) => item.id !== id)
      musicianHasNext.value = musicianList.value.length > 0 && musicianHasNext.value
    } else {
      userList.value = userList.value.filter((item) => item.id !== id)
      userHasNext.value = userList.value.length > 0 && userHasNext.value
    }

    showNotification('已取消关注')
  } catch (error) {
    console.error('取消关注失败:', error)
    ElMessage.error('操作失败，请稍后重试')
  } finally {
    unfollowLoading.value[id] = false
  }
}

// 导航方法
const goToDiscovery = () => router.push('/aritist')
const goToUserProfile = (id: number) => router.push(`/User/PersonalCenter/${id}`)
const goToMusicianDetail = (id: number) => router.push(`/User/MusicianCenter/${id}`)

const handleSearchFocus = (isFocused: boolean) => {
  isSearchFocused.value = isFocused

  // 只保留输入框聚焦动画，移除所有 notification 操作
  const searchInput = document.querySelector('.follow-search input')
  if (searchInput) {
    if (isFocused) {
      searchInput.parentElement?.classList.add('search-focused')
    } else {
      searchInput.parentElement?.classList.remove('search-focused')
    }
  }
}

// 修改 showNotification 函数
const showNotification = (message: string) => {
  // 直接调用组件的 show 方法
  if (notificationInstance.value && typeof notificationInstance.value.show === 'function') {
    notificationInstance.value.show(message)
  }
}
</script>

<style lang="scss" scoped>
.follow-page {
  position: relative;
  overflow-x: hidden;
  scroll-behavior: smooth;
}
.search-highlight {
  background: linear-gradient(to right, #cd3181, #ff8fab);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 600;
}
.grid.search-active .group {
  animation: search-result-pulse 0.5s ease-out;
}

// 搜索结果统计样式
.search-result-count {
  font-size: 11px;
  color: #94a3b8;
  margin-top: 4px;
  animation: fade-in-up 0.3s ease-out;
}

// 全局滚动条样式
@media (prefers-color-scheme: dark) {
  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  ::-webkit-scrollbar-track {
    background: #121225;
    border-radius: 3px;
  }
  ::-webkit-scrollbar-thumb {
    background: #cd3181;
    border-radius: 3px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #ff8fab;
  }
}

// 响应式优化
@media (max-width: 768px) {
  .grid {
    grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
    gap: 3rem 1.5rem !important;
  }
}
</style>

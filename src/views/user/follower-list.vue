<template>
  <div
    class="fans-page min-h-screen bg-[#0a0a14] text-white font-['Inter',sans-serif] overflow-x-hidden"
  >
    <!-- 背景渐变装饰 -->
    <div
      class="fixed inset-0 bg-gradient-to-br from-[#121225]/90 to-[#0a0a14]/95 bg-[radial-gradient(circle_at_70%_80%,rgba(205,49,129,0.1),transparent_40%)] pointer-events-none -z-10"
    ></div>

    <main class="container mx-auto px-4 py-12 relative pb-16">
      <!-- 页面标题区 -->
      <div class="mb-8 text-center">
        <h2
          class="text-[clamp(1.5rem,4vw,2rem)] font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-white to-[#e2e8f0] tracking-tight"
        >
          我的粉丝
        </h2>
        <p class="text-[#94a3b8] max-w-md mx-auto text-sm md:text-sm leading-relaxed">
          查看关注你的用户，管理粉丝互动，了解谁在关注你的动态
        </p>
        <div
          class="w-20 h-[2px] bg-gradient-to-r from-[#cd3181] to-[#ff8fab] mx-auto mt-4 rounded-full"
        ></div>
      </div>

      <!-- 搜索框区域（高交互设计） -->
      <div class="mb-8 max-w-2xl mx-auto">
        <div class="relative">
          <!-- 搜索图标 -->
          <div
            class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-all duration-400"
            :class="isSearchFocused ? 'text-[#cd3181] scale-110' : 'text-[#64748b]'"
          >
            <i class="iconfont text-lg">&#xe611;</i>
          </div>

          <!-- 搜索输入框 -->
          <input
            v-model="searchQuery"
            @focus="handleSearchFocus(true)"
            @blur="handleSearchFocus(false)"
            @input="handleSearch"
            type="text"
            placeholder="搜索粉丝（昵称/个性签名）..."
            class="w-full pl-12 pr-12 py-3 rounded-full bg-[#121225] border border-[rgba(205,49,129,0.1)] focus:border-[#cd3181] focus:ring-2 focus:ring-[#cd3181]/20 outline-none transition-all duration-500 text-sm placeholder:text-[#64748b] placeholder:transition-colors placeholder:focus:text-[#94a3b8] shadow-md shadow-black/10 focus:shadow-lg focus:shadow-[#cd3181]/5 transform focus:scale-[1.02] origin-center"
          />

          <!-- 清除按钮（有搜索内容时显示） -->
          <button
            @click="clearSearch"
            v-if="searchQuery.length > 0"
            class="absolute inset-y-0 right-4 flex z-100 items-center text-[#64748b] hover:text-[#cd3181] transition-colors duration-300 hover:scale-110 active:scale-95"
          >
            <i class="iconfont text-lg">&#xe607;</i>
          </button>

          <!-- 搜索结果计数（实时反馈） -->
          <div
            v-if="searchQuery.length > 0"
            class="absolute top-full left-0 right-0 mt-2 text-xs text-[#64748b] pl-12 animate-fadeIn"
          >
            找到 {{ filteredFans.length }} 个粉丝
            <span v-if="filteredFans.length < totalFans" class="text-[#cd3181]/80">
              (共 {{ totalFans }} 个粉丝)
            </span>
          </div>
        </div>
      </div>

      <!-- 粉丝总数统计 -->
      <div class="mb-6 flex justify-between items-center px-4">
        <!-- 排序按钮 -->
        <div class="flex gap-2">
          <button
            @click="sortFans('latest')"
            class="px-3 py-1 rounded-full text-xs transition-all duration-300"
            :class="
              sortType === 'latest'
                ? 'bg-[#cd3181]/20 text-[#cd3181]'
                : 'bg-[#121225] text-[#94a3b8]'
            "
          >
            最新关注
          </button>
          <button
            @click="sortFans('popular')"
            class="px-3 py-1 rounded-full text-xs transition-all duration-300"
            :class="
              sortType === 'popular'
                ? 'bg-[#cd3181]/20 text-[#cd3181]'
                : 'bg-[#121225] text-[#94a3b8]'
            "
          >
            粉丝数最多
          </button>
        </div>
      </div>

      <!-- 粉丝列表 -->
      <div class="space-y-4">
        <!-- 加载中状态 -->
        <div v-if="loading && fansList.length === 0" class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#cd3181]"></div>
        </div>

        <!-- 粉丝列表项 -->
        <div
          v-for="(fan, index) in filteredFans"
          :key="fan.id"
          class="group"
          :style="{ animationDelay: `${index * 0.05}s` }"
        >
          <div
            class="fan-card bg-[#121225] rounded-2xl p-5 flex items-center gap-5 border border-[rgba(205,49,129,0.05)] hover:border-[rgba(205,49,129,0.2)] transition-all duration-500 hover:shadow-lg hover:shadow-[#cd3181]/5 hover:-translate-y-1 relative overflow-hidden cursor-pointer"
            @click="goToFanProfile(fan.id)"
          >
            <!-- 背景装饰 -->
            <div
              class="absolute -right-20 -top-20 w-40 h-40 bg-[#cd3181]/5 rounded-full blur-2xl pointer-events-none group-hover:scale-110 transition-transform duration-700"
            ></div>

            <!-- 粉丝头像 -->
            <div class="relative flex-shrink-0">
              <img
                :src="fan.avatar"
                alt="粉丝头像"
                class="w-16 h-16 rounded-full object-cover border-2 border-transparent group-hover:border-[#cd3181] transition-all duration-400 shadow-md shadow-black/20"
              />
              <!-- 在线状态 -->
              <!-- <div
                v-if="fan.userStatus === 1"
                class="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-[#cd3181] border-2 border-[#121225] shadow-md shadow-[#cd3181]/30 animate-pulse"
              ></div> -->
            </div>

            <!-- 粉丝信息 - 添加 min-width: 0 确保文本截断 -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1.5">
                <h4
                  class="font-medium text-base truncate text-white group-hover:text-[#ff8fab] transition-colors duration-300"
                >
                  <span v-html="highlightKeyword(fan.username)"></span>
                </h4>
                <!-- 认证标识 -->
                <span
                  v-if="fan.verified"
                  class="text-[#FA86A6] text-xs flex items-center justify-center w-5 h-5 rounded-full bg-[#cd3181]/10 flex-shrink-0"
                >
                  <i class="iconfont">&#xe640;</i>
                </span>
              </div>
              <!-- 个性签名 -->
              <p class="text-[#94a3b8] text-sm line-clamp-1 truncate italic mb-2">
                <span
                  v-html="highlightKeyword(fan.introduction || '这个人很懒，什么都没写')"
                ></span>
              </p>

              <!-- 粉丝数据统计 -->
              <div class="flex gap-5">
                <span
                  class="text-xs text-[#64748b] flex items-center gap-1.5 group-hover:text-[#8b5cf6] transition-colors"
                >
                  <i class="iconfont text-[#64748b] text-base group-hover:text-[#8b5cf6]"
                    >&#xe612;</i
                  >
                  {{ fan.dynamicCount || 0 }} 动态
                </span>
                <span
                  class="text-xs text-[#64748b] flex items-center gap-1.5 group-hover:text-[#cd3181] transition-colors"
                >
                  <i class="iconfont text-[#64748b] text-lg group-hover:text-[#cd3181]">&#xe66a;</i>
                  {{ fan.fansCount || 0 }} 粉丝
                </span>
                <span
                  class="text-xs text-[#64748b] flex items-center gap-1.5 group-hover:text-[#4ade80] transition-colors"
                >
                  <i class="iconfont text-[#64748b] text-lg group-hover:text-[#4ade80]">&#xe62b;</i>
                  关注于 {{ formatFollowTime(fan.followTime) }}
                </span>
              </div>
            </div>

            <!-- 操作按钮 - 修复对齐问题 -->
            <div class="flex gap-2 flex-shrink-0 ml-auto">
              <button
                class="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-400 flex items-center justify-center gap-1.5 hover:shadow-lg hover:shadow-[#8b5cf6]/20 active:scale-95 min-w-[80px]"
                style="
                  background: rgba(139, 92, 246, 0.08);
                  border: 1px solid rgba(139, 92, 246, 0.2);
                  color: #8b5cf6;
                "
                @click.stop="sendMessage(fan.id)"
              >
                <i class="iconfont text-xs">&#xe614;</i> 私信
              </button>
              <!-- <button
                class="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-400 flex items-center justify-center gap-1.5 hover:shadow-lg hover:shadow-[#cd3181]/20 active:scale-95 min-w-[80px]"
                style="
                  background: rgba(205, 49, 129, 0.08);
                  border: 1px solid rgba(205, 49, 129, 0.2);
                  color: #cd3181;
                "
                @click.stop="toggleFollowBack(fan.id)"
                :disabled="followLoading[fan.id]"
              >
                <i class="iconfont text-xs">&#xe62b;</i>
                {{ fan.isMutual ? '已回关' : '未回关' }}
              </button> -->
            </div>
          </div>
        </div>

        <!-- 加载更多按钮区域 -->
        <div class="flex justify-center py-6">
          <!-- 加载中状态：仅非搜索/搜索有结果时显示 -->
          <div
            v-if="loadingMore && !(searchQuery.trim() && filteredFans.length === 0)"
            class="flex justify-center"
          >
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#cd3181]"></div>
          </div>

          <!-- 加载更多按钮：新增判断条件 - 搜索无结果时不显示 -->
          <button
            v-else-if="
              hasMore && fansList.length > 0 && !(searchQuery.trim() && filteredFans.length === 0)
            "
            @click="loadFans(true)"
            class="px-6 py-2 rounded-full bg-[#121225] border border-[#cd3181]/30 text-[#cd3181] hover:bg-[#cd3181]/10 transition-all duration-300 flex items-center gap-2"
            :disabled="loadingMore"
          >
            <i class="iconfont">&#xe62b;</i>
            加载更多
          </button>

          <!-- 无更多数据提示：仅非搜索/搜索有结果时显示 -->
          <div
            v-else-if="
              !hasMore && fansList.length > 0 && !(searchQuery.trim() && filteredFans.length === 0)
            "
            class="text-[#94a3b8] text-sm"
          >
            已加载全部粉丝
          </div>
        </div>
      </div>

      <!-- 空状态（无粉丝/无搜索结果） -->
      <div
        v-if="!loading && filteredFans.length === 0"
        class="flex flex-col items-center justify-center py-24 text-center"
      >
        <div
          class="w-28 h-28 rounded-full bg-gradient-to-r from-[#cd3181]/8 to-[#ff8fab]/8 flex items-center justify-center mb-8 shadow-lg shadow-[#cd3181]/5 animate-float"
        >
          <i class="iconfont text-5xl text-[#fff]/60" style="font-size: 60px">
            {{ searchQuery.length > 0 ? '&#xe64c;' : '&#xe625;' }}
          </i>
        </div>
        <h3 class="text-2xl font-medium mb-3 text-white">
          {{ searchQuery.length > 0 ? '没有找到匹配的粉丝' : '暂无粉丝' }}
        </h3>
        <p class="text-[#94a3b8] max-w-md mb-8 text-base leading-relaxed">
          {{
            searchQuery.length > 0
              ? `未找到包含"${searchQuery}"的粉丝，请尝试其他关键词`
              : '分享你的音乐作品，吸引更多粉丝关注你吧'
          }}
        </p>
        <button
          class="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#cd3181] to-[#ff8fab] text-white font-medium shadow-lg shadow-[#cd3181]/20 hover:shadow-[#cd3181]/30 transition-all duration-400 hover:-translate-y-1 active:scale-95 flex items-center gap-2"
          @click="searchQuery.length > 0 ? clearSearch() : shareWorks()"
        >
          <i class="iconfont text-sm" style="font-size: 23px">
            {{ searchQuery.length > 0 ? '&#xe633;' : '&#xe60a;' }}
          </i>
          {{ searchQuery.length > 0 ? '清除搜索' : '分享作品' }}
        </button>
      </div>
    </main>

    <!-- 通知提示框 -->
    <teleport to="body">
      <div
        ref="notificationRef"
        class="fixed top-6 right-6 bg-[#121225] border border-[#cd3181] text-white px-5 py-3 rounded-xl shadow-xl shadow-[#cd3181]/10 z-50 transform translate-x-full transition-transform duration-500 ease-out flex items-center gap-2"
      >
        <i class="iconfont text-[#cd3181]">&#xe62b;</i>
        <span id="notification-text">已回关该粉丝</span>
      </div>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { getFollower } from '@/api/follow'
import type { NormalUserItem } from '@/types/follow'

// 分页参数定义
interface FollowListParams {
  lastId?: string | null
  size: number
  keyword?: string // 新增：搜索关键词参数
  type?: string
}

interface FollowListResp {
  dateList: NormalUserItem[]
  hasMore: boolean
  lastId: string | null
  total: number
}

// 基础状态
const searchQuery = ref('')
const isSearchFocused = ref(false)
const notificationRef = ref<HTMLDivElement | null>(null)
const sortType = ref<'latest' | 'popular'>('latest')

// 接口相关状态
const fansList = ref<NormalUserItem[]>([])
const loading = ref(false)
const loadingMore = ref(false)
const hasMore = ref(true)
const lastId = ref<string | null>(null)
const totalFans = ref(0)
const followLoading = ref<Record<number, boolean>>({})

// 过滤后的粉丝列表
const filteredFans = computed(() => {
  let result = [...fansList.value]

  // 搜索过滤（前端兜底，优先接口过滤）
  const query = searchQuery.value.trim().toLowerCase()
  if (query) {
    result = result.filter(
      (fan) =>
        fan.username.toLowerCase().includes(query) ||
        (fan.introduction && fan.introduction.toLowerCase().includes(query)),
    )
  }

  // 排序
  if (sortType.value === 'latest') {
    result.sort((a, b) => {
      const timeA = a.followTime ? new Date(a.followTime).getTime() : 0
      const timeB = b.followTime ? new Date(b.followTime).getTime() : 0
      return timeB - timeA
    })
  } else {
    result.sort((a, b) => (b.fansCount || 0) - (a.fansCount || 0))
  }

  return result
})

// 加载粉丝数据（核心修改：支持传递搜索关键词）
const loadFans = async (isLoadMore = false) => {
  if ((isLoadMore && loadingMore.value) || (!isLoadMore && loading.value)) return

  try {
    if (isLoadMore) {
      loadingMore.value = true
    } else {
      loading.value = true
      lastId.value = null
      hasMore.value = true
      fansList.value = []
    }

    // 构造请求参数：携带搜索关键词
    const params: FollowListParams = {
      lastId: isLoadMore ? lastId.value : null,
      size: 10,
      keyword: searchQuery.value.trim() || undefined, // 有搜索词则传递，无则不传
    }

    // 调用接口（实际项目中接口需支持keyword参数过滤）
    const res = await getFollower(params)
    const { dateList, hasMore: respHasMore, lastId: respLastId, total } = res
    console.log(`加载${isLoadMore ? '更多' : '第一页'}数据：`, res)

    if (isLoadMore) {
      fansList.value = [...fansList.value, ...dateList]
    } else {
      fansList.value = dateList
      totalFans.value = total ?? 0
    }

    hasMore.value = respHasMore
    lastId.value = respLastId ?? null
  } catch (error) {
    console.error('加载粉丝失败:', error)
    ElMessage.error('加载粉丝失败，请稍后重试')
  } finally {
    loading.value = false
    loadingMore.value = false
  }
}

// 生命周期
onMounted(async () => {
  await loadFans()
  console.log('✅ 初始数据加载完成')
})

onUnmounted(() => {})

// 搜索焦点处理
const handleSearchFocus = (isFocused: boolean) => {
  isSearchFocused.value = isFocused
  if (isFocused && notificationRef.value) {
    notificationRef.value.style.transform = 'translateX(calc(100% + 2rem))'
  }
}

// 搜索处理（输入时触发，加载对应关键词的第一页数据）
const handleSearch = () => {
  // 防抖处理（可选，避免频繁请求）
  clearTimeout((window as any).searchTimer)
  ;(window as any).searchTimer = setTimeout(() => {
    loadFans(false) // 重新加载第一页（带关键词）
    nextTick(() => {
      const fanCards = document.querySelectorAll('.fan-card')
      fanCards.forEach((card, index) => {
        const el = card as HTMLElement
        el.style.opacity = '0.8'
        setTimeout(() => {
          el.style.opacity = '1'
        }, index * 50)
      })
    })
  }, 300)
}

// 清除搜索（核心修改：完全还原页面初始状态）
const clearSearch = () => {
  // 1. 清空搜索框
  searchQuery.value = ''
  // 2. 重置排序为默认值
  sortType.value = 'latest'
  // 3. 重新加载原始数据（无关键词）
  loadFans(false)
  // 4. 隐藏通知提示
  if (notificationRef.value) {
    notificationRef.value.style.transform = 'translateX(calc(100% + 2rem))'
  }
  // 5. 提示用户
  showNotification('已清除搜索，恢复全部粉丝列表')
}

// 排序处理
const sortFans = (type: 'latest' | 'popular') => {
  sortType.value = type
  showNotification(type === 'latest' ? '已按最新关注排序' : '已按粉丝数最多排序')

  nextTick(() => {
    const fanCards = document.querySelectorAll('.fan-card')
    fanCards.forEach((card, index) => {
      const el = card as HTMLElement
      el.style.transform = 'translateY(10px)'
      el.style.opacity = '0'
      setTimeout(() => {
        el.style.transform = 'translateY(0)'
        el.style.opacity = '1'
      }, index * 50)
    })
  })
}

// 关键词高亮
const highlightKeyword = (text: string) => {
  const query = searchQuery.value.trim()
  if (!query) return text
  const regex = new RegExp(`(${query})`, 'gi')
  return text.replace(
    regex,
    '<span class="bg-clip-text text-transparent bg-gradient-to-r from-[#cd3181] to-[#ff8fab] font-semibold">$1</span>',
  )
}

// 格式化关注时间
const formatFollowTime = (time?: string) => {
  if (!time) return '未知时间'
  const date = new Date(time)
  return `${date.getMonth() + 1}月${date.getDate()}日`
}

// 跳转粉丝主页
const goToFanProfile = (fanId: number) => {
  console.log(`跳转到粉丝主页：${fanId}`)
  // router.push(`/user/${fanId}`)
}

// 发送私信
const sendMessage = (fanId: number) => {
  console.log(`给粉丝${fanId}发送私信`)
  showNotification('私信窗口已打开')
}

// 回关/取消回关
const toggleFollowBack = async (fanId: number) => {
  try {
    followLoading.value[fanId] = true
    const fan = fansList.value.find((f: NormalUserItem) => f.id === fanId)
    if (fan) {
      fan.isMutual = !fan.isMutual
      showNotification(fan.isMutual ? '已回关该粉丝' : '已取消回关')
    }
    // await followUser(fanId) // 真实接口调用
  } catch (error) {
    console.error('回关失败:', error)
    ElMessage.error('操作失败，请稍后重试')
  } finally {
    followLoading.value[fanId] = false
  }
}

// 分享作品
const shareWorks = () => {
  showNotification('分享功能已打开')
}

// 显示通知
const showNotification = (text: string) => {
  if (notificationRef.value) {
    const textEl = notificationRef.value.querySelector('#notification-text')
    if (textEl) textEl.textContent = text
    notificationRef.value.style.transform = 'translateX(0)'
    setTimeout(() => {
      notificationRef.value!.style.transform = 'translateX(calc(100% + 2rem))'
    }, 2500)
  }
}
</script>

<style lang="scss" scoped>
.fan-card {
  opacity: 0;
  transform: translateY(10px);
  animation: fadeInUp 0.5s ease-out forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
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

.animate-float {
  animation: float 3s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
    box-shadow: 0 0 0 0 rgba(205, 49, 129, 0.4);
  }
  50% {
    opacity: 0.7;
    box-shadow: 0 0 0 4px rgba(205, 49, 129, 0.1);
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-out forwards;
}

@media (max-width: 768px) {
  .fan-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
    padding: 1rem;
  }

  .fan-card .flex-1 {
    width: 100%;
  }

  .fan-card .flex.gap-2 {
    width: 100%;
    justify-content: flex-end;
    margin-top: 0.5rem;
  }

  .fan-card .flex.gap-2 button {
    padding: 0.5rem 1rem;
    font-size: 0.75rem;
  }
}

@media (prefers-color-scheme: dark) {
  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  ::-webkit-scrollbar-track {
    background: #121225;
  }
  ::-webkit-scrollbar-thumb {
    background: #cd3181;
    border-radius: 3px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #ff8fab;
  }
}

* {
  scroll-behavior: smooth;
}
</style>

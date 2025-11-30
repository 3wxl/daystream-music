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
            class="absolute inset-y-0 right-4 flex items-center text-[#64748b] hover:text-[#cd3181] transition-colors duration-300 hover:scale-110 active:scale-95"
          >
            <i class="iconfont text-lg">&#xe672;</i>
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
        <h3 class="text-base font-medium text-[#e2e8f0]">
          总计 <span class="text-[#cd3181] font-bold">{{ totalFans }}</span> 个粉丝
        </h3>
        <!-- 排序下拉框 -->
        <!-- <div class="relative group">
          <button
            class="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#121225] border border-[rgba(205,49,129,0.1)] text-sm text-[#94a3b8] hover:text-white hover:border-[rgba(205,49,129,0.2)] transition-all duration-300"
          >
            <i class="iconfont text-xs">&#xe65c;</i>
            {{ sortType === 'latest' ? '最新关注' : '粉丝数最多' }}
            <i class="iconfont text-xs transition-transform duration-300 group-hover:rotate-180"
              >&#xe641;</i
            >
          </button>
          <div
            class="absolute right-0 top-full mt-2 w-36 bg-[#121225] border border-[rgba(205,49,129,0.1)] rounded-xl shadow-lg shadow-black/20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-10"
          >
            <button
              @click="sortFans('latest')"
              class="w-full text-left px-4 py-2 text-sm hover:bg-[rgba(205,49,129,0.08)] hover:text-[#cd3181] transition-colors duration-200 flex items-center gap-1.5"
              :class="sortType === 'latest' ? 'text-[#cd3181]' : 'text-[#94a3b8]'"
            >
              <i class="iconfont text-xs">&#xe60b;</i> 最新关注
            </button>
            <button
              @click="sortFans('popular')"
              class="w-full text-left px-4 py-2 text-sm hover:bg-[rgba(205,49,129,0.08)] hover:text-[#cd3181] transition-colors duration-200 flex items-center gap-1.5"
              :class="sortType === 'popular' ? 'text-[#cd3181]' : 'text-[#94a3b8]'"
            >
              <i class="iconfont text-xs">&#xe66a;</i> 粉丝数最多
            </button>
          </div>
        </div> -->
      </div>

      <div class="space-y-4">
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
              <div
                v-if="fan.isOnline"
                class="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-[#cd3181] border-2 border-[#121225] shadow-md shadow-[#cd3181]/30 animate-pulse"
              ></div>
            </div>

            <!-- 粉丝信息 - 添加 min-width: 0 确保文本截断 -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1.5">
                <h4
                  class="font-medium text-base truncate text-white group-hover:text-[#ff8fab] transition-colors duration-300"
                >
                  <span v-html="highlightKeyword(fan.name)"></span>
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
                <span v-html="highlightKeyword(fan.signature)"></span>
              </p>

              <!-- 粉丝数据统计 -->
              <div class="flex gap-5">
                <span
                  class="text-xs text-[#64748b] flex items-center gap-1.5 group-hover:text-[#8b5cf6] transition-colors"
                >
                  <i class="iconfont text-[#64748b] text-base group-hover:text-[#8b5cf6]"
                    >&#xe612;</i
                  >
                  {{ fan.posts }} 动态
                </span>
                <span
                  class="text-xs text-[#64748b] flex items-center gap-1.5 group-hover:text-[#cd3181] transition-colors"
                >
                  <i class="iconfont text-[#64748b] text-lg group-hover:text-[#cd3181]">&#xe66a;</i>
                  {{ fan.fansCount }} 粉丝
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
              <button
                class="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-400 flex items-center justify-center gap-1.5 hover:shadow-lg hover:shadow-[#cd3181]/20 active:scale-95 min-w-[80px]"
                style="
                  background: rgba(205, 49, 129, 0.08);
                  border: 1px solid rgba(205, 49, 129, 0.2);
                  color: #cd3181;
                "
                @click.stop="toggleFollowBack(fan.id)"
              >
                <i class="iconfont text-xs">&#xe62b;</i>
                {{ fan.isFollowed ? '已回关' : '未回关' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态（无粉丝/无搜索结果） -->
      <div
        v-if="filteredFans.length === 0"
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
          @click="searchQuery.length > 0 ? clearSearch : shareWorks()"
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
const searchQuery = ref('')
const isSearchFocused = ref(false)
const notificationRef = ref<HTMLDivElement | null>(null)
const sortType = ref<'latest' | 'popular'>('latest')

const fans = ref([
  {
    id: 1001,
    name: 'MusicLover01',
    avatar: 'https://picsum.photos/100/100?random=101',
    signature: '你的每首歌我都听过，超喜欢！',
    verified: false,
    posts: 89,
    fansCount: 1250,
    followTime: '2025-01-15',
    isOnline: true,
    isFollowed: true,
  },
  {
    id: 1002,
    name: 'NightOwlMusic',
    avatar: 'https://picsum.photos/100/100?random=102',
    signature: '深夜听歌党，为你打call！',
    verified: true,
    posts: 218,
    fansCount: 3420,
    followTime: '2025-02-20',
    isOnline: false,
    isFollowed: false,
  },
  {
    id: 1003,
    name: 'SynthWaveFan',
    avatar: 'https://picsum.photos/100/100?random=103',
    signature: '复古电子乐爱好者，喜欢你的编曲',
    verified: false,
    posts: 156,
    fansCount: 890,
    followTime: '2025-03-05',
    isOnline: true,
    isFollowed: true,
  },
  {
    id: 1004,
    name: 'JazzCat88',
    avatar: 'https://picsum.photos/100/100?random=104',
    signature: '爵士与蓝调的忠实听众，期待你的新作',
    verified: true,
    posts: 98,
    fansCount: 2780,
    followTime: '2025-04-12',
    isOnline: false,
    isFollowed: false,
  },
  {
    id: 1005,
    name: 'IndieMusicFan',
    avatar: 'https://picsum.photos/100/100?random=105',
    signature: '独立音乐挖掘者，你的音乐超有态度！',
    verified: false,
    posts: 320,
    fansCount: 1560,
    followTime: '2025-05-18',
    isOnline: true,
    isFollowed: true,
  },
])

const totalFans = computed(() => fans.value.length)

const filteredFans = computed(() => {
  let result = [...fans.value]

  const query = searchQuery.value.trim().toLowerCase()
  if (query) {
    result = result.filter(
      (fan) =>
        fan.name.toLowerCase().includes(query) || fan.signature.toLowerCase().includes(query),
    )
  }

  if (sortType.value === 'latest') {
    result.sort((a, b) => new Date(b.followTime).getTime() - new Date(a.followTime).getTime())
  } else {
    result.sort((a, b) => b.fansCount - a.fansCount)
  }

  return result
})

const handleSearchFocus = (isFocused: boolean) => {
  isSearchFocused.value = isFocused
  if (isFocused && notificationRef.value) {
    notificationRef.value.style.transform = 'translateX(calc(100% + 2rem))'
  }
}

const handleSearch = () => {
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
}

const clearSearch = () => {
  searchQuery.value = ''
  showNotification('已清除搜索')
}

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

const highlightKeyword = (text: string) => {
  const query = searchQuery.value.trim()
  if (!query) return text
  const regex = new RegExp(`(${query})`, 'gi')
  return text.replace(
    regex,
    '<span class="bg-clip-text text-transparent bg-gradient-to-r from-[#cd3181] to-[#ff8fab] font-semibold">$1</span>',
  )
}

const formatFollowTime = (time: string) => {
  const date = new Date(time)
  return `${date.getMonth() + 1}月${date.getDate()}日`
}

const goToFanProfile = (fanId: number) => {
  console.log(`跳转到粉丝主页：${fanId}`)
}

const sendMessage = (fanId: number) => {
  console.log(`给粉丝${fanId}发送私信`)
  showNotification('私信窗口已打开')
}

const toggleFollowBack = (fanId: number) => {
  const fan = fans.value.find((f) => f.id === fanId)
  if (fan) {
    fan.isFollowed = !fan.isFollowed
    showNotification(fan.isFollowed ? '已回关该粉丝' : '已取消回关')
  }
}

const shareWorks = () => {
  showNotification('分享功能已打开')
}

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

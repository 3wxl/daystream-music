<template>
  <div
    class="follow-page min-h-screen bg-[#0a0a14] text-white font-['Inter',sans-serif] overflow-x-hidden"
  >
    <div
      class="fixed inset-0 bg-gradient-to-br from-[#121225]/90 to-[#0a0a14]/95 bg-[radial-gradient(circle_at_30%_20%,rgba(205,49,129,0.1),transparent_40%)] pointer-events-none -z-10"
    ></div>

    <main class="container mx-auto px-4 py-12 relative pb-16">
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

      <div class="mb-8 relative flex flex-col md:flex-row items-center justify-between gap-4">
        <div
          class="flex justify-center gap-1 md:gap-2 max-w-sm w-full md:w-auto bg-[#121225] rounded-full p-1 border border-[rgba(205,49,129,0.1)]"
        >
          <button
            @click="switchTab('artists')"
            class="flex-1 py-2 px-4 rounded-full font-medium text-xs md:text-sm transition-all duration-400 relative"
            :class="
              activeTab === 'artists'
                ? 'text-white bg-gradient-to-r from-[#cd3181] to-[#ff8fab] shadow-lg shadow-[#cd3181]/20'
                : 'text-[#718096] hover:text-white hover:bg-white/5'
            "
          >
            <span class="flex items-center justify-center gap-1">
              <i class="iconfont text-xs md:text-xs">&#xe7f2;</i>
              关注的歌手
            </span>
          </button>
          <button
            @click="switchTab('users')"
            class="flex-1 py-2 px-4 rounded-full font-medium text-xs md:text-sm transition-all duration-400 relative"
            :class="
              activeTab === 'users'
                ? 'text-white bg-gradient-to-r from-[#cd3181] to-[#ff8fab] shadow-lg shadow-[#cd3181]/20'
                : 'text-[#718096] hover:text-white hover:bg-white/5'
            "
          >
            <span class="flex items-center justify-center gap-1">
              <i class="iconfont text-xs md:text-xs">&#xe611;</i>
              关注的用户
            </span>
          </button>
        </div>

        <div class="w-full md:w-auto flex-1 md:max-w-xs">
          <div class="relative">
            <div
              class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-all duration-400"
              :class="isSearchFocused ? 'text-[#cd3181]' : 'text-[#64748b]'"
            >
              <i class="iconfont text-lg">
                {{ activeTab === 'artists' ? '&#xe7f2;' : '&#xe611;' }}
              </i>
            </div>
            <input
              v-model="searchQuery"
              @focus="handleSearchFocus(true)"
              @blur="handleSearchFocus(false)"
              @input="handleSearch"
              type="text"
              :placeholder="'搜索' + (activeTab === 'artists' ? '歌手' : '用户') + '...'"
              class="w-full pl-12 pr-12 py-3 rounded-full bg-[#121225] border border-[rgba(205,49,129,0.1)] focus:border-[#cd3181] focus:ring-2 focus:ring-[#cd3181]/20 outline-none transition-all duration-500 text-sm placeholder:text-[#64748b] placeholder:transition-colors placeholder:focus:text-[#94a3b8] shadow-md shadow-black/10 focus:shadow-lg focus:shadow-[#cd3181]/5 transform focus:scale-[1.02] origin-center"
              :style="{
                width: isSearchFocused ? '100%' : '80%',
                margin: isSearchFocused ? '0 0 0 auto' : '0 0 0 auto',
              }"
            />
            <button
              @click="clearSearch"
              v-if="searchQuery.length > 0"
              class="absolute inset-y-0 right-4 flex items-center text-[#64748b] hover:text-[#cd3181] transition-colors duration-300"
            >
              <i class="iconfont text-lg">&#xe672;</i>
            </button>
            <div
              v-if="searchQuery.length > 0 && filteredItems.length >= 0"
              class="absolute top-full right-0 mt-2 text-xs text-[#64748b] pr-12 md:pr-0"
            >
              找到 {{ filteredItems.length }} 个{{ activeTab === 'artists' ? '歌手' : '用户' }}
            </div>
          </div>
        </div>
      </div>

      <div v-if="activeTab === 'artists'" class="space-y-8">
        <div
          class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6"
        >
          <div v-for="artist in filteredItems" :key="artist.id" class="group relative">
            <div
              class="relative overflow-hidden rounded-2xl mb-3 aspect-square cursor-pointer bg-[#121225] border border-[rgba(205,49,129,0.05)] group-hover:border-[rgba(205,49,129,0.2)] transition-all duration-500 group-hover:shadow-xl group-hover:shadow-[#cd3181]/5"
            >
              <img
                :src="artist.avatar"
                alt="歌手头像"
                class="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-115"
              />
              <div
                class="absolute inset-0 bg-gradient-to-t from-[#0a0a14]/90 via-[#0a0a14]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex flex-col items-center justify-end pb-5"
              >
                <button
                  class="w-12 h-12 rounded-full bg-gradient-to-r from-[#cd3181] to-[#ff8fab] flex items-center justify-center shadow-lg shadow-[#cd3181]/30 transform translate-y-6 group-hover:translate-y-0 transition-all duration-500 hover:scale-110 active:scale-95"
                >
                  <img src="../../assets/线条小狗 (4)_爱给网_aigei_com.gif" alt="" class="w-7" />
                </button>
                <p class="text-xs text-white/80 mt-3">
                  {{ Math.floor(Math.random() * 100) + 5 }}k 粉丝
                </p>
              </div>
              <div
                v-if="artist.isOnline"
                class="absolute top-3 right-3 w-4 h-4 rounded-full bg-[#cd3181] border-2 border-[rgba(255,138,171,0.5)] shadow-md shadow-[#cd3181]/30 animate-pulse"
              ></div>
              <div
                class="absolute inset-0 border-2 border-transparent rounded-2xl group-hover:border-[#cd3181]/50 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
              ></div>
            </div>
            <h4
              class="font-medium text-sm truncate text-white group-hover:text-[#ff8fab] transition-colors duration-300"
            >
              <span v-html="highlightKeyword(artist.name)"></span>
            </h4>
            <p class="text-[#64748b] text-xs truncate mt-1">{{ artist.genre }}</p>
            <button
              class="mt-2 w-full py-1.5 text-xs rounded-full border border-[rgba(205,49,129,0.3)] text-[#cd3181] opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[rgba(205,49,129,0.1)] hover:border-[#cd3181] hover:text-[#ff8fab] transform translate-y-2 group-hover:translate-y-0"
              @click.stop="toggleFollow('artist', artist.id)"
            >
              取消关注
            </button>
          </div>
        </div>
      </div>

      <div v-if="activeTab === 'users'" class="space-y-4" key="user-list">
        <div v-for="(user, index) in filteredItems" :key="user.id" class="group">
          <div
            class="user-card bg-[#121225] rounded-2xl p-5 flex items-center gap-5 border border-[rgba(205,49,129,0.05)] hover:border-[rgba(205,49,129,0.2)] transition-all duration-500 hover:shadow-lg hover:shadow-[#cd3181]/5 hover:-translate-y-1 relative overflow-hidden cursor-pointer"
            :style="{ animationDelay: `${index * 0.1}s` }"
            @click="goToUserProfile(user.id)"
          >
            <div
              class="absolute -right-20 -top-20 w-40 h-40 bg-[#cd3181]/5 rounded-full blur-2xl pointer-events-none"
            ></div>

            <div class="relative">
              <img
                :src="user.avatar"
                alt="用户头像"
                class="w-16 h-16 rounded-full object-cover border-2 border-transparent group-hover:border-[#cd3181] transition-all duration-400 shadow-md shadow-black/20"
              />
            </div>

            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1.5">
                <h4
                  class="font-medium text-base truncate text-white group-hover:text-[#ff8fab] transition-colors duration-300"
                >
                  <span v-html="highlightKeyword(user.name)"></span>
                </h4>
                <span
                  v-if="user.verified"
                  class="text-[#FA86A6] text-xs flex items-center justify-center w-5 h-5 rounded-full bg-[#cd3181]/10"
                >
                  <i class="iconfont">&#xe640;</i>
                </span>
              </div>
              <p class="text-[#94a3b8] text-sm line-clamp-1 truncate italic">
                {{ user.signature }}
              </p>

              <div class="flex gap-5 mt-2.5">
                <span
                  class="text-xs text-[#64748b] flex items-center gap-1.5 group-hover:text-[#8b5cf6] transition-colors"
                >
                  <i
                    class="iconfont text-[#64748b] text-base group-hover:text-[#8b5cf6]"
                    style="font-size: 20px"
                    >&#xe612;</i
                  >
                  {{ user.posts }} 动态
                </span>
                <span
                  class="text-xs text-[#64748b] flex items-center gap-1.5 group-hover:text-[#cd3181] transition-colors"
                >
                  <i
                    class="iconfont text-[#64748b] text-lg group-hover:text-[#cd3181]"
                    style="font-size: 23px"
                    >&#xe66a;</i
                  >
                  {{ user.playlists }} 歌单
                </span>
              </div>
            </div>

            <button
              class="px-8 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-400 flex items-center gap-1.5 hover:shadow-lg hover:shadow-[#cd3181]/20 active:scale-95 relative"
              style="
                background: rgba(205, 49, 129, 0.08);
                border: 1px solid rgba(205, 49, 129, 0.2);
                color: #cd3181;
              "
              @click.stop="toggleFollow('user', user.id)"
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
                  >取消关注</span
                >
              </span>
            </button>
          </div>
        </div>
      </div>

      <div
        v-if="filteredItems.length === 0 && (activeTab === 'artists' || activeTab === 'users')"
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
          {{ searchQuery.length > 0 ? '没有找到匹配结果' : '暂无关注内容' }}
        </h3>
        <p class="text-[#94a3b8] max-w-md mb-8 text-base leading-relaxed">
          {{
            searchQuery.length > 0
              ? `未找到包含"${searchQuery}"的${activeTab === 'artists' ? '歌手' : '用户'}，请尝试其他关键词`
              : activeTab === 'artists'
                ? '去发现更多优秀歌手并关注他们吧，第一时间获取新歌动态'
                : '去关注一些有趣的用户，分享你的音乐品味，丰富音乐社交'
          }}
        </p>
        <button
          class="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#cd3181] to-[#ff8fab] text-white font-medium shadow-lg shadow-[#cd3181]/20 hover:shadow-[#cd3181]/30 transition-all duration-400 hover:-translate-y-1 active:scale-95 flex items-center gap-2"
          @click="searchQuery.length > 0 ? clearSearch() : ''"
        >
          <i class="iconfont text-sm" style="font-size: 23px">
            {{ searchQuery.length > 0 ? '&#xe633;' : '&#xe660;' }}
          </i>
          {{ searchQuery.length > 0 ? '清除搜索' : '去发现' }}
        </button>
      </div>
    </main>
    <teleport to="body">
      <div
        ref="notificationRef"
        class="fixed top-6 right-6 bg-[#121225] border border-[#cd3181] text-white px-5 py-3 rounded-xl shadow-xl shadow-[#cd3181]/10 z-50 transform translate-x-full transition-transform duration-500 ease-out flex items-center gap-2"
      >
        <i class="iconfont text-[#cd3181]">&#xe62b;</i>
        <span id="notification-text">已取消关注</span>
      </div>
    </teleport>
  </div>
</template>
<script setup lang="ts">
const activeTab = ref('artists')
const notificationRef = ref<HTMLDivElement | null>(null)
const searchQuery = ref('')
const isSearchFocused = ref(false)

const artists = ref([
  {
    id: 1,
    name: 'Luna Ray',
    avatar: 'https://picsum.photos/300/300?random=10',
    genre: '电子流行',
    isOnline: true,
  },
  {
    id: 2,
    name: 'Echo Valley',
    avatar: 'https://picsum.photos/300/300?random=11',
    genre: '独立民谣',
    isOnline: false,
  },
  {
    id: 3,
    name: 'Neon Pulse',
    avatar: 'https://picsum.photos/300/300?random=12',
    genre: 'Synthwave',
    isOnline: true,
  },
  {
    id: 4,
    name: 'Aurora Sky',
    avatar: 'https://picsum.photos/300/300?random=13',
    genre: '梦幻流行',
    isOnline: false,
  },
  {
    id: 5,
    name: 'Rhythm Collective',
    avatar: 'https://picsum.photos/300/300?random=14',
    genre: '爵士 Fusion',
    isOnline: true,
  },
  {
    id: 6,
    name: 'Velvet Echo',
    avatar: 'https://picsum.photos/300/300?random=15',
    genre: '灵魂乐',
    isOnline: false,
  },
  {
    id: 7,
    name: 'Luna Ray',
    avatar: 'https://picsum.photos/300/300?random=10',
    genre: '电子流行',
    isOnline: true,
  },
  {
    id: 8,
    name: 'Echo Valley',
    avatar: 'https://picsum.photos/300/300?random=11',
    genre: '独立民谣',
    isOnline: false,
  },
  {
    id: 9,
    name: 'Neon Pulse',
    avatar: 'https://picsum.photos/300/300?random=12',
    genre: 'Synthwave',
    isOnline: true,
  },
  {
    id: 10,
    name: 'Aurora Sky',
    avatar: 'https://picsum.photos/300/300?random=13',
    genre: '梦幻流行',
    isOnline: false,
  },
  {
    id: 11,
    name: 'Rhythm Collective',
    avatar: 'https://picsum.photos/300/300?random=14',
    genre: '爵士 Fusion',
    isOnline: true,
  },
  {
    id: 12,
    name: 'Velvet Echo',
    avatar: 'https://picsum.photos/300/300?random=15',
    genre: '灵魂乐',
    isOnline: false,
  },
])

const users = ref([
  {
    id: 101,
    name: 'MusicLover',
    avatar: 'https://picsum.photos/100/100?random=1',
    signature: '每天都在发现好音乐的路上',
    verified: true,
    posts: 128,
    playlists: 24,
  },
  {
    id: 102,
    name: 'NightOwl',
    avatar: 'https://picsum.photos/100/100?random=2',
    signature: '深夜音乐鉴赏家 | 独立音乐爱好者',
    verified: false,
    posts: 87,
    playlists: 15,
  },
  {
    id: 103,
    name: 'SynthAddict',
    avatar: 'https://picsum.photos/100/100?random=3',
    signature: '80年代复古电子音乐收藏者',
    verified: false,
    posts: 215,
    playlists: 36,
  },
  {
    id: 104,
    name: 'JazzCat',
    avatar: 'https://picsum.photos/100/100?random=4',
    signature: '爵士与蓝调的忠实追随者',
    verified: true,
    posts: 93,
    playlists: 19,
  },
])

const switchTab = (tab: 'artists' | 'users') => {
  console.log(`🔄 切换标签页: ${tab} → 当前值:`, activeTab.value)
  activeTab.value = tab
  searchQuery.value = ''
  handleSearch()
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

const handleSearchFocus = (isFocused: boolean) => {
  isSearchFocused.value = isFocused
  if (isFocused && notificationRef.value) {
    notificationRef.value.style.transform = 'translateX(calc(100% + 2rem))'
  }
}

const filteredItems = ref<any[]>([])
const handleSearch = () => {
  const query = searchQuery.value.trim().toLowerCase()
  if (activeTab.value === 'artists') {
    filteredItems.value = query
      ? artists.value.filter(
          (artist) =>
            artist.name.toLowerCase().includes(query) || artist.genre.toLowerCase().includes(query),
        )
      : [...artists.value] // 无关键词时显示全部
  } else {
    filteredItems.value = query
      ? users.value.filter(
          (user) =>
            user.name.toLowerCase().includes(query) || user.signature.toLowerCase().includes(query),
        )
      : [...users.value] // 无关键词时显示全部
  }
}

const clearSearch = () => {
  searchQuery.value = ''
  handleSearch()
  if (notificationRef.value) {
    const textEl = notificationRef.value.querySelector('#notification-text')
    if (textEl) textEl.textContent = '已清除搜索'
    notificationRef.value.style.transform = 'translateX(0)'
    setTimeout(() => {
      notificationRef.value!.style.transform = 'translateX(calc(100% + 2rem))'
    }, 1500)
  }
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

const goToUserProfile = (userId: number) => {
  console.log(`✅ 点击用户卡片成功，用户ID：${userId}`)
}

const toggleFollow = (type: 'artist' | 'user', id: number) => {
  if (type === 'artist') {
    artists.value = artists.value.filter((artist) => artist.id !== id)
    filteredItems.value = filteredItems.value.filter((artist) => artist.id !== id)
  } else {
    users.value = users.value.filter((user) => user.id !== id)
    filteredItems.value = filteredItems.value.filter((user) => user.id !== id)
  }

  if (notificationRef.value) {
    const textEl = notificationRef.value.querySelector('#notification-text')
    if (textEl) textEl.textContent = '已取消关注'
    notificationRef.value.style.transform = 'translateX(0)'
    setTimeout(() => {
      notificationRef.value!.style.transform = 'translateX(calc(100% + 2rem))'
    }, 2500)
  }
}

handleSearch()
</script>
<style lang="scss" scoped>
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

.user-card {
  opacity: 0;
  animation: fadeInUp 0.5s ease-out forwards;
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

.grid > div.group::after {
  content: '';
  position: absolute;
  bottom: 0px;
  left: 50%;
  transform: translateX(-50%) scaleX(0);
  width: 80%;
  height: 2px;
  background: linear-gradient(to right, #cd3181, #ff8fab);
  transform-origin: center;
  transition: transform 0.4s ease;
  border-radius: 1px;
}

.grid > div.group:hover::after {
  transform: translateX(-50%) scaleX(1);
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

@media (max-width: 768px) {
  .grid {
    grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
    gap: 3rem 1.5rem !important;
  }

  button[class*='px-5'][class*='py-2'] {
    margin-top: 10px;
    width: 100%;
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

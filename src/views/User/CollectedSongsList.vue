<template>
  <div
    class="collection-playlists-page min-h-screen bg-[#080812] text-white font-['Poppins',sans-serif] overflow-x-hidden"
  >
    <div
      class="fixed inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(236,72,153,0.12),transparent_60%)] pointer-events-none -z-10"
    ></div>
    <div
      class="fixed inset-0 bg-[url('https://picsum.photos/1920/1080?random=99')] opacity-4 bg-cover bg-center bg-fixed pointer-events-none -z-10"
    ></div>

    <header
      class="sticky top-0 z-50 bg-[#080812]/95 backdrop-blur-3xl border-b border-[rgba(236,72,153,0.08)] px-4 md:px-8 py-4 transition-all duration-500 ease-in-out"
      @scroll="handleScroll"
    >
      <div class="container mx-auto flex items-center justify-between">
        <div class="flex items-center gap-4">
          <button
            class="w-12 h-12 rounded-full bg-[#121224]/80 flex items-center justify-center text-[#e9d5ff] hover:bg-[#1a1a36] hover:text-[#ec4899] transition-all duration-400 group shadow-md shadow-black/20"
          >
            <i class="iconfont text-xl group-hover:scale-110 transition-transform duration-300"
              >&#xe661;</i
            >
          </button>
          <div>
            <h1
              class="text-[clamp(1.25rem,3vw,1.9rem)] font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-[#f0abfc] tracking-0.5px"
            >
              我的歌单
            </h1>
            <p class="text-xs text-[#94a3b8]/60 mt-1.5">
              全部 {{ totalPlaylists }} 个 / 收藏 {{ likedPlaylists.length }} 个
            </p>
          </div>
        </div>

        <div class="relative w-full max-w-md mx-4 md:mx-8">
          <div class="relative group/search-container">
            <input
              v-model="searchKeyword"
              type="text"
              class="w-full py-3 px-5 pr-12 rounded-full bg-[#121224]/80 border border-[rgba(236,72,153,0.12)] text-[#e9d5ff] placeholder:text-[#94a3b8]/60 focus:outline-none focus:border-[rgba(236,72,153,0.4)] focus:bg-[#1a1a36]/80 transition-all duration-400 shadow-md shadow-black/20"
              placeholder="搜索歌单/歌曲/风格..."
              @focus="showSearchSuggestions = true"
              @input="handleSearchInput"
              @blur="handleBlur"
            />
            <button
              class="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-[#94a3b8] group-hover/search-container:text-[#ec4899] transition-colors duration-300"
              @click="handleSearch"
            >
              <i class="iconfont text-lg">&#xe721;</i>
            </button>
            <button
              v-if="searchKeyword"
              class="absolute right-14 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center text-[#94a3b8] hover:text-white transition-colors duration-200"
              @click="clearSearch"
            >
              <i class="iconfont text-sm">&#xe607;</i>
            </button>
            <div
              v-if="showSearchSuggestions && (searchKeyword || searchHistory.length)"
              class="absolute top-full left-0 right-0 mt-2 rounded-xl bg-[#121224]/95 shadow-xl shadow-black/40 backdrop-blur-sm overflow-hidden z-50 animate-fadeInUp"
            >
              <div v-if="searchKeyword && !filteredPlaylists.length" class="px-6 py-8 text-center">
                <p class="text-sm text-[#94a3b8]">未找到相关结果</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <main class="container mx-auto px-4 md:px-8 py-8 pb-20">
      <div class="mb-9 overflow-x-auto scrollbar-hide pb-3">
        <div class="flex gap-3 md:gap-4 whitespace-nowrap">
          <button
            class="px-6 py-3 rounded-full text-sm font-medium transition-all duration-400 transform hover:-translate-y-1 active:scale-95 hover:brightness-105"
            :class="
              activeTab === 'all'
                ? 'bg-gradient-to-r from-[#ec4899] to-[#f472b6] text-white shadow-xl shadow-[#ec4899]/20 hover:shadow-[#ec4899]/40'
                : 'bg-[#121224]/80 text-[#94a3b8] hover:bg-[#1a1a36] hover:text-white'
            "
            @click="activeTab = 'all'"
          >
            全部歌单
          </button>
          <button
            class="px-6 py-3 rounded-full text-sm font-medium transition-all duration-400 transform hover:-translate-y-1 active:scale-95 hover:brightness-105"
            :class="
              activeTab === 'liked'
                ? 'bg-gradient-to-r from-[#ec4899] to-[#f472b6] text-white shadow-xl shadow-[#ec4899]/20 hover:shadow-[#ec4899]/40'
                : 'bg-[#121224]/80 text-[#94a3b8] hover:bg-[#1a1a36] hover:text-white'
            "
            @click="activeTab = 'liked'"
          >
            收藏歌单
          </button>
        </div>
      </div>

      <PlaylistSection
        :playlists="
          searchKeyword ? filteredPlaylists : activeTab === 'all' ? allPlaylists : likedPlaylists
        "
        @goToPlaylistDetail="goToPlaylistDetail"
        @playAllSongs="playAllSongs"
        @toggleCollection="toggleCollection"
        @sharePlaylist="sharePlaylist"
        @createNewPlaylist="createNewPlaylist"
      />

      <div
        v-if="searchKeyword && !filteredPlaylists.length && allPlaylists.length > 0"
        class="col-span-full flex flex-col items-center justify-center py-28 text-center"
      >
        <div
          class="w-36 h-36 rounded-full bg-[#121224]/80 flex items-center justify-center mb-9 shadow-2xl shadow-black/25 animate-float border border-[rgba(236,72,153,0.12)]"
        >
          <i class="iconfont text-7xl text-[#ec4899]/50">&#xe611;</i>
        </div>
        <h3
          class="text-[clamp(1.25rem,3vw,1.75rem)] font-bold mb-4 text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-[#f0abfc] tracking-0.5px"
        >
          未找到相关歌单
        </h3>
        <p class="text-[#64748b] max-w-md mb-9 text-base leading-relaxed">
          没有找到包含"{{ searchKeyword }}"的歌单
        </p>
        <button
          class="px-10 py-4 rounded-full bg-gradient-to-r from-[#ec4899] to-[#f472b6] text-white font-medium shadow-2xl shadow-[#ec4899]/20 hover:shadow-[#ec4899]/40 transition-all duration-400 hover:-translate-y-2 active:scale-95 flex items-center gap-3 text-lg hover:brightness-105"
          @click="clearSearch()"
        >
          <i class="iconfont text-xl">&#xe60e;</i>
          <span>清空搜索</span>
        </button>
      </div>

      <div
        v-if="!searchKeyword && activeTab === 'all' && allPlaylists.length === 0"
        class="col-span-full flex flex-col items-center justify-center py-28 text-center"
      >
        <div
          class="w-36 h-36 rounded-full bg-[#121224]/80 flex items-center justify-center mb-9 shadow-2xl shadow-black/25 animate-float border border-[rgba(236,72,153,0.12)]"
        >
          <i class="iconfont text-7xl text-[#ec4899]/50">&#xe630;</i>
        </div>
        <h3
          class="text-[clamp(1.25rem,3vw,1.75rem)] font-bold mb-4 text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-[#f0abfc] tracking-0.5px"
        >
          暂无创建歌单
        </h3>
        <p class="text-[#64748b] max-w-md mb-9 text-base leading-relaxed">
          创建属于你的专属歌单，收藏喜欢的旋律，打造个性化音乐库
        </p>
        <button
          class="px-10 py-4 rounded-full bg-gradient-to-r from-[#ec4899] to-[#f472b6] text-white font-medium shadow-2xl shadow-[#ec4899]/20 hover:shadow-[#ec4899]/40 transition-all duration-400 hover:-translate-y-2 active:scale-95 flex items-center gap-3 text-lg hover:brightness-105"
          @click="createNewPlaylist()"
        >
          <i class="iconfont text-xl">&#xe60a;</i>
          <span>创建新歌单</span>
        </button>
      </div>

      <div
        v-if="!searchKeyword && activeTab === 'liked' && likedPlaylists.length === 0"
        class="col-span-full flex flex-col items-center justify-center py-28 text-center"
      >
        <div
          class="w-36 h-36 rounded-full bg-[#121224]/80 flex items-center justify-center mb-9 shadow-2xl shadow-black/25 animate-float border border-[rgba(236,72,153,0.12)]"
        >
          <i class="iconfont text-7xl text-[#ec4899]/50">&#xe62b;</i>
        </div>
        <h3
          class="text-[clamp(1.25rem,3vw,1.75rem)] font-bold mb-4 text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-[#f0abfc] tracking-0.5px"
        >
          暂无收藏歌单
        </h3>
        <p class="text-[#64748b] max-w-md mb-9 text-base leading-relaxed">
          快去发现更多好听的歌单，收藏你喜欢的音乐合集吧
        </p>
        <button
          class="px-10 py-4 rounded-full bg-gradient-to-r from-[#ec4899] to-[#f472b6] text-white font-medium shadow-2xl shadow-[#ec4899]/20 hover:shadow-[#ec4899]/40 transition-all duration-400 hover:-translate-y-2 active:scale-95 flex items-center gap-3 text-lg hover:brightness-105"
          @click="explorePlaylists()"
        >
          <i class="iconfont text-xl">&#xe615;</i>
          <span>发现歌单</span>
        </button>
      </div>
    </main>

    <teleport to="body">
      <div
        ref="notificationRef"
        class="fixed top-8 right-8 bg-[#121224]/95 border border-[#ec4899]/80 text-white px-6 py-4 rounded-2xl shadow-2xl shadow-[#ec4899]/15 z-50 transform translate-x-full transition-transform duration-700 ease-out flex items-center gap-3 backdrop-blur-sm"
      >
        <div
          class="w-10 h-10 rounded-full bg-[#ec4899]/20 flex items-center justify-center text-[#ec4899]"
        >
          <i class="iconfont text-lg">&#xe62b;</i>
        </div>
        <span id="notification-text" class="text-sm">已取消收藏该歌单</span>
      </div>
    </teleport>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()

interface Playlist {
  id: number
  name: string
  cover: string
  songCount: number
  isLiked?: boolean
}

const allPlaylists = ref<Playlist[]>([
  {
    id: 1,
    name: '治愈系民谣',
    cover: 'https://picsum.photos/200/200?random=3',
    songCount: 24,
    isLiked: true,
  },
  {
    id: 2,
    name: '深夜电子',
    cover: 'https://picsum.photos/200/200?random=4',
    songCount: 18,
    isLiked: true,
  },
  {
    id: 3,
    name: '雨天BGM',
    cover: 'https://picsum.photos/200/200?random=5',
    songCount: 32,
    isLiked: false,
  },
  {
    id: 4,
    name: '复古迪斯科',
    cover: 'https://picsum.photos/200/200?random=6',
    songCount: 28,
    isLiked: false,
  },
  {
    id: 5,
    name: '咖啡时光',
    cover: 'https://picsum.photos/200/200?random=7',
    songCount: 16,
    isLiked: true,
  },
])

const likedPlaylists = computed(() => {
  return allPlaylists.value.filter((playlist) => playlist.isLiked)
})

const activeTab = ref<'all' | 'liked'>('all')

const searchKeyword = ref('')
const showSearchSuggestions = ref(false)
const searchHistory = ref<string[]>(['治愈系民谣', '深夜电子', '雨天BGM'])

const filteredPlaylists = computed(() => {
  if (!searchKeyword.value) return []
  const keyword = searchKeyword.value.toLowerCase()
  const basePlaylists = activeTab.value === 'all' ? allPlaylists.value : likedPlaylists.value
  return basePlaylists.filter((playlist) => playlist.name.toLowerCase().includes(keyword))
})

const totalPlaylists = computed(() => allPlaylists.value.length)
const notificationRef = ref<HTMLDivElement | null>(null)

const handleScroll = () => {
  const header = document.querySelector('header')
  if (header) {
    if (window.scrollY > 20) {
      header.classList.add('py-2')
      header.classList.remove('py-4')
    } else {
      header.classList.add('py-4')
      header.classList.remove('py-2')
    }
  }
}

const handleSearchInput = () => {
  showSearchSuggestions.value = true
}

const handleBlur = () => {
  window.setTimeout(() => {
    showSearchSuggestions.value = false
  }, 200)
}

const handleSearch = () => {
  if (!searchKeyword.value.trim()) return
  if (!searchHistory.value.includes(searchKeyword.value)) {
    searchHistory.value.unshift(searchKeyword.value)
    if (searchHistory.value.length > 5) {
      searchHistory.value.pop()
    }
  }
  showSearchSuggestions.value = false
  showNotification(`正在搜索"${searchKeyword.value}"`)
}

const clearSearch = () => {
  searchKeyword.value = ''
  showSearchSuggestions.value = false
  showNotification('已清空搜索内容')
}

const showNotification = (text: string) => {
  if (notificationRef.value) {
    const textEl = notificationRef.value.querySelector('#notification-text')
    if (textEl) textEl.textContent = text
    notificationRef.value.style.transform = 'translateX(0)'
    setTimeout(() => {
      notificationRef.value!.style.transform = 'translateX(calc(100% + 4rem))'
    }, 3000)
  }
}

const goToPlaylistDetail = (id: number) => {
  console.log(`进入歌单详情：${id}`)
  router.push({ path: `/playlist/${id}` })
  showNotification(`正在播放《${allPlaylists.value.find((p) => p.id === id)?.name}》`)
}

const playAllSongs = (id: number) => {
  console.log(`播放歌单全部歌曲：${id}`)
  showNotification(`开始播放《${allPlaylists.value.find((p) => p.id === id)?.name}》全部歌曲`)
}

const toggleCollection = (id: number) => {
  const playlist = allPlaylists.value.find((p) => p.id === id)
  if (playlist) {
    playlist.isLiked = !playlist.isLiked
    const action = playlist.isLiked ? '收藏' : '取消收藏'
    showNotification(`已${action}该歌单`)
  }
}

const sharePlaylist = (id: number) => {
  console.log(`分享歌单：${id}`)
  showNotification('分享成功，快去和好友分享吧～')
}

const createNewPlaylist = () => {
  console.log('创建新歌单')
  showNotification('正在为你创建新歌单')
}

const explorePlaylists = () => {
  console.log('发现歌单')
  showNotification('为你推荐更多优质歌单')
}
</script>

<style lang="scss" scoped>
.animate-fadeInUp {
  animation: fadeInUp 0.25s ease-out forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(8px);
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
    transform: translateY(-12px);
  }
}

.animate-float {
  animation: float 4.5s ease-in-out infinite;
}

::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(#121224, 50);
  border-radius: 6px;
}

::-webkit-scrollbar-thumb {
  background: rgba(#ec4899, 70);
  border-radius: 6px;
}

::-webkit-scrollbar-thumb:hover {
  background: #f472b6;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.iconfont {
  font-family: 'iconfont' !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

@media (max-width: 768px) {
  header .flex.items-center.gap-4 {
    gap: 1.5rem;
  }
  header .relative.w-full.max-w-md {
    margin: 0;
    margin-top: 1rem;
    width: 100%;
  }
  header .container.mx-auto.flex {
    flex-wrap: wrap;
  }
  .mb-9 {
    margin-bottom: 2rem;
  }
  .notification {
    width: calc(100% - 32px);
    right: 16px;
  }
  .px-6 {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}

button {
  cursor: pointer;
  outline: none;
  border: none;
}

* {
  scroll-behavior: smooth;
  box-sizing: border-box;
}

.bg-gradient-to-r {
  background-image: linear-gradient(to right, var(--tw-gradient-stops));
  --tw-gradient-from: #ec4899;
  --tw-gradient-to: #f472b6;
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.backdrop-blur-3xl {
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
}

.backdrop-blur-sm {
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.shadow-2xl {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.3);
}

input:focus {
  box-shadow: none !important;
}

.animate-fadeInUp {
  border: none !important;
  outline: none !important;
  box-shadow: none !important;
}

button:hover .text-xs.text-\[\#94a3b8\] {
  color: #e9d5ff;
}
</style>

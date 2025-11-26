<template>
  <div
    class="collection-albums-page min-h-screen bg-[#080812] text-white font-['Poppins',sans-serif] overflow-x-hidden"
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
              我的收藏专辑
            </h1>
            <p class="text-xs text-[#94a3b8]/60 mt-1.5">珍藏 {{ totalAlbums }} 张心动旋律</p>
          </div>
        </div>

        <div class="relative w-full max-w-md mx-4 md:mx-8">
          <div class="relative group/search-container">
            <input
              v-model="searchKeyword"
              type="text"
              class="w-full py-3 px-5 pr-12 rounded-full bg-[#121224]/80 border border-[rgba(236,72,153,0.12)] text-[#e9d5ff] placeholder:text-[#94a3b8]/60 focus:outline-none focus:border-[rgba(236,72,153,0.4)] focus:bg-[#1a1a36]/80 transition-all duration-400 shadow-md shadow-black/20"
              placeholder="搜索专辑/歌手/歌曲..."
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
              <div v-if="searchKeyword && !filteredAlbums.length" class="px-6 py-8 text-center">
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
            class="px-6 py-3 rounded-full bg-gradient-to-r from-[#ec4899] to-[#f472b6] text-white text-sm font-medium shadow-xl shadow-[#ec4899]/20 hover:shadow-[#ec4899]/40 transition-all duration-400 transform hover:-translate-y-1 active:scale-95 hover:brightness-105"
          >
            全部专辑
          </button>
        </div>
      </div>

      <CollectedAlbum
        :albums="filteredAlbums.length ? filteredAlbums : albums"
        @goToAlbumDetail="goToAlbumDetail"
        @playAlbum="playAlbum"
        @toggleCollection="toggleCollection"
        @shareAlbum="shareAlbum"
        @exploreAlbums="exploreAlbums"
      />

      <div
        v-if="searchKeyword && !filteredAlbums.length && albums.length > 0"
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
          未找到相关专辑
        </h3>
        <p class="text-[#64748b] max-w-md mb-9 text-base leading-relaxed">
          没有找到包含"{{ searchKeyword }}"的专辑
        </p>
        <button
          class="px-10 py-4 rounded-full bg-gradient-to-r from-[#ec4899] to-[#f472b6] text-white font-medium shadow-2xl shadow-[#ec4899]/20 hover:shadow-[#ec4899]/40 transition-all duration-400 hover:-translate-y-2 active:scale-95 flex items-center gap-3 text-lg hover:brightness-105"
          @click="clearSearch()"
        >
          <i class="iconfont text-xl">&#xe60e;</i>
          <span>清空搜索</span>
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
        <span id="notification-text" class="text-sm">已取消收藏该专辑</span>
      </div>
    </teleport>
  </div>
</template>

<script setup lang="ts">
interface Album {
  id: number
  name: string
  artist: string
  cover: string
  songCount: number
  playCount: string
  collectTime: string
}

const albums = ref<Album[]>([
  {
    id: 1,
    name: '孤独的海',
    artist: '深海鱼子酱',
    cover: 'https://picsum.photos/300/300?random=41',
    songCount: 12,
    playCount: '128万',
    collectTime: '2025-05-20',
  },
  {
    id: 2,
    name: '晚风告白',
    artist: '小田音乐社',
    cover: 'https://picsum.photos/300/300?random=42',
    songCount: 10,
    playCount: '89万',
    collectTime: '2025-04-12',
  },
  {
    id: 3,
    name: '星河入海',
    artist: '尹昔眠',
    cover: 'https://picsum.photos/300/300?random=43',
    songCount: 14,
    playCount: '205万',
    collectTime: '2025-05-05',
  },
  {
    id: 4,
    name: '雾里',
    artist: '姚六一',
    cover: 'https://picsum.photos/300/300?random=44',
    songCount: 8,
    playCount: '312万',
    collectTime: '2025-03-18',
  },
  {
    id: 5,
    name: '人间白首',
    artist: '叶洛洛',
    cover: 'https://picsum.photos/300/300?random=45',
    songCount: 11,
    playCount: '76万',
    collectTime: '2025-04-28',
  },
  {
    id: 6,
    name: '难生恨',
    artist: 'DAWN',
    cover: 'https://picsum.photos/300/300?random=46',
    songCount: 9,
    playCount: '158万',
    collectTime: '2025-05-10',
  },
])

const searchKeyword = ref('')
const showSearchSuggestions = ref(false)
const searchHistory = ref<string[]>(['周杰伦', '孤独的海', '小幸运'])

const filteredAlbums = computed(() => {
  if (!searchKeyword.value) return []
  const keyword = searchKeyword.value.toLowerCase()
  return albums.value.filter(
    (album) =>
      album.name.toLowerCase().includes(keyword) || album.artist.toLowerCase().includes(keyword),
  )
})

const totalAlbums = computed(() => albums.value.length)
const notificationRef = ref<HTMLDivElement | null>(null)

const handleScroll = () => {
  /* ... */
}
const handleSearchInput = () => {
  /* ... */
}
const handleBlur = () => {
  /* ... */
}
const handleSearch = () => {
  /* ... */
}
const clearSearch = () => {
  /* ... */
}
const selectSearchHistory = (history: string) => {
  /* ... */
}
const removeSearchHistory = (index: number) => {
  /* ... */
}
const selectAlbumSuggestion = (album: Album) => {
  /* ... */
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

const goToAlbumDetail = (id: number) => {
  console.log(`进入专辑详情：${id}`)
  showNotification(`正在播放《${albums.value.find((a) => a.id === id)?.name}》`)
}

const playAlbum = (id: number) => {
  console.log(`播放专辑：${id}`)
  showNotification(`开始播放《${albums.value.find((a) => a.id === id)?.name}》`)
}

const toggleCollection = (id: number) => {
  albums.value = albums.value.filter((album) => album.id !== id)
  showNotification('已取消收藏该专辑')
}

const shareAlbum = (id: number) => {
  console.log(`分享专辑：${id}`)
  showNotification('分享成功，快去和好友分享吧～')
}

const exploreAlbums = () => {
  console.log('探索热门专辑')
  showNotification('正在为你推荐热门专辑')
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
  background: rgba(18, 18, 36, 0.5);
  border-radius: 6px;
}

::-webkit-scrollbar-thumb {
  background: rgba(#ec4899, 0.7);
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
  .header .flex.items-center.gap-4 {
    gap: 3rem;
  }
  .header .relative.w-full.max-w-md {
    margin: 0;
    margin-top: 1rem;
  }
  .header .container.mx-auto.flex {
    flex-wrap: wrap;
  }
  .mb-9 {
    margin-bottom: 2rem;
  }
  .notification {
    width: calc(100% - 32px);
    right: 16px;
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

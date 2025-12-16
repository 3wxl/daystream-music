<template>
  <div
    class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6"
  >
    <div
      v-for="(album, index) in albums"
      :key="album.id"
      class="album-card group cursor-pointer"
      :style="{ '--delay': index * 0.05 + 's' }"
      @click="goToAlbumDetail(album.id)"
    >
      <div
        class="relative aspect-square mb-4 rounded-2xl overflow-hidden bg-[#121224] border border-[rgba(236,72,153,0.05)] group-hover:border-[rgba(236,72,153,0.3)] transition-all duration-700 shadow-xl shadow-black/20 group-hover:shadow-2xl group-hover:shadow-[#ec4899]/8"
      >
        <img
          :src="album.cover"
          alt="专辑封面"
          class="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-115"
        />

        <div
          class="absolute inset-0 bg-gradient-to-t from-[#080812]/90 via-[#080812]/40 to-[#080812]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
        ></div>
        <div
          class="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-8 group-hover:translate-y-0 pt-8"
        >
          <button
            class="w-16 h-16 rounded-full bg-gradient-to-r from-[#ec4899] to-[#f472b6] flex items-center justify-center shadow-2xl shadow-[#ec4899]/30 transform scale-90 group-hover:scale-100 transition-all duration-500 hover:scale-110 active:scale-95 mb-6 z-10"
            @click.stop="playAlbum(album.id)"
          >
            <i class="iconfont text-white text-2xl">&#xe623;</i>
          </button>

          <div
            class="px-4 py-2 rounded-full bg-black/60 backdrop-blur-sm text-xs text-white/90 flex items-center gap-2 z-10"
          >
            <i class="iconfont text-[#ec4899] text-xs">&#xe6ac;</i>
            {{ album.songCount }} 首歌曲
          </div>
        </div>

        <div
          class="absolute top-4 right-4 w-10 h-10 rounded-full bg-gradient-to-r from-[#ec4899] to-[#f472b6] flex items-center justify-center shadow-lg shadow-[#ec4899]/30 transform group-hover:rotate-15 transition-transform duration-700 z-5"
        >
          <i class="iconfont text-white text-sm">&#xe62b;</i>
        </div>

        <div
          class="absolute bottom-4 left-4 text-xs text-white/90 backdrop-blur-md bg-black/40 px-3 py-1.5 rounded-lg flex items-center gap-1.5 z-5 opacity-100 group-hover:opacity-0 transition-opacity duration-500"
        >
          <i class="iconfont text-xs text-[#ec4899]">&#xe84e;</i>
          <span>{{ album.playCount }}</span>
        </div>

        <div
          class="absolute inset-0 border-2 border-transparent rounded-2xl group-hover:border-[#ec4899]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-0"
        ></div>

        <div
          class="absolute inset-0 bg-[#ec4899]/5 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-0"
        ></div>
      </div>

      <h3
        class="text-sm font-semibold truncate text-white group-hover:text-[#f472b6] transition-colors duration-500"
      >
        {{ album.name }}
      </h3>
      <p
        class="text-xs text-[#64748b] truncate mt-2 group-hover:text-[#94a3b8] transition-colors duration-500"
      >
        {{ album.artist }}
      </p>

      <div
        class="mt-3 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-3 group-hover:translate-y-0"
      >
        <!-- 取消收藏按钮：添加loading状态 + 阻止事件冒泡 -->
        <button
          class="text-xs text-[#64748b] hover:text-[#ec4899] transition-colors duration-300"
          @click.stop="handleCancelCollect(album.id)"
          :disabled="loadingIds.includes(album.id)"
        >
          <i class="iconfont mr-1 text-xs" v-if="loadingIds.includes(album.id)">&#xe634;</i>
          <i class="iconfont mr-1 text-xs" v-else>&#xe62b;</i>
          {{ loadingIds.includes(album.id) ? '取消中...' : '取消收藏' }}
        </button>
        <button
          class="text-xs text-[#64748b] hover:text-[#ec4899] transition-colors duration-300"
          @click.stop="shareAlbum(album.id)"
        >
          <i class="iconfont mr-1 text-xs">&#xe663;</i> 分享
        </button>
      </div>
    </div>
  </div>

  <div
    v-if="albums.length === 0"
    class="col-span-full flex flex-col items-center justify-center py-28 text-center"
  >
    <div
      class="w-32 h-32 rounded-full bg-[#121224] flex items-center justify-center mb-8 shadow-2xl shadow-black/20 animate-float border border-[rgba(236,72,153,0.1)]"
    >
      <i class="iconfont text-6xl text-[#ec4899]/50">&#xe625;</i>
    </div>
    <h3
      class="text-2xl font-bold mb-4 text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-[#f0abfc]"
    >
      暂无收藏专辑
    </h3>
    <p class="text-[#64748b] max-w-md mb-8 text-base leading-relaxed">
      去发现更多心动的专辑，收藏属于你的音乐时光
    </p>
    <button
      class="px-10 py-4 rounded-full bg-gradient-to-r from-[#ec4899] to-[#f472b6] text-white font-medium shadow-2xl shadow-[#ec4899]/20 hover:shadow-[#ec4899]/40 transition-all duration-400 hover:-translate-y-2 active:scale-95 flex items-center gap-3 text-lg"
      @click="exploreAlbums"
    >
      <i class="iconfont text-xl">&#xe60a;</i>
      探索热门专辑
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 1. 修复Props类型：id兼容数字/字符串
const props = defineProps<{
  albums: {
    id: number | string // 关键：兼容数字/字符串ID
    name: string
    artist: string
    cover: string
    songCount: number
    playCount: string
    collectTime: string
  }[]
}>()

// 2. 修复Emits类型：id兼容数字/字符串
const emit = defineEmits<{
  (e: 'goToAlbumDetail', id: number | string): void
  (e: 'playAlbum', id: number | string): void
  (e: 'toggleCollection', id: number | string): void
  (e: 'shareAlbum', id: number | string): void
  (e: 'exploreAlbums'): void
}>()

// 3. 添加loading状态（避免重复点击）
const loadingIds = ref<(number | string)[]>([])

// 4. 封装取消收藏逻辑（带loading）
const handleCancelCollect = async (id: number | string) => {
  // 避免重复点击
  if (loadingIds.value.includes(id)) return

  try {
    loadingIds.value.push(id)
    // 触发父组件的取消收藏事件
    emit('toggleCollection', id)
  } finally {
    // 移除loading状态（无论成功/失败）
    loadingIds.value = loadingIds.value.filter((item) => item !== id)
  }
}

// 5. 保留原有事件触发函数
const goToAlbumDetail = (id: number | string) => emit('goToAlbumDetail', id)
const playAlbum = (id: number | string) => emit('playAlbum', id)
const shareAlbum = (id: number | string) => emit('shareAlbum', id)
const exploreAlbums = () => emit('exploreAlbums')
</script>

<style lang="scss" scoped>
.album-card {
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 0.8s ease-out forwards;
  animation-delay: var(--delay);
}

@keyframes fadeInUp {
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
    transform: translateY(-10px);
  }
}

.animate-float {
  animation: float 4s ease-in-out infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-rotate {
  animation: rotate 8s linear infinite;
}

::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #121224;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #ec4899;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #f472b6;
}

/* 隐藏横向滚动条 */
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
  .grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)) !important;
    gap: 5rem 2rem !important;
  }

  .album-card .relative {
    border-radius: 16px !important;
  }

  .album-card h3 {
    font-size: 13px !important;
  }

  .album-card p {
    font-size: 11px !important;
  }

  .album-card .relative .flex-col {
    padding-top: 1rem !important;
  }

  .album-card .relative .flex-col button {
    margin-bottom: 1rem !important;
  }

  .flex.items-center.justify-between {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
}

button {
  cursor: pointer;
  outline: none;
  border: none;
}

* {
  scroll-behavior: smooth;
}

.bg-gradient-to-r {
  background-image: linear-gradient(to right, var(--tw-gradient-stops));
}

.bg-clip-text {
  -webkit-background-clip: text;
  background-clip: text;
}

.text-transparent {
  color: transparent;
}

.backdrop-blur-2xl {
  backdrop-filter: blur(40px);
  -webkit-backdrop-filter: blur(40px);
}

.shadow-2xl {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}
</style>

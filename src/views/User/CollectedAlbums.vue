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

      <!-- 空数据提示 -->
      <div v-if="albums.length === 0 && !loadingMore && !searchKeyword" class="py-20 text-center">
        <div
          class="w-32 h-32 rounded-full bg-[#121224]/80 flex items-center justify-center mx-auto mb-6"
        >
          <i class="iconfont text-6xl text-[#ec4899]/40">&#xe611;</i>
        </div>
        <p class="text-[#94a3b8] text-lg">暂无收藏的专辑</p>
      </div>

      <!-- 专辑列表组件 -->
      <CollectedAlbum
        v-if="albums.length > 0"
        :albums="filteredAlbums.length ? filteredAlbums : albums"
        @goToAlbumDetail="goToAlbumDetail"
        @playAlbum="playAlbum"
        @toggleCollection="toggleCollection"
        @shareAlbum="shareAlbum"
        @exploreAlbums="exploreAlbums"
      />

      <!-- 加载更多按钮 -->
      <div class="mt-10 text-center" v-if="!searchKeyword && albums.length > 0">
        <!-- 加载中状态 -->
        <button
          v-if="loadingMore"
          disabled
          class="px-8 py-3 rounded-full bg-[#121224]/80 border border-[rgba(236,72,153,0.2)] text-white/80 text-sm flex items-center justify-center gap-2 mx-auto cursor-not-allowed"
        >
          <i class="iconfont text-xs animate-spin">&#xe634;</i>
          <span>加载中...</span>
        </button>

        <!-- 加载更多按钮（还有更多数据） -->
        <button
          v-else-if="hasMore"
          class="px-8 py-3 rounded-full bg-[#121224]/80 border border-[rgba(236,72,153,0.2)] text-white/80 text-sm hover:bg-[#1a1a36] hover:text-white hover:border-[rgba(236,72,153,0.4)] transition-all duration-400 flex items-center justify-center gap-2 mx-auto"
          @click="loadMoreAlbums"
        >
          <span>加载更多</span>
        </button>

        <!-- 无更多数据提示 -->
        <div v-else class="text-sm text-[#94a3b8]/60 py-3">已加载全部收藏专辑</div>
      </div>

      <!-- 搜索无结果提示 -->
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
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
// 导入接口和已定义的类型
import { getMyCollectAlbums, collectAlbum } from '@/api/personalCenter/index'
import type { AlbumVO, CollectAlbumResp, AlbumCardVO } from '@/types/personalCenter/index'

// 分页参数配置
const pagination = ref({
  pageNum: 1, // 当前页码（前端维护）
  pageSize: 12, // 每页加载数量
  total: 0, // 总记录数
  loadedCount: 0, // 已加载数量（替代current）
  pages: 1, // 总页数
  hasMore: false, // 初始值改为false，避免无数据时显示加载更多
})

// 响应式状态
const albums = ref<AlbumCardVO[]>([])
const loadingMore = ref(false) // 加载更多按钮状态
const searchKeyword = ref('')
const showSearchSuggestions = ref(false)
const searchHistory = ref<string[]>(['周杰伦', '孤独的海', '小幸运'])
const notificationRef = ref<HTMLDivElement | null>(null)

// 计算属性
// 搜索过滤
const filteredAlbums = computed(() => {
  if (!searchKeyword.value) return []
  const keyword = searchKeyword.value.toLowerCase()
  return albums.value.filter(
    (album) =>
      album.name.toLowerCase().includes(keyword) || album.artist.toLowerCase().includes(keyword),
  )
})

// 总专辑数
const totalAlbums = computed(() => pagination.value.total)

// 是否还有更多数据（优化边界判断）
const hasMore = computed(() => {
  // 边界条件：总数量为0、已加载数量>=总数量、当前页码>=总页数 → 无更多
  if (
    pagination.value.total === 0 ||
    pagination.value.loadedCount >= pagination.value.total ||
    pagination.value.pageNum >= pagination.value.pages
  ) {
    return false
  }
  // 正常场景：已加载数量 < 总数量 且 还有更多页
  return pagination.value.loadedCount < pagination.value.total && pagination.value.hasMore
})

// ========== 核心接口调用逻辑 ==========
/**
 * 加载收藏专辑
 * @param isLoadMore 是否为加载更多（false=初始化，true=加载更多）
 */
const loadCollectAlbums = async (isLoadMore = false) => {
  try {
    // 加载更多时显示loading
    if (isLoadMore) {
      loadingMore.value = true
    }

    // 调用接口
    const res = (await getMyCollectAlbums({
      pageNum: pagination.value.pageNum,
      pageSize: pagination.value.pageSize,
    })) as unknown as CollectAlbumResp

    console.log('收藏专辑接口返回:', res)

    // 接口调用成功
    if (res.success && res.data) {
      const { records, total, pages, current } = res.data

      // 更新分页信息
      pagination.value.total = total || 0
      pagination.value.pages = pages || 1

      // 处理二维数组：扁平化处理
      let flatRecords: AlbumVO[] = []
      if (Array.isArray(records)) {
        flatRecords = records.flat(Infinity)
      }

      // 过滤无效数据（必须有id）
      const validAlbums = flatRecords.filter((album: AlbumVO) => album && album.id)

      // 更新已加载数量
      const newLoadedCount = isLoadMore
        ? pagination.value.loadedCount + validAlbums.length
        : validAlbums.length
      pagination.value.loadedCount = newLoadedCount

      // 核心：正确判断是否还有更多数据
      pagination.value.hasMore =
        pagination.value.total > 0 && // 有数据
        newLoadedCount < pagination.value.total && // 已加载 < 总数量
        pagination.value.pageNum < pagination.value.pages // 当前页 < 总页数

      // 转换接口数据为前端展示格式
      const formattedAlbums = validAlbums.map((album: AlbumVO) => ({
        id: album.id, // 兼容数字/字符串ID
        name: album.albumName || '未知专辑',
        artist: album.musicianName || '未知歌手',
        cover: album.coverUrl || 'https://picsum.photos/300/300?random=41',
        songCount: album.musicCount || 0,
        playCount: album.playCount || `${album.collectCount || 0}次收藏`,
        collectTime: '2025-05-20', // 接口无此字段，暂用默认值
      }))

      // 更新专辑列表
      if (isLoadMore) {
        albums.value = [...albums.value, ...formattedAlbums]
      } else {
        albums.value = formattedAlbums
      }
    } else {
      // 接口返回失败或无数据
      if (!isLoadMore) {
        albums.value = []
        pagination.value.hasMore = false
        pagination.value.loadedCount = 0
        ElMessage.warning(res.errorMsg || '暂无收藏的专辑')
      }
    }
  } catch (error) {
    // 接口调用异常
    console.error('加载收藏专辑失败:', error)
    ElMessage.error('加载专辑失败，请稍后重试')

    // 加载更多失败时回退页码
    if (isLoadMore) {
      pagination.value.pageNum -= 1
      pagination.value.hasMore = false // 异常时直接标记无更多
    }
  } finally {
    // 关闭loading状态
    loadingMore.value = false
  }
}

/**
 * 加载更多专辑
 */
const loadMoreAlbums = async () => {
  // 严格判断：没有更多数据、正在加载中、总数量为0 → 直接返回
  if (!hasMore.value || loadingMore.value || pagination.value.total === 0) return

  // 页码+1
  pagination.value.pageNum += 1

  // 调用加载函数
  await loadCollectAlbums(true)
}

// ========== 页面初始化 ==========
onMounted(() => {
  // 加载第一页数据
  loadCollectAlbums()
})

// ========== 交互逻辑 ==========
const handleScroll = () => {
  /* 保留原有逻辑 */
}
const handleSearchInput = () => {
  /* 保留原有逻辑 */
}
const handleBlur = () => {
  /* 保留原有逻辑 */
}

const handleSearch = () => {
  showSearchSuggestions.value = false
}

const clearSearch = () => {
  searchKeyword.value = ''
  showSearchSuggestions.value = false
}

const selectSearchHistory = (history: string) => {
  /* 保留原有逻辑 */
}
const removeSearchHistory = (index: number) => {
  /* 保留原有逻辑 */
}
const selectAlbumSuggestion = (album: AlbumCardVO) => {
  /* 保留原有逻辑 */
}

/**
 * 显示通知提示
 */
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

/**
 * 进入专辑详情（兼容数字/字符串ID）
 */
const goToAlbumDetail = (id: number | string) => {
  console.log(`进入专辑详情：${id}`)
  const album = albums.value.find((a) => a.id === id)
  if (album) {
    showNotification(`正在播放《${album.name}》`)
  }
}

/**
 * 播放专辑（兼容数字/字符串ID）
 */
const playAlbum = (id: number | string) => {
  console.log(`播放专辑：${id}`)
  const album = albums.value.find((a) => a.id === id)
  if (album) {
    showNotification(`开始播放《${album.name}》`)
  }
}

/**
 * 分享专辑（兼容数字/字符串ID）
 */
const shareAlbum = (id: number | string) => {
  console.log(`分享专辑：${id}`)
  const album = albums.value.find((a) => a.id === id)
  if (album) {
    showNotification(`分享成功，快去和好友分享《${album.name}》吧～`)
  }
}
const toggleCollection = async (id: number | string) => {
  try {
    // 1. 找到要取消收藏的专辑（用于乐观更新和提示）
    const albumIndex = albums.value.findIndex((item) => item.id === id)
    if (albumIndex === -1) return

    const targetAlbum = albums.value[albumIndex]
    if (!targetAlbum) return // 额外防御性检查

    // 2. 乐观更新：先从页面移除该专辑（提升用户体验）
    albums.value.splice(albumIndex, 1)

    // 3. 调用取消收藏接口
    const res = await collectAlbum(id, 2) // 2=专辑类型
    console.log(res)
    // 4. 接口返回失败：恢复数据并提示
    if (!res.success) {
      ElMessage.error(res.errorMsg || '取消收藏失败')
      // 恢复移除的专辑
      albums.value.splice(albumIndex, 0, targetAlbum)
      return
    }

    // 5. 接口返回成功：更新分页数据 + 显示提示
    pagination.value.total = Math.max(0, pagination.value.total - 1)
    pagination.value.loadedCount = Math.max(0, pagination.value.loadedCount - 1)

    // 重新判断是否还有更多数据
    pagination.value.hasMore =
      pagination.value.total > 0 &&
      pagination.value.loadedCount < pagination.value.total &&
      pagination.value.pageNum < pagination.value.pages

    // 显示成功提示
    showNotification(res.data?.errorMsg || `已取消收藏《${targetAlbum.name}》`)
  } catch (error) {
    // 6. 网络异常/其他错误：提示并重新加载数据
    console.error('取消收藏失败:', error)
    ElMessage.error('取消收藏失败，请稍后重试')

    // 重新加载最新数据（确保数据一致性）
    await loadCollectAlbums()
  }
}
/**
 * 探索热门专辑
 */
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

/* 新增：加载中旋转动画 */
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
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
  background: rgba(236, 72, 153, 0.7);
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

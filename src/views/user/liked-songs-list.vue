<template>
  <div class="playlist-detail-page">
    <div class="playlist-header">
      <div class="container">
        <div class="header-content">
          <div class="playlist-cover group">
            <!-- 使用动态封面 -->
            <img
              :src="playlistDetail?.cover || DEFAULT_COVER"
              alt="歌单封面"
              class="cover-img transition-transform duration-500 group-hover:scale-105"
              @error="handleCoverError"
            />
            <div
              class="cover-overlay opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
            >
              <i class="iconfont" style="font-size: 27px">&#xe623;</i>
            </div>
          </div>

          <div class="playlist-info">
            <h1 class="playlist-title tracking-wide">{{ playlistDetail?.name || '我的喜欢' }}</h1>
            <div class="playlist-meta">
              <div class="creator flex items-center gap-2 group cursor-pointer">
                <img
                  :src="playlistDetail?.avatar || DEFAULT_COVER"
                  alt="创作者头像"
                  class="creator-avatar transition-transform group-hover:scale-110"
                />
                <span class="creator-name text-sm group-hover:text-pink-400 transition-colors">
                  {{ playlistDetail?.creator || '未知创作者' }}
                </span>
              </div>
              <span class="create-time text-xs text-gray-400">
                {{ formatDate(playlistDetail?.createdTime) }} 创建
              </span>
              <!-- 添加歌曲数量显示 -->
              <span class="song-count text-xs text-gray-400" v-if="likedSongs.length > 0">
                {{ playlistDetail?.musicCount || likedSongs.length }} 首歌
              </span>
            </div>

            <div class="action-buttons gap-3">
              <el-button
                class="play-all-btn"
                type="primary"
                size="large"
                @click="handlePlayAll"
                :class="{ 'animate-pulse': isPlayingAll }"
                :disabled="likedSongs.length === 0"
              >
                <i class="iconfont">&#xe623;</i>
                播放全部
              </el-button>
              <!-- <el-button
                class="download-btn"
                size="large"
                :disabled="likedSongs.length === 0"
                @mouseenter="isDownloadHover = true"
                @mouseleave="isDownloadHover = false"
              >
                <i class="iconfont">&#xe606;</i>
                下载
              </el-button> -->
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container main-content">
      <div class="custom-tabs">
        <div class="tabs-nav flex justify-between items-center">
          <div class="flex justify-between items-center">
            <div
              v-for="tab in tabs"
              :key="tab.name"
              :class="['tab-nav-item', { active: activeTab === tab.name }]"
              @click="activeTab = tab.name"
            >
              {{ tab.label }}
            </div>
          </div>
          <div class="search-container" v-if="activeTab === 'songs'">
            <el-input
              v-model="searchKeyword"
              placeholder="搜索"
              class="search-input"
              :class="{ 'search-input-focused': isSearchFocused }"
              @focus="isSearchFocused = true"
              @blur="isSearchFocused = false"
            >
              <template #prefix>
                <i class="iconfont search-icon">&#xe721;</i>
              </template>
            </el-input>
          </div>
        </div>

        <div
          class="tabs-content"
          v-infinite-scroll="loadMoreSongs"
          infinite-scroll-distance="100"
          infinite-scroll-disabled="activeTab !== 'songs' || !hasMore || isLoadingMore"
          infinite-scroll-immediate-check="true"
        >
          <div v-if="activeTab === 'songs'" class="tab-pane">
            <!-- 1. 加载中状态：添加加载提示 -->
            <div v-if="loading" class="py-12 text-center">
              <div class="loading-spinner text-pink-500 text-2xl mb-2 animate-spin">
                <i class="iconfont">&#xe623;</i>
              </div>
              <p class="mt-2 text-gray-400">加载歌曲中...</p>
            </div>

            <!-- 2. 无数据状态 -->
            <div v-else-if="likedSongs.length === 0" class="py-12 text-center">
              <el-empty description="暂无喜欢的歌曲" class="text-gray-500" />
            </div>

            <!-- 3. 有数据状态：渲染歌曲列表组件 -->
            <div v-else>
              <LikedSongs :likedSongs="likedSongs" :userId="userInfo.id" />
            </div>

            <!-- 加载更多提示 -->
            <div v-if="isLoadingMore" class="py-4 text-center text-gray-400">
              <i class="iconfont animate-spin">&#xe623;</i> 加载中...
            </div>
            <div v-else-if="!hasMore" class="py-4 text-center text-gray-400">没有更多歌曲了</div>
          </div>

          <div v-if="activeTab === 'comments'">
            <h3 class="text-xl font-semibold text-white tracking-[0.3px]">
              评论{{ playlistDetail?.commentCount || 0 }}
            </h3>
            <!-- 传递歌单ID和类型（歌单类型固定为2） -->
            <CommentSection :target-id="playlistStore.currentPlaylistId" :target-type="2" />
          </div>

          <div v-if="activeTab === 'collectors'" class="tab-pane">
            <CollectorsList
              :collectors="collectors"
              :search-keyword="searchKeyword"
              @update:search-keyword="searchKeyword = $event"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getUserInfo, getPlaylistDetail, getPlaylistCollections } from '@/api/personalCenter/index'
import type { MusicVO, UserInfoVO, PlaylistDetailVO } from '@/types/personalCenter/index'
import type { Collector } from '@/types/personalCenter/index'
import { usePlaylistStore } from '@/stores/playList'
import { usePlayerStore } from '@/stores/player'

const userInfo = ref<UserInfoVO>({ username: '', avatar: '' })
const loading = ref(false)
const pagination = reactive({
  pageNum: 1,
  pageSize: 10,
})
const paginationCollectors = reactive({
  pageNum: 1,
  pageSize: 20,
})
const playlistDetail = ref<PlaylistDetailVO | null>(null)
const hasMore = ref(true) // 是否有下一页数据
const isLoadingMore = ref(false) // 是否正在加载下一页
const playlistStore = usePlaylistStore()
// 默认封面，当第一首歌没有封面或加载失败时使用
const DEFAULT_COVER = 'https://picsum.photos/300/300?random=10'

const tabs = [
  { name: 'songs', label: '歌曲' },
  { name: 'comments', label: '评论' },
  { name: 'collectors', label: '收藏者' },
]

// 收藏者数据
const collectors = ref<Collector[]>([])

// 响应式数据
const activeTab = ref('songs')
const searchKeyword = ref('')
const commentCount = ref(3)
const isPlayingAll = ref(false)
const isDownloadHover = ref(false)
const isSearchFocused = ref(false)

// 歌曲列表
const likedSongs = ref<MusicVO[]>([])

// 计算属性
const collectorCount = computed(() => collectors.value.length)

// 日期格式化
const formatDate = (dateString?: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

// 封面图片加载失败处理
const handleCoverError = (event: Event) => {
  const img = event.target as HTMLImageElement
  console.warn('封面图片加载失败，使用默认封面')
  img.src = DEFAULT_COVER
}

// 播放全部按钮事件
const handlePlayAll = async () => {
  if (likedSongs.value.length === 0) {
    ElMessage.warning('歌单中没有歌曲')
    return
  }
  isPlayingAll.value = true
  setTimeout(() => (isPlayingAll.value = false), 1000)

  // 调用播放器播放第一首歌
  const playerStore = usePlayerStore()
  await playerStore.playSong(likedSongs.value[0]!, likedSongs.value)
}

const loadUserInfo = async () => {
  try {
    const res = await getUserInfo()
    console.log(res)
    userInfo.value = {
      ...res.data,
      username: res.data.username,
      avatar: res.data.avatar,
    }
    console.log(userInfo.value.username)
  } catch (error) {
    console.error('加载用户信息失败:', error)
  }
}

// 加载更多歌曲函数，配合v-infinite-scroll使用
const loadMoreSongs = () => {
  // 仅在「歌曲标签页」且「有更多数据」且「未加载中」时触发
  if (activeTab.value !== 'songs' || !hasMore.value || isLoadingMore.value) {
    console.log('加载更多条件不满足：', {
      activeTab: activeTab.value,
      hasMore: hasMore.value,
      isLoadingMore: isLoadingMore.value,
    })
    return
  }
  const nextPage = pagination.pageNum + 1
  console.log(`触发加载更多，下一页：${nextPage}`)
  loadPlaylistDetail(nextPage, true)
}

// 重构：添加 pageNum 参数，支持加载指定页
const loadPlaylistDetail = async (pageNum: number = 1, isLoadMore: boolean = false) => {
  // 加载下一页时，标记为加载中
  if (isLoadMore) {
    isLoadingMore.value = true
  } else {
    loading.value = true
    likedSongs.value = [] // 首次加载/刷新时清空列表
    hasMore.value = true // 重置有下一页状态
    pagination.pageNum = 1 // 重置页码
  }

  try {
    const playlistIdStr = playlistStore.currentPlaylistId
    if (!playlistIdStr) {
      ElMessage.error('未选择歌单，请返回列表页重新选择')
      window.history.back()
      loading.value = false
      isLoadingMore.value = false
      return
    }

    const res = await getPlaylistDetail({
      playlistId: playlistIdStr,
      pageNum: pageNum,
      pageSize: pagination.pageSize, // 用现有pagination的pageSize（10）
    })
    console.log(`加载第${pageNum}页数据：`, res.data)

    // 赋值歌单详情数据
    playlistDetail.value = res.data

    if (res.data?.musicDetailVOList) {
      const { records, total, pages } = res.data.musicDetailVOList
      // 🔥 关键：加载下一页时拼接数据，首次加载直接赋值
      if (isLoadMore) {
        likedSongs.value = [...likedSongs.value, ...records]
        pagination.pageNum = pageNum // 更新当前页码
      } else {
        likedSongs.value = records
      }
      // 更新是否有下一页（当前页 < 总页数 则有下一页）
      hasMore.value = pageNum < pages
    } else {
      if (!isLoadMore) likedSongs.value = []
      hasMore.value = false
      console.log('无歌曲数据')
    }
  } catch (error) {
    console.error('加载歌单详情失败:', error)
    ElMessage.error(isLoadMore ? '加载下一页失败，请稍后重试' : '加载歌单详情失败，请稍后重试')
    hasMore.value = false // 加载失败时标记为无更多
  } finally {
    loading.value = false
    isLoadingMore.value = false // 无论成功失败，都结束加载状态
  }
}

// 获取收藏者列表
const loadCollectors = async () => {
  try {
    const playlistIdStr = playlistStore.currentPlaylistId
    if (!playlistIdStr) {
      return
    }

    const res = await getPlaylistCollections(playlistIdStr, {
      pageNum: paginationCollectors.pageNum,
      pageSize: paginationCollectors.pageSize,
    })
    console.log('收藏者列表数据:', res)

    if (res.success && res.data) {
      // 转换后端数据为前端需要的格式
      collectors.value = (res.data as Collector[]).map((item) => ({
        id: item.id,
        avatar: item.avatar || '',
        userName: item.userName || '',
        gender: item.gender || 0,
        introduction: item.introduction || '',
        collectPlaylistCount: item.collectPlaylistCount || 0,
        fansCount: item.fansCount || 0,
      }))
    }
  } catch (error) {
    console.error('加载收藏者列表失败:', error)
    ElMessage.error('加载收藏者列表失败，请稍后重试')
  }
}

onMounted(async () => {
  await Promise.all([loadUserInfo(), loadPlaylistDetail()])
  // 加载收藏者列表
  await loadCollectors()
})

// 不在onUnmounted中清空歌单ID，因为用户可能只是去播放音乐页面
// 歌单ID会在进入其他歌单列表页时被覆盖，或在需要时手动清空
// onUnmounted(() => {
//   playlistStore.clearCurrentPlaylist()
// })
</script>

<style lang="scss" scoped>
.playlist-detail-page {
  background-color: #0f0f1a;
  color: #e0e0e0;
  min-height: 100vh;
}

.playlist-header {
  background: linear-gradient(135deg, #121225 0%, #1a1a30 100%);
  padding: 40px 0;
  border-bottom: 1px solid rgba(255, 153, 204, 0.1);
}

.container {
  width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.header-content {
  display: flex;
  gap: 30px;
  align-items: center;
}

.playlist-cover {
  position: relative;
  width: 200px;
  height: 200px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(255, 153, 204, 0.15);
}

.cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.5s ease;
}

.cover-overlay {
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.6);
}

.playlist-title {
  font-size: 28px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 20px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.playlist-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 30px;
}

.creator-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 1px solid rgba(255, 153, 204, 0.2);
}

.creator-name {
  color: #d1d5db;
}

.song-count {
  padding-left: 8px;
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  margin-left: 8px;
}

.action-buttons {
  display: flex;
  align-items: center;
}

.play-all-btn {
  background-color: #e74fa0 !important;
  border-color: #e74fa0 !important;
  color: #fff !important;
  transition: all 0.3s ease !important;
  box-shadow: 0 4px 12px rgba(255, 153, 204, 0.3) !important;
}

.play-all-btn:hover {
  background-color: #e63493 !important;
  border-color: #e63493 !important;
  transform: translateY(-2px) !important;
  box-shadow: 0 6px 16px rgba(255, 153, 204, 0.4) !important;
}

.download-btn {
  background-color: rgba(255, 255, 255, 0.05) !important;
  color: #e0e0e0 !important;
  border-color: rgba(255, 153, 204, 0.2) !important;
  transition: all 0.3s ease !important;
}

.download-btn:hover {
  background-color: rgba(255, 153, 204, 0.1) !important;
  border-color: #ff8fab !important;
  color: #ff8fab !important;
}

.main-content {
  padding: 30px 0;
}

.custom-tabs {
  margin-top: 20px;
}

.tabs-nav {
  display: flex;
  border-bottom: 1px solid rgba(255, 153, 204, 0.1);
  padding-bottom: 2px;
}

.tab-nav-item {
  padding: 0 16px;
  height: 40px;
  line-height: 40px;
  color: #9ca3af;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  margin-right: 8px;
}

.tab-nav-item:hover:not(.active) {
  color: #e0e0e0;
}

.tab-nav-item.active {
  color: #cd3181;
  font-weight: 500;
}

.tab-nav-item.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #cd3181;
  border-radius: 2px;
}

.tabs-content {
  padding-top: 20px;
  max-height: 600px;
  overflow-y: auto;
  scrollbar-width: thin; // 美化滚动条（可选）
  scrollbar-color: #cd3181 #1a1a30; // 可选
}

.tab-pane {
  animation: fadeIn 0.3s ease;
  height: 100%;
  width: 100%;
}
.search-container {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}

.search-input {
  width: 100px;
  border-radius: 20px !important;
  background: linear-gradient(145deg, #181832, #1a1a36) !important;
  border-color: rgba(255, 143, 171, 0.1) !important;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.15) !important;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
  height: 36px !important;
}

.search-input-focused {
  width: 200px;
  border-color: rgba(255, 143, 171, 0.4) !important;
  box-shadow:
    0 0 8px rgba(255, 143, 171, 0.15),
    inset 0 1px 2px rgba(0, 0, 0, 0.15) !important;
}

::v-deep .el-input__wrapper {
  background-color: transparent !important;
  border-radius: 20px !important;
  background: linear-gradient(145deg, #181832, #1a1a36) !important;
  border: 1px solid rgba(255, 143, 171, 0.1) !important;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.15) !important;
  height: 36px !important;
  padding: 0 12px !important;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
}

::v-deep .search-input-focused .el-input__wrapper {
  border-color: rgba(255, 143, 171, 0.4) !important;
  box-shadow:
    0 0 8px rgba(255, 143, 171, 0.15),
    inset 0 1px 2px rgba(0, 0, 0, 0.15) !important;
}

::v-deep .el-input__inner {
  background-color: transparent !important;
  border: none !important;
  color: #f0f0f5 !important;
  height: 34px !important;
  padding: 0 8px 0 5px !important;
  font-size: 13px;
  line-height: 34px !important;
}

::v-deep .el-input__inner::placeholder {
  color: #7a7f9d !important;
  font-size: 12px;
  letter-spacing: 0.5px;
}

::v-deep .search-icon {
  color: #ff94b2 !important;
  font-size: 14px !important;
  margin-right: 5px !important;
  margin-left: 3px !important;
  opacity: 0.8;
  transition: opacity 0.2s ease;
}

::v-deep .el-input__wrapper:hover .search-icon {
  opacity: 1;
}

::v-deep .el-input__wrapper:hover {
  border-color: rgba(255, 143, 171, 0.25) !important;
  background: linear-gradient(145deg, #191935, #1b1b38) !important;
}

::v-deep .el-input__wrapper.is-focus {
  border-color: rgba(255, 143, 171, 0.4) !important;
  outline: none !important;
}

::v-deep .el-input__wrapper:focus-within {
  outline: none !important;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-pulse {
  animation: pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@media (max-width: 768px) {
  .container {
    width: 100%;
  }

  .header-content {
    flex-direction: column;
    align-items: flex-start;
  }

  /* 移动端搜索框适配 */
  .search-input {
    width: 100px;
  }
  .search-input-focused {
    width: 180px;
  }
}
.tabs-content::-webkit-scrollbar {
  width: 6px;
}
.tabs-content::-webkit-scrollbar-track {
  background: #1a1a30;
}
.tabs-content::-webkit-scrollbar-thumb {
  background-color: #cd3181;
  border-radius: 3px;
}
</style>

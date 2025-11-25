<template>
  <div class="playlist-detail-page">
    <div class="playlist-header">
      <div class="container">
        <div class="header-content">
          <div class="playlist-cover group">
            <img
              :src="playlistInfo.coverUrl"
              alt="歌单封面"
              class="cover-img transition-transform duration-500 group-hover:scale-105"
            />
            <div
              class="cover-overlay opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
            >
              <i class="iconfont" style="font-size: 27px">&#xe623;</i>
            </div>
          </div>

          <div class="playlist-info">
            <h1 class="playlist-title tracking-wide">{{ playlistInfo.title }}</h1>
            <div class="playlist-meta">
              <div class="creator flex items-center gap-2 group cursor-pointer">
                <img
                  :src="playlistInfo.creator.avatarUrl"
                  alt="创作者头像"
                  class="creator-avatar transition-transform group-hover:scale-110"
                />
                <span class="creator-name text-sm group-hover:text-pink-400 transition-colors">
                  {{ playlistInfo.creator.name }}
                </span>
              </div>
              <span class="create-time text-xs text-gray-400">
                {{ formatDate(playlistInfo.createTime) }} 创建
              </span>
            </div>

            <div class="action-buttons gap-3">
              <el-button
                class="play-all-btn"
                type="primary"
                size="large"
                @click="handlePlayAll"
                :class="{ 'animate-pulse': isPlayingAll }"
              >
                <i class="iconfont">&#xe623;</i>
                播放全部
              </el-button>
              <el-button
                class="download-btn"
                size="large"
                @mouseenter="isDownloadHover = true"
                @mouseleave="isDownloadHover = false"
              >
                <i class="iconfont">&#xe606;</i>
                下载
              </el-button>
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

        <div class="tabs-content">
          <div v-if="activeTab === 'songs'" class="tab-pane">
            <likedSongs />
          </div>

          <div v-if="activeTab === 'comments'">
            <h3 class="text-xl font-semibold text-white tracking-[0.3px]">评论（20）</h3>
            <CommentSection />
          </div>

          <div v-if="activeTab === 'collectors'" class="tab-pane">
            <CollectorsList
              :collectors="collectors"
              :search-keyword="searchKeyword"
              @toggle-follow="toggleFollow"
              @update:search-keyword="searchKeyword = $event"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 标签配置
const tabs = [
  { name: 'songs', label: '歌曲' },
  { name: 'comments', label: '评论' },
  { name: 'collectors', label: '收藏者' },
]

// 收藏者类型定义
interface Collector {
  id: number
  avatarUrl: string
  name: string
  collectTime: number
  signature?: string
  followStatus: boolean // 是否关注
}

// 创作者类型
interface Creator {
  name: string
  avatarUrl: string
}

// 歌单信息类型
interface PlaylistInfo {
  title: string
  coverUrl: string
  createTime: number
  creator: Creator
}

// 歌单模拟数据
const playlistInfo: PlaylistInfo = {
  title: '我喜欢的音乐',
  coverUrl: 'https://picsum.photos/300/300?random=10',
  createTime: 1598246400000,
  creator: {
    name: '问安200824',
    avatarUrl: 'https://picsum.photos/100/100?random=20',
  },
}

// 收藏者模拟数据
const collectors = ref<Collector[]>([
  {
    id: 1,
    avatarUrl: 'https://picsum.photos/100/100?random=1',
    name: '晚风告白',
    collectTime: 1710000000000,
    signature: '喜欢小众的好音乐',
    followStatus: false,
  },
  {
    id: 2,
    avatarUrl: 'https://picsum.photos/100/100?random=2',
    name: '星河入梦',
    collectTime: 1708000000000,
    signature: '音乐是第二生命',
    followStatus: true,
  },
  {
    id: 3,
    avatarUrl: 'https://picsum.photos/100/100?random=3',
    name: '人间理想',
    collectTime: 1705000000000,
    signature: '音乐是第二生命',
    followStatus: false,
  },
  {
    id: 4,
    avatarUrl: 'https://picsum.photos/100/100?random=4',
    name: '问安200824',
    collectTime: 1700000000000,
    signature: '做有温度的音乐分享',
    followStatus: true,
  },
])

// 响应式数据
const activeTab = ref('songs')
const searchKeyword = ref('')
const commentCount = ref(3)
const isPlayingAll = ref(false)
const isDownloadHover = ref(false)
const isSearchFocused = ref(false)

// 计算属性
const collectorCount = computed(() => collectors.value.length)

// 日期格式化
const formatDate = (timestamp: number) => {
  const date = new Date(timestamp)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

// 播放全部按钮事件
const handlePlayAll = () => {
  isPlayingAll.value = true
  setTimeout(() => (isPlayingAll.value = false), 1000)
}

// 关注/取消关注收藏者
const toggleFollow = (id: number) => {
  collectors.value = collectors.value.map((collector) => {
    if (collector.id === id) {
      return { ...collector, followStatus: !collector.followStatus }
    }
    return collector
  })
}
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
}

.cover-overlay {
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.6);
}

.cover-overlay .play-icon {
  width: 60px;
  height: 60px;
  color: #ff8fab;
  filter: drop-shadow(0 0 8px rgba(255, 153, 204, 0.5));
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
::v-deep .el-input__wrapper {
  background-color: transparent !important;
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

.more-btn {
  background-color: rgba(255, 255, 255, 0.05) !important;
  color: #e0e0e0 !important;
  border-color: rgba(255, 153, 204, 0.2) !important;
  transition: all 0.3s ease !important;
}

.more-btn:hover {
  background-color: rgba(255, 153, 204, 0.1) !important;
  border-color: #ff8fab !important;
  color: #ff8fab !important;
}

.custom-dropdown {
  background-color: #1a1a30 !important;
  border-color: rgba(255, 153, 204, 0.2) !important;
}

.dropdown-item {
  color: #e0e0e0 !important;
  transition: all 0.2s ease !important;
}

.dropdown-item:hover {
  background-color: rgba(255, 153, 204, 0.1) !important;
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
}

.tab-pane {
  animation: fadeIn 0.3s ease;
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

.tab-placeholder {
  padding: 80px 0;
  text-align: center;
  color: #6b7280;
  border: 1px dashed rgba(255, 153, 204, 0.1);
  border-radius: 8px;
  transition: all 0.3s ease;
}

.tab-placeholder:hover {
  border-color: rgba(255, 153, 204, 0.3);
}

.tab-placeholder p {
  font-size: 16px;
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
</style>

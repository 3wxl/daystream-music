<template>
  <div class="playlist-detail-page">
    <div class="playlist-header">
      <div class="container">
        <div class="header-content">
          <div class="playlist-cover group">
            <img
              :src="cover || DEFAULT_COVER"
              alt="封面"
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
            <h1 class="playlist-title tracking-wide">{{ musicName || '未知标题' }}</h1>
            <div class="playlist-meta">
              <div class="creator flex items-center gap-2 group cursor-pointer">
                <img
                  :src="avatar || DEFAULT_AVATAR"
                  alt="创作者头像"
                  class="creator-avatar transition-transform group-hover:scale-110"
                />
                <span class="creator-name text-sm group-hover:text-pink-400 transition-colors">
                  {{ personName || '未知作者' }}
                </span>
              </div>
              <span class="create-time text-xs text-gray-400">
                {{ type === 3 ? '发行时间：' : '创建时间：' }}{{ formatDate(releaseTime) }}
              </span>
              <span class="song-count text-xs text-gray-400" v-if="musicList && musicList.length > 0">
                {{ musicCount || musicList.length }} 首歌
              </span>
            </div>

            <div class="action-buttons gap-3">
              <el-button
                class="play-all-btn"
                type="primary"
                size="large"
                @click="$emit('playAll')"
                :class="{ 'animate-pulse': isPlayingAll }"
                :disabled="!musicList || musicList.length === 0"
              >
                <i class="iconfont">&#xe623;</i>
                播放全部
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
              v-model="internalSearchKeyword"
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
          v-infinite-scroll="handleInfiniteScroll"
          :infinite-scroll-disabled="activeTab !== 'songs' || !hasMore || isLoadingMore"
        >
          <div v-if="activeTab === 'songs'" class="tab-pane">
            <div v-if="loading" class="py-12 text-center">
              <div class="loading-spinner text-pink-500 text-2xl mb-2 animate-spin">
                <i class="iconfont">&#xe623;</i>
              </div>
              <p class="mt-2 text-gray-400">加载歌曲中...</p>
            </div>
            <div v-else-if="!musicList || musicList.length === 0" class="py-12 text-center">
              <el-empty description="暂无歌曲" class="text-gray-500" />
            </div>
            <div v-else>
              <LikedSongs :likedSongs="filteredMusicList" />
            </div>
            
            <div v-if="isLoadingMore" class="py-4 text-center text-gray-400">
              <i class="iconfont animate-spin">&#xe623;</i> 加载中...
            </div>
          </div>

          <div v-if="activeTab === 'comments'">
            <h3 class="text-xl font-semibold text-white tracking-[0.3px]">
              评论{{ commentCount || 0 }}
            </h3>
            <CommentSection :target-id="id" :target-type="type" />
          </div>

          <div v-if="activeTab === 'collectors'" class="tab-pane">
            <CollectorsList
              :collectors="collectors"
              :search-keyword="internalSearchKeyword"
              @update:search-keyword="internalSearchKeyword = $event"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import LikedSongs from '@/components/user/LikedSongs.vue'
import CommentSection from '@/components/user/CommentSection.vue'
import CollectorsList from '@/components/user/CollectorsList.vue'
import { ref, computed } from 'vue'

interface Props {
  id: string | number
  type: number // 2: 歌单, 3: 专辑
  musicName: string
  avatar: string
  personName: string
  releaseTime: string
  description: string
  musicCount: number
  musicList: any[]
  cover: string
  commentCount: number
  collectors: any[]
  loading: boolean
  isLoadingMore?: boolean
  hasMore?: boolean
  isPlayingAll?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  musicList: () => [],
  collectors: () => [],
  loading: false,
  isLoadingMore: false,
  hasMore: false,
  isPlayingAll: false
})

const emit = defineEmits(['loadMore', 'playAll'])

const DEFAULT_COVER = 'https://picsum.photos/300/300?random=10'
const DEFAULT_AVATAR = 'https://picsum.photos/100/100?random=11'

const tabs = [
  { name: 'songs', label: '歌曲' },
  { name: 'comments', label: '评论' },
  { name: 'collectors', label: '收藏者' },
]

const activeTab = ref('songs')
const internalSearchKeyword = ref('')
const isSearchFocused = ref(false)

const filteredMusicList = computed(() => {
  if (!internalSearchKeyword.value) return props.musicList
  return props.musicList.filter(song => 
    song.musicName?.toLowerCase().includes(internalSearchKeyword.value.toLowerCase()) ||
    song.musicianName?.toLowerCase().includes(internalSearchKeyword.value.toLowerCase())
  )
})

const formatDate = (dateString?: string) => {
  if (!dateString) return '未知时间'
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const handleCoverError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = DEFAULT_COVER
}

const handleInfiniteScroll = () => {
  if (props.hasMore && !props.isLoadingMore && activeTab.value === 'songs') {
    emit('loadMore')
  }
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
  scrollbar-width: thin;
  scrollbar-color: #cd3181 #1a1a30;
}

.tab-pane {
  animation: fadeIn 0.3s ease;
  height: 100%;
  width: 100%;
}

.search-input {
  width: 100px;
  border-radius: 20px !important;
  background: linear-gradient(145deg, #181832, #1a1a36) !important;
  border: 1px solid rgba(255, 143, 171, 0.1) !important;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
  height: 36px !important;
}

.search-input-focused {
  width: 200px;
  border-color: rgba(255, 143, 171, 0.4) !important;
}

::v-deep .el-input__wrapper {
  background-color: transparent !important;
  border-radius: 20px !important;
  border: none !important;
  box-shadow: none !important;
  height: 36px !important;
  padding: 0 12px !important;
}

::v-deep .el-input__inner {
  color: #f0f0f5 !important;
  font-size: 13px;
}

::v-deep .search-icon {
  color: #ff94b2 !important;
  font-size: 14px !important;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-pulse {
  animation: pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite;
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
<template>
  <!-- 统一页面容器样式：和个人中心保持一致的深色渐变背景 -->
  <div class="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-white p-4 md:p-6">
    <div class="max-w-7xl mx-auto space-y-6">
      <!-- 统一UserHeader组件传参和事件监听 -->
      <UserHeader
        v-if="musicianInfo.id"
        :userInfo="musicianInfo"
        :isOthersPage="!!userId"
        :isFollowing="isFollowing"
        @update-user-info="handleUpdateUserInfo"
        @upload-avatar="handleUploadAvatar"
        @upload-bg="handleUploadBg"
        @follow-change="handleFollowChange"
      />

      <!-- 统一卡片样式：和个人中心保持一致的深色卡片风格 -->
      <div class="bg-gray-900/50 rounded-xl overflow-hidden border border-gray-800">
        <div class="tabs relative flex h-16 items-center px-5">
          <button
            class="tab-button flex-1 h-full flex items-center justify-center border-none bg-transparent text-[#b8b8cc] text-base font-medium rounded-2xl cursor-pointer tab-button-transition relative z-10"
            :class="{ 'text-white font-semibold': activeTab === 'works' }"
            @click="switchTab('works')"
          >
            作品
          </button>

          <button
            class="tab-button flex-1 h-full flex items-center justify-center border-none bg-transparent text-[#b8b8cc] text-base font-medium rounded-2xl cursor-pointer tab-button-transition relative z-10"
            :class="{ 'text-white font-semibold': activeTab === 'collection' }"
            @click="switchTab('collection')"
          >
            音乐私藏馆
          </button>

          <div
            class="tab-indicator absolute h-10 rounded-2xl bg-gradient-to-r from-[#ec4899] to-[#f472b6] tab-indicator-transition z-0 shadow-[0_4px_15px_rgba(236,72,153,0.4)]"
            :style="{
              width: indicatorWidth + 'px',
              left: indicatorOffset + 'px',
              transform: `scale(${indicatorScale})`,
            }"
          ></div>
        </div>

        <div class="tab-content mt-5 p-5 text-white min-h-[100px]">
          <!-- 作品Tab -->
          <div
            class="content-section"
            :class="{ hidden: activeTab !== 'works', active: activeTab === 'works' }"
          >
            <h3
              class="mt-0 mb-4 text-lg font-semibold text-gray-100 pl-3 border-l-3 border-pink-500"
            >
              我的作品
            </h3>

            <div v-if="mySongs.length === 0" class="py-12 text-center">
              <el-empty description="暂无已发布的音乐作品" class="text-gray-500" />
              <el-button
                type="primary"
                class="mt-4 bg-pink-600 hover:bg-pink-700 border-none"
                @click="$router.push('/musician/Upload')"
              >
                发布新作品
              </el-button>
            </div>
            <div
              v-else
              v-infinite-scroll="loadMoreMusic"
              :infinite-scroll-disabled="
                musicLoading || musicPagination.pageNum >= musicPagination.pages
              "
              :infinite-scroll-distance="30"
              :infinite-scroll-immediate="false"
              class="mb-8 max-h-[300px] overflow-y-auto"
            >
              <LikedSongs :likedSongs="mySongs" />
              <div v-if="musicLoading" class="py-4 text-center text-gray-500">
                <el-icon class="is-loading"></el-icon>
                加载中...
              </div>
              <div
                v-else-if="musicPagination.pageNum >= musicPagination.pages && mySongs.length > 0"
                class="py-4 text-center text-gray-500 text-sm"
              >
                已经到底了~
              </div>
            </div>
            <h3 class="mb-4 text-lg font-semibold text-gray-100 pl-3 border-l-3 border-pink-500">
              我的专辑
            </h3>
            <!-- 统一音乐人专辑组件传参和事件 -->
            <div v-if="albumLoading" class="py-12 text-center">
              <el-skeleton loading animation="wave" :rows="6" class="w-full skeleton-dark" />
            </div>
            <div v-else-if="myAlbums.length > 0">
              <MyAlbum
                :albums="filteredmyAlbums.length ? filteredmyAlbums : myAlbums"
                @goToAlbumDetail="goToAlbumDetail"
                @playAlbum="playAlbum"
                @shareAlbum="shareAlbum"
                @exploreAlbums="exploreAlbums"
              />
            </div>
            <div v-else class="py-6 text-center">
              <el-empty description="暂无专辑" class="text-gray-500" />
              <p class="text-gray-400 text-sm mt-2">去创建你的第一张专辑吧</p>
            </div>
          </div>

          <!-- 音乐私藏馆Tab（和个人中心统一） -->
          <div
            class="content-section"
            :class="{ hidden: activeTab !== 'collection', active: activeTab === 'collection' }"
          >
            <h3
              class="mt-0 mb-4 text-lg font-semibold text-gray-100 pl-3 border-l-3 border-pink-500"
            >
              音乐私藏馆
            </h3>

            <!-- 我喜欢的歌曲（和个人中心完全一致） -->
            <div class="bg-gray-900/50 rounded-xl overflow-hidden border border-gray-800 mb-6">
              <div class="flex items-center justify-between px-5 py-3 border-b border-gray-800">
                <div class="shrink-0 w-[280px]">
                  <h3 class="text-white font-semibold flex items-center">
                    <img src="../../assets/爱心动图.gif" alt="" class="w-12" />
                    我喜欢的歌曲
                  </h3>
                </div>
                <div v-if="likedSongs.length > 0" class="w-[200px] text-center">
                  <span class="text-gray-400 text-sm">专辑</span>
                </div>
                <div
                  v-if="likedSongs.length > 0"
                  class="shrink-0 w-[100px] flex justify-end"
                  @click="handleViewAllLikedSongs"
                >
                  <el-button type="text" size="small" class="text-[#00f0ff] hover:text-white">
                    查看全部
                  </el-button>
                </div>
              </div>
              <div v-if="loading" class="py-12 text-center">
                <el-skeleton loading animation="wave" :rows="4" class="w-full skeleton-dark" />
              </div>
              <div v-else-if="likedSongs.length === 0" class="py-12 text-center">
                <el-empty description="暂无喜欢的歌曲" class="text-gray-500" />
              </div>
              <LikedSongs v-if="!loading && likedSongs.length > 0" :likedSongs="likedSongs" />
            </div>

            <!-- 统计+歌单模块（和个人中心统一） -->
            <div class="flex flex-col md:flex-row gap-20">
              <div class="flex-[3] min-w-[200px]">
                <MusicStatistics
                  :daily-listen-duration="dailyListenDuration"
                  :daily-listen-seconds="dailyListenSeconds"
                  :music-tag-ratio="musicTagRatio"
                  :loading="listenCountLoading || tagRatioLoading"
                />
              </div>
              <div class="flex-[6]">
                <div class="space-y-6">
                  <!-- 收藏歌单（统一逻辑） -->
                  <div>
                    <div class="flex items-center justify-between mb-4">
                      <div class="flex items-center">
                        <img src="../../assets/turntable-13463_256.gif" alt="" class="w-13" />
                        <h3 class="text-white font-semibold text-lg">我收藏的歌单</h3>
                      </div>
                      <router-link
                        :to="`/user/collected-songs-list?userId=${Number(musicianInfo.id) || Number(userId)}`"
                      >
                        <el-button type="text" size="small" class="text-[#00f0ff] hover:text-white">
                          查看全部
                        </el-button>
                      </router-link>
                    </div>
                    <div v-if="collectPlaylistLoading" class="py-12 text-center">
                      <el-skeleton
                        loading
                        animation="wave"
                        :rows="3"
                        class="w-full skeleton-dark"
                      />
                    </div>
                    <div v-else-if="collectPlaylists.length > 0">
                      <CollectSection
                        :playlists="collectPlaylists"
                        action-type="collect"
                        :show-action-button="true"
                        @collect-change="handleCollectChange"
                        @update-success="handleUpdateSuccess"
                      />
                    </div>
                    <div v-else class="py-4 text-center bg-gray-900/30 rounded-lg">
                      <el-empty description="暂无收藏歌单" class="text-gray-500" :image-size="60" />
                    </div>
                  </div>

                  <!-- 创建歌单（统一弹窗和逻辑） -->
                  <div>
                    <div class="flex items-center justify-between mb-4">
                      <div class="flex items-center">
                        <img src="../../assets/speaker-16876_256.gif" alt="" class="w-15" />
                        <h3 class="text-white font-semibold text-lg">我创建的歌单</h3>
                      </div>
                      <div class="flex items-center gap-2">
                        <router-link
                          :to="`/user/collected-songs-list?userId=${Number(musicianInfo.id) || Number(userId)}`"
                        >
                          <el-button
                            type="text"
                            size="small"
                            class="text-[#00f0ff] hover:text-white"
                          >
                            查看全部
                          </el-button>
                        </router-link>
                        <el-button
                          @click="openCreateDialog"
                          type="text"
                          size="small"
                          class="text-[#00f0ff] hover:text-white"
                        >
                          新建歌单
                        </el-button>
                      </div>
                    </div>
                    <div v-if="createPlaylistLoading" class="py-12 text-center">
                      <el-skeleton
                        loading
                        animation="wave"
                        :rows="3"
                        class="w-full skeleton-dark"
                      />
                    </div>
                    <div v-else-if="createPlaylists.length > 0">
                      <CollectSection
                        :playlists="createPlaylists"
                        action-type="delete"
                        :show-action-button="true"
                        @delete-change="handleDeleteChange"
                        @update-success="handleUpdateSuccess"
                      />
                    </div>
                    <div v-else class="py-4 text-center bg-gray-900/30 rounded-lg">
                      <el-empty description="暂无创建歌单" class="text-gray-500" :image-size="60" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 收藏专辑（和个人中心统一） -->
          </div>
        </div>
      </div>

      <!-- 统一创建歌单弹窗（复用个人中心的UpdatePlayList组件） -->
      <UpdatePlayList
        v-if="isCreateDialogOpen"
        v-model:isDialogOpen="isCreateDialogOpen"
        :isEditMode="false"
        @create-success="handleCreateSuccess"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { getMyAlbums } from '@/api/personalCenter/musician/index'
// 统一导入个人中心的API和类型
import {
  getUserInfo,
  updateUserInfo,
  getLikeMusic,
  getPlayList,
  getCreatePlaylists,
  createPlaylistApi,
  getWeeklyDailyListenCount,
  getWeeklyTagRatio,
  getMyCollectAlbums,
  collectAlbum,
  likeRecord,
} from '@/api/personalCenter/index'
import type {
  MusicVO,
  UserInfoVO,
  UpdateUserInfoParams,
  EditForm,
  CollectPlaylistReq,
  CreatePlaylistReq,
  PlaylistVO,
  CollectPlaylistResp,
  CreatePlaylistResp,
  CreatePlaylistParams,
  DailyListenDataVO,
  MusicTagRatioVO,
  CollectAlbumResp,
  AlbumVO,
  AlbumCardVO,
  LikeRecordResponse,
} from '@/types/personalCenter/index'

import { getMyMusic } from '@/api/personalCenter/musician/index'

const router = useRouter()

// ========== 1. 统一Tab切换逻辑 ==========
const activeTab = ref<'works' | 'collection'>('works')
const indicatorOffset = ref(0)
const indicatorWidth = ref(0)
const indicatorScale = ref(1)

const switchTab = (tab: 'works' | 'collection') => {
  indicatorScale.value = 0.95
  activeTab.value = tab

  const tabButton = document.querySelector(
    `.tab-button:nth-child(${tab === 'works' ? 1 : 2})`,
  ) as HTMLElement
  const tabsContainer = document.querySelector('.tabs') as HTMLElement

  if (tabButton && tabsContainer) {
    const buttonWidth = tabButton.offsetWidth
    const buttonLeft = tabButton.offsetLeft
    const containerPadding = 8

    indicatorWidth.value = buttonWidth - containerPadding * 2
    indicatorOffset.value = buttonLeft + containerPadding

    setTimeout(() => {
      indicatorScale.value = 1.02
      setTimeout(() => {
        indicatorScale.value = 1
      }, 150)
    }, 100)
  }
}

// ========== 2. 统一音乐人信息（和个人中心UserInfo结构对齐） ==========
const musicianInfo = ref<UserInfoVO>({
  id: 1, // 补充必要的id字段
  username: 'Daystream',
  avatar: 'https://picsum.photos/100/100?random=21',
  introduction: '独立音乐人 | 创作不止于声',
  followCount: 125,
  fansCount: 12400,
  likeCount: 56800,
  isVip: true,
  playCount: 0,
  createdCount: 0,
  onlineStatus: 0,
  userRole: '音乐人',
})

// ========== 3. 统一加载状态（和个人中心一致） ==========
const loading = ref(false) // 喜欢的歌曲加载状态
const collectPlaylistLoading = ref(false) // 收藏歌单加载状态
const createPlaylistLoading = ref(false) // 创建歌单加载状态
const albumLoading = ref(false) // 专辑加载状态
const listenCountLoading = ref(false) // 听歌统计加载状态
const tagRatioLoading = ref(false) // 标签占比加载状态
const isCreatingPlaylist = ref(false) // 创建歌单按钮加载状态

// ========== 4. 统一分页参数（和个人中心一致） ==========
const pagination = reactive({
  pageNum: 1,
  pageSize: 4,
})
const collectPagination = reactive<CollectPlaylistReq>({
  pageNum: 1,
  pageSize: 3,
})
const createPagination = reactive<CreatePlaylistReq>({
  pageNum: 1,
  pageSize: 3,
})
const albumPagination = reactive({
  pageNum: 1,
  pageSize: 6,
})

// ========== 5. 统一数据结构（和个人中心一致） ==========
const likedSongs = ref<MusicVO[]>([]) // 喜欢的歌曲
const collectPlaylists = ref<PlaylistVO[]>([]) // 收藏歌单
const createPlaylists = ref<PlaylistVO[]>([]) // 创建歌单
const albums = ref<AlbumCardVO[]>([]) // 专辑列表
const filteredAlbums = ref<AlbumCardVO[]>([]) // 筛选专辑
const totalAlbums = ref(0) // 专辑总数
const searchKeyword = ref('') // 搜索关键词
const musicTagRatio = ref<MusicTagRatioVO[]>([]) // 标签占比
const dailyListenDuration = ref<number[]>([0, 0, 0, 0, 0, 0, 0]) // 每日听歌时长（分钟）
const dailyListenSeconds = ref<number[]>([0, 0, 0, 0, 0, 0, 0]) // 每日听歌时长（秒）
const loadingIds = ref<number[]>([]) // 点赞加载ID
const myAlbums = ref<AlbumCardVO[]>([])
const filteredmyAlbums = ref<AlbumCardVO[]>([])
// 音乐作品数据
const mySongs = ref<any[]>([]) // 音乐作品列表
const musicLoading = ref(false) // 音乐作品加载状态
const musicPagination = reactive({
  pageNum: 1,
  pageSize: 10,
  total: 0,
  pages: 0,
})

// 将 mySongs 转换为 LikedSongs 组件需要的格式
// const mySongsForLikedSongs = computed(() => {
//   return mySongs.value.map((song) => ({
//     id: song.id,
//     musicName: song.name,
//     musicianName: '', // 音乐人自己的作品，不显示歌手名
//     coverUrl: song.cover,
//     albumName: song.album,
//     duration: formatDuration(song.duration),
//     isLiked: 0,
//     likeCount: 0,
//     isVip: 0,
//     audioList: song.tags || [],
//   }))
// })

// 格式化时长（秒转为 mm:ss 格式）
const formatDuration = (seconds: number): string => {
  if (!seconds || seconds <= 0) return '00:00'
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

// ========== 6. 统一弹窗状态（和个人中心一致） ==========
const isCreateDialogOpen = ref(false)

import { usePlaylistStore } from '@/stores/playList'
const playlistStore = usePlaylistStore()
const handleViewAllLikedSongs = () => {
  console.log(musicianInfo.value.likePlaylistId)
  if (musicianInfo.value.likePlaylistId) {
    playlistStore.setCurrentPlaylist(musicianInfo.value.likePlaylistId)
    router.push('/user/liked-songs-list')
  } else {
    ElMessage.warning('未找到喜欢的歌曲列表')
  }
}
const loadMyMusic = async (isAppend: boolean = false) => {
  musicLoading.value = true
  try {
    const res = await getMyMusic({
      pageNum: musicPagination.pageNum,
      pageSize: musicPagination.pageSize,
      musicianId: Number(userId || musicianInfo.value.id),
    })
    console.log('获取我的音乐成功:', res.data)
    if (res.success && res.data) {
      let records = res.data.records || []
      // 处理后端返回的特殊数据结构：records是包含数组的数组
      if (Array.isArray(records) && records.length === 1 && Array.isArray(records[0])) {
        // 如果是嵌套数组，使用内部数组
        records = records[0]
      }

      // 确保records是数组
      if (!Array.isArray(records)) {
        records = []
      }

      const newSongs = records.map((item: any) => {
        // 处理audioList，提取qualityType并转换为文字
        const audioList =
          item.audioList?.map((audio: any) => {
            const qualityType = audio.qualityType
            switch (qualityType) {
              case 1:
                return '标准'
              case 2:
                return '高清'
              case 3:
                return '无损'
              case 4:
                return '空间音频'
              default:
                return '标准'
            }
          }) || []
        return {
          ...item,
          audioList: audioList, // 把处理好的音质列表加进去
        }
      })

      // 根据是否是追加模式处理数据
      if (isAppend) {
        mySongs.value = [...mySongs.value, ...newSongs]
      } else {
        mySongs.value = newSongs
      }

      musicPagination.total = res.data.total || 0
      musicPagination.pages = res.data.pages || 0
    } else {
      if (!isAppend) {
        mySongs.value = []
      }
      musicPagination.total = 0
      musicPagination.pages = 0
      ElMessage.error(res.errorMsg || '获取作品列表失败')
    }
  } catch (error) {
    console.error('加载音乐作品失败:', error)
    if (!isAppend) {
      mySongs.value = []
    }
    ElMessage.error('加载作品列表失败')
  } finally {
    musicLoading.value = false
  }
}

// 无限滚动加载更多
const loadMoreMusic = () => {
  if (!musicLoading.value && musicPagination.pageNum < musicPagination.pages) {
    musicPagination.pageNum++
    console.log('加载更多音乐作品')
    loadMyMusic(true)
  }
}

// 重置音乐作品列表
const resetMusicList = () => {
  musicPagination.pageNum = 1
  loadMyMusic()
}

// 加载喜欢的歌曲
const loadLikedSongs = async () => {
  loading.value = true
  try {
    const res = await getLikeMusic({
      size: 5,
      lastId: null,
      userId: userId || musicianInfo.value.id,
    })
    console.log(musicianInfo.value)
    console.log('loadLikedSongs 响应:', res)
    if (res.success) {
      const rawRecords = res.data?.dateList || []
      likedSongs.value = Array.isArray(rawRecords[0])
        ? (rawRecords[0] as MusicVO[])
        : (rawRecords as MusicVO[])
    } else {
      ElMessage.error(res.errorMsg || '获取喜欢的歌曲失败')
      likedSongs.value = []
    }
  } catch (error) {
    console.error('加载喜欢的歌曲失败:', error)
    likedSongs.value = []
    ElMessage.error('加载失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

// 加载收藏歌单
const loadCollectPlaylists = async () => {
  try {
    collectPlaylistLoading.value = true
    const res: CollectPlaylistResp = await getPlayList({
      lastId: null,
      size: 3,
      userId: userId || musicianInfo.value.id,
    })
    console.log('获取收藏歌单成功:', res)
    if (res.data) {
      if (res.data.dateList && res.data.dateList.length > 0) {
        const records = res.data.dateList
        collectPlaylists.value = Array.isArray(records[0])
          ? (records[0] as PlaylistVO[])
          : (records as PlaylistVO[])
      } else {
        collectPlaylists.value = []
      }
    } else {
      ElMessage.error(res.errorMsg || '获取收藏的歌单失败')
      collectPlaylists.value = []
    }
  } catch (error) {
    console.error('加载收藏的歌单失败:', error)
    ElMessage.error('加载收藏的歌单失败，请稍后重试')
    collectPlaylists.value = []
  } finally {
    collectPlaylistLoading.value = false
  }
}

// 加载创建歌单
const loadCreatePlaylists = async () => {
  try {
    createPlaylistLoading.value = true
    const res: CreatePlaylistResp = await getCreatePlaylists({
      ...createPagination,
      userId: userId || musicianInfo.value.id,
    })
    if (res.success) {
      const pageData = res.data || { records: [], total: 0 }
      const rawRecords = pageData.records || []
      createPlaylists.value = Array.isArray(rawRecords[0])
        ? (rawRecords[0] as PlaylistVO[])
        : (rawRecords as PlaylistVO[])
    } else {
      ElMessage.error(res.errorMsg || '获取创建的歌单失败')
      createPlaylists.value = []
    }
  } catch (error) {
    console.error('加载创建的歌单失败:', error)
    ElMessage.error('加载创建的歌单失败，请稍后重试')
    createPlaylists.value = []
  } finally {
    createPlaylistLoading.value = false
  }
}

// 加载收藏专辑
// const loadCollectAlbums = async () => {
//   try {
//     albumLoading.value = true
//     const res: CollectAlbumResp = await getMyCollectAlbums({
//       pageNum: albumPagination.pageNum,
//       pageSize: albumPagination.pageSize,
//       userId: userId || musicianInfo.value.id,
//     })

//     if (res.success && res.data) {
//       const rawAlbums = (res.data.records || []).filter((album) => {
//         return album && album.id !== undefined && album.id !== null
//       })

//       totalAlbums.value = res.data.total || 0

//       if (rawAlbums.length > 0) {
//         albums.value = rawAlbums.map((album: AlbumVO) => ({
//           id: album.id,
//           name: album.albumName || '未知专辑',
//           artist: album.musicianName || '未知歌手',
//           cover: album.coverUrl || 'https://picsum.photos/300/300?random=41',
//           songCount: album.musicCount || 0,
//           playCount: `${album.collectCount || 0}次收藏`,
//           collectTime: '2025-05-20',
//         }))
//       } else {
//         albums.value = []
//       }

//       filteredAlbums.value = [...albums.value]
//     } else {
//       ElMessage.warning(res.errorMsg || '暂无收藏的专辑')
//       albums.value = []
//       filteredAlbums.value = []
//     }
//   } catch (error) {
//     console.error('加载收藏专辑失败:', error)
//     ElMessage.error('加载收藏专辑失败，请稍后重试')
//     albums.value = []
//     filteredAlbums.value = []
//   } finally {
//     albumLoading.value = false
//   }
// }

// 加载每周听歌时长
const loadWeeklyListenCount = async () => {
  try {
    listenCountLoading.value = true
    const res = await getWeeklyDailyListenCount()

    if (res.success && res.data) {
      const rawData = Array.isArray(res.data) ? res.data : []
      let secondsArr = rawData.map((item: any) => item.seconds || 0)

      while (secondsArr.length < 7) {
        secondsArr.push(0)
      }
      if (secondsArr.length > 7) {
        secondsArr = secondsArr.slice(0, 7)
      }

      dailyListenSeconds.value = secondsArr
      dailyListenDuration.value = secondsArr.map(secondsToMinutes)
    } else {
      ElMessage.warning('暂无本周听歌时长数据')
      dailyListenDuration.value = [0, 0, 0, 0, 0, 0, 0]
      dailyListenSeconds.value = [0, 0, 0, 0, 0, 0, 0]
    }
  } catch (error) {
    console.error('加载本周听歌时长失败:', error)
    ElMessage.error('加载听歌时长数据失败')
    dailyListenDuration.value = [0, 0, 0, 0, 0, 0, 0]
    dailyListenSeconds.value = [0, 0, 0, 0, 0, 0, 0]
  } finally {
    listenCountLoading.value = false
  }
}

// 加载每周标签占比
const loadWeeklyTagRatio = async () => {
  try {
    tagRatioLoading.value = true
    const res = await getWeeklyTagRatio()
    if (res.success && res.data) {
      musicTagRatio.value = (res.data as unknown as MusicTagRatioVO[]) || []
    } else {
      ElMessage.warning('暂无本周音乐标签数据')
      musicTagRatio.value = []
    }
  } catch (error) {
    console.error('加载标签占比失败:', error)
    ElMessage.error('加载音乐标签数据失败')
    musicTagRatio.value = []
  } finally {
    tagRatioLoading.value = false
  }
}

// ========== 8. 统一事件处理函数（和个人中心一致） ==========
// 打开创建歌单弹窗
const openCreateDialog = () => {
  isCreateDialogOpen.value = true
}

// 创建歌单成功处理
const handleCreateSuccess = async (formData: FormData) => {
  try {
    isCreatingPlaylist.value = true
    const res = await createPlaylistApi(formData)
    if (res) {
      await loadCreatePlaylists()
      ElMessage.success('歌单创建成功')
    } else {
      ElMessage.error('创建歌单失败：返回数据异常')
    }
  } catch (error) {
    console.error('创建歌单失败:', error)
    ElMessage.error('创建歌单失败，请稍后重试')
  } finally {
    isCreatingPlaylist.value = false
    isCreateDialogOpen.value = false
  }
}

// 收藏歌单变更处理
const handleCollectChange = async (playlistId: string | number) => {
  const id = Number(playlistId)
  try {
    await loadCollectPlaylists()
  } catch (error) {
    console.error('处理收藏变更失败:', error)
  }
}

// 删除歌单变更处理
const handleDeleteChange = async (playlistId: string | number) => {
  const id = Number(playlistId)
  try {
    await loadCreatePlaylists()
  } catch (error) {
    console.error('处理删除变更失败:', error)
  }
}

// 更新成功刷新
const handleUpdateSuccess = async () => {
  try {
    await loadCreatePlaylists()
  } catch (error) {
    console.error('刷新歌单列表失败:', error)
    ElMessage.error('刷新歌单列表失败，请手动刷新页面')
  }
}

// 更新用户信息
const handleUpdateUserInfo = async (editForm: EditForm) => {
  try {
    const params: UpdateUserInfoParams = {
      username: editForm.name,
      introduction: editForm.signature,
      gender: editForm.gender,
      phone: editForm.phone,
    }

    const res = await updateUserInfo(params)
    if (res.success) {
      ElMessage.success('个人信息修改成功')
      musicianInfo.value = {
        ...musicianInfo.value,
        username: editForm.name,
        introduction: editForm.signature,
        gender: editForm.gender,
        phone: editForm.phone,
      }
    }
  } catch (error) {
    console.error('修改个人信息失败:', error)
  }
}

// 上传头像
const handleUploadAvatar = async (file: File) => {
  try {
    const params: UpdateUserInfoParams = {
      avatarFile: file,
    }
    const res = await updateUserInfo(params)
    if (res.success) {
      if ((res.data as UserInfoVO).avatar) {
        musicianInfo.value.avatar = (res.data as UserInfoVO).avatar
      } else {
        musicianInfo.value.avatar = URL.createObjectURL(file)
      }
      ElMessage.success('头像更新成功')
    }
  } catch (error) {
    console.error('头像更新失败:', error)
    ElMessage.error('头像更新失败，请重试')
  }
}

// 上传背景图
const handleUploadBg = async (file: File) => {
  try {
    const params: UpdateUserInfoParams = {
      backgroundImageFile: file,
    }
    const res = await updateUserInfo(params)
    if (res.success) {
      if ((res.data as UserInfoVO).backgroundImage) {
        musicianInfo.value.backgroundImage = (res.data as UserInfoVO).backgroundImage
      } else {
        musicianInfo.value.backgroundImage = URL.createObjectURL(file)
      }
      ElMessage.success('背景图更新成功')
    }
  } catch (error) {
    console.error('背景图更新失败:', error)
    ElMessage.error('背景图更新失败，请重试')
  }
}

// 专辑相关事件
const goToAlbumDetail = (id: number | string) => {
  console.log(`跳转到专辑详情: ${id}`)
  router.push({ path: `/album/${id}` })
}

const playAlbum = (id: number | string) => {
  console.log(`播放专辑: ${id}`)
  ElMessage.success('开始播放专辑')
}

const toggleCollection = async (id: number | string) => {
  try {
    const albumIndex = albums.value.findIndex((item) => item.id === id)
    if (albumIndex === -1) {
      ElMessage.warning('未找到该专辑')
      return
    }

    const targetAlbum = albums.value[albumIndex]
    albums.value.splice(albumIndex, 1)

    if (filteredAlbums.value.length > 0) {
      const filterIndex = filteredAlbums.value.findIndex((item) => item.id === id)
      if (filterIndex > -1) {
        filteredAlbums.value.splice(filterIndex, 1)
      }
    }

    const res = await collectAlbum(id, 2)
    if (!res.success) {
      ElMessage.error(res.errorMsg || '取消收藏失败')
      if (targetAlbum) {
        albums.value.splice(albumIndex, 0, targetAlbum)
        const originalIndex = albums.value.findIndex((album) => album.id === targetAlbum.id)
        if (originalIndex !== -1) {
          filteredAlbums.value.splice(originalIndex, 0, targetAlbum)
        }
      }
      return
    }

    totalAlbums.value = Math.max(0, totalAlbums.value - 1)
    ElMessage.success(res.data?.errorMsg || `已取消收藏《${targetAlbum?.name}》`)
  } catch (error) {
    console.error('取消收藏专辑失败:', error)
    ElMessage.error('取消收藏失败，请稍后重试')
    await loadCollectAlbums()
  }
}

const shareAlbum = (id: number | string) => {
  console.log(`分享专辑: ${id}`)
  ElMessage.success('已分享专辑')
}

const exploreAlbums = () => {
  console.log('发现专辑')
  router.push('/discovery')
}

// 点赞/取消点赞
const handleLike = async (songId: number) => {
  if (loadingIds.value.includes(songId)) return
  loadingIds.value.push(songId)

  try {
    const song = likedSongs.value.find((item) => item.id === songId)
    if (!song) {
      ElMessage.warning('未找到该歌曲')
      return
    }

    const res = await likeRecord({
      targetId: songId,
      targetType: 1,
    })
    if (res.success) {
      song.isLiked = res.data.islike ? 1 : 0
      if (res.data.likecount !== undefined) {
        song.likeCount = res.data.likecount
      }
      ElMessage.success(res.data.msg || (res.data.islike ? '点赞成功' : '取消点赞成功'))
    } else {
      ElMessage.error(res.errorMsg || '操作失败，请重试')
    }
  } catch (error) {
    console.error('点赞/取消点赞失败:', error)
    ElMessage.error('网络异常，操作失败')
  } finally {
    loadingIds.value = loadingIds.value.filter((id) => id !== songId)
  }
}

// ========== 9. 工具函数（和个人中心一致） ==========
const secondsToMinutes = (seconds: number) => {
  return Number((seconds / 60).toFixed(1))
}

const formatDurationText = (seconds: number) => {
  if (seconds === 0) return '0分钟'
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)

  if (hours > 0) {
    return `${hours}小时${minutes}分`
  } else {
    return `${minutes}分钟`
  }
}

// ========== 10. 初始化加载（和个人中心一致） ==========
onMounted(async () => {
  setTimeout(() => {
    switchTab('works')
    window.addEventListener('resize', () => {
      switchTab(activeTab.value)
    })
  }, 100)
  await loadUserInfo()
  await Promise.all([
    loadMyAlbums(),
    loadLikedSongs(),
    loadCollectPlaylists(),
    loadCreatePlaylists(),
    loadWeeklyListenCount(),
    loadWeeklyTagRatio(),
    loadMyMusic(),
  ])
})
// 加载我的专辑
const loadMyAlbums = async () => {
  try {
    albumLoading.value = true
    const res = await getMyAlbums({
      pageNum: albumPagination.pageNum,
      pageSize: albumPagination.pageSize,
      userId: Number(userId || musicianInfo.value.id),
    })
    console.log('loadMyAlbums 响应:', res)

    if (res.success && res.data) {
      console.log('loadMyAlbums data:', res.data)
      console.log('loadMyAlbums records:', res.data.records)
      console.log('loadMyAlbums total:', res.data.total)

      // 处理后端返回的特殊数据结构
      let records = res.data.records || []
      if (Array.isArray(records) && records.length === 1 && Array.isArray(records[0])) {
        records = records[0]
      }

      const rawAlbums = records.filter((album: any) => {
        return album && album.id !== undefined && album.id !== null
      })

      totalAlbums.value = res.data.total || 0
      console.log('loadMyAlbums rawAlbums长度:', rawAlbums.length)

      if (rawAlbums.length > 0) {
        myAlbums.value = rawAlbums.map((album: any) => ({
          id: album.id,
          name: album.albumName || '未知专辑',
          artist: album.musicianName || '未知歌手',
          cover: album.coverUrl || 'https://picsum.photos/300/300?random=41',
          songCount: album.musicCount || 0,
          playCount: `${album.collectCount || 0}次收藏`,
          collectTime: '2025-05-20',
        }))
      } else {
        myAlbums.value = []
        console.log('loadMyAlbums: 暂无专辑数据')
      }

      filteredmyAlbums.value = [...myAlbums.value]
      console.log('loadMyAlbums albums.value:', myAlbums.value)
    } else {
      console.log('loadMyAlbums: 请求失败或数据为空')
      myAlbums.value = []
      filteredmyAlbums.value = []
    }
  } catch (error) {
    console.error('加载我的专辑失败:', error)
    ElMessage.error('加载我的专辑失败，请稍后重试')
    myAlbums.value = []
    filteredmyAlbums.value = []
  } finally {
    albumLoading.value = false
    console.log('loadMyAlbums 最终 albums:', myAlbums.value)
  }
}
// ========== 11. 筛选专辑（和个人中心一致） ==========
const filteredAlbumsComputed = computed(() => {
  if (!searchKeyword.value) return albums.value
  const keyword = searchKeyword.value.toLowerCase()
  return albums.value.filter(
    (album) =>
      album.name.toLowerCase().includes(keyword) || album.artist.toLowerCase().includes(keyword),
  )
})
const route = useRoute()

const userId = route.query.userId as string | undefined
import { getOtherUserInfo } from '@/api/personalCenter'

const isFollowing = ref(false)

const loadUserInfo = async () => {
  try {
    let res
    if (userId) {
      res = await getOtherUserInfo({ userId: Number(userId) })
      isFollowing.value = res.data?.isFollowing || false
    } else {
      res = await getUserInfo()
    }
    musicianInfo.value = res.data
  } catch (err) {}
}

const handleFollowChange = (newIsFollowing: boolean) => {
  isFollowing.value = newIsFollowing
}
</script>

<style lang="scss" scoped>
/* 统一深色骨架屏样式 */
:deep(.skeleton-dark) {
  --el-skeleton-bg-color: #1a1a1a;
  --el-skeleton-item-bg-color: #2d2d2d;
  --el-skeleton-wave-color: rgba(255, 255, 255, 0.1);
}

:deep(.skeleton-dark .el-skeleton__item) {
  border-radius: 4px;
  margin-bottom: 8px;
}

:deep(.skeleton-dark .el-skeleton__item:last-child) {
  margin-bottom: 0;
}

/* 统一Tab样式 */
@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: translateY(10px) scale(0.98);
  }
  70% {
    opacity: 0.9;
    transform: translateY(-2px) scale(1.01);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.content-section.active {
  animation: fadeIn 0.5s ease-out;
}

.tab-button {
  position: relative;
  overflow: hidden;
}

.tab-button:hover {
  color: #ffffff !important;
  transform: translateY(-1px);
}

.tab-button:active {
  transform: translateY(1px);
}

.tab-button.text-white {
  text-shadow: 0 0 8px rgba(255, 255, 255, 0.3);
}

.tab-indicator {
  top: 13px;
  will-change: transform, left, width;
}

@media (max-width: 768px) {
  .tabs {
    height: 14px;
  }

  .tab-indicator {
    height: 8px;
  }

  .tab-button {
    font-size: 14px;
  }
}

/* 统一错误输入框样式 */
.error-input :deep(.el-input__inner) {
  border-color: #f56565 !important;
}

.error-input :deep(.el-input__inner:focus) {
  border-color: #f56565 !important;
  box-shadow: 0 0 0 1px rgba(245, 101, 101, 0.2) !important;
}
</style>

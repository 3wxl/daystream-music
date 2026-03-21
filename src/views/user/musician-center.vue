<template>
  <!-- 统一页面容器样式：和个人中心保持一致的深色渐变背景 -->
  <div class="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-white p-4 md:p-6">
    <div class="max-w-7xl mx-auto space-y-6">
      <!-- 统一UserHeader组件传参和事件监听 -->
      <UserHeader
        v-if="musicianInfo.id"
        :userInfo="musicianInfo"
        :isOthersPage="false"
        @update-user-info="handleUpdateUserInfo"
        @upload-avatar="handleUploadAvatar"
        @upload-bg="handleUploadBg"
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
            :class="{ 'text-white font-semibold': activeTab === 'dynamic' }"
            @click="switchTab('dynamic')"
          >
            动态
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
            <MusicianWorks class="mb-8" />
            <h3 class="mb-4 text-lg font-semibold text-gray-100 pl-3 border-l-3 border-pink-500">
              我的专辑
            </h3>
            <!-- 统一专辑组件传参和事件 -->
            <div v-if="albumLoading" class="py-12 text-center">
              <el-skeleton loading animation="wave" :rows="6" class="w-full skeleton-dark" />
            </div>
            <div v-else-if="albums.length > 0">
              <CollectedAlbum
                :albums="filteredAlbums.length ? filteredAlbums : albums"
                @goToAlbumDetail="goToAlbumDetail"
                @playAlbum="playAlbum"
                @toggleCollection="toggleCollection"
                @shareAlbum="shareAlbum"
                @exploreAlbums="exploreAlbums"
              />
            </div>
            <div v-else class="py-6 text-center">
              <el-empty description="暂无专辑" class="text-gray-500" />
              <p class="text-gray-400 text-sm mt-2">去创建你的第一张专辑吧</p>
            </div>
          </div>

          <!-- 动态Tab -->
          <div
            class="content-section"
            :class="{ hidden: activeTab !== 'dynamic', active: activeTab === 'dynamic' }"
          >
            <h3
              class="mt-0 mb-4 text-lg font-semibold text-gray-100 pl-3 border-l-3 border-pink-500"
            >
              我的动态
            </h3>
            <MusicianDynamic class="mb-8" />
            <h3 class="mb-4 text-lg font-semibold text-gray-100 pl-3 border-l-3 border-pink-500">
              收到的评论
            </h3>
            <CommentSection />
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
                <router-link to="/User/LikedSongsList">
                  <div v-if="likedSongs.length > 0" class="shrink-0 w-[100px] flex justify-end">
                    <el-button type="text" size="small" class="text-[#00f0ff] hover:text-white">
                      查看全部
                    </el-button>
                  </div>
                </router-link>
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
                      <router-link to="/User/CollectedSongsList">
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
                        <router-link to="/User/CollectedSongsList">
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
            <div
              class="collection-albums-page bg-[#080812] text-white overflow-x-hidden rounded-2xl mt-6"
            >
              <main class="container mx-auto px-4 md:px-8 py-8">
                <div class="mb-8 pb-3">
                  <div class="flex items-center justify-between w-full">
                    <button
                      class="px-6 py-3 rounded-full bg-gradient-to-r from-[#ec4899] to-[#f472b6] text-white text-sm font-medium shadow-xl shadow-[#ec4899]/20 hover:shadow-[#ec4899]/40 transition-all duration-400 transform hover:-translate-y-1 active:scale-95"
                    >
                      我收藏的专辑
                    </button>
                    <router-link to="/User/CollectedAlbums">
                      <button
                        class="px-4 py-2 rounded-full bg-[#121224] border border-[rgba(236,72,153,0.2)] text-white/80 text-sm hover:bg-[#1a1a36] hover:text-white hover:border-[rgba(236,72,153,0.4)] transition-all duration-400 flex items-center gap-1"
                      >
                        <span>查看全部</span>
                        <i class="iconfont text-xs">&#xe696;</i>
                      </button>
                    </router-link>
                  </div>
                </div>

                <!-- 专辑列表（统一加载和空状态） -->
                <div v-if="albumLoading" class="py-12 text-center">
                  <el-skeleton loading animation="wave" :rows="6" class="w-full skeleton-dark" />
                </div>
                <div v-else-if="albums.length > 0">
                  <CollectedAlbum
                    :albums="filteredAlbums.length ? filteredAlbums : albums"
                    @goToAlbumDetail="goToAlbumDetail"
                    @playAlbum="playAlbum"
                    @toggleCollection="toggleCollection"
                    @shareAlbum="shareAlbum"
                    @exploreAlbums="exploreAlbums"
                  />
                </div>
                <div v-else class="py-6 text-center">
                  <el-empty description="暂无收藏的专辑" class="text-gray-500" />
                  <p class="text-gray-400 text-sm mt-2">去发现更多精彩的专辑吧</p>
                  <router-link to="/album">
                    <el-button type="text" class="text-[#00f0ff] hover:text-white mt-4">
                      发现专辑
                    </el-button>
                  </router-link>
                </div>
              </main>
            </div>
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
import { ElMessage } from 'element-plus'
// 统一导入个人中心的API和类型
import {
  getUserInfo,
  updateUserInfo,
  getMyLikeSongs,
  getCollectPlaylists,
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

const router = useRouter()

// ========== 1. 统一Tab切换逻辑 ==========
const activeTab = ref('works')
const indicatorOffset = ref(0)
const indicatorWidth = ref(0)
const indicatorScale = ref(1)

const switchTab = (tab: 'works' | 'dynamic' | 'collection') => {
  indicatorScale.value = 0.95
  activeTab.value = tab

  const tabButton = document.querySelector(
    `.tab-button:nth-child(${tab === 'works' ? 1 : tab === 'dynamic' ? 2 : 3})`,
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

// ========== 6. 统一弹窗状态（和个人中心一致） ==========
const isCreateDialogOpen = ref(false)

// ========== 7. 统一加载函数（复用个人中心的成熟逻辑） ==========
// 加载用户信息
const loadUserInfo = async () => {
  try {
    const res = await getUserInfo()
    musicianInfo.value = {
      ...res.data,
      username: res.data.username,
      introduction: res.data.introduction,
      followCount: res.data.followCount || 0,
      fansCount: res.data.fansCount || 0,
      likeCount: res.data.likeCount || 0,
      onlineStatus: res.data.onlineStatus || 0,
      userRole: '音乐人',
    }
  } catch (error) {
    console.error('加载用户信息失败:', error)
  }
}

// 加载喜欢的歌曲
const loadLikedSongs = async () => {
  loading.value = true
  try {
    const res = await getMyLikeSongs({
      pageNum: pagination.pageNum,
      pageSize: pagination.pageSize,
    })
    if (res.success) {
      const rawRecords = res.data?.records || []
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
    const res: CollectPlaylistResp = await getCollectPlaylists(collectPagination)
    if (res.success && res.data) {
      if (res.data.records && res.data.records.length > 0) {
        const records = res.data.records
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
    const res: CreatePlaylistResp = await getCreatePlaylists(createPagination)
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
const loadCollectAlbums = async () => {
  try {
    albumLoading.value = true
    const res: CollectAlbumResp = await getMyCollectAlbums({
      pageNum: albumPagination.pageNum,
      pageSize: albumPagination.pageSize,
    })

    if (res.success && res.data) {
      const rawAlbums = (res.data.records || []).filter((album) => {
        return album && album.id !== undefined && album.id !== null
      })

      totalAlbums.value = res.data.total || 0

      if (rawAlbums.length > 0) {
        albums.value = rawAlbums.map((album: AlbumVO) => ({
          id: album.id,
          name: album.albumName || '未知专辑',
          artist: album.musicianName || '未知歌手',
          cover: album.coverUrl || 'https://picsum.photos/300/300?random=41',
          songCount: album.musicCount || 0,
          playCount: `${album.collectCount || 0}次收藏`,
          collectTime: '2025-05-20',
        }))
      } else {
        albums.value = []
      }

      filteredAlbums.value = [...albums.value]
    } else {
      ElMessage.warning(res.errorMsg || '暂无收藏的专辑')
      albums.value = []
      filteredAlbums.value = []
    }
  } catch (error) {
    console.error('加载收藏专辑失败:', error)
    ElMessage.error('加载收藏专辑失败，请稍后重试')
    albums.value = []
    filteredAlbums.value = []
  } finally {
    albumLoading.value = false
  }
}

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
      switchTab(activeTab.value as 'works' | 'dynamic' | 'collection')
    })
  }, 100)

  await Promise.all([
    loadUserInfo(),
    loadLikedSongs(),
    loadCollectPlaylists(),
    loadCreatePlaylists(),
    loadWeeklyListenCount(),
    loadWeeklyTagRatio(),
    loadCollectAlbums(),
  ])
})

// ========== 11. 筛选专辑（和个人中心一致） ==========
const filteredAlbumsComputed = computed(() => {
  if (!searchKeyword.value) return albums.value
  const keyword = searchKeyword.value.toLowerCase()
  return albums.value.filter(
    (album) =>
      album.name.toLowerCase().includes(keyword) || album.artist.toLowerCase().includes(keyword),
  )
})
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

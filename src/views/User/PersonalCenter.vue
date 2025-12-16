<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-white p-4 md:p-6">
    <div class="max-w-7xl mx-auto space-y-6">
      <!-- 传递完整的userInfo，监听子组件事件 -->
      <UserHeader
        v-if="userInfo.id"
        :userInfo="userInfo"
        :isOthersPage="false"
        @update-user-info="handleUpdateUserInfo"
        @upload-avatar="handleUploadAvatar"
        @upload-bg="handleUploadBg"
      />

      <div class="bg-gray-900/50 rounded-xl overflow-hidden border border-gray-800">
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
        <div v-if="loading" class="py-12 text-center"></div>
        <div v-else-if="likedSongs.length === 0" class="py-12 text-center">
          <el-empty description="暂无喜欢的歌曲" class="text-gray-500" />
        </div>
        <LikedSongs v-if="!loading && likedSongs.length > 0" :likedSongs="likedSongs" />
      </div>

      <!-- 其他原有代码（收藏歌单/创建歌单/收藏专辑） -->
      <div class="flex flex-col md:flex-row gap-20">
        <div class="flex-[3] min-w-[200px]">
          <!-- 传递标签占比数据给子组件 -->
          <MusicStatistics
            :daily-listen-duration="dailyListenDuration"
            :daily-listen-seconds="dailyListenSeconds"
            :music-tag-ratio="musicTagRatio"
            :loading="listenCountLoading || tagRatioLoading"
          />
        </div>
        <div class="flex-[6]">
          <!-- 收藏歌单 -->
          <div class="space-y-6">
            <div>
              <div class="flex items-center justify-between mb-3">
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

              <!-- 收藏歌单列表 -->
              <div v-if="collectPlaylistLoading" class="py-12 text-center"></div>
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

            <!-- 创建歌单 -->
            <div>
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center">
                  <img src="../../assets/speaker-16876_256.gif" alt="" class="w-15" />
                  <h3 class="text-white font-semibold text-lg">我创建的歌单</h3>
                </div>
                <div class="flex items-center gap-2">
                  <router-link to="/User/CollectedSongsList">
                    <el-button type="text" size="small" class="text-[#00f0ff] hover:text-white">
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

              <!-- 创建歌单列表 -->
              <div v-if="createPlaylistLoading" class="py-12 text-center"></div>
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
      <!-- 这里添加了缺失的闭合div -->

      <!-- 收藏专辑 -->
      <div class="collection-albums-page bg-[#080812] text-white overflow-x-hidden rounded-2xl">
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

          <!-- 专辑列表 -->
          <div v-if="albumLoading" class="py-12 text-center"></div>
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

    <!-- 创建歌单弹窗组件 -->
    <UpdatePlayList
      v-if="isCreateDialogOpen"
      v-model:isDialogOpen="isCreateDialogOpen"
      :isEditMode="false"
      @create-success="handleCreateSuccess"
    />
  </div>
</template>

<script setup lang="ts">
// 原有导入代码...
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  getUserInfo,
  updateUserInfo,
  getMyLikeSongs,
  getCollectPlaylists,
  getCreatePlaylists,
  createPlaylistApi,
  getWeeklyDailyListenCount,
  getWeeklyTagRatio, // 新增导入
  getMyCollectAlbums,
  collectAlbum, // 新增：导入取消收藏专辑接口
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
  DailyListenDataVO, // 新增导入
  MusicTagRatioVO, // 新增导入
  CollectAlbumResp,
  AlbumVO,
  AlbumCardVO,
} from '@/types/personalCenter/index'

// 原有变量定义...
const router = useRouter()
const loading = ref(false)
const pagination = reactive({
  pageNum: 1,
  pageSize: 4,
})
const collectPlaylistLoading = ref(false)
const createPlaylistLoading = ref(false)
const isCreatingPlaylist = ref(false)

const collectPlaylists = ref<PlaylistVO[]>([])
const createPlaylists = ref<PlaylistVO[]>([])

const collectPagination = reactive<CollectPlaylistReq>({
  pageNum: 1,
  pageSize: 3,
})
const createPagination = reactive<CreatePlaylistReq>({
  pageNum: 1,
  pageSize: 3,
})

// 替换原有 albums 相关变量
const albumLoading = ref(false) // 专辑加载状态
const albums = ref<AlbumCardVO[]>([]) // 收藏专辑列表（格式化后）
const filteredAlbums = ref<AlbumCardVO[]>([]) // 筛选后的专辑
const albumPagination = reactive({
  // 专辑分页参数
  pageNum: 1,
  pageSize: 6, // 首页显示6张专辑
})
const totalAlbums = ref(0) // 总专辑数
// 新增：加载收藏的专辑
// 原函数中的 API 调用部分
const loadCollectAlbums = async () => {
  try {
    albumLoading.value = true
    const res: CollectAlbumResp = await getMyCollectAlbums({
      pageNum: albumPagination.pageNum,
      pageSize: albumPagination.pageSize,
    })

    console.log('收藏专辑接口原始返回：', res)

    // ========== 关键修复1：严格校验数据有效性 ==========
    if (res.success && res.data) {
      // 1. 过滤无效数据：剔除 records 中的空对象/无id的对象
      const rawAlbums = (res.data.records || []).filter((album) => {
        // 必须包含核心字段 id，否则视为无效数据
        return album && album.id !== undefined && album.id !== null
      })

      totalAlbums.value = res.data.total || 0
      console.log('过滤后的原始专辑数据：', rawAlbums)

      // 2. 只有有效数据>0时才转换，否则直接置空
      if (rawAlbums.length > 0) {
        albums.value = rawAlbums.map((album: AlbumVO) => ({
          id: album.id,
          name: album.albumName || '未知专辑', // 兜底默认值
          artist: album.musicianName || '未知歌手', // 兜底默认值
          cover: album.coverUrl || 'https://picsum.photos/300/300?random=41', // 兜底封面
          songCount: album.musicCount || 0,
          playCount: `${album.collectCount || 0}次收藏`,
          collectTime: '2025-05-20',
        }))
      } else {
        // 无有效数据时强制置空
        albums.value = []
      }

      filteredAlbums.value = [...albums.value]
    } else {
      // 接口返回失败/无data时置空
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
const likedSongs = ref<MusicVO[]>([])
const searchKeyword = ref('')
const showSearchSuggestions = ref(false)
const searchHistory = ref<string[]>(['周杰伦', '孤独的海', '小幸运'])

const isCreateDialogOpen = ref(false)

const userInfo = ref<UserInfoVO>({
  isVip: false,
  playCount: 0,
  createdCount: 0,
  followCount: 0,
  fansCount: 0,
  likeCount: 0,
  onlineStatus: 0,
  userRole: '普通用户',
})

const listenCountLoading = ref(false) // 加载状态
const tagRatioLoading = ref(false) // 标签占比加载状态
const musicTagRatio = ref<MusicTagRatioVO[]>([]) // 标签占比数据

// 修改：每日听歌数据类型（适配接口返回的对象数组）
const dailyListenDuration = ref<number[]>([0, 0, 0, 0, 0, 0, 0])

// 原有变量定义（loading/collectPlaylists等）保持不变...

const loadWeeklyTagRatio = async () => {
  try {
    tagRatioLoading.value = true
    const res = await getWeeklyTagRatio()
    console.log('本周标签')
    console.log(res)
    if (res.success && res.data) {
      // 使用类型断言解决类型错误
      // 第288行修改为：
      musicTagRatio.value = (res.data as unknown as MusicTagRatioVO[]) || []
      console.log('本周标签占比数据：', musicTagRatio.value)
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
const dailyListenSeconds = ref<number[]>([0, 0, 0, 0, 0, 0, 0])
// 修改：加载每日听歌数据（适配对象数组）
// 修改 loadWeeklyListenCount 函数中的这段代码：
const loadWeeklyListenCount = async () => {
  try {
    listenCountLoading.value = true
    const res = await getWeeklyDailyListenCount()
    console.log('每日听歌时长响应：', res)

    if (res.success && res.data) {
      // 类型检查确保 res.data 是数组
      const rawData = Array.isArray(res.data) ? res.data : []

      // 如果是空数组，初始化为7个默认值
      // if (rawData.length === 0) {
      //   for (let i = 0; i < 7; i++) {
      //     rawData.push({ count: 0, seconds: 0 })
      //   }
      // }

      let secondsArr = rawData.map((item: any) => item.seconds || 0)

      // 确保数组长度为7
      while (secondsArr.length < 7) {
        secondsArr.push(0)
      }
      if (secondsArr.length > 7) {
        secondsArr = secondsArr.slice(0, 7)
      }

      // 存储原始秒数和转换后的分钟数
      dailyListenSeconds.value = secondsArr
      dailyListenDuration.value = secondsArr.map(secondsToMinutes)
      console.log('本周每日听歌时长（分钟）：', dailyListenDuration.value)
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
// 修改onMounted：新增加载标签占比
onMounted(async () => {
  await Promise.all([
    loadUserInfo(),
    loadLikedSongs(),
    loadCollectPlaylists(),
    loadCreatePlaylists(),
    loadWeeklyListenCount(),
    loadWeeklyTagRatio(),
    loadCollectAlbums(), // 新增：加载收藏专辑
  ])
})
// 父组件新增：处理编辑成功后的刷新
const handleUpdateSuccess = async () => {
  try {
    await loadCreatePlaylists()
  } catch (error) {
    console.error('刷新歌单列表失败:', error)
    ElMessage.error('刷新歌单列表失败，请手动刷新页面')
  }
}
const loadCollectPlaylists = async () => {
  try {
    collectPlaylistLoading.value = true
    const res: CollectPlaylistResp = await getCollectPlaylists(collectPagination)
    console.log('加载收藏的歌单完整响应：', res)

    if (res.success && res.data) {
      if (res.data.records && res.data.records.length > 0) {
        const records = res.data.records
        collectPlaylists.value = Array.isArray(records[0])
          ? (records[0] as PlaylistVO[])
          : (records as PlaylistVO[])
        console.log('处理后的收藏歌单数据：', collectPlaylists.value)
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

const loadCreatePlaylists = async () => {
  try {
    createPlaylistLoading.value = true
    const res: CreatePlaylistResp = await getCreatePlaylists(createPagination)
    console.log('加载创建的歌单：', res)
    if (res.success) {
      const pageData = res.data || { records: [], total: 0 }
      const rawRecords = pageData.records || []
      createPlaylists.value = Array.isArray(rawRecords[0])
        ? (rawRecords[0] as PlaylistVO[])
        : (rawRecords as PlaylistVO[])
      console.log('createPlaylists:', createPlaylists.value)
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

const loadLikedSongs = async () => {
  loading.value = true
  try {
    const res = await getMyLikeSongs({
      pageNum: pagination.pageNum,
      pageSize: pagination.pageSize,
    })
    console.log('API原始返回:', res)

    if (res.success) {
      const rawRecords = res.data?.records || []
      likedSongs.value = Array.isArray(rawRecords[0])
        ? (rawRecords[0] as MusicVO[])
        : (rawRecords as MusicVO[])
      console.log('最终传递给子组件的数组:', likedSongs.value)
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
const handleCollectChange = async (playlistId: string | number) => {
  const id = Number(playlistId) // 确保转换为数字
  try {
    // 重新加载收藏歌单列表
    await loadCollectPlaylists()
  } catch (error) {
    console.error('处理收藏变更失败:', error)
  }
}

// 新增：处理删除变更
const handleDeleteChange = async (playlistId: string | number) => {
  const id = Number(playlistId)
  try {
    // 重新加载创建歌单列表
    await loadCreatePlaylists()
  } catch (error) {
    console.error('处理删除变更失败:', error)
  }
}
const loadUserInfo = async () => {
  try {
    const res = await getUserInfo()
    console.log(res)
    userInfo.value = {
      ...res.data,
      username: res.data.username,
      introduction: res.data.introduction,
      followCount: res.data.followCount || 0,
      fansCount: res.data.fansCount || 0,
      likeCount: res.data.likeCount || 0,
      onlineStatus: res.data.onlineStatus || 0,
      userRole: res.data.userRole || '普通用户',
    }
    console.log(userInfo.value.lastCheckinTime)
  } catch (error) {
    console.error('加载用户信息失败:', error)
  }
}

const openCreateDialog = () => {
  isCreateDialogOpen.value = true
}
const secondsToMinutes = (seconds: number) => {
  return Number((seconds / 60).toFixed(1))
}

/**
 * 将秒数转换为友好的文本格式（如：1小时20分 / 30分 / 0分）
 * @param seconds 秒数
 * @returns 格式化的时长文本
 */
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

// 修复核心：处理创建成功事件（调用真实API）
// 个人中心页面的handleCreateSuccess函数
const handleCreateSuccess = async (formData: FormData) => {
  try {
    isCreatingPlaylist.value = true
    console.log('传递给API的FormData：', formData)

    // 1. 调用创建歌单API（直接传FormData）
    const res = await createPlaylistApi(formData)
    console.log('创建歌单API返回:', res)

    // 2. 验证API返回（根据实际响应结构调整）
    if (res) {
      // 3. 重新加载创建歌单列表
      await loadCreatePlaylists()
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

// 原有其他函数不变...
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
      userInfo.value = {
        ...userInfo.value,
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

const handleUploadAvatar = async (file: File) => {
  try {
    const params: UpdateUserInfoParams = {
      avatarFile: file,
    }
    const res = await updateUserInfo(params)
    if (res.success) {
      if ((res.data as UserInfoVO).avatar) {
        userInfo.value.avatar = (res.data as UserInfoVO).avatar
      } else {
        userInfo.value.avatar = URL.createObjectURL(file)
      }
      ElMessage.success('头像更新成功')
    }
  } catch (error) {
    console.error('头像更新失败:', error)
    ElMessage.error('头像更新失败，请重试')
  }
}

const handleUploadBg = async (file: File) => {
  try {
    const params: UpdateUserInfoParams = {
      backgroundImageFile: file,
    }
    const res = await updateUserInfo(params)
    console.log(res)
    if (res.success) {
      if ((res.data as UserInfoVO).backgroundImage) {
        userInfo.value.backgroundImage = (res.data as UserInfoVO).backgroundImage
      } else {
        userInfo.value.backgroundImage = URL.createObjectURL(file)
      }
      ElMessage.success('背景图更新成功')
    }
  } catch (error) {
    console.error('背景图更新失败:', error)
    ElMessage.error('背景图更新失败，请重试')
  }
}

const goToAlbumDetail = (id: number | string) => {
  console.log(`跳转到专辑详情: ${id}`)
  router.push({ path: `/album/${id}` })
}

const playAlbum = (id: number | string) => {
  console.log(`播放专辑: ${id}`)
  ElMessage.success('开始播放专辑')
}

// ========== 核心修改：完善取消收藏专辑逻辑 ==========
const toggleCollection = async (id: number | string) => {
  try {
    // 1. 找到要取消收藏的专辑（用于乐观更新和提示）
    const albumIndex = albums.value.findIndex((item) => item.id === id)
    if (albumIndex === -1) {
      ElMessage.warning('未找到该专辑')
      return
    }

    const targetAlbum = albums.value[albumIndex]

    // 2. 乐观更新：先从页面移除该专辑（提升用户体验）
    albums.value.splice(albumIndex, 1)
    // 同步更新筛选后的专辑列表
    if (filteredAlbums.value.length > 0) {
      const filterIndex = filteredAlbums.value.findIndex((item) => item.id === id)
      if (filterIndex > -1) {
        filteredAlbums.value.splice(filterIndex, 1)
      }
    }

    // 3. 调用取消收藏专辑接口（targetType=2表示专辑）
    const res = await collectAlbum(id, 2)
    console.log(res)
    // 4. 接口返回失败：恢复数据并提示
    if (!res.success) {
      ElMessage.error(res.errorMsg || '取消收藏失败')
      // 恢复移除的专辑
      if (targetAlbum) {
        albums.value.splice(albumIndex, 0, targetAlbum)
        // 恢复筛选列表
        // 示例：假设你想把 targetAlbum 插入回 filteredAlbums 的原始位置
        const originalIndex = albums.value.findIndex((album) => album.id === targetAlbum.id)
        if (originalIndex !== -1) {
          filteredAlbums.value.splice(originalIndex, 0, targetAlbum)
        }
      }

      return
    }

    // 5. 接口返回成功：更新总数 + 显示提示
    totalAlbums.value = Math.max(0, totalAlbums.value - 1)

    ElMessage.success(res.data?.errorMsg || `已取消收藏《${targetAlbum?.name}》`)
  } catch (error) {
    // 6. 网络异常/其他错误：提示并重新加载数据
    console.error('取消收藏专辑失败:', error)
    ElMessage.error('取消收藏失败，请稍后重试')

    // 重新加载最新的专辑数据（确保数据一致性）
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
</script>

<style scoped>
/* 原有样式不变 */
.error-input :deep(.el-input__inner) {
  border-color: #f56565 !important;
}

.error-input :deep(.el-input__inner:focus) {
  border-color: #f56565 !important;
  box-shadow: 0 0 0 1px rgba(245, 101, 101, 0.2) !important;
}
</style>

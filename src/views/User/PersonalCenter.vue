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
              <el-button size="small" class="text-[#00f0ff] hover:text-white"> 查看全部 </el-button>
            </div>
          </router-link>
        </div>
        <div v-if="loading" class="py-12 text-center">
          <el-skeleton loading animation="wave" :rows="4" />
        </div>
        <div v-else-if="likedSongs.length === 0" class="py-12 text-center">
          <el-empty description="暂无喜欢的歌曲" class="text-gray-500" />
        </div>
        <LikedSongs v-else :likedSongs="likedSongs" />
      </div>
      <!-- 其他原有代码（收藏歌单/创建歌单/收藏专辑） -->
      <div class="flex flex-col md:flex-row gap-20">
        <div class="flex-[3] min-w-[200px]">
          <MusicStatistics />
        </div>
        <div class="flex-[6]">
          <!-- 收藏歌单 -->
          <div class="space-y-6">
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
              <PlaylistSection />
            </div>
            <!-- 创建歌单 -->
            <div>
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center">
                  <img src="../../assets/speaker-16876_256.gif" alt="" class="w-15" />
                  <h3 class="text-white font-semibold text-lg">我创建的歌单</h3>
                </div>
                <el-button
                  type="text"
                  size="small"
                  class="text-[#00f0ff] hover:text-white"
                  @click="isCreateDialogOpen = true"
                >
                  新建歌单
                </el-button>
              </div>
            </div>
          </div>
          <PlaylistSection />

          <!-- 创建歌单弹窗（原有代码） -->
          <div
            v-if="isCreateDialogOpen"
            class="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <!-- 弹窗内容不变 -->
          </div>
        </div>
      </div>

      <!-- 收藏专辑 -->
      <div
        class="collection-albums-page bg-[#080812] text-white font-['Poppins',sans-serif] overflow-x-hidden rounded-2xl"
      >
        <main class="container mx-auto px-4 md:px-8 py-8">
          <div class="mb-8 pb-3">
            <div class="flex items-center justify-between w-full">
              <button
                class="px-6 py-3 rounded-full bg-gradient-to-r text-white text-sm font-medium shadow-xl shadow-[#ec4899]/20 hover:shadow-[#ec4899]/40 transition-all duration-400 transform hover:-translate-y-1 active:scale-95"
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
          <CollectedAlbum
            :albums="filteredAlbums.length ? filteredAlbums : albums"
            @goToAlbumDetail="goToAlbumDetail"
            @playAlbum="playAlbum"
            @toggleCollection="toggleCollection"
            @shareAlbum="shareAlbum"
            @exploreAlbums="exploreAlbums"
          />
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getUserInfo, updateUserInfo } from '@/api/personalCenter/index'
import type {
  MusicVO,
  UserInfoVO,
  UpdateUserInfoParams,
  EditForm,
} from '@/types/personalCenter/index'
const loading = ref(false)
const pagination = reactive({
  pageNum: 1,
  pageSize: 4,
})

// 2. 歌曲列表（类型适配）
// const likedSongs = ref<MusicVO[]>([])
// 原有静态数据
const likedSongs = ref([
  {
    id: 1,
    name: '夏日晚风',
    artist: 'Daystream Music',
    album: '晚风集',
    cover: 'https://picsum.photos/80/80?random=1',
    duration: 237,
    tags: ['超清母带', 'MV'],
    isLiked: true,
  },
  {
    id: 2,
    name: '星光坠落时',
    artist: 'Daystream Music',
    album: '星光合集',
    cover: 'https://picsum.photos/80/80?random=2',
    duration: 198,
    tags: ['VIP', '无损'],
    isLiked: false,
  },
  {
    id: 3,
    name: '城市浪漫',
    artist: 'Daystream Music',
    album: '城市之声',
    cover: 'https://picsum.photos/80/80?random=3',
    duration: 215,
    tags: ['超清母带'],
    isLiked: true,
  },
  {
    id: 4,
    name: '深海回响',
    artist: 'Daystream Music',
    album: '深海秘境',
    cover: 'https://picsum.photos/80/80?random=4',
    duration: 242,
    tags: [],
    isLiked: false,
  },
])

const albums = ref([
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

const likedPlaylists = ref([
  { id: 1, name: '治愈系民谣', cover: 'https://picsum.photos/200/200?random=3', songCount: 24 },
  { id: 2, name: '深夜电子', cover: 'https://picsum.photos/200/200?random=4', songCount: 18 },
  { id: 3, name: '雨天BGM', cover: 'https://picsum.photos/200/200?random=5', songCount: 32 },
])

const createdPlaylists = ref([
  { id: 101, name: '我的私藏列表', cover: 'https://picsum.photos/200/200?random=6', songCount: 32 },
  { id: 102, name: '健身BGM', cover: 'https://picsum.photos/200/200?random=7', songCount: 15 },
  { id: 103, name: '通勤必备', cover: 'https://picsum.photos/200/200?random=8', songCount: 42 },
])

// 搜索相关
const searchKeyword = ref('')
const showSearchSuggestions = ref(false)
const searchHistory = ref<string[]>(['周杰伦', '孤独的海', '小幸运'])
const filteredAlbums = ref([])
const totalAlbums = ref(0)
const notificationRef = ref<HTMLDivElement | null>(null)

// 创建歌单相关
const isCreateDialogOpen = ref(false)
const newPlaylistName = ref('')
const newPlaylistDesc = ref('')
const playlistPrivacy = ref('public')
const newPlaylistCover = ref('')
const isUploading = ref(false)

// 核心：用户信息（从接口加载）
const userInfo = ref<UserInfoVO>({
  isVip: false,
  playCount: 0,
  createdCount: 0,
  followCount: 0,
  fansCount: 0,
  likedCount: 0,
})

// 初始化加载用户信息
onMounted(async () => {
  try {
    // 调用适配后的getUserInfo接口
    const res = await getUserInfo()
    console.log(res)
    // res直接是data部分（因为returnFullResponse=false）
    userInfo.value = {
      ...res.data,
      // 接口字段 → 页面字段映射
      username: res.data.username, // 接口username → 页面name
      introduction: res.data.introduction, // 接口introduction → 页面signature
      followCount: res.data.followCount || 0,
      fansCount: res.data.fansCount || 0,
      likedCount: res.data.likedCount || 0,
    }
    console.log(userInfo.value.lastCheckinTime)
  } catch (error) {
    console.error('加载用户信息失败:', error)
    // 错误提示已在request拦截器中处理，无需重复提示
  }
})

// 处理子组件传递的「修改个人信息」事件
const handleUpdateUserInfo = async (editForm: EditForm) => {
  try {
    // 映射前端表单到接口参数
    const params: UpdateUserInfoParams = {
      username: editForm.name,
      introduction: editForm.signature,
      // 前端gender（男/女/保密）→ 接口integer（1/2/3）
      gender: editForm.gender,
    }

    // 调用修改接口
    const res = await updateUserInfo(params)
    if (res.success) {
      ElMessage.success('个人信息修改成功')
      console.log(res)
      // 更新本地userInfo
      userInfo.value = {
        ...userInfo.value,
        username: editForm.name,
        introduction: editForm.signature,
        gender: editForm.gender,
      }
    }
  } catch (error) {
    console.error('修改个人信息失败:', error)
    // 错误提示已在request拦截器中处理
  }
}

// 处理头像上传成功后的回调
const handleUploadAvatar = async (avatarUrl: string) => {
  userInfo.value.avatar = avatarUrl
  ElMessage.success('头像修改成功')
}

// 处理背景图上传成功后的回调
const handleUploadBg = async (bgUrl: string) => {
  userInfo.value.bgImg = bgUrl
  ElMessage.success('背景图修改成功')
}

// 原有工具方法（不变）
const handleScroll = () => {}
const handleSearchInput = () => {}
const handleBlur = () => {}
const handleSearch = () => {}
const clearSearch = () => {}
const selectSearchHistory = (history: string) => {}
const removeSearchHistory = (index: number) => {}
const selectAlbumSuggestion = (album: any) => {}
const showNotification = (text: string) => {}
const goToAlbumDetail = (id: number) => {}
const playAlbum = (id: number) => {}
const toggleCollection = (id: number) => {}
const shareAlbum = (id: number) => {}
const exploreAlbums = () => {}
const beforeUpload = (file: File) => {
  const isImage = file.type === 'image/jpeg' || file.type === 'image/png'
  if (!isImage) {
    ElMessage.error('仅支持JPG、PNG格式的图片')
    return false
  }
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过2MB')
    return false
  }
  return true
}
const handleUpload = async (options: any) => {
  const file = options.file
  isUploading.value = true
  try {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      newPlaylistCover.value = reader.result as string
      isUploading.value = false
      ElMessage.success('封面上传成功')
    }
  } catch (error) {
    isUploading.value = false
    ElMessage.error('封面上传失败，请重试')
  }
}
const createNewPlaylist = () => {
  const newPlaylist = {
    id: Date.now(),
    name: newPlaylistName.value.trim(),
    cover:
      newPlaylistCover.value ||
      `https://picsum.photos/200/200?random=${Math.floor(Math.random() * 100)}`,
    songCount: 0,
  }
  createdPlaylists.value.unshift(newPlaylist)
  resetAndClose()
  ElMessage.success('歌单创建成功')
}
const resetAndClose = () => {
  newPlaylistName.value = ''
  newPlaylistDesc.value = ''
  newPlaylistCover.value = ''
  playlistPrivacy.value = 'public'
  isUploading.value = false
  isCreateDialogOpen.value = false
}
</script>

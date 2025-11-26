<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-white p-4 md:p-6">
    <div class="max-w-7xl mx-auto space-y-6">
      <UserHeader :userInfo="userInfo" :isOthersPage="false" />

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
              <el-button type="text" size="small" class="text-gray-400 hover:text-white">
                查看全部
              </el-button>
            </div>
          </router-link>
        </div>
        <LikedSongs />
      </div>

      <div class="flex flex-col md:flex-row gap-20">
        <div class="flex-[3] min-w-[200px]">
          <MusicStatistics />
        </div>
        <div class="flex-[6]">
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
          <div
            v-if="isCreateDialogOpen"
            class="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              class="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
              @click="resetAndClose"
            ></div>

            <div
              class="relative z-50 w-full max-w-md bg-[#1E1E1E] rounded-xl shadow-2xl overflow-hidden transform transition-all duration-300 scale-100"
            >
              <div
                class="h-18 w-full bg-[#121212] border-b border-white/10 px-6 py-4 flex justify-between items-center"
              >
                <div class="flex items-center gap-3">
                  <img src="../../assets/logo.jpg" alt="" class="w-10 h-10 rounded-full" />
                  <h2 class="text-xl font-semibold text-white">创建新歌单</h2>
                </div>
                <button
                  class="text-[#8A8A8A] hover:text-white transition-colors"
                  @click="resetAndClose"
                >
                  <i class="iconfont">&#xe69e;</i>
                </button>
              </div>

              <div class="p-6 overflow-y-auto max-h-[calc(85vh-4.5rem)] scrollbar-custom">
                <div class="space-y-6">
                  <div>
                    <label class="text-sm text-[#8A8A8A] block mb-1">歌单封面</label>
                    <div style="display: flex; justify-content: flex-start" class="gap-8">
                      <el-upload
                        class="cover-upload"
                        :show-file-list="false"
                        :before-upload="beforeUpload"
                        :http-request="handleUpload"
                        accept="image/jpeg,image/png"
                      >
                        <div
                          class="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-dashed border-white/10 hover:border-[#FF2E93] transition-colors cursor-pointer bg-[#121212]"
                        >
                          <img
                            v-if="newPlaylistCover"
                            :src="newPlaylistCover"
                            class="w-full h-full object-cover"
                          />
                          <div
                            v-else
                            class="w-full h-full flex flex-col items-center justify-center text-[#8A8A8A]"
                          >
                            <i class="iconfont icon-image-upload" style="font-size: 28px"></i>
                            <span class="text-xs mt-2">点击上传封面图</span>
                            <span class="text-xs">或拖放至此</span>
                          </div>
                          <div
                            v-if="isUploading"
                            class="absolute inset-0 bg-black/60 flex items-center justify-center"
                          >
                            <i
                              class="iconfont icon-loading"
                              style="
                                font-size: 24px;
                                color: white;
                                animation: spin 1s linear infinite;
                              "
                            ></i>
                          </div>
                        </div>
                      </el-upload>
                      <div class="flex justify-center items-center flex-col">
                        <p>点击上传封面</p>
                        <p class="text-[#8A8A8A] text-xs mt-1">
                          支持JPG、PNG格式，建议尺寸200x200px
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label class="block text-sm text-[#8A8A8A] mb-1">歌单名称 *</label>
                    <input
                      type="text"
                      id="nickname"
                      class="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#FF2E93] transition-all"
                      placeholder="输入歌单名称（最多16个字）"
                      maxlength="16"
                      v-model="newPlaylistName"
                    />
                  </div>

                  <div>
                    <label class="block text-sm text-[#8A8A8A] mb-1">歌单描述</label>
                    <textarea
                      id="signature"
                      rows="2"
                      class="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#FF2E93] transition-all"
                      placeholder="添加歌单描述（最多30个字）"
                      maxlength="30"
                      v-model="newPlaylistDesc"
                    ></textarea>
                  </div>

                  <div>
                    <label class="block text-sm text-[#8A8A8A] mb-1">隐私设置</label>
                    <div class="flex gap-6 py-2">
                      <label class="flex items-center gap-2 cursor-pointer text-white">
                        <input
                          type="radio"
                          name="privacy"
                          class="accent-[#FF2E93]"
                          value="public"
                          v-model="playlistPrivacy"
                        />
                        <span>公开（所有人可见）</span>
                      </label>
                      <label class="flex items-center gap-2 cursor-pointer text-white">
                        <input
                          type="radio"
                          name="privacy"
                          class="accent-[#FF2E93]"
                          value="private"
                          v-model="playlistPrivacy"
                        />
                        <span>私有（仅自己可见）</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div class="px-6 py-4 border-t border-white/10 flex justify-end gap-3">
                <button
                  type="button"
                  class="px-6 py-2 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-colors"
                  @click="resetAndClose"
                >
                  取消
                </button>
                <button
                  type="button"
                  class="px-6 py-2 bg-gradient-to-r from-[#e2036f] to-[#b277bb] rounded-lg text-white hover:opacity-90 transition-opacity flex items-center gap-2"
                  @click="createNewPlaylist"
                  :disabled="!newPlaylistName.trim() || isUploading"
                  :class="{
                    'opacity-70 cursor-not-allowed': !newPlaylistName.trim() || isUploading,
                  }"
                >
                  <i class="iconfont icon-plus mr-1" style="font-size: 16px">&#xe619;</i>
                  <span>创建</span>
                </button>
              </div>

              <div
                class="h-1 w-full bg-gradient-to-r from-[#FF2E93] via-[#d46ab5] to-[#b481bc]"
              ></div>
            </div>
          </div>
        </div>
      </div>
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

const userInfo = ref({
  name: '音乐爱好者',
  avatar: 'https://picsum.photos/100/100?random=20',
  signature: '喜欢一切美好的音乐，分享治愈系歌单',
  followCount: 32,
  fansCount: 156,
  likedCount: 248,
  isVip: true,
})
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

const isCreateDialogOpen = ref(false)
const newPlaylistName = ref('')
const newPlaylistDesc = ref('')
const playlistPrivacy = ref('public')
const newPlaylistCover = ref('')
const isUploading = ref(false)

watch(isCreateDialogOpen, (value) => {
  document.body.style.overflow = value ? 'hidden' : ''
})

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
<route lang="yaml">
meta:
  layout: main
</route>

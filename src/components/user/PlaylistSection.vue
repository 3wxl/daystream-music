<template>
  <div class="space-y-6">
    <div>
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-white font-semibold text-lg">我收藏的歌单</h3>
        <el-button type="text" size="small" class="text-gray-400 hover:text-white">
          查看全部
        </el-button>
      </div>
      <div
        class="grid grid-cols-2 sm:grid-cols-auto-fill md:grid-cols-auto-fill lg:grid-cols-auto-fill gap-6"
        style="grid-template-columns: repeat(auto-fill, minmax(180px, 1fr))"
      >
        <div v-for="playlist in likedPlaylists" :key="playlist.id" class="group w-[180px]">
          <div class="relative overflow-hidden rounded-lg mb-2 aspect-square">
            <img
              :src="playlist.cover"
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div
              class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
            >
              <div
                class="w-12 h-12 rounded-full bg-pink-500 flex items-center justify-center transform translate-y-4 group-hover:translate-y-0 transition-transform"
              >
                <i class="iconfont icon-play" style="font-size: 20px; color: white">&#xe623;</i>
              </div>
            </div>
          </div>
          <div
            class="text-white text-sm font-medium line-clamp-1 group-hover:text-pink-400 transition-colors"
          >
            {{ playlist.name }}
          </div>
          <div class="text-gray-500 text-xs mt-1">{{ playlist.songCount }}首歌曲</div>
        </div>
      </div>
    </div>

    <div>
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-white font-semibold text-lg">我创建的歌单</h3>
        <el-button
          type="text"
          size="small"
          class="text-gray-400 hover:text-white"
          @click="isCreateDialogOpen = true"
        >
          新建歌单
        </el-button>
      </div>
      <div
        class="grid grid-cols-2 sm:grid-cols-auto-fill md:grid-cols-auto-fill lg:grid-cols-auto-fill gap-6"
        style="grid-template-columns: repeat(auto-fill, minmax(180px, 1fr))"
      >
        <div v-for="playlist in createdPlaylists" :key="playlist.id" class="group w-[180px]">
          <div class="relative overflow-hidden rounded-lg mb-2 aspect-square">
            <img
              :src="playlist.cover"
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div
              class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
            >
              <div
                class="w-12 h-12 rounded-full bg-pink-500 flex items-center justify-center transform translate-y-4 group-hover:translate-y-0 transition-transform"
              >
                <i class="iconfont icon-play" style="font-size: 20px; color: white">&#xe623;</i>
              </div>
            </div>
          </div>
          <div
            class="text-white text-sm font-medium line-clamp-1 group-hover:text-pink-400 transition-colors"
          >
            {{ playlist.name }}
          </div>
          <div class="text-gray-500 text-xs mt-1">{{ playlist.songCount }}首歌曲</div>
        </div>
      </div>
    </div>

    <div v-if="isCreateDialogOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="fixed inset-0 bg-black/70 backdrop-blur-sm z-40" @click="resetAndClose"></div>

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
          <button class="text-[#8A8A8A] hover:text-white transition-colors" @click="resetAndClose">
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
                        style="font-size: 24px; color: white; animation: spin 1s linear infinite"
                      ></i>
                    </div>
                  </div>
                </el-upload>
                <div class="flex justify-center items-center flex-col">
                  <p>点击上传封面</p>
                  <p class="text-[#8A8A8A] text-xs mt-1">支持JPG、PNG格式，建议尺寸200x200px</p>
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
            :class="{ 'opacity-70 cursor-not-allowed': !newPlaylistName.trim() || isUploading }"
          >
            <i class="iconfont icon-plus mr-1" style="font-size: 16px">&#xe619;</i>
            <span>创建</span>
          </button>
        </div>

        <div class="h-1 w-full bg-gradient-to-r from-[#FF2E93] via-[#d46ab5] to-[#b481bc]"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const likedPlaylists = ref([
  { id: 1, name: '治愈系民谣', cover: 'https://picsum.photos/200/200?random=3', songCount: 24 },
  { id: 2, name: '深夜电子', cover: 'https://picsum.photos/200/200?random=4', songCount: 18 },
  { id: 3, name: '雨天BGM', cover: 'https://picsum.photos/200/200?random=5', songCount: 32 },
  { id: 34, name: '晴天BGM', cover: 'https://picsum.photos/200/200?random=8', songCount: 15 },
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

<style scoped>
::v-deep .el-input__inner {
  background-color: transparent !important;
  border: none !important;
  padding: 0 !important;
  color: white !important;
}

::v-deep .el-textarea__inner {
  background-color: transparent !important;
  border: none !important;
  resize: none !important;
  color: white !important;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.scrollbar-custom::-webkit-scrollbar {
  width: 8px;
}

.scrollbar-custom::-webkit-scrollbar-track {
  background: #2d2d2d;
  border-radius: 4px;
}

.scrollbar-custom::-webkit-scrollbar-thumb {
  background: #555;
  border-radius: 4px;
  transition: background 0.3s;
}

.scrollbar-custom::-webkit-scrollbar-thumb:hover {
  background: #888;
}

.fixed > div:last-child {
  animation: fadeIn 0.3s ease-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.cover-upload ::v-deep .el-upload {
  width: 100%;
}
::v-deep .el-textarea {
  --el-textarea-border-color: transparent !important;
}

::v-deep .el-textarea__wrapper {
  border: none !important;
  box-shadow: 0 0 0 1px transparent !important;
  transition: all 0.3s ease !important;
}

::v-deep .el-textarea__wrapper:hover {
  box-shadow: 0 0 0 1px rgba(255, 46, 147, 0.3) !important;
}

::v-deep .el-textarea:focus-within .el-textarea__wrapper {
  box-shadow:
    0 0 0 2px rgba(255, 46, 147, 0.5),
    0 0 8px rgba(255, 46, 147, 0.2) !important;
  outline: none !important;
}

::v-deep .el-textarea.is-disabled .el-textarea__wrapper {
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.05) !important;
  background-color: #121212 !important;
}
</style>

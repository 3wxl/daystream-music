<template>
  <div class="animate-fade-in">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-semibold">我的歌曲</h2>
      <router-link
        to="/musician/Upload?type=audio"
        class="px-4 py-2 bg-pink-600 hover:bg-pink-700 rounded-lg text-sm font-medium transition-colors"
      >
        上传新歌
      </router-link>
    </div>

    <div v-if="songs.length > 0" class="grid gap-4" v-loading="loading">
      <div
        v-for="song in songs"
        :key="song.id"
        class="flex items-center justify-between p-4 bg-[#111] rounded-xl border border-white/5 hover:border-pink-500/30 transition-all group"
      >
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-lg bg-gray-800 overflow-hidden">
            <img v-if="song.coverUrl" :src="song.coverUrl" class="w-full h-full object-cover" />
            <div v-else class="w-full h-full flex items-center justify-center text-gray-600">
              <i class="fa fa-music"></i>
            </div>
          </div>
          <div>
            <h3 class="font-medium text-white group-hover:text-pink-400 transition-colors">
              {{ song.musicName }}
            </h3>
            <p class="text-xs text-gray-500">
              {{ song.albumName || '单曲' }}
              <span v-if="song.createTime"> · {{ song.createTime.split(' ')[0] }}</span>
            </p>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <el-dropdown trigger="click" @command="handleCommand">
            <span class="p-2 cursor-pointer hover:bg-white/10 rounded-full transition-colors">
              <i class="fa fa-ellipsis-h text-gray-400"></i>
            </span>
            <template #dropdown>
              <el-dropdown-menu class="bg-[#222] border-gray-700">
                <el-dropdown-item :command="{ type: 'album', song }">添加到专辑</el-dropdown-item>
                <el-dropdown-item :command="{ type: 'playlist', song }">添加到歌单</el-dropdown-item>
                <el-dropdown-item :command="{ type: 'delete', song }" divided class="text-red-500">
                  删除
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </div>
    <el-empty v-else-if="!loading" description="暂无上传歌曲" :image-size="100"></el-empty>

    <!-- 歌单选择弹窗 -->
    <el-dialog
      v-model="playlistDialogVisible"
      title="选择要添加到的歌单"
      width="400px"
      class="dark-dialog"
      :append-to-body="true"
    >
      <div class="playlist-selection-list custom-scrollbar max-h-[400px] overflow-y-auto">
        <div
          v-for="item in userPlaylists"
          :key="item.id"
          class="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-white/5 transition-colors border"
          :class="selectedPlaylistId === item.id ? 'border-pink-500 bg-pink-500/10' : 'border-transparent'"
          @click="selectedPlaylistId = item.id"
        >
          <div class="w-12 h-12 rounded bg-gray-800 overflow-hidden flex-shrink-0">
            <img v-if="item.cover" :src="item.cover" class="w-full h-full object-cover" />
            <div v-else class="w-full h-full flex items-center justify-center text-gray-600">
              <i class="fa fa-list"></i>
            </div>
          </div>
          <div class="flex-1 min-w-0">
            <p class="font-medium text-white truncate">{{ item.name }}</p>
            <p class="text-xs text-gray-500 truncate">{{ item.description || '暂无描述' }}</p>
          </div>
        </div>
        <div v-if="userPlaylists.length === 0" class="py-10 text-center text-gray-500">
          <p>暂无创建的歌单</p>
        </div>
      </div>
      <template #footer>
        <div class="flex gap-3 justify-end mt-4">
          <el-button @click="playlistDialogVisible = false">取消</el-button>
          <el-button
            type="primary"
            :disabled="!selectedPlaylistId"
            :loading="submitting"
            @click="submitAddToPlaylist"
            class="!bg-pink-600 !border-pink-600"
          >
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { deleteMusic, getMyMusicList } from '@/api/music'
import { getCreatePlaylists } from '@/api/personalCenter'
import { addSongToPlaylist } from '@/api/playlist'
import { useUserStore } from '@/stores/user'
import { ElMessage, ElMessageBox } from 'element-plus'
import { onMounted, ref } from 'vue'

const userStore = useUserStore()
const songs = ref<any[]>([])
const loading = ref(false)

const fetchSongs = async () => {
  loading.value = true
  try {
    const musicianId = userStore.userInfo.id
    const res = await getMyMusicList(musicianId, 1, 100)
    if (res.success && res.data && res.data.records) {
      // 适配 [[Song]] 二维数组结构
      songs.value = res.data.records.flat()
    }
  } catch (error) {
    console.error('获取歌曲列表失败:', error)
  } finally {
    loading.value = false
  }
}

const playlistDialogVisible = ref(false)
const userPlaylists = ref<any[]>([])
const selectedPlaylistId = ref<string | number | null>(null)
const submitting = ref(false)
const currentMusicId = ref<string | number | null>(null)

const handleCommand = (command: any) => {
  const { type, song } = command
  if (type === 'album') handleAddToAlbum()
  else if (type === 'playlist') showPlaylistDialog(song)
  else if (type === 'delete') handleDelete(song)
}

const handleAddToAlbum = () => {
  ElMessageBox.alert('添加到专辑功能正在火速开发中，敬请期待！', '功能提示', {
    confirmButtonText: '收到',
    type: 'info',
  })
}

const showPlaylistDialog = async (song: any) => {
  currentMusicId.value = song.id
  playlistDialogVisible.value = true
  selectedPlaylistId.value = null

  if (userPlaylists.value.length === 0) {
    let userId = userStore.userInfo.id

    // 如果没有 userId，尝试同步用户信息
    if (!userId) {
      await userStore.getUsersInfo()
      userId = userStore.userInfo.id
    }

    try {
      const res = await getCreatePlaylists({
        pageNum: 1,
        pageSize: 100,
        userId: userId
      })
      if (res.success && res.data && res.data.records) {
        // 关键点：使用 flat() 确保数组是非嵌套的，解决“0行”显示问题
        userPlaylists.value = res.data.records.flat()
      }
    } catch (error) {
      console.error('获取歌单失败:', error)
    }
  }
}

const submitAddToPlaylist = async () => {
  if (!currentMusicId.value || !selectedPlaylistId.value) return
 
  submitting.value = true
  try {
    const res = await addSongToPlaylist({
      playlistId: selectedPlaylistId.value,
      songId: currentMusicId.value,
    })
    if (res.success) {
      ElMessage.success('成功添加到歌单')
      playlistDialogVisible.value = false
    }
  } catch (error) {
    // 错误处理由拦截器负责
  } finally {
    submitting.value = false
  }
}

const handleDelete = (song: any) => {
  ElMessageBox.confirm(`确定要删除歌曲《${song.musicName}》吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    try {
      const res = await deleteMusic(song.id)
      if (res.success) {
        ElMessage.success('删除成功')
        fetchSongs()
      }
    } catch (error) {
      // 错误由拦截器处理
    }
  })
}

onMounted(() => {
  fetchSongs()
})
</script>

<style>
/* 全局样式以适配 append-to-body 的弹窗 */
.dark-dialog {
  background: #1a1b1e !important;
  border: 1px solid #333 !important;
  border-radius: 12px !important;
}

.dark-dialog .el-dialog__title {
  color: white !important;
}

.dark-dialog .el-dialog__header {
  padding-bottom: 20px;
  border-bottom: 1px solid #333;
  margin-right: 0;
}

.dark-dialog .el-dialog__body {
  padding-top: 20px;
  color: #eee;
}

.dark-dialog .el-dialog__footer {
  border-top: 1px solid #333;
  padding-top: 15px;
}

/* 针对弹窗内的文字颜色进行强化 */
.dark-dialog .playlist-selection-list .text-white {
  color: #ffffff !important;
}

.dark-dialog .playlist-selection-list .text-gray-500 {
  color: #999 !important;
}

/* 自定义滚动条样式 */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.2);
}
</style>

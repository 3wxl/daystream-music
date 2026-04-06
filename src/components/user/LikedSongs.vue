<template>
  <!-- 先解析二维数组，取 records[0] 作为歌曲列表 -->
  <div v-if="(likedSongsList || []).length === 0" class="py-12 text-center">
    <el-empty description="空空如也" class="text-gray-500" />
  </div>

  <div class="song-list">
    <div
      v-for="(song, index) in likedSongsList"
      :key="String(song.id)"
      class="relative flex items-center px-5 py-3 hover:bg-gray-800/30 transition-colors group cursor-pointer justify-between"
      :class="{ 'playing-song': playerStore.currentSong && playerStore.currentSong.id === song.id }"
    >
      <div class="flex items-center shrink-0 w-[400px]">
        <div class="w-8 text-center text-gray-400 mr-4">
          <!-- 正在播放时根据播放状态显示播放或暂停图标，否则显示序号 -->
          <template v-if="playerStore.currentSong && playerStore.currentSong.id === song.id">
            <i
              class="iconfont text-pink-500 inline-block animate-pulse"
              :class="{
                'icon-pause': playerStore.isPlaying,
                'icon-play': !playerStore.isPlaying,
              }"
              @click.stop="handleTogglePlay"
            ></i>
          </template>
          <template v-else>
            <span class="inline-block text-gray-400 group-hover:hidden transition-opacity">{{
              index + 1
            }}</span>
            <i
              class="iconfont text-pink-500 hidden group-hover:inline-block transition-opacity icon-play"
              @click.stop="handlePlaySong(song)"
            ></i>
          </template>
        </div>
        <!-- 封面URL补全（若后端返回相对路径，需拼接域名） -->
        <img :src="song.coverUrl" class="w-10 h-10 rounded object-cover shrink-0" alt="歌曲封面" />
        <div class="ml-3 min-w-0 flex-1">
          <div class="flex items-center gap-2 mb-0.5">
            <span
              class="text-white text-sm font-medium group-hover:text-pink-400 transition-colors truncate"
              :class="{
                'playing-song-text':
                  playerStore.currentSong && playerStore.currentSong.id === song.id,
              }"
            >
              {{ song.musicName }}
            </span>
            <!-- 渲染VIP标签（替代原tags逻辑，后端无tags字段） -->
            <template v-if="song.isVip === 1">
              <span
                class="bg-pink-500/20 text-pink-400 border border-pink-500/30 text-xs px-1.5 py-0.25 rounded"
              >
                VIP
              </span>
            </template>
            <!-- 渲染音质信息 -->
            <template v-if="song.audioList && song.audioList.length > 0">
              <span
                v-for="(quality, index) in song.audioList"
                :key="index"
                :class="[
                  'text-xs px-1.5 py-0.25 rounded mr-1 inline-block',
                  quality === '标准'
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : '',
                  quality === '高清'
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    : '',
                  quality === '无损'
                    ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                    : '',
                  quality === '空间音频'
                    ? 'bg-yellow-300/20 text-yellow-200 border border-yellow-300/30'
                    : '',
                ]"
              >
                {{ quality }}
              </span>
            </template>
          </div>
          <div class="text-gray-500 text-xs truncate">
            {{ song.musicianName || '未知歌手' }}
          </div>
        </div>
      </div>

      <div class="flex items-center w-[500px]">
        <div class="flex items-center gap-6 opacity-0 group-hover:opacity-100 transition-opacity">
          <el-tooltip content="下载" placement="top" custom-class="tooltip-small">
            <el-dropdown trigger="hover" @command="handleDownload">
              <el-button
                link
                class="text-gray-400 hover:text-white transition-colors p-0 text-sm"
                style="
                  width: 20px;
                  height: 20px;
                  display: flex;
                  alignment-baseline: center;
                  justify-content: center;
                "
              >
                <i class="iconfont text-sm">&#xe605;</i>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu style="background-color: #2c2c2c">
                  <el-dropdown-item
                    v-for="(quality, index) in song.audioList || []"
                    :key="index"
                    :command="{ songId: song.id, quality: quality }"
                  >
                    {{ quality }}
                  </el-dropdown-item>
                  <el-dropdown-item v-if="!(song.audioList && song.audioList.length > 0)" disabled>
                    暂无下载选项
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </el-tooltip>

          <el-tooltip content="添加到歌单" placement="top">
            <button
              class="flex items-center justify-center w-5 h-5 transition-colors"
              :class="song.isLiked ? 'text-amber-400' : 'text-gray-400 hover:text-amber-400'"
              @click.stop="handleLike(String(song.id))"
            >
              <i class="iconfont text-sm">&#xe6cb;</i>
            </button>
          </el-tooltip>

          <el-tooltip content="评论" placement="top">
            <button
              class="flex items-center justify-center w-5 h-5 text-gray-400 hover:text-white transition-colors"
            >
              <i class="iconfont text-sm">&#xe62c;</i>
            </button>
          </el-tooltip>
          <el-tooltip content="分享" placement="top">
            <button
              class="flex items-center justify-center w-5 h-5 text-gray-400 hover:text-white transition-colors"
            >
              <i class="iconfont text-sm">&#xe64f;</i>
            </button>
          </el-tooltip>
        </div>
        <!-- 专辑名：后端返回的是albumName，且可能为null -->
        <div class="w-[200px] text-gray-500 text-xs text-center">
          {{ song.albumName || '未知专辑' }}
        </div>
      </div>

      <div class="flex items-center gap-3 shrink-0 w-[100px] justify-end">
        <i
          class="iconfont cursor-pointer transition-all text-lg"
          :class="song.isLiked ? 'text-[#FF4D4F]' : 'text-gray-500'"
          @click.stop="handleLike(String(song.id))"
          v-loading="loadingIds.includes(String(song.id))"
          element-loading-text=""
          element-loading-spinner="el-icon-loading"
        >
          &#xe8c3;
        </i>
        <!-- 时长：后端直接返回格式化后的字符串，无需转换 -->
        <div class="text-gray-500 text-xs">
          {{ song.duration }}
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
// 原有导入
import type { MusicVO, LikeRecordResponse } from '@/types/personalCenter'
import { likeRecord } from '@/api/personalCenter'
// 新增：导入播放状态
import { usePlayerStore } from '@/stores/player'
import { ElMessage } from 'element-plus'
// 导入下载音乐API
import { downloadMusic } from '@/api/music/download'

const playerStore = usePlayerStore() // 初始化播放状态

// 原有Props和逻辑不变
interface Props {
  likedSongs: MusicVO[]
}
const props = defineProps<Props>()
const loadingIds = ref<string[]>([])

const likedSongsList = computed(() => {
  return Array.isArray(props.likedSongs) ? props.likedSongs : []
})
console.log('likedSongsList.value', likedSongsList.value)
// 新增：播放歌曲方法
const handlePlaySong = async (song: MusicVO) => {
  try {
    // 调用播放方法，传入当前歌曲和完整
    console.log('当前歌曲信息', song)
    await playerStore.playSong(song, props.likedSongs)
  } catch (error) {
    console.error('播放歌曲失败:', error)
    ElMessage.error('播放失败，请重试')
  }
}

// 新增：处理播放/暂停切换
const handleTogglePlay = () => {
  playerStore.togglePlay()
}
watch(
  () => props.likedSongs,
  (newVal) => {
    console.log('子组件监听：likedSongs 最新值', newVal)
    console.log('解析后的歌曲列表（可渲染）', likedSongsList.value)
  },
  { deep: true, immediate: true },
)

onMounted(async () => {
  await nextTick()
})

const handleLike = async (songId: string) => {
  if (loadingIds.value.includes(songId)) return
  loadingIds.value.push(songId)

  try {
    console.log('mounted 解析后列表', likedSongsList.value)
    const song = likedSongsList.value.find((item) => String(item.id) === songId)
    if (!song) {
      ElMessage.warning('未找到该歌曲')
      return
    }

    const res = await likeRecord({
      targetId: songId,
      targetType: 1,
    })
    console.log(res)

    if (res.success) {
      // 使用类型断言或进行字段名转换
      const data = res.data as any
      song.isLiked = data.islike ? 1 : 0 // 注意：使用小写的 islike

      // 使用小写的 likecount
      if (data.likecount !== undefined) {
        song.likeCount = data.likecount
      }

      ElMessage.success(data.msg || (data.islike ? '点赞成功' : '取消点赞成功'))
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

// 音质映射表
const qualityMap = {
  标准: 1,
  高清: 2,
  无损: 3,
  空间音频: 4,
}

const mimeTypeMap = {
  标准: 'audio/mpeg',
  高清: 'audio/mpeg',
  无损: 'audio/flac',
  空间音频: 'audio/mpeg',
}

const downloading = ref(false)

// 处理下载操作
const handleDownload = async (command: { songId: number; quality: string }) => {
  if (downloading.value) return
  downloading.value = true
  try {
    console.log('下载歌曲:', command.songId, '音质:', command.quality)

    // 映射音质名称到quality值
    const qualityValue = qualityMap[command.quality] || 1
    console.log('映射后的quality值:', qualityValue)

    // 调用下载API
    console.log('开始调用下载API')

    ElMessage.success(`开始下载 ${command.quality} 音质的歌曲`)
    const response = await downloadMusic(String(command.songId), qualityValue)
    console.log('下载响应:', response)
    ElMessage.success(`正在下载 ${command.quality} 音质的歌曲,请耐心等待...`)
    // 检查响应类型
    const contentType = response.headers['content-type'] || response.headers['Content-Type']
    console.log('响应类型:', contentType)
    console.log('响应大小:', response.data.size)

    // 处理响应
    if (contentType.includes('application/json')) {
      // 如果是JSON，尝试解析错误信息
      const text = await response.data.text()
      try {
        const errorData = JSON.parse(text)
        console.error('下载失败:', errorData)
        ElMessage.error(errorData.errorMsg || '下载失败，请重试')
      } catch (e) {
        console.error('下载失败，无法解析错误信息:', text)
        ElMessage.error('下载失败，请重试')
      }
    } else {
      // 处理二进制流文件下载
      const blob = response.data
      const url = window.URL.createObjectURL(blob)

      // 创建下载链接
      const link = document.createElement('a')
      link.href = url

      // 设置文件名（使用歌曲名称和音质）
      const song = likedSongsList.value.find((item) => item.id === command.songId)
      if (!song) {
        ElMessage.warning('未找到该歌曲')
        return
      }
      const fileName = `${song.musicName || '未知歌曲'}-${command.quality}.${contentType.includes('flac') ? 'flac' : 'mp3'}`
      link.download = fileName

      // 触发下载
      document.body.appendChild(link)
      link.click()

      // 清理
      setTimeout(() => {
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
      }, 100)
    }
  } catch (error) {
    console.error('下载歌曲失败:', error)
    ElMessage.error('下载失败，请重试')
  } finally {
    downloading.value = false
  }
}
</script>
<style lang="scss" scoped>
::v-deep .text-\[\#FF4D4F\] {
  text-shadow: 0 0 6px rgba(255, 77, 79, 0.4);
}

button.text-amber-400,
button.hover\:text-amber-400:hover {
  transform: scale(1.1);
}

.iconfont.hover\:text-\[\#FF4D4F\]:hover {
  transform: scale(1.1);
}

// 补充封面加载失败的样式
img[alt='歌曲封面']:error {
  content: '';
  background: #333;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
}

// 正在播放歌曲的样式
.playing-song {
  background-color: rgba(231, 79, 160, 0.1) !important;
  border-left: 3px solid #e74fa0;
}

.playing-song-text {
  color: #e74fa0 !important;
  font-weight: 600;
}

// 播放图标的动画效果
.animate-pulse {
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.05);
  }
}
::v-deep .el-dropdown-menu {
  background-color: #2c2c2c !important; // 菜单背景色（深色系示例）
  border: 1px solid #444 !important; // 菜单边框色
  border-radius: 6px !important; // 菜单圆角
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important; // 阴影（可选）
}

// 2. 下拉菜单项默认样式（字体色、内边距）
::v-deep .el-dropdown-menu__item {
  color: #f5f5f5 !important; // 菜单项字体色（浅白色）
  padding: 8px 16px !important; // 菜单项内边距（调整高度）
  font-size: 12px !important; // 字体大小
}

// 3. 菜单项 hover 样式（鼠标悬浮时）
::v-deep .el-dropdown-menu__item:hover {
  background-color: rgba(128, 128, 128, 0.2) !important; // hover 背景色（粉色系，和你项目风格统一）
  color: #ffffff !important; // hover 字体色
}

// 4. 禁用状态的菜单项（比如「暂无下载选项」）
::v-deep .el-dropdown-menu__item.is-disabled {
  color: #888888 !important; // 禁用字体色（灰色）
  background-color: transparent !important; // 禁用背景色（透明）
}
</style>

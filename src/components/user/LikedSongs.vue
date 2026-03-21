<template>
  <!-- 先解析二维数组，取 records[0] 作为歌曲列表 -->
  <div v-if="(likedSongsList || []).length === 0" class="py-12 text-center">
    <el-empty description="空空如也" class="text-gray-500" />
  </div>

  <div class="song-list">
    <div
      v-for="(song, index) in likedSongsList"
      :key="song.id"
      class="relative flex items-center px-5 py-3 hover:bg-gray-800/30 transition-colors group cursor-pointer justify-between"
      :class="{ 'playing-song': playerStore.currentSong && playerStore.currentSong.id === song.id }"
    >
      <div class="flex items-center shrink-0 w-[280px]">
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
        <div class="ml-3 min-w-0">
          <div class="flex items-center gap-2 mb-0.5">
            <span
              class="text-white text-sm font-medium group-hover:text-pink-400 transition-colors truncate max-w-[150px]"
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
          </div>
          <div class="text-gray-500 text-xs truncate">
            {{ song.musicianName || '未知歌手' }}
          </div>
        </div>
      </div>

      <div class="flex items-center w-[500px]">
        <div class="flex items-center gap-6 opacity-0 group-hover:opacity-100 transition-opacity">
          <el-tooltip content="下载" placement="top" custom-class="tooltip-small">
            <el-button
              type="text"
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
          </el-tooltip>

          <el-tooltip content="添加到歌单" placement="top">
            <button
              class="flex items-center justify-center w-5 h-5 transition-colors"
              :class="song.isLiked ? 'text-amber-400' : 'text-gray-400 hover:text-amber-400'"
              @click.stop="handleLike(Number(song.id))"
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

// 新增：播放歌曲方法
const handlePlaySong = async (song: MusicVO) => {
  try {
    // 调用播放方法，传入当前歌曲和完整播放列表
    console.log(song.isLiked)
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
</style>

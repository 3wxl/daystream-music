<template>
  <div
    class="fixed bottom-0 left-0 right-0 duration-400 h-[92px] border-t border-pink-400/10 bg-gradient-to-t from-[#0f0f15] via-[#0f0f15]/95 to-transparent backdrop-blur-xl p-3 z-40"
    :class="{ 'adminColor': isAdmin ,'closeStatus':isClose}"
  >
    <div class="container mx-auto px-4 relative">
      <div v-if="isAdmin" class="-top-[22px] w-[100%] flex justify-center absolute">
        <span @click="isClose=!isClose" class="bg-gray-400/60 cursor-pointer px-3 py-[0px] rounded-[24px] ">
          <IconFontSymbol class="text-white" name="lujing"></IconFontSymbol>
        </span>
      </div>
      <!-- 进度条 -->
      <div class="flex items-center gap-3 mb-3">
        <!-- 直接使用 store 中定义的 formatTime 方法 -->
        <span class="text-xs text-pink-400 w-11 text-right">{{
          playerStore.formatTime(playerStore.progress)
        }}</span>
        <div
          class="flex-1 h-1 rounded-full bg-pink-500/10 overflow-hidden group cursor-pointer relative"
          @click="handleProgressClick($event)"
          ref="progressBar"
        >
          <div
            class="h-full bg-gradient-to-r from-pink-400 to-pink-300 rounded-full transition-all duration-300"
            :style="{ width: playerStore.progressPercentage + '%' }"
          ></div>
          <div
            class="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-[0_0_8px_#f472b6] opacity-0 group-hover:opacity-100 transition-opacity"
            :style="{
              left: playerStore.progressPercentage + '%',
              transform: 'translate(-50%, -50%)',
            }"
          ></div>
        </div>
        <span class="text-xs text-pink-300 w-10">{{
          playerStore.currentSong?.duration || '00:00'
        }}</span>
      </div>
      <!-- 控制区域 -->
      <div class="flex items-center justify-between flex-wrap gap-3">
        <!-- 左侧歌曲信息 -->
        <div class="flex items-center gap-3 flex-shrink-0">
          <div class="relative group">
            <img
              :src="playerStore.currentSong?.coverUrl"
              alt="歌曲封面"
              class="w-10 h-10 rounded-lg object-cover border border-pink-400/20 group-hover:border-pink-400 transition-colors cursor-pointer"
              @click="openPlayDetail"
            />
            <div
              v-if="playerStore.isPlaying"
              class="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-gradient-to-r from-pink-400 to-pink-300 animate-pulse"
            ></div>
          </div>
          <div class="min-w-0">
            <h3
              class="text-sm font-medium text-pink-100 hover:text-pink-400 transition-colors cursor-pointer truncate"
              @click="openPlayDetail"
            >
              {{ playerStore.currentSong?.musicName || '未知歌曲' }}
            </h3>
            <p
              class="text-xs text-pink-300/80 hover:text-pink-400 transition-colors cursor-pointer truncate"
              @click="openPlayDetail"
            >
              {{ playerStore.currentSong?.musicianName || '未知歌手' }}
            </p>
          </div>
          <button
            @click="playerStore.toggleLike"
            class="w-6 h-6 rounded-full flex items-center justify-center hover:bg-pink-500/10 transition-colors flex-shrink-0"
          >
            <i
              :class="
                playerStore.isLiked
                  ? 'iconfont icon-like-filled text-pink-400 text-xs'
                  : 'iconfont icon-like text-pink-300/80 hover:text-pink-400 text-xs'
              "
            ></i>
          </button>
        </div>

        <!-- 中间控制按钮 -->
        <div class="flex items-center gap-4 flex-shrink-0">
          <button
            @click="playerStore.toggleShuffle"
            :class="[
              'w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300',
              playerStore.shuffle
                ? 'bg-pink-500/20 text-pink-400'
                : 'text-pink-300/80 hover:text-pink-400 hover:bg-pink-500/10',
            ]"
          >
            <i class="iconfont text-sm">&#xe641;</i>
          </button>
          <button
            @click="playerStore.playPrevSong"
            class="w-8 h-8 rounded-full flex items-center justify-center text-pink-300/80 hover:text-pink-100 hover:bg-pink-500/10 transition-all duration-300"
          >
            <i class="iconfont text-base">&#xe622;</i>
          </button>
          <button
            @click="playerStore.togglePlay"
            class="w-10 h-10 rounded-full bg-gradient-to-r from-pink-400 to-pink-300 flex items-center justify-center shadow-[0_0_20px_rgba(244,114,182,0.4)] hover:shadow-[0_0_30px_rgba(244,114,182,0.6)] transition-all duration-300 active:scale-95"
          >
            <i
              :class="
                playerStore.isPlaying
                  ? 'iconfont icon-pause text-white text-base'
                  : 'iconfont icon-play text-white text-base ml-0.5'
              "
            ></i>
          </button>
          <button
            @click="playerStore.playNextSong"
            class="w-8 h-8 rounded-full flex items-center justify-center text-pink-300/80 hover:text-pink-100 hover:bg-pink-500/10 transition-all duration-300"
          >
            <i class="iconfont text-base">&#xe632;</i>
          </button>
          <button
            @click="playerStore.toggleLoop"
            :class="[
              'w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300',
              playerStore.loop
                ? 'bg-pink-400/20 text-pink-300'
                : 'text-pink-300/80 hover:text-pink-300 hover:bg-pink-400/10',
            ]"
          >
            <i class="iconfont text-sm">&#xe644;</i>
          </button>
        </div>

        <!-- 右侧音量控制和音质选择 -->
        <div class="flex items-center gap-3 flex-shrink-0">
          <!-- 音质选择 -->
          <div class="relative group">
            <button
              class="px-3 py-1 rounded-full text-xs text-pink-300/80 hover:text-pink-400 hover:bg-pink-500/10 transition-colors flex items-center gap-1"
            >
              <span>{{ currentQuality || '标准' }}</span>
              <i class="iconfont text-xs">▼</i>
            </button>
            <!-- 音质选项下拉菜单 -->
            <div
              class="absolute bottom-full right-0 mb-2 w-24 bg-gray-800/95 backdrop-blur-sm rounded-lg border border-pink-400/20 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50"
            >
              <div
                v-for="quality in qualityOptions"
                :key="quality"
                class="px-3 py-2 text-xs text-pink-300/80 hover:bg-pink-500/10 hover:text-pink-400 cursor-pointer transition-colors"
                @click="switchQuality(quality)"
              >
                {{ quality }}
              </div>
            </div>
          </div>

          <button
            @click="playerStore.toggleMute"
            class="w-8 h-8 rounded-full flex items-center justify-center text-pink-300/80 hover:text-pink-400 transition-colors flex-shrink-0"
          >
            <i
              :class="
                playerStore.muted
                  ? 'iconfont icon-volume-off text-xs'
                  : 'iconfont icon-volume text-xs'
              "
            ></i>
          </button>
          <div
            class="w-20 h-1 rounded-full bg-pink-500/10 overflow-hidden group cursor-pointer"
            @click="handleVolumeClick($event)"
            ref="volumeBar"
          >
            <div
              class="h-full bg-gradient-to-r from-pink-400 to-pink-300 rounded-full transition-all duration-300"
              :style="{ width: playerStore.volume + '%' }"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, nextTick, computed } from 'vue'
import { useRouter } from 'vue-router'
import { usePlayerStore } from '@/stores/player'
import { getMusicPlayUrl } from '@/api/music'

const props = defineProps<{
  isAdmin:{
    type: Boolean,
    default: false
  }
}>()

const isClose = ref(false);
const router = useRouter()
const playerStore = usePlayerStore()

const progressBar = ref<HTMLDivElement | null>(null)
const volumeBar = ref<HTMLDivElement | null>(null)

// 音质选项 - 从当前播放歌曲中获取
const qualityOptions = computed(() => {
  return playerStore.currentSong?.audioList || []
})

// 当前音质 - 从当前播放歌曲中获取
const currentQuality = computed(() => {
  return playerStore.currentQuality
})

// 音质映射函数
const mapQuality = (quality: string): number => {
  switch (quality) {
    case '空间音频':
      return 4
    case '无损':
      return 3
    case '高清':
      return 2
    case '标准':
    default:
      return 1
  }
}

// 切换音质
const switchQuality = async (quality: string) => {
  playerStore.currentQuality = quality
  console.log('切换音质为:', quality)

  // 如果当前有歌曲在播放，重新加载对应音质的版本
  if (playerStore.currentSong) {
    try {
      // 获取当前歌曲信息
      const currentSong = playerStore.currentSong

      // 重新获取对应音质的播放链接
      const res = await getMusicPlayUrl({
        musicId: String(currentSong.id),
        quality: mapQuality(quality),
      })

      if (res && res.success && res.data?.audioUrl) {
        // 更新音频源
        if (playerStore.audioInstance) {
          const audio = playerStore.audioInstance
          const currentTime = audio.currentTime

          // 暂停并更新音频源
          audio.pause()
          audio.src = res.data.audioUrl

          // 等待音频加载
          await new Promise<void>((resolve, reject) => {
            const onLoaded = () => {
              audio.removeEventListener('canplaythrough', onLoaded)
              audio.removeEventListener('error', onError)
              resolve()
            }

            const onError = () => {
              audio.removeEventListener('canplaythrough', onLoaded)
              audio.removeEventListener('error', onError)
              reject(new Error('音频加载失败'))
            }

            audio.addEventListener('canplaythrough', onLoaded)
            audio.addEventListener('error', onError)
          })

          // 恢复播放进度
          audio.currentTime = currentTime

          // 如果之前在播放，继续播放
          if (playerStore.isPlaying) {
            await audio.play()
          }

          // 更新currentSong的音频链接
          playerStore.currentSong.audioUrl = res.data.audioUrl

          console.log('音质切换成功')
        }
      }
    } catch (error) {
      console.error('切换音质失败:', error)
    }
  }
}

// 修复：DOM 引用初始化
onMounted(() => {
  // 确保DOM渲染完成后获取引用
  nextTick(() => {
    console.log('Progress bar ref:', progressBar.value)
    console.log('Volume bar ref:', volumeBar.value)
  })
})

const openPlayDetail = () => {
  if (playerStore.currentSong) {
    router.push({ path: `/music-player/${playerStore.currentSong.id}` })
  } else {
    router.push({ path: '/music-player' })
  }
}

// 修复：进度条点击事件（边界值 + 容错）
const handleProgressClick = (e: MouseEvent) => {
  if (!progressBar.value || !playerStore.currentSong) return

  const target = e.target as HTMLElement
  // 找到真正的进度条容器（兼容点击子元素）
  const rect = progressBar.value.getBoundingClientRect()
  if (rect.width <= 0) return // 容错

  const clickX = e.clientX - rect.left
  const percentage = Math.max(0, Math.min(100, (clickX / rect.width) * 100))
  playerStore.setProgress(percentage)
}

// 修复：音量条点击事件（边界值 + 容错）
const handleVolumeClick = (e: MouseEvent) => {
  if (!volumeBar.value) return

  const rect = volumeBar.value.getBoundingClientRect()
  if (rect.width <= 0) return

  const clickX = e.clientX - rect.left
  const newVolume = Math.max(0, Math.min(100, (clickX / rect.width) * 100))
  playerStore.setVolume(newVolume)
}
</script>

<style scoped lang="scss">
  .adminColor{
    background-image:linear-gradient(to top,rgb(119, 80, 116),rgb(99, 80, 119));
  }
  .closeStatus{
    height: 0px;
    transition: all 0.5s ease;
    padding: 0;
  }
</style>

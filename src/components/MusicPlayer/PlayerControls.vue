<template>
  <div
    class="fixed bottom-0 left-0 right-0 border-t border-pink-400/10 bg-gradient-to-t from-[#0f0f15] via-[#0f0f15]/95 to-transparent backdrop-blur-xl p-3 z-40"
  >
    <div class="container mx-auto px-4">
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

        <!-- 右侧音量控制 -->
        <div class="flex items-center gap-2 flex-shrink-0">
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
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { usePlayerStore } from '@/stores/player'

const router = useRouter()
const playerStore = usePlayerStore()

const progressBar = ref<HTMLDivElement | null>(null)
const volumeBar = ref<HTMLDivElement | null>(null)

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

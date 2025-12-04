<template>
  <div
    class="fixed bottom-0 left-0 right-0 border-t border-pink-400/10 bg-gradient-to-t from-[#0f0f15] via-[#0f0f15]/95 to-transparent backdrop-blur-xl p-3 z-40"
  >
    <div class="container mx-auto px-4">
      <!-- 进度条 -->
      <div class="flex items-center gap-3 mb-3">
        <span class="text-xs text-pink-400 w-10 text-right">{{ formatTime(progress) }}</span>
        <div
          class="flex-1 h-1 rounded-full bg-pink-500/10 overflow-hidden group cursor-pointer relative"
          @click="$emit('handle-progress-click', $event)"
          ref="progressBar"
        >
          <div
            class="h-full bg-gradient-to-r from-pink-400 to-pink-300 rounded-full transition-all duration-300"
            :style="{ width: progressPercentage + '%' }"
          ></div>
          <div
            class="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-[0_0_8px_#f472b6] opacity-0 group-hover:opacity-100 transition-opacity"
            :style="{ left: progressPercentage + '%', transform: 'translate(-50%, -50%)' }"
          ></div>
        </div>
        <span class="text-xs text-pink-300 w-10">03:24</span>
      </div>

      <!-- 控制区域 -->
      <div class="flex items-center justify-between flex-wrap gap-3">
        <!-- 左侧歌曲信息 -->
        <div class="flex items-center gap-3 flex-shrink-0">
          <div class="relative group">
            <img
              src="https://i.pixiv.cat/img-original/img/2018/08/20/00/00/00/63450144_p0_square1200.jpg"
              alt="歌曲封面"
              class="w-10 h-10 rounded-lg object-cover border border-pink-400/20 group-hover:border-pink-400 transition-colors cursor-pointer"
              @click="$emit('toggle-play')"
            />
            <div
              v-if="isPlaying"
              class="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-gradient-to-r from-pink-400 to-pink-300 animate-pulse"
            ></div>
          </div>
          <div class="min-w-0">
            <h3
              class="text-sm font-medium text-pink-100 hover:text-pink-400 transition-colors cursor-pointer truncate"
            >
              You
            </h3>
            <p
              class="text-xs text-pink-300/80 hover:text-pink-400 transition-colors cursor-pointer truncate"
            >
              千坂 / N2V
            </p>
          </div>
          <button
            @click="$emit('toggle-like')"
            class="w-6 h-6 rounded-full flex items-center justify-center hover:bg-pink-500/10 transition-colors flex-shrink-0"
          >
            <i
              :class="
                isLiked
                  ? 'iconfont icon-like-filled text-pink-400 text-xs'
                  : 'iconfont icon-like text-pink-300/80 hover:text-pink-400 text-xs'
              "
            ></i>
          </button>
        </div>

        <!-- 中间控制按钮 -->
        <div class="flex items-center gap-4 flex-shrink-0">
          <button
            @click="$emit('toggle-shuffle')"
            :class="[
              'w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300',
              shuffle
                ? 'bg-pink-500/20 text-pink-400'
                : 'text-pink-300/80 hover:text-pink-400 hover:bg-pink-500/10',
            ]"
          >
            <i class="iconfont icon-shuffle text-sm"></i>
          </button>
          <button
            @click="$emit('prev-song')"
            class="w-8 h-8 rounded-full flex items-center justify-center text-pink-300/80 hover:text-pink-100 hover:bg-pink-500/10 transition-all duration-300"
          >
            <i class="iconfont icon-prev text-base"></i>
          </button>
          <button
            @click="$emit('toggle-play')"
            class="w-10 h-10 rounded-full bg-gradient-to-r from-pink-400 to-pink-300 flex items-center justify-center shadow-[0_0_20px_rgba(244,114,182,0.4)] hover:shadow-[0_0_30px_rgba(244,114,182,0.6)] transition-all duration-300 active:scale-95"
          >
            <i
              :class="
                isPlaying
                  ? 'iconfont icon-pause text-white text-base'
                  : 'iconfont icon-play text-white text-base ml-0.5'
              "
            ></i>
          </button>
          <button
            @click="$emit('next-song')"
            class="w-8 h-8 rounded-full flex items-center justify-center text-pink-300/80 hover:text-pink-100 hover:bg-pink-500/10 transition-all duration-300"
          >
            <i class="iconfont icon-next text-base"></i>
          </button>
          <button
            @click="$emit('toggle-loop')"
            :class="[
              'w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300',
              loop
                ? 'bg-pink-400/20 text-pink-300'
                : 'text-pink-300/80 hover:text-pink-300 hover:bg-pink-400/10',
            ]"
          >
            <i class="iconfont icon-repeat text-sm"></i>
          </button>
        </div>

        <!-- 右侧音量控制 -->
        <div class="flex items-center gap-2 flex-shrink-0">
          <button
            @click="$emit('toggle-mute')"
            class="w-8 h-8 rounded-full flex items-center justify-center text-pink-300/80 hover:text-pink-400 transition-colors flex-shrink-0"
          >
            <i
              :class="muted ? 'iconfont icon-volume-off text-xs' : 'iconfont icon-volume text-xs'"
            ></i>
          </button>
          <div
            class="w-20 h-1 rounded-full bg-pink-500/10 overflow-hidden group cursor-pointer"
            @click="$emit('handle-volume-click', $event)"
            ref="volumeBar"
          >
            <div
              class="h-full bg-gradient-to-r from-pink-400 to-pink-300 rounded-full transition-all duration-300"
              :style="{ width: volume + '%' }"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  isPlaying: {
    type: Boolean,
    default: false,
  },
  progress: {
    type: Number,
    default: 0,
  },
  volume: {
    type: Number,
    default: 80,
  },
  shuffle: {
    type: Boolean,
    default: false,
  },
  loop: {
    type: Boolean,
    default: false,
  },
  muted: {
    type: Boolean,
    default: false,
  },
  isLiked: {
    type: Boolean,
    default: false,
  },
  progressPercentage: {
    type: Number,
    default: 0,
  },
  formatTime: {
    type: Function,
    default: (seconds) => {
      const min = Math.floor(seconds / 60)
      const sec = Math.floor(seconds % 60)
      return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`
    },
  },
})

defineEmits([
  'toggle-play',
  'toggle-like',
  'toggle-shuffle',
  'toggle-loop',
  'toggle-mute',
  'prev-song',
  'next-song',
  'handle-progress-click',
  'handle-volume-click',
])
</script>

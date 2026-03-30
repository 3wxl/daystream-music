<template>
  <div class="relative w-full max-w-md">
    <!-- 黑胶唱片容器 - 可点击播放暂停 -->
    <div
      @click="$emit('toggle-play')"
      class="relative w-64 h-64 md:w-80 md:h-80 mx-auto cursor-pointer hover:scale-[1.02] transition-transform duration-300"
    >
      <!-- 唱片外圈光晕 -->
      <div
        class="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500/10 via-pink-400/5 to-pink-500/10 animate-pulse"
      ></div>

      <!-- 唱片本体 -->
      <div
        class="absolute inset-4 md:ins-6 rounded-full bg-gradient-to-br from-gray-900 to-black border-8 border-pink-500/20 shadow-[0_0_40px_rgba(244,114,182,0.3)] transition-all duration-700"
        :class="{
          'animate-spin': isPlaying,
          'opacity-90': !isPlaying,
        }"
        style="animation-duration: 10s"
      >
        <!-- 唱片纹理 -->
        <div class="absolute inset-0 rounded-full overflow-hidden">
          <div
            class="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
          ></div>
          <div
            class="absolute inset-0"
            style="
              background-image: radial-gradient(circle, transparent 30%, rgba(0, 0, 0, 0.5) 70%);
            "
          ></div>
        </div>

        <!-- 唱片中心圆 -->
        <div
          class="absolute top-1/2 left-1/2 w-12 h-12 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center shadow-inner"
        >
          <div class="w-4 h-4 rounded-full bg-black/80"></div>
        </div>

        <!-- 歌曲封面 -->
        <div
          class="absolute top-1/2 left-1/2 w-48 h-48 -translate-x-1/2 -translate-y-1/2 rounded-full overflow-hidden border-4 border-pink-400/30"
        >
          <img
            :src="coverUrl"
            :alt="musicName"
            class="w-full h-full object-cover transition-transform duration-700"
            :class="{ 'scale-105': isPlaying }"
          />
          <div
            v-if="!coverUrl"
            class="w-full h-full bg-gradient-to-br from-pink-500/30 to-purple-500/30 flex items-center justify-center"
          >
            <i class="iconfont icon-music text-4xl text-white/70">&#xe61f;</i>
          </div>
        </div>
      </div>

      <!-- 唱针 -->
      <div
        class="absolute top-0 left-1/2 w-32 origin-top-left transition-transform duration-700 z-10"
        :class="isPlaying ? 'rotate-15' : 'rotate-0'"
      >
        <div class="relative">
          <!-- 唱臂 -->
          <div class="w-32 h-1 bg-gradient-to-r from-gray-700 to-gray-900 rounded-full"></div>
          <!-- 唱头 -->
          <div
            class="absolute -right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center"
          >
            <div class="w-3 h-3 rounded-full bg-black/80"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 歌曲信息 -->
    <div class="text-center mt-8 space-y-2">
      <h2 class="text-lg font-bold text-white truncate px-4">
        {{ musicName || '未知歌曲' }}
      </h2>
      <p class="text-sm text-pink-300/80 truncate px-4">
        {{ artistName || '未知歌手' }}
      </p>
    </div>

    <!-- 播放控制提示（可选保留，改为更小的指示器） -->
    <div class="text-center mt-4 opacity-60 text-sm">点击唱片播放/暂停</div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  isPlaying: {
    type: Boolean,
    default: false,
  },
  coverUrl: {
    type: String,
    default: '',
  },
  musicName: {
    type: String,
    default: '',
  },
  artistName: {
    type: String,
    default: '',
  },
})

defineEmits(['toggle-play'])
</script>

<style scoped>
.rotate-15 {
  transform: rotate(15deg);
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 10s linear infinite;
}
</style>

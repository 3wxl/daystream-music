<template>
  <div
    class="carousel-item group relative rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 ease-out w-[320px] md:w-[360px] flex-shrink-0 h-[340px] opacity-90"
    @mouseenter="handleHoverEnter"
    @mouseleave="handleHoverLeave"
    @click="handlePlayChart"
    :class="{
      'h-[380px] scale-105 z-10 shadow-2xl shadow-pink-500/20 active-chart': isHovered,
    }"
  >
    <!-- 背景图 -->
    <div class="absolute inset-0">
      <img
        :src="getChartImage(chart)"
        :alt="chart.title"
        class="w-full h-full object-cover transition-transform duration-700"
        :class="{ 'scale-110': isHovered }"
      />
      <div
        class="absolute inset-0"
        :class="chart.gradientClass || 'bg-gradient-to-br from-pink-600/70 to-pink-500/70'"
      ></div>
      <div class="album-overlay" :class="{ 'opacity-80': isHovered }"></div>
    </div>

    <!-- 主要内容 -->
    <div class="relative z-10 p-5 h-full flex flex-col justify-between">
      <!-- 榜单信息 -->
      <div class="flex items-start justify-between">
        <div class="flex-1 min-w-0">
          <h3 class="text-xl font-bold mb-2 transition-all duration-300 truncate">
            {{ chart.title }}
          </h3>
          <p class="text-white/80 text-sm mb-1 truncate">{{ chart.subtitle }}</p>
          <div class="flex items-center gap-1 text-xs text-white/70">
            <i class="fa fa-clock-o animate-spin-slow"></i>
            <span>{{ chart.updateTime }}</span>
          </div>
        </div>
        <span class="text-xs glass-effect px-2 py-1 rounded-full ml-2 flex-shrink-0">
          {{ chart.songCount }}
        </span>
      </div>

      <!-- 展开时的歌曲列表 -->
      <div
        v-if="isHovered"
        class="mt-3 space-y-2 animate-fade-in-up flex-1 overflow-y-auto max-h-[150px] custom-scrollbar"
      >
        <div
          v-for="(song, songIndex) in chart.topSongs"
          :key="songIndex"
          class="flex items-center p-2 rounded-xl glass-effect border border-white/20 transition-all duration-300 hover:bg-white/20"
        >
          <div
            class="w-6 h-6 rounded-full glass-effect flex items-center justify-center text-xs font-bold mr-2 flex-shrink-0"
          >
            {{ songIndex + 1 }}
          </div>
          <div class="flex-1 min-w-0">
            <h4 class="font-semibold text-xs truncate">{{ song.title }}</h4>
            <p class="text-white/60 text-xs truncate">{{ song.artist }}</p>
          </div>
          <button
            class="w-6 h-6 rounded-full glass-effect flex items-center justify-center transition-all duration-300 hover:bg-white/30 hover:scale-110 flex-shrink-0 ml-2"
            @click.stop="handlePlaySong(song)"
          >
            <i class="iconfont text-xs">&#xe623;</i>
          </button>
        </div>
      </div>

      <!-- 播放按钮 -->
      <div class="flex justify-end mt-2">
        <button
          class="w-12 h-12 rounded-2xl glass-effect flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-white/20 hover:shadow-lg hover:shadow-white/20"
          :class="{ 'scale-110 bg-white/30': isHovered }"
          @click.stop="handlePlayChart"
        >
          <i
            class="iconfont text-white text-sm transition-transform duration-200"
            :class="{ 'scale-110': isHovered }"
            >&#xe623;</i
          >
        </button>
      </div>
    </div>

    <!-- 悬停光晕效果 -->
    <div
      class="absolute inset-0 rounded-3xl border-2 border-transparent transition-all duration-500 pointer-events-none"
      :class="{ 'border-white/40 shadow-2xl shadow-pink-500/30': isHovered }"
    ></div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue'

// 接收父组件参数
const props = defineProps({
  chart: {
    type: Object,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
})

// 向父组件传递事件
const emit = defineEmits(['hover-enter', 'hover-leave', 'play-chart', 'play-song'])

// 响应式数据
const isHovered = ref(false)

// 处理悬停
const handleHoverEnter = () => {
  isHovered.value = true
  emit('hover-enter', props.index)
}

const handleHoverLeave = () => {
  isHovered.value = false
  emit('hover-leave')
}

// 播放榜单/歌曲
const handlePlayChart = () => {
  emit('play-chart', props.chart)
}

const handlePlaySong = (song) => {
  emit('play-song', song)
}

// 获取图表图片
const getChartImage = (chart) => {
  return (
    chart.backgroundImage ||
    chart.imageUrl ||
    'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400'
  )
}
</script>

<style scoped>
.carousel-item {
  transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  flex-shrink: 0;
}

@media (min-width: 768px) {
  .carousel-item {
    width: 360px !important;
  }
}

/* 淡入上滑动画 */
.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out forwards;
  opacity: 0;
  transform: translateY(20px);
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 自定义滚动条 */
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
  transition: all 0.3s ease;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

/* 玻璃态效果 */
.glass-effect {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* 专辑遮罩 */
.album-overlay {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(236, 72, 153, 0.3));
}

/* 慢速旋转动画 */
.animate-spin-slow {
  animation: spinSlow 8s linear infinite;
}

@keyframes spinSlow {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>

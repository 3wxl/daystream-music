<template>
  <section class="space-y-4 animate-fade-in-up" style="--delay: 0.2s">
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-3">
        <div
          class="w-2 h-6 bg-gradient-to-b from-pink-300 to-pink-400 rounded-full animate-pulse-glow"
        ></div>
        <h2 class="text-2xl font-bold text-pink-400">{{ activeCategoryName }}</h2>
        <span
          class="ml-2 px-2 py-1 bg-pink-500/20 rounded-full text-xs text-pink-300 animate-bounce-subtle"
        >
          <i class="fa fa-globe mr-1"></i>实时更新
        </span>
      </div>
      <div class="flex items-center gap-2">
        <!-- 轮播控制按钮 -->
        <button
          class="w-10 h-10 rounded-full glass-effect flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-white/20"
          @click="pauseAutoPlay"
          :class="{ 'bg-white/20': !isAutoPlaying }"
        >
          <i class="iconfont text-lg">&#xe697;</i>
        </button>
        <button
          class="w-10 h-10 rounded-full glass-effect flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-white/20"
          @click="resumeAutoPlay"
          :class="{ 'bg-white/20': isAutoPlaying }"
        >
          <i class="iconfont text-lg">&#xe621;</i>
        </button>
      </div>
    </div>

    <!-- 轮播图容器 -->
    <div class="relative px-4">
      <!-- 轮播图 - 修复无限轮播 -->
      <div
        ref="carouselContainer"
        class="carousel-wrapper overflow-hidden"
        @mouseenter="pauseAutoPlay"
        @mouseleave="resumeAutoPlay"
      >
        <div
          class="carousel-track flex gap-6"
          :class="{ 'carousel-paused': !isAutoPlaying }"
          :style="{ animationDuration: `${carouselSpeed}s` }"
        >
          <!-- 第一组 -->
          <ChartItem
            v-for="(chart, index) in charts"
            :key="`first-${index}`"
            :chart="chart"
            :index="index"
            @hover-enter="handleChartHoverEnter"
            @hover-leave="handleChartHoverLeave"
            @play-chart="handlePlayChart"
            @play-song="handlePlaySong"
          />

          <!-- 第二组（重复第一组，用于无缝循环） -->
          <ChartItem
            v-for="(chart, index) in charts"
            :key="`second-${index}`"
            :chart="chart"
            :index="index"
            @hover-enter="handleChartHoverEnter"
            @hover-leave="handleChartHoverLeave"
            @play-chart="handlePlayChart"
            @play-song="handlePlaySong"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch } from 'vue'
import ChartItem from './ChartItem.vue'

// 接收父组件参数
const props = defineProps({
  charts: {
    type: Array,
    required: true,
  },
  activeCategoryName: {
    type: String,
    required: true,
  },
  carouselSpeed: {
    type: Number,
    default: 30,
  },
})

// 向父组件传递事件
const emit = defineEmits(['play-chart', 'play-song'])

// 响应式数据
const carouselContainer = ref(null)
const isAutoPlaying = ref(true)
const hoveredChartIndex = ref(-1)

// 自动播放控制
const pauseAutoPlay = () => {
  isAutoPlaying.value = false
}

const resumeAutoPlay = () => {
  isAutoPlaying.value = true
}

// 处理榜单悬停
const handleChartHoverEnter = (index) => {
  hoveredChartIndex.value = index
}

const handleChartHoverLeave = () => {
  hoveredChartIndex.value = -1
}

// 播放榜单/歌曲
const handlePlayChart = (chart) => {
  emit('play-chart', chart)
}

const handlePlaySong = (song) => {
  emit('play-song', song)
}

// 监听榜单数据变化，重置自动播放
watch(
  () => props.charts,
  () => {
    isAutoPlaying.value = true
  },
)
</script>

<style scoped>
.carousel-wrapper {
  position: relative;
  overflow: hidden;
  padding: 20px 0;
}

.carousel-track {
  animation: infinite-carousel linear infinite;
  width: max-content;
  display: flex;
  gap: 1.5rem;
}

.carousel-paused {
  animation-play-state: paused;
}

/* 无限轮播动画 */
@keyframes infinite-carousel {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(calc(-50% - 0.75rem)); /* 减去gap的一半 */
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

/* 玻璃态效果 */
.glass-effect {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* 轻微弹跳动画 */
.animate-bounce-subtle {
  animation: bounceSubtle 2s ease-in-out infinite alternate;
}

@keyframes bounceSubtle {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-2px);
  }
}

/* 脉冲发光动画 */
.animate-pulse-glow {
  animation: pulseGlow 2s ease-in-out infinite alternate;
}

@keyframes pulseGlow {
  0% {
    opacity: 0.7;
  }
  100% {
    opacity: 1;
    box-shadow: 0 0 8px rgba(236, 72, 153, 0.6);
  }
}
</style>

<template>
  <div
    class="ranking-card relative overflow-hidden flex items-center p-4 h-28 rounded-2xl border border-gray-700/50 bg-gray-800/40 shadow-xl transition-all duration-400 backdrop-blur-sm group"
    @mouseenter="handleHoverEnter"
    @mouseleave="handleHoverLeave"
  >
    <!-- 排名数字 -->
    <div
      class="rank-number text-2xl font-bold w-11 h-11 flex items-center justify-center mr-4 relative z-10 rounded-full transition-all duration-300"
      :class="getRankClass(rank)"
    >
      {{ rank }}
    </div>

    <!-- 头像容器 -->
    <div class="avatar-container relative mr-4">
      <el-avatar
        :size="50"
        :src="singer.avatar"
        class="avatar border-2 border-pink-500/50 transition-all duration-400 relative z-10"
        :class="{ 'avatar-hover': isHovered }"
      />
      <div
        class="avatar-glow absolute top-0 left-0 w-full h-full rounded-full opacity-0 transition-opacity duration-400 bg-pink-500/30 blur-[12px]"
        :class="{ 'glow-active': isHovered }"
      ></div>
    </div>

    <!-- 歌手信息 -->
    <div class="info flex-1 relative z-10">
      <h3
        class="singer-name text-base font-bold mb-1 text-white transition-colors duration-300"
        :class="{ 'name-hover': isHovered }"
      >
        {{ singer.name }}
      </h3>
      <div class="fans-count text-gray-400 text-sm flex items-center mb-0.5">
        <span class="heart text-pink-500 mr-1 text-sm">♥</span>
        粉丝数: {{ singer.fans }}
      </div>
      <div class="genre text-gray-500 text-xs">{{ singer.genre }}</div>
    </div>

    <!-- 趋势指示器 -->
    <div
      class="trend-indicator flex items-center text-xs ml-2 px-3 py-1 rounded-full font-bold transition-all duration-300"
      :class="[getTrendClass(singer.trend.type), { 'scale-110': isHovered }]"
    >
      <span>{{ singer.trend.value > 0 ? '+' : '' }}{{ singer.trend.value }}</span>
      <span class="trend-icon ml-1">{{ getTrendIcon(singer.trend.type) }}</span>
    </div>

    <!-- 热门歌曲 -->
    <div
      class="top-songs absolute bottom-0 left-0 right-0 bg-black/70 backdrop-blur-sm p-3 rounded-b-2xl transition-all duration-400 z-20"
      :class="{ 'songs-visible': isHovered }"
    >
      <h4 class="text-xs mb-2 text-pink-300 font-semibold">热门歌曲</h4>
      <div class="song-list flex flex-wrap gap-2">
        <span
          v-for="song in singer.topSongs"
          :key="song"
          class="song-tag px-2 py-1 text-xs rounded-lg border border-pink-500/40 bg-pink-500/20 text-pink-200 transition-colors duration-300 hover:bg-pink-500/30"
        >
          {{ song }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps } from 'vue'
import { ElAvatar } from 'element-plus'

// 接收父组件参数
const props = defineProps({
  singer: {
    type: Object,
    required: true,
  },
  rank: {
    type: Number,
    required: true,
  },
})

// 响应式数据
const isHovered = ref(false)

// 处理悬停
const handleHoverEnter = () => {
  isHovered.value = true
}

const handleHoverLeave = () => {
  isHovered.value = false
}

// 获取排名样式类
const getRankClass = (rank) => {
  switch (rank) {
    case 1:
      return 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-white shadow-[0_0_25px_rgba(255,215,0,0.6)]'
    case 2:
      return 'bg-gradient-to-br from-gray-300 to-gray-500 text-white shadow-[0_0_25px_rgba(192,192,192,0.6)]'
    case 3:
      return 'bg-gradient-to-br from-amber-600 to-amber-800 text-white shadow-[0_0_25px_rgba(205,127,50,0.6)]'
    default:
      return 'bg-gradient-to-br from-pink-500 to-pink-700 text-pink-100 shadow-[0_0_25px_rgba(138,43,226,0.6)]'
  }
}

// 获取趋势样式类
const getTrendClass = (type) => {
  return {
    up: 'text-green-400 bg-green-500/15 shadow-[0_0_10px_rgba(76,175,80,0.2)]',
    down: 'text-red-400 bg-red-500/15 shadow-[0_0_10px_rgba(244,67,54,0.2)]',
    stable: 'text-orange-400 bg-orange-500/15 shadow-[0_0_10px_rgba(255,152,0,0.2)]',
  }[type]
}

const getTrendIcon = (type) => {
  switch (type) {
    case 'up':
      return '↑'
    case 'down':
      return '↓'
    case 'stable':
      return '→'
    default:
      return ''
  }
}
</script>

<style scoped>
.ranking-card {
  transform-style: preserve-3d;
}

.ranking-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(138, 43, 226, 0.2), transparent);
  transition: left 0.7s ease;
  z-index: 1;
}

.ranking-card:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow:
    0 10px 25px rgba(0, 0, 0, 0.4),
    0 0 15px rgba(163, 27, 113, 0.46);
  border-color: rgba(192, 20, 126, 0.612);
}

.ranking-card:hover::before {
  left: 100%;
}

.avatar-hover {
  border-color: rgba(226, 43, 165, 0.9) !important;
  transform: scale(1.1);
  box-shadow: 0 0 15px rgba(239, 16, 213, 0.497);
}

.glow-active {
  opacity: 1 !important;
}

.name-hover {
  color: #b19cd9;
}

/* 热门歌曲hover显示 */
.top-songs {
  transform: translateY(100%);
}

.songs-visible {
  transform: translateY(0);
}

/* 响应式微调 */
@media (max-width: 768px) {
  .ranking-card {
    padding: 0.75rem !important;
    height: auto !important;
  }

  .avatar {
    width: 40px !important;
    height: 40px !important;
  }

  .rank-number {
    width: 2.5rem !important;
    height: 2.5rem !important;
    font-size: 1.25rem !important;
  }
}

@media (max-width: 480px) {
  .ranking-card {
    flex-direction: column !important;
    text-align: center !important;
    padding: 1rem !important;
  }

  .rank-number {
    margin-right: 0 !important;
    margin-bottom: 0.5rem !important;
  }

  .avatar-container {
    margin-right: 0 !important;
    margin-bottom: 0.75rem !important;
  }

  .trend-indicator {
    margin-left: 0 !important;
    margin-top: 0.5rem !important;
  }
}
</style>

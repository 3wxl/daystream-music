<template>
  <div
    class="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-6 font-sans"
  >
    <!-- 顶部标题区域 -->
    <div class="max-w-4xl mx-auto mb-8">
      <div class="flex items-center justify-between mb-2">
        <h1 class="text-2xl font-bold text-white">我的歌单</h1>
        <div class="text-sm text-gray-400">全新巨人/斯蒂文</div>
      </div>
      <div
        class="w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-full"
      ></div>
    </div>

    <!-- 主要内容区域 -->
    <div class="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- 巅峰潮流榜 -->
      <div
        class="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6 shadow-2xl"
      >
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center space-x-2">
            <div class="w-2 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
            <h2 class="text-xl font-bold text-white">巅峰潮流榜</h2>
          </div>
          <div class="text-xs text-gray-400 bg-gray-700/50 px-2 py-1 rounded-full">QQ音乐×微博</div>
        </div>

        <div class="space-y-4">
          <div
            v-for="(song, index) in peakChart"
            :key="song.id"
            class="group relative bg-gray-700/30 rounded-xl p-4 border border-gray-600/30 hover:border-purple-500/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/20"
          >
            <!-- 排名徽章 -->
            <div
              class="absolute -left-2 -top-2 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg"
              :class="getRankBadgeClass(index)"
            >
              {{ index + 1 }}
            </div>

            <div class="ml-6">
              <h3
                class="text-white font-semibold text-lg mb-1 group-hover:text-purple-300 transition-colors"
              >
                {{ song.title }}
              </h3>
              <p class="text-gray-400 text-sm">{{ song.artist }}</p>

              <!-- 播放控制 -->
              <div class="flex items-center justify-between mt-3">
                <div class="flex items-center space-x-3">
                  <button
                    class="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center hover:bg-purple-500 transition-all duration-300 hover:scale-110 group-hover:shadow-lg group-hover:shadow-purple-500/30"
                  >
                    <i class="fas fa-play text-white text-xs"></i>
                  </button>
                  <div class="text-xs text-gray-500 group-hover:text-gray-400 transition-colors">
                    {{ song.plays }}
                  </div>
                </div>
                <div class="text-xs text-gray-500 group-hover:text-gray-400 transition-colors">
                  热度 {{ song.hot }}
                </div>
              </div>
            </div>

            <!-- 悬停光效 -->
            <div
              class="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            ></div>
          </div>
        </div>
      </div>

      <!-- 飙升榜 -->
      <div
        class="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6 shadow-2xl"
      >
        <div class="flex items-center space-x-2 mb-6">
          <div class="w-2 h-6 bg-gradient-to-b from-green-500 to-emerald-500 rounded-full"></div>
          <h2 class="text-xl font-bold text-white">飙升榜</h2>
        </div>

        <div class="space-y-4">
          <div
            v-for="(song, index) in risingChart"
            :key="song.id"
            class="group relative bg-gray-700/30 rounded-xl p-4 border border-gray-600/30 hover:border-green-500/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-green-500/20"
          >
            <!-- 排名徽章 -->
            <div
              class="absolute -left-2 -top-2 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg"
              :class="getRankBadgeClass(index)"
            >
              {{ index + 1 }}
            </div>

            <div class="ml-6">
              <h3
                class="text-white font-semibold text-lg mb-1 group-hover:text-green-300 transition-colors"
              >
                {{ song.title }}
              </h3>
              <p class="text-gray-400 text-sm">{{ song.artist }}</p>

              <!-- 上升趋势指示器 -->
              <div class="flex items-center space-x-2 mt-2">
                <div
                  class="flex items-center text-green-400 text-xs font-semibold bg-green-500/20 px-2 py-1 rounded-full"
                >
                  <i class="fas fa-arrow-up mr-1 text-xs"></i>
                  <span>飙升 {{ song.rise }}%</span>
                </div>
                <div class="text-xs text-gray-500">{{ song.trend }}</div>
              </div>

              <!-- 播放控制 -->
              <div class="flex items-center justify-between mt-3">
                <button
                  class="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center hover:bg-green-500 transition-all duration-300 hover:scale-110 group-hover:shadow-lg group-hover:shadow-green-500/30"
                >
                  <i class="fas fa-play text-white text-xs"></i>
                </button>
                <div class="text-xs text-gray-500 group-hover:text-gray-400 transition-colors">
                  新歌上榜
                </div>
              </div>
            </div>

            <!-- 悬停光效 -->
            <div
              class="absolute inset-0 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            ></div>
          </div>
        </div>
      </div>

      <!-- 热歌榜 -->
      <div
        class="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6 shadow-2xl"
      >
        <div class="flex items-center space-x-2 mb-6">
          <div class="w-2 h-6 bg-gradient-to-b from-orange-500 to-red-500 rounded-full"></div>
          <h2 class="text-xl font-bold text-white">热歌榜</h2>
        </div>

        <div class="space-y-4">
          <div
            v-for="(song, index) in hotChart"
            :key="song.id"
            class="group relative bg-gray-700/30 rounded-xl p-4 border border-gray-600/30 hover:border-orange-500/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-orange-500/20"
          >
            <!-- 排名徽章 -->
            <div
              class="absolute -left-2 -top-2 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg"
              :class="getRankBadgeClass(index)"
            >
              {{ index + 1 }}
            </div>

            <div class="ml-6">
              <h3
                class="text-white font-semibold text-lg mb-1 group-hover:text-orange-300 transition-colors"
              >
                {{ song.title }}
              </h3>
              <p class="text-gray-400 text-sm">{{ song.artist }}</p>

              <!-- 热度指示器 -->
              <div class="flex items-center space-x-2 mt-2">
                <div class="flex-1 bg-gray-600 rounded-full h-1.5">
                  <div
                    class="bg-gradient-to-r from-orange-500 to-red-500 h-1.5 rounded-full"
                    :style="{ width: song.popularity + '%' }"
                  ></div>
                </div>
                <div class="text-xs text-gray-500">{{ song.popularity }}%</div>
              </div>

              <!-- 播放控制 -->
              <div class="flex items-center justify-between mt-3">
                <button
                  class="w-8 h-8 rounded-full bg-orange-600 flex items-center justify-center hover:bg-orange-500 transition-all duration-300 hover:scale-110 group-hover:shadow-lg group-hover:shadow-orange-500/30"
                >
                  <i class="fas fa-play text-white text-xs"></i>
                </button>
                <div class="text-xs text-gray-500 group-hover:text-gray-400 transition-colors">
                  {{ song.duration }}
                </div>
              </div>
            </div>

            <!-- 悬停光效 -->
            <div
              class="absolute inset-0 rounded-xl bg-gradient-to-r from-orange-500/10 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部装饰 -->
    <div class="max-w-4xl mx-auto mt-8">
      <div class="flex items-center justify-center space-x-4 text-gray-500 text-sm">
        <div class="flex items-center space-x-2">
          <div class="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
          <span>实时更新</span>
        </div>
        <div class="w-1 h-1 bg-gray-600 rounded-full"></div>
        <div class="flex items-center space-x-2">
          <div
            class="w-2 h-2 bg-green-500 rounded-full animate-pulse"
            style="animation-delay: 0.2s"
          ></div>
          <span>全网热播</span>
        </div>
        <div class="w-1 h-1 bg-gray-600 rounded-full"></div>
        <div class="flex items-center space-x-2">
          <div
            class="w-2 h-2 bg-orange-500 rounded-full animate-pulse"
            style="animation-delay: 0.4s"
          ></div>
          <span>经典流行</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 巅峰潮流榜数据
const peakChart = ref([
  {
    id: 1,
    title: "Can't stop the rain",
    artist: '警卓',
    plays: '1.2亿',
    hot: '98.5万',
  },
  {
    id: 2,
    title: 'What a Day',
    artist: '蔡徐坤',
    plays: '9800万',
    hot: '87.3万',
  },
  {
    id: 3,
    title: '觅光',
    artist: '张韶涵',
    plays: '8560万',
    hot: '76.8万',
  },
])

// 飙升榜数据
const risingChart = ref([
  {
    id: 1,
    title: '爱丽丝卿（Live）',
    artist: '周深',
    rise: 245,
    trend: '急速上升',
  },
  {
    id: 2,
    title: '装货（Live）',
    artist: '薛之谦/欧阳娜娜',
    rise: 189,
    trend: '新歌上榜',
  },
  {
    id: 3,
    title: 'Spicy Honey',
    artist: '虞书欣',
    rise: 156,
    trend: '持续升温',
  },
])

// 热歌榜数据
const hotChart = ref([
  {
    id: 1,
    title: '恋人',
    artist: '李荣浩',
    popularity: 95,
    duration: '3:45',
  },
  {
    id: 2,
    title: '爱错',
    artist: '王力宏',
    popularity: 88,
    duration: '4:12',
  },
  {
    id: 3,
    title: '夜曲',
    artist: '周杰伦',
    popularity: 92,
    duration: '3:20',
  },
])

// 获取排名徽章样式
const getRankBadgeClass = (index) => {
  switch (index) {
    case 0:
      return 'bg-gradient-to-br from-yellow-500 to-yellow-600 shadow-yellow-500/50'
    case 1:
      return 'bg-gradient-to-br from-gray-400 to-gray-500 shadow-gray-400/50'
    case 2:
      return 'bg-gradient-to-br from-amber-600 to-amber-700 shadow-amber-600/50'
    default:
      return 'bg-gradient-to-br from-purple-600 to-purple-700 shadow-purple-600/50'
  }
}
</script>

<style scoped>
/* 自定义动画 */
@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-5px);
  }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

/* 滚动条样式 */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(139, 92, 246, 0.5);
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(139, 92, 246, 0.7);
}

/* 玻璃态效果增强 */
.glass-effect {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
</style>

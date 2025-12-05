<template>
  <div class="w-full max-w-xl mb-auto">
    <!-- 歌曲标题+歌手 -->
    <div class="mb-6 text-center">
      <h1
        class="text-xl md:text-2xl font-bold bg-gradient-to-r from-pink-400 via-pink-500 to-pink-300 bg-clip-text text-transparent animate-gradient"
        style="
          -webkit-background-clip: text;
          background-clip: text;
          text-shadow: 0 2px 15px rgba(255, 166, 193, 0.3);
          background-size: 200% auto;
        "
      >
        You
      </h1>
      <p class="text-xs text-pink-300/70 mt-2 flex items-center justify-center gap-2 flex-wrap">
        <span
          class="px-2 py-0.5 rounded-full bg-pink-500/10 border border-pink-400/30 text-pink-400"
          >千坂</span
        >
        <span class="text-pink-300/80">/</span>
        <span
          class="px-2 py-0.5 rounded-full bg-pink-400/10 border border-pink-300/30 text-pink-300"
          >N2V</span
        >
      </p>
    </div>

    <!-- 标签切换 -->
    <div class="mb-4 relative">
      <div class="flex space-x-1 w-full overflow-x-auto scrollbar-hide pb-2">
        <button
          v-for="tab in tabs"
          :key="tab.name"
          @click="$emit('update:active-tab', tab.name)"
          :class="[
            'px-4 py-2 rounded-t-lg text-xs font-medium relative flex-shrink-0 transition-all duration-300',
            activeTab === tab.name
              ? 'text-pink-400 bg-pink-500/10 border-t border-x border-pink-400/30'
              : 'text-pink-300/70 hover:text-pink-400 hover:bg-pink-500/5',
          ]"
        >
          {{ tab.label }}
          <div
            v-if="activeTab === tab.name"
            class="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-pink-400 to-pink-300 rounded-full"
          ></div>
        </button>
      </div>
    </div>

    <!-- 标签内容区域 -->
    <div
      class="backdrop-blur-sm rounded-lg overflow-hidden border transition-all duration-300"
      :class="[
        activeTab === 'lyric' ? 'border-transparent bg-transparent' : '',
        activeTab !== 'lyric' ? 'bg-pink-500/5 border-pink-400/10 hover:border-pink-400/30' : '',
      ]"
      @mouseenter="isLyricHovered = true"
      @mouseleave="isLyricHovered = false"
    >
      <!-- 歌词区域 -->
      <div v-if="activeTab === 'lyric'" class="p-4">
        <div
          class="lyric-container h-84 relative overflow-y-auto scrollbar-hide"
          ref="lyricContainer"
          @wheel="handleLyricWheel"
          @scroll="handleLyricScroll"
          @mouseup="resetAutoScrollTimer"
          @mousedown="clearAutoScrollTimer"
        >
          <!-- 歌词容器（固定每行高度，便于计算） -->
          <div class="lyric-wrapper" ref="lyricWrapper">
            <div
              v-for="(item, index) in lyricList"
              :key="`lyric-${index}-${item.time}`"
              class="lyric-item py-4 text-center transition-all duration-300 relative"
              :class="{
                'lyric-highlight': index === highlightedLyricIndex,
                'cursor-pointer': true,
              }"
              @click="handleLyricClick(timeToSeconds(item.time))"
            >
              <!-- 歌词文本 -->
              <div class="lyric-text-container inline-block">
                <span class="lyric-text">
                  {{ item.text }}
                </span>
                <!-- 时间标签（使用绝对定位，不影响歌词布局） -->
                <span
                  v-if="index === highlightedLyricIndex && isLyricHovered"
                  class="lyric-time absolute -right-15 top-1/2 transform -translate-y-1/2 text-xs text-pink-400/90 bg-pink-500/10 px-2 py-0.5 rounded-full ml-2 whitespace-nowrap"
                >
                  {{ formatTime(item.time) }}
                </span>
              </div>
            </div>
          </div>

          <!-- 高亮区域参考线（已移除虚线方框） -->
          <div
            class="highlight-marker absolute left-0 right-0 top-1/2 transform -translate-y-1/2 h-12 z-0 pointer-events-none opacity-0"
          ></div>
        </div>

        <!-- 底部当前播放提示 -->
        <div class="text-center mt-2">
          <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/10">
            <i class="iconfont text-pink-400 text-xs">&#xe61e;</i>
            <span class="text-xs text-pink-400">当前播放：{{ currentLyricTime }}</span>
            <span
              v-if="highlightedLyricIndex !== currentLyricIndex"
              class="text-xs text-pink-300/70 ml-2"
            >
              (当前视图：{{ formatTime(lyricList[highlightedLyricIndex]?.time || '00:00') }})
            </span>
          </div>
        </div>
      </div>

      <!-- 相似歌曲 -->
      <div v-if="activeTab === 'similar'" class="p-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-48 overflow-y-auto scrollbar-hide">
          <div
            v-for="(song, index) in similarSongs"
            :key="`song-${index}-${song.title}`"
            @click="$emit('play-similar-song', song)"
            class="group flex items-center gap-3 p-3 rounded-lg bg-pink-500/5 hover:bg-pink-500/10 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer border border-transparent hover:border-pink-400/20"
          >
            <div class="relative flex-shrink-0">
              <img
                :src="song.cover"
                :alt="song.title"
                class="w-12 h-12 rounded-lg object-cover border-2 border-pink-400/10 group-hover:border-pink-400/50 transition-colors"
              />
              <div
                class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 rounded-lg flex items-center justify-center transition-opacity"
              >
                <div class="w-6 h-6 rounded-full bg-pink-500 flex items-center justify-center">
                  <i class="iconfont icon-play text-white text-xs"></i>
                </div>
              </div>
            </div>
            <div class="flex-1 min-w-0">
              <h4
                class="text-sm text-pink-400 font-medium group-hover:text-pink-300 transition-colors truncate"
              >
                {{ song.title }}
              </h4>
              <p class="text-xs text-pink-300/70 mt-0.5 truncate">{{ song.singer }}</p>
              <div class="flex items-center gap-1.5 mt-1">
                <span class="text-xs px-1.5 py-0.5 rounded-full bg-pink-400/20 text-pink-300"
                  >{{ song.similarity }}%相似</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 百科 -->
      <div v-if="activeTab === 'encyclopedia'" class="p-4">
        <div
          class="space-y-4 max-h-48 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          <div
            class="p-3 rounded-lg bg-gradient-to-br from-pink-500/10 to-pink-400/10 border border-pink-400/20"
          >
            <h3 class="text-sm font-bold text-pink-400 mb-2 flex items-center gap-1.5">
              <i class="iconfont icon-album text-xs">&#xe64b;</i>
              专辑信息
            </h3>
            <div class="space-y-1 text-xs">
              <p>
                <span class="text-pink-300/70">专辑名：</span
                ><span class="text-pink-100">You - Single</span>
              </p>
              <p>
                <span class="text-pink-300/70">发行时间：</span
                ><span class="text-pink-100">2018-08-20</span>
              </p>
              <p>
                <span class="text-pink-300/70">发行平台：</span
                ><span class="text-pink-100">全网音乐平台</span>
              </p>
            </div>
          </div>

          <div class="space-y-2">
            <h4 class="text-sm font-bold text-pink-300">歌曲介绍</h4>
            <p class="text-xs text-pink-300/80 leading-relaxed">
              《You》是由中国电子音乐制作人千坂（Chisa）与N2V合作制作的一首Future Bass风格单曲，
              发行于2018年8月20日。歌曲以轻快的节奏、明亮的旋律和甜美的电子音效为特点。
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'

// 接收父组件props
const props = defineProps({
  activeTab: {
    type: String,
    default: 'lyric',
  },
  currentLyricIndex: {
    type: Number,
    default: 0,
  },
  currentLyricTime: {
    type: String,
    default: '00:00.00',
  },
  similarSongs: {
    type: Array,
    default: () => [],
  },
})

// 定义事件
const emit = defineEmits(['update:active-tab', 'seek-to-lyric', 'play-similar-song'])

// 核心引用
const lyricContainer = ref(null)
const lyricWrapper = ref(null)

// 状态管理
const isLyricHovered = ref(false) // 鼠标是否悬停在歌词区域
const highlightedLyricIndex = ref(0) // 当前高亮的歌词索引（视图中间）
const autoScrollTimer = ref(null) // 自动回滚计时器
const lyricItemHeight = ref(72) // 每行歌词高度（py-4 = 2rem = 32px + 上下内边距）
const isUserInteracting = ref(false) // 用户是否正在交互

// 歌词数据
const lyricList = ref([
  { time: '00:00.00', text: '前奏' },
  { time: '00:15.20', text: '君のことを ずっと ずっと 考えている' },
  { time: '00:20.50', text: '夜も昼も 眠れないほど' },
  { time: '00:25.80', text: 'You are the only one for me' },
  { time: '00:31.10', text: '永遠に 一緒に いたい' },
  { time: '00:36.40', text: '君の笑顔 輝いて 僕の世界を照らす' },
  { time: '00:41.70', text: 'どんな困難でも 乗り越えられる' },
  { time: '00:47.00', text: 'Because of you' },
  { time: '00:52.30', text: '君の声 柔らかく 僕の心を包む' },
  { time: '00:57.60', text: 'どんな時でも 側にいるから' },
  { time: '01:02.90', text: 'You are my everything' },
  { time: '01:08.20', text: '時が流れても 変わらない想い' },
  { time: '01:13.50', text: '君との約束 忘れない' },
  { time: '01:18.80', text: 'Every day every night I miss you' },
  { time: '01:24.10', text: '胸の中に 君がいる限り' },
  { time: '01:29.40', text: '何も怖くない' },
  { time: '01:34.70', text: '星が降る夜に 君を想う' },
  { time: '01:40.00', text: '願いが叶うなら もう一度逢いたい' },
  { time: '01:45.30', text: 'Your smile is like the sunshine' },
  { time: '01:50.60', text: '暖かく 僕の心を包む' },
  { time: '01:55.90', text: 'ずっと ずっと 側にいて' },
  { time: '02:01.20', text: 'この気持ち 伝えたい' },
  { time: '02:06.50', text: 'ありがとう 君がいてくれたこと' },
  { time: '02:11.80', text: '未来も 一緒に 歩いていこう' },
  { time: '02:17.10', text: 'You are the light in my life' },
  { time: '02:22.40', text: '終わり' },
])

// 标签数据
const tabs = [
  { name: 'lyric', label: '歌词', icon: 'lyric' },
  { name: 'similar', label: '相似歌曲', icon: 'similar' },
  { name: 'encyclopedia', label: '百科', icon: 'encyclopedia' },
]

// ========== 核心方法 ==========
// 格式化时间
const formatTime = (timeStr) => {
  if (!timeStr) return '00:00'
  return timeStr.split('.')[0]
}

// 时间转秒数
const timeToSeconds = (timeStr) => {
  const [min, sec] = timeStr.split(':')
  return parseInt(min) * 60 + parseFloat(sec)
}

// 计算当前视图中间的歌词索引
const calculateHighlightedIndex = () => {
  if (!lyricContainer.value || !lyricWrapper.value) return

  const container = lyricContainer.value
  const wrapper = lyricWrapper.value

  // 容器中间位置（相对容器顶部）
  const containerCenter = container.clientHeight / 2
  // 滚动条位置
  const scrollTop = container.scrollTop
  // 绝对中间位置（相对歌词列表顶部）
  const absoluteCenter = scrollTop + containerCenter

  // 计算当前中间位置对应的歌词索引
  const index = Math.floor(absoluteCenter / lyricItemHeight.value)
  // 边界处理
  const validIndex = Math.max(0, Math.min(index, lyricList.value.length - 1))

  highlightedLyricIndex.value = validIndex
}

// 滚动到指定索引的歌词（居中）
const scrollToLyricIndex = (index, isSmooth = true) => {
  if (!lyricContainer.value || !lyricWrapper.value) return

  const container = lyricContainer.value
  const targetTop =
    index * lyricItemHeight.value - container.clientHeight / 2 + lyricItemHeight.value / 2

  container.scrollTo({
    top: targetTop,
    behavior: isSmooth ? 'smooth' : 'auto',
  })

  // 强制更新高亮索引
  highlightedLyricIndex.value = index
}

// 重置自动回滚计时器（停留3秒后回到播放位置）
const resetAutoScrollTimer = () => {
  clearAutoScrollTimer()

  // 3秒后自动回到正在播放的歌词
  autoScrollTimer.value = setTimeout(() => {
    if (!isUserInteracting.value) {
      scrollToLyricIndex(props.currentLyricIndex)
    }
  }, 3000)
}

// 清除自动回滚计时器
const clearAutoScrollTimer = () => {
  if (autoScrollTimer.value) {
    clearTimeout(autoScrollTimer.value)
    autoScrollTimer.value = null
  }
}

// ========== 事件处理 ==========
// 歌词点击事件（跳转播放）
const handleLyricClick = (seconds) => {
  isUserInteracting.value = true
  emit('seek-to-lyric', seconds)
  // 点击后立即回到该歌词位置，并重置计时器
  const targetIndex = lyricList.value.findIndex((item) => timeToSeconds(item.time) === seconds)
  if (targetIndex !== -1) {
    scrollToLyricIndex(targetIndex)
  }
  clearAutoScrollTimer()
  // 延迟标记交互结束，避免频繁触发
  setTimeout(() => {
    isUserInteracting.value = false
  }, 100)
}

// 滚轮事件（标记用户交互）
const handleLyricWheel = () => {
  isUserInteracting.value = true
  clearAutoScrollTimer()
  // 延迟标记交互结束，避免频繁触发
  setTimeout(() => {
    isUserInteracting.value = false
    resetAutoScrollTimer()
  }, 100)
}

// 滚动事件（实时更新高亮索引）
const handleLyricScroll = () => {
  calculateHighlightedIndex()
  // 如果用户正在滚动，重置自动回滚计时器
  if (!isUserInteracting.value) {
    resetAutoScrollTimer()
  }
}

// ========== 监听与生命周期 ==========
// 监听当前播放歌词索引变化
watch(
  () => props.currentLyricIndex,
  (newIndex) => {
    // 只有用户没有手动滚动时，才自动同步播放位置
    if (!autoScrollTimer.value && !isUserInteracting.value) {
      scrollToLyricIndex(newIndex)
    }
  },
)

// 初始化
onMounted(() => {
  nextTick(() => {
    // 计算实际歌词行高
    if (lyricWrapper.value && lyricWrapper.value.children[0]) {
      lyricItemHeight.value = lyricWrapper.value.children[0].offsetHeight || 72
    }
    // 初始滚动到播放位置
    scrollToLyricIndex(props.currentLyricIndex, false)
    calculateHighlightedIndex()
    // 初始化自动回滚计时器
    resetAutoScrollTimer()
  })
})

// 组件卸载清理
onUnmounted(() => {
  clearAutoScrollTimer()
})
</script>

<style scoped>
/* 渐变动画 */
.animate-gradient {
  background-size: 200% auto;
  animation: gradient 3s ease infinite;
}

@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* 歌词容器核心样式 */
.lyric-container {
  scroll-behavior: smooth;
  -ms-overflow-style: none;
  scrollbar-width: none;
  position: relative;
}

.lyric-container::-webkit-scrollbar {
  display: none;
}

/* 歌词列表容器 */
.lyric-wrapper {
  min-height: 100%;
}

/* 单行动词样式 */
.lyric-item {
  height: auto;
  line-height: 1.5;
  transition: all 0.3s ease;
  opacity: 0.6;
  transform: scale(0.95);
  padding: 1rem 2.5rem; /* 给时间标签预留空间 */
}

/* 高亮歌词样式（视图中间行） */
.lyric-highlight {
  opacity: 1;
  transform: scale(1);
}

.lyric-highlight .lyric-text {
  color: #f472b6;
  font-weight: bold;
  font-size: 1.1rem;
  text-shadow: 0 2px 10px rgba(244, 114, 182, 0.4);
}

/* 歌词文本容器 */
.lyric-text-container {
  position: relative;
  display: inline-block;
}

/* 普通歌词文本 */
.lyric-text {
  color: #f9a8d4;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  display: inline-block;
}

/* 时间标签样式 - 使用绝对定位，不改变歌词布局 */
.lyric-time {
  background: linear-gradient(to right, rgba(244, 114, 182, 0.1), rgba(236, 72, 153, 0.1));
  border: 1px solid rgba(244, 114, 182, 0.3);
  box-shadow: 0 2px 8px rgba(244, 114, 182, 0.2);
  animation: timeFadeIn 0.3s ease-out;
}

@keyframes timeFadeIn {
  from {
    opacity: 0;
    transform: translateX(-10px) translateY(-50%);
  }
  to {
    opacity: 1;
    transform: translateX(0) translateY(-50%);
  }
}

/* 自定义滚动条隐藏 */
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* 高亮区域参考线 - 移除所有边框和虚线 */
.highlight-marker {
  background: transparent;
  border: none !important;
  box-shadow: none !important;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .lyric-container {
    height: 180px !important;
  }

  .lyric-item {
    padding: 0.75rem 1.5rem !important;
  }

  .lyric-highlight .lyric-text {
    font-size: 1rem !important;
  }

  .lyric-text {
    font-size: 0.85rem !important;
  }

  .lyric-time {
    font-size: 0.65rem !important;
    padding: 0.15rem 0.5rem !important;
    right: -1.5rem !important;
  }
}

@media (max-width: 480px) {
  .lyric-container {
    height: 150px !important;
  }

  .text-xl {
    font-size: 1.25rem !important;
  }

  .p-4 {
    padding: 1rem !important;
  }

  .lyric-item {
    padding: 0.5rem 1rem !important;
  }

  .lyric-highlight .lyric-text {
    font-size: 0.9rem !important;
  }

  .lyric-text {
    font-size: 0.75rem !important;
  }

  .lyric-time {
    font-size: 0.6rem !important;
    padding: 0.1rem 0.4rem !important;
    right: -1rem !important;
  }
}

/* 粉色系配色 */
.text-pink-100 {
  color: #fce7f3;
}
.text-pink-300 {
  color: #f9a8d4;
}
.text-pink-400 {
  color: #f472b6;
}
.text-pink-500 {
  color: #ec4899;
}

.border-pink-300\/30 {
  border-color: rgba(249, 168, 212, 0.3);
}
.border-pink-400\/10 {
  border-color: rgba(244, 114, 182, 0.1);
}
.border-pink-400\/20 {
  border-color: rgba(244, 114, 182, 0.2);
}
.border-pink-400\/30 {
  border-color: rgba(244, 114, 182, 0.3);
}
</style>

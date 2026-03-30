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
        {{ songDetail?.musicName || '未知歌曲' }}
      </h1>
      <p class="text-xs text-pink-300/70 mt-2 flex items-center justify-center gap-2 flex-wrap">
        <span
          v-for="tag in songDetail?.tags?.slice(0, 3)"
          :key="tag.id"
          class="px-2 py-0.5 rounded-full bg-pink-500/10 border border-pink-400/30 text-pink-400"
        >
          {{ tag.tagName }}
        </span>
        <span class="text-pink-300/80">/</span>
        <span
          class="px-2 py-0.5 rounded-full bg-pink-400/10 border border-pink-300/30 text-pink-300"
        >
          {{ songDetail?.musicianName || '未知歌手' }}
        </span>
      </p>

      <!-- 歌曲统计信息 -->
      <div class="flex items-center justify-center gap-4 mt-3 text-xs text-pink-300/70">
        <span class="flex items-center gap-1">
          <i class="iconfont text-xs">&#xe83f;</i>
          {{ songDetail?.likeCount || 0 }}
        </span>
        <span class="flex items-center gap-1">
          <i class="iconfont icon-comment text-xs">&#xe663;</i>
          {{ songDetail?.commentCount || 0 }}
        </span>
        <span class="flex items-center gap-1">
          <i class="iconfont text-xs">&#xe61e;</i>
          {{ formatDuration(songDetail?.duration || '00:00') }}
        </span>
      </div>
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
          v-if="props.isRawTextLyric"
          class="absolute top-0 left-0 right-0 flex justify-center z-10"
        >
          <span
            class="text-xs text-pink-400/90 bg-pink-500/10 px-3 py-1 rounded-full border border-pink-400/30 mb-10"
          >
            此段歌词是纯文本，无自动翻滚
          </span>
        </div>
        <div
          class="lyric-container h-84 relative overflow-y-auto scrollbar-hide"
          ref="lyricContainer"
          @wheel="handleLyricWheel"
          @scroll="handleLyricScroll"
          @mouseup="resetAutoScrollTimer"
          @mousedown="clearAutoScrollTimer"
        >
          <!-- 纯文本歌词提示 -->

          <div class="lyric-wrapper" ref="lyricWrapper">
            <div
              v-for="(item, index) in lyricList"
              :key="`lyric-${index}-${item.time || index}`"
              class="lyric-item py-4 text-center transition-all duration-300 relative"
              :class="{
                'lyric-highlight': index === highlightedLyricIndex,
                'cursor-pointer': true,
              }"
              @click="handleLyricClick(timeToSeconds(item.time))"
            >
              <div class="lyric-text-container inline-block">
                <span class="lyric-text">
                  {{ item.text }}
                </span>
                <span
                  v-if="index === highlightedLyricIndex && isLyricHovered"
                  class="lyric-time absolute -right-15 top-1/2 transform -translate-y-1/2 text-xs text-pink-400/90 bg-pink-500/10 px-2 py-0.5 rounded-full ml-2 whitespace-nowrap"
                >
                  {{ formatTime(item.time) }}
                </span>
              </div>
            </div>
          </div>

          <!-- 空状态 -->
          <div v-if="!lyricList.length" class="h-full flex items-center justify-center">
            <div class="text-center">
              <i class="iconfont icon-music-note text-4xl text-pink-400/50 mb-2">&#xe61f;</i>
              <p class="text-pink-300/50">暂无歌词</p>
            </div>
          </div>
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
            :key="`song-${index}-${song.id}`"
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

      <!-- 歌曲信息 -->
      <div v-if="activeTab === 'encyclopedia'" class="p-4">
        <div class="space-y-4 max-h-48 overflow-y-auto scrollbar-hide">
          <div
            class="p-3 rounded-lg bg-gradient-to-br from-pink-500/10 to-pink-400/10 border border-pink-400/20"
          >
            <h3 class="text-sm font-bold text-pink-400 mb-2 flex items-center gap-1.5">
              <i class="iconfont icon-album text-xs">&#xe64b;</i>
              专辑信息
            </h3>
            <div class="space-y-1 text-xs">
              <p>
                <span class="text-pink-300/70">专辑名：</span>
                <span class="text-pink-100">{{ songDetail?.albumName || '未收录专辑' }}</span>
              </p>
              <p>
                <span class="text-pink-300/70">BPM：</span>
                <span class="text-pink-100">{{ songDetail?.bpm || '--' }}</span>
              </p>
              <p>
                <span class="text-pink-300/70">音频格式：</span>
                <span class="text-pink-100">{{ songDetail?.audioList?.join('、') || 'MP3' }}</span>
              </p>
            </div>
          </div>

          <div class="space-y-2">
            <h4 class="text-sm font-bold text-pink-300">歌曲介绍</h4>
            <p class="text-xs text-pink-300/80 leading-relaxed">
              {{ songDetail?.introduction || '暂无歌曲介绍' }}
            </p>
          </div>

          <!-- 标签 -->
          <div v-if="songDetail?.tags && songDetail.tags.length > 0" class="space-y-2">
            <h4 class="text-sm font-bold text-pink-300">歌曲标签</h4>
            <div class="flex flex-wrap gap-1">
              <span
                v-for="tag in songDetail.tags"
                :key="tag.id"
                class="px-2 py-1 text-xs rounded-full bg-pink-500/10 border border-pink-400/20 text-pink-300"
              >
                {{ tag.tagName }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'

// 接收父组件props
const props = defineProps({
  activeTab: {
    type: String,
    default: 'lyric',
  },
  isPlaying: {
    type: Boolean,
    default: false,
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
    type: Array as () => Array<{
      id: number | string
      cover: string
      title: string
      singer: string
      similarity: number
    }>,
    default: () => [],
  },
  songDetail: {
    type: Object as () => any,
    default: null,
  },
  lyricList: {
    type: Array as () => Array<{ time: string; text: string }>,
    default: () => [],
  },
  isRawTextLyric: {
    type: Boolean,
    default: false,
  },
})

// 定义事件
const emit = defineEmits(['update:active-tab', 'seek-to-lyric', 'play-similar-song'])

// 核心引用
const lyricContainer = ref<HTMLElement | null>(null)
const lyricWrapper = ref<HTMLElement | null>(null)

// 状态管理
const isLyricHovered = ref(false)
const highlightedLyricIndex = ref(0)
const autoScrollTimer = ref<NodeJS.Timeout | null>(null)
const lyricItemHeight = ref(72)
const isUserInteracting = ref(false)

// 标签数据
const tabs = [
  { name: 'lyric', label: '歌词', icon: 'lyric' },
  { name: 'similar', label: '相似歌曲', icon: 'similar' },
  { name: 'encyclopedia', label: '信息', icon: 'encyclopedia' },
]

// ========== 核心方法 ==========
// 格式化时间显示（修复：容错）
const formatTime = (timeStr: string) => {
  if (!timeStr || !timeStr.includes(':')) return '00:00'
  return timeStr.split('.')[0]
}

// 时间转秒数（修复：容错）
const timeToSeconds = (timeStr: string) => {
  if (!timeStr || !timeStr.includes(':')) return 0
  const [min, sec] = timeStr.split(':')
  return parseInt(min || '0') * 60 + parseFloat(sec || '0')
}

// 格式化时长显示
const formatDuration = (durationStr: string) => {
  if (!durationStr) return '00:00'
  return durationStr
}

// 修复：计算当前视图中间的歌词索引
const calculateHighlightedIndex = () => {
  if (!lyricContainer.value || !lyricWrapper.value || !props.lyricList.length) return

  const container = lyricContainer.value
  const containerRect = container.getBoundingClientRect()
  const containerCenter = containerRect.height / 2
  const scrollTop = container.scrollTop
  const absoluteCenter = scrollTop + containerCenter

  // 计算可见区域中间的歌词索引
  const index = Math.floor(absoluteCenter / lyricItemHeight.value)
  const validIndex = Math.max(0, Math.min(index, props.lyricList.length - 1))

  highlightedLyricIndex.value = validIndex
}

// 修复：滚动到指定索引的歌词（边界值）
const scrollToLyricIndex = (index: number, isSmooth = true) => {
  if (!lyricContainer.value || !lyricWrapper.value || props.lyricList.length === 0) return

  // 边界值校验
  const targetIndex = Math.max(0, Math.min(index, props.lyricList.length - 1))
  const container = lyricContainer.value
  const containerHeight = container.clientHeight

  // 计算目标滚动位置
  const targetTop = Math.max(
    0,
    targetIndex * lyricItemHeight.value - containerHeight / 2 + lyricItemHeight.value / 2,
  )

  // 滚动
  container.scrollTo({
    top: targetTop,
    behavior: isSmooth ? 'smooth' : 'auto',
  })

  highlightedLyricIndex.value = targetIndex
}

// 重置自动回滚计时器（修复：防抖）
const resetAutoScrollTimer = () => {
  clearAutoScrollTimer()

  // 只有播放中、非用户交互且非纯文本歌词时才自动回滚
  if (props.isPlaying && !isUserInteracting.value && !props.isRawTextLyric) {
    autoScrollTimer.value = setTimeout(() => {
      if (!isUserInteracting.value) {
        scrollToLyricIndex(props.currentLyricIndex)
      }
    }, 3000)
  }
}

// 清除自动回滚计时器
const clearAutoScrollTimer = () => {
  if (autoScrollTimer.value) {
    clearTimeout(autoScrollTimer.value)
    autoScrollTimer.value = null
  }
}

// ========== 事件处理 ==========
// 歌词点击事件（修复：交互标记）
const handleLyricClick = (seconds: number) => {
  isUserInteracting.value = true
  emit('seek-to-lyric', seconds)

  const targetIndex = props.lyricList.findIndex((item) => timeToSeconds(item.time) === seconds)
  if (targetIndex !== -1) {
    scrollToLyricIndex(targetIndex)
  }

  clearAutoScrollTimer()
  // 延长交互标记时间，避免快速自动回滚
  setTimeout(() => {
    isUserInteracting.value = false
    resetAutoScrollTimer()
  }, 1000)
}

// 滚轮事件（修复：交互标记）
const handleLyricWheel = () => {
  isUserInteracting.value = true
  clearAutoScrollTimer()
  setTimeout(() => {
    isUserInteracting.value = false
    resetAutoScrollTimer()
  }, 1500)
}

// 滚动事件（修复：性能优化）
const handleLyricScroll = () => {
  // 防抖处理，避免频繁计算
  clearTimeout((window as any).lyricScrollTimer)
  ;(window as any).lyricScrollTimer = setTimeout(() => {
    calculateHighlightedIndex()
    if (!isUserInteracting.value) {
      resetAutoScrollTimer()
    }
  }, 100)
}

// ========== 监听与生命周期 ==========
// 监听当前播放歌词索引变化（修复：简化条件，确保播放时歌词始终滚动）
watch(
  () => props.currentLyricIndex,
  (newIndex) => {
    if (props.isPlaying && !props.isRawTextLyric) {
      scrollToLyricIndex(newIndex)
    }
  },
)

// 监听播放状态变化（新增）
watch(
  () => props.isPlaying,
  (isPlaying) => {
    if (isPlaying && !props.isRawTextLyric) {
      resetAutoScrollTimer()
    } else {
      clearAutoScrollTimer()
    }
  },
)

// 监听歌词列表变化
watch(
  () => props.lyricList,
  () => {
    nextTick(() => {
      scrollToLyricIndex(props.currentLyricIndex, false)
    })
  },
  { deep: true },
)

// 初始化（修复：歌词高度计算）
onMounted(() => {
  nextTick(() => {
    // 实际计算歌词行高
    if (lyricWrapper.value && lyricWrapper.value.children[0]) {
      const firstItem = lyricWrapper.value.children[0] as HTMLElement
      lyricItemHeight.value = firstItem.offsetHeight || 72
    }
    scrollToLyricIndex(props.currentLyricIndex, false)
    calculateHighlightedIndex()
    if (props.isPlaying) {
      resetAutoScrollTimer()
    }
  })
})

// 组件卸载清理（修复：完整清理）
onUnmounted(() => {
  clearAutoScrollTimer()
  clearTimeout((window as any).lyricScrollTimer)
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

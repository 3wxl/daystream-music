<template>
  <!-- 外层容器 - 背景模糊层 -->
  <div
    class="fixed inset-0 z-50 transition-all duration-800 ease-in-out"
    :style="{
      backdropFilter: isShow ? 'blur(10px)' : 'blur(0px)',
      backgroundColor: isShow ? 'rgba(15, 15, 21, 0.9)' : 'rgba(15, 15, 21, 0)',
    }"
  >
    <!-- 动画容器 -->
    <div
      class="absolute inset-x-0 bottom-0 w-full transition-all duration-800 ease-in-out"
      :style="{
        height: '100vh',
        transform: isShow ? 'translateY(0%)' : 'translateY(100%)',
      }"
    >
      <!-- 内容容器 - 添加渐变背景 -->
      <div
        class="relative w-full h-full bg-gradient-to-br from-[#0f0f15] via-[#1a1a25] to-[#0f0f15] flex flex-col text-white overflow-hidden"
      >
        <!-- 背景粒子 -->
        <BackgroundParticles />

        <!-- 内容区域 -->
        <div class="relative z-10 flex-1 flex flex-col">
          <!-- 顶部返回按钮 -->
          <BackButton @back="handleBack" />

          <!-- 主内容区 -->
          <div
            class="flex-1 flex flex-col lg:flex-row items-center justify-center px-4 md:px-6 gap-4 lg:gap-12"
          >
            <!-- 左侧：黑胶唱片区域 -->
            <VinylPlayer :is-playing="isPlaying" @toggle-play="togglePlay" />

            <!-- 右侧：歌曲信息+标签切换区 -->
            <SongInfoPanel
              :active-tab="activeTab"
              :is-playing="isPlaying"
              :current-lyric-index="currentLyricIndex"
              :current-lyric-time="currentLyricTime"
              :progress="progress"
              :similar-songs="similarSongs"
              @update:active-tab="activeTab = $event"
              @seek-to-lyric="seekToLyric"
              @play-similar-song="playSimilarSong"
            />
          </div>
        </div>

        <!-- 底部播放控制栏 -->
        <PlayerControls
          :is-playing="isPlaying"
          :progress="progress"
          :volume="volume"
          :shuffle="shuffle"
          :loop="loop"
          :muted="muted"
          :is-liked="isLiked"
          :progress-percentage="progressPercentage"
          @toggle-play="togglePlay"
          @toggle-like="toggleLike"
          @toggle-shuffle="toggleShuffle"
          @toggle-loop="toggleLoop"
          @toggle-mute="toggleMute"
          @prev-song="prevSong"
          @next-song="nextSong"
          @handle-progress-click="handleProgressClick"
          @handle-volume-click="handleVolumeClick"
          @format-time="formatTime"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
// 响应式数据
const activeTab = ref('lyric')
const progress = ref(15) // 当前播放进度（秒）
const volume = ref(80)
const isPlaying = ref(false)
const currentLyricIndex = ref(0)
const currentLyricTime = ref('00:00.00')
const shuffle = ref(false)
const loop = ref(false)
const muted = ref(false)
const isLiked = ref(false)
const isShow = ref(false)
// 计算属性
const progressPercentage = computed(() => (progress.value / 204) * 100)

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
])

// 相似歌曲
const similarSongs = ref([
  {
    title: 'Faded',
    singer: 'Alan Walker',
    cover: 'https://picsum.photos/id/1019/60/60',
    similarity: 92,
  },
  {
    title: 'Alone',
    singer: 'Marshmello',
    cover: 'https://picsum.photos/id/1020/60/60',
    similarity: 88,
  },
  {
    title: 'Closer',
    singer: 'The Chainsmokers/Halsey',
    cover: 'https://picsum.photos/id/1021/60/60',
    similarity: 85,
  },
])

// 工具函数
const formatTime = (seconds) => {
  const min = Math.floor(seconds / 60)
  const sec = Math.floor(seconds % 60)
  return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`
}

const timeToSeconds = (timeStr) => {
  const [min, sec] = timeStr.split(':')
  return parseInt(min) * 60 + parseFloat(sec)
}

// 播放控制
let progressTimer = null

const togglePlay = () => {
  isPlaying.value = !isPlaying.value
  if (isPlaying.value) {
    startProgressTimer()
  } else {
    stopProgressTimer()
  }
}

const startProgressTimer = () => {
  stopProgressTimer()
  progressTimer = setInterval(() => {
    if (progress.value >= 204) {
      progress.value = 0
      currentLyricIndex.value = 0
      if (!loop.value) {
        isPlaying.value = false
        stopProgressTimer()
      }
    } else {
      progress.value += 0.1
      updateLyricHighlight()
    }
  }, 100)
}

const stopProgressTimer = () => {
  if (progressTimer) {
    clearInterval(progressTimer)
    progressTimer = null
  }
}

// 歌词高亮更新
const updateLyricHighlight = () => {
  const currentTime = progress.value
  for (let i = lyricList.value.length - 1; i >= 0; i--) {
    const lyricTime = timeToSeconds(lyricList.value[i].time)
    if (currentTime >= lyricTime) {
      if (currentLyricIndex.value !== i) {
        currentLyricIndex.value = i
        currentLyricTime.value = lyricList.value[i].time
      }
      break
    }
  }
}

// 进度条点击跳转
const handleProgressClick = (e) => {
  const bar = e.currentTarget
  const rect = bar.getBoundingClientRect()
  const clickX = e.clientX - rect.left
  const width = rect.width
  const percentage = clickX / width
  progress.value = Math.min(204, Math.max(0, percentage * 204))
  updateLyricHighlight()
}

// 音量条点击调整
const handleVolumeClick = (e) => {
  const bar = e.currentTarget
  const rect = bar.getBoundingClientRect()
  const clickX = e.clientX - rect.left
  const width = rect.width
  volume.value = Math.min(100, Math.max(0, (clickX / width) * 100))
  muted.value = false
}

// 歌词点击跳转
const seekToLyric = (seconds) => {
  progress.value = seconds
  updateLyricHighlight()
  if (!isPlaying.value) {
    isPlaying.value = true
    startProgressTimer()
  }
}

// 相似歌曲点击
const playSimilarSong = (song) => {
  console.log('播放相似歌曲:', song.title)
  progress.value = 0
  currentLyricIndex.value = 0
  if (!isPlaying.value) {
    togglePlay()
  }
}

// 其他交互
const handleBack = () => {
  // 先触发退出动画
  isShow.value = false

  // 等待动画完成后返回
  setTimeout(() => {
    window.history.back()
    // 若用路由跳转：router.push('/原页面路径')
  }, 600)
}

const toggleLike = () => {
  isLiked.value = !isLiked.value
}

const toggleShuffle = () => {
  shuffle.value = !shuffle.value
}

const toggleLoop = () => {
  loop.value = !loop.value
}

const toggleMute = () => {
  muted.value = !muted.value
}

const prevSong = () => {
  if (progress.value > 3) {
    progress.value = 0
    currentLyricIndex.value = 0
  }
}

const nextSong = () => {
  if (similarSongs.value.length > 0) {
    const randomIndex = Math.floor(Math.random() * similarSongs.value.length)
    playSimilarSong(similarSongs.value[randomIndex])
  }
}

// 生命周期
onMounted(() => {
  // 延迟显示，确保DOM已渲染
  setTimeout(() => {
    isShow.value = true
  }, 50)
})

onUnmounted(() => {
  stopProgressTimer()
})
</script>
<route lang="yaml">
meta:
  layout: empty
</route>

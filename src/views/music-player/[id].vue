<template>
  <!-- 外层容器 - 优化背景过渡 + 点击遮罩关闭 -->
  <div
    class="fixed inset-0 z-50 transition-all duration-500 ease-in-out"
    :style="{
      backdropFilter: isShow ? 'blur(12px)' : 'blur(0px)',
      backgroundColor: isShow ? 'rgba(15, 15, 21, 0.95)' : 'rgba(15, 15, 21, 0)',
      pointerEvents: isShow ? 'auto' : 'none',
    }"
    @click.self="handleBack"
  >
    <!-- 动画容器 - 优化入场动画（从底部滑入 → 带弹性的滑入） -->
    <div
      class="absolute inset-x-0 bottom-0 w-full transition-all duration-600 ease-out"
      :style="{
        height: '100vh',
        transform: isShow ? 'translateY(0%)' : 'translateY(100%)',
        // 增加弹性效果
        transitionTimingFunction: isShow ? 'cubic-bezier(0.16, 1, 0.3, 1)' : 'ease-in',
      }"
    >
      <!-- 内容容器 - 优化渐变 + 滚动优化 -->
      <div
        class="relative w-full h-full bg-gradient-to-br from-[#0f0f15] via-[#1a1a25] to-[#0f0f15] flex flex-col text-white overflow-hidden"
      >
        <!-- 背景粒子 -->
        <BackgroundParticles />

        <!-- 内容区域 -->
        <div class="relative z-10 flex-1 flex flex-col">
          <!-- 顶部返回按钮 - 优化交互（增加点击反馈） -->
          <div class="px-4 pt-6 pb-2">
            <button
              @click="handleBack"
              class="flex items-center gap-2 text-pink-300 hover:text-pink-200 transition-colors p-2 rounded-full hover:bg-white/5"
            >
              <i class="iconfont text-lg">&#xe62e;</i>
              <span class="text-sm">返回</span>
            </button>
          </div>

          <!-- 主内容区 - 优化加载过渡 + 响应式 -->
          <div
            class="flex-1 flex flex-col lg:flex-row items-center justify-center px-4 md:px-6 gap-4 lg:gap-12 overflow-y-auto pb-16"
            v-if="!loading && songDetail"
            :style="{ opacity: loading ? 0 : 1, transition: 'opacity 0.3s ease' }"
          >
            <!-- 左侧：黑胶唱片区域 - 增加hover动画 -->
            <div class="w-full max-w-[300px] lg:max-w-[350px] flex-shrink-0">
              <VinylPlayer
                :is-playing="playerStore.isPlaying"
                @toggle-play="playerStore.togglePlay"
                :cover-url="songDetail.coverUrl"
                :music-name="songDetail.musicName"
                :artist-name="songDetail.musicianName || '未知歌手'"
                class="hover:scale-[1.02] transition-transform duration-300"
              />
            </div>

            <!-- 右侧：歌曲信息+标签切换区 - 优化布局 + 歌词交互 -->
            <div class="w-full lg:max-w-[500px] flex-1">
              <SongInfoPanel
                :active-tab="activeTab"
                :is-playing="playerStore.isPlaying"
                :current-lyric-index="currentLyricIndex"
                :current-lyric-time="currentLyricTime"
                :progress="playerStore.progress"
                :similar-songs="similarSongs"
                :song-detail="songDetail"
                :lyric-list="formattedLyricList"
                :is-raw-text-lyric="isRawTextLyric"
                @update:active-tab="activeTab = $event"
                @seek-to-lyric="seekToLyric"
                @play-similar-song="playSimilarSong"
                class="h-full"
              />
            </div>
          </div>

          <!-- 加载状态 - 优化动画 + 样式 -->
          <div v-if="loading" class="flex-1 flex flex-col items-center justify-center gap-4">
            <div class="relative">
              <!-- 黑胶加载动画 -->
              <div
                class="w-24 h-24 rounded-full bg-gradient-to-r from-pink-500/20 to-purple-500/20 border-2 border-pink-500/30 animate-spin"
              ></div>
              <div
                class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#1a1a25]"
              ></div>
            </div>
            <p class="text-pink-300 text-sm">正在加载歌曲详情...</p>
          </div>

          <!-- 错误状态 - 优化样式 + 交互 -->
          <div
            v-if="error && !loading"
            class="flex-1 flex flex-col items-center justify-center px-4 gap-6"
          >
            <div class="text-center">
              <div
                class="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mb-4"
              >
                <i class="iconfont icon-error text-4xl text-red-400">&#xe61d;</i>
              </div>
              <p class="text-pink-300 mb-2">{{ error }}</p>
              <button
                @click="retryLoadSong"
                class="px-6 py-2 bg-pink-500/20 text-pink-300 rounded-lg hover:bg-pink-500/30 transition-colors active:scale-95"
              >
                重试加载
              </button>
            </div>
          </div>
        </div>

        <!-- 底部播放控制栏 - 固定定位 + 渐变遮罩 -->
        <div
          class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#0f0f15] to-transparent px-4 py-2"
        >
          <PlayerControls
            :song="playerStore.currentSong"
            :is-playing="playerStore.isPlaying"
            @toggle-play="playerStore.togglePlay"
            @prev="playerStore.playPrevSong"
            @next="playerStore.playNextSong"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getMusicDetail } from '@/api/music'
import { usePlayerStore } from '@/stores/player'
import type { MusicDetailVO, LyricLineDTO, MusicVO } from '@/types/personalCenter'

// 响应式数据
const route = useRoute()
const router = useRouter()
const playerStore = usePlayerStore()

const activeTab = ref('lyric')
const currentLyricIndex = ref(0)
const currentLyricTime = ref('00:00.00')
const isShow = ref(false)

// 计时器变量定义
let backTimer: number | null = null
let showTimer: number | null = null
let debugUnwatch: ReturnType<typeof watch> | null = null

// 歌曲详情相关
const loading = ref(false)
const error = ref('')
const songDetail = ref<MusicDetailVO | null>(null)
const rawLyricList = ref<Array<{ time: number; text: string }>>([]) // 原始毫秒级歌词

// 相似歌曲
const similarSongs = ref<
  Array<{
    id: number | string
    title: string
    similarity: number
    musicName: string
    coverUrl: string
    musicianName: string
    duration: string
    isLiked: 0 | 1
    likeCount: number
    albumId: number
    bpm: number
    commentCount: number
    albumName: ''
    isVip: 0
    musicianId: 0
  }>
>([
  {
    id: 1,
    title: 'Faded',
    musicName: 'Faded',
    musicianName: 'Alan Walker',
    coverUrl: 'https://picsum.photos/id/1019/60/60',
    similarity: 92,
    duration: '03:32',
    isLiked: 0,
    likeCount: 125800,
    albumId: 101,
    bpm: 90,
    commentCount: 8920,
    albumName: '',
    isVip: 0,
    musicianId: 0,
  },
  {
    id: 2,
    title: 'Alone',
    musicName: 'Alone',
    musicianName: 'Marshmello',
    coverUrl: 'https://picsum.photos/id/1020/60/60',
    similarity: 88,
    duration: '02:48',
    isLiked: 0,
    likeCount: 98500,
    albumId: 102,
    bpm: 100,
    commentCount: 7540,
    albumName: '',
    isVip: 0,
    musicianId: 0,
  },
  {
    id: 3,
    title: 'Closer',
    musicName: 'Closer',
    musicianName: 'The Chainsmokers/Halsey',
    coverUrl: 'https://picsum.photos/id/1021/60/60',
    similarity: 85,
    duration: '04:04',
    isLiked: 0,
    likeCount: 156700,
    albumId: 103,
    bpm: 95,
    commentCount: 12300,
    albumName: '',
    isVip: 0,
    musicianId: 0,
  },
])

// ==================== 歌词处理函数 ====================

/**
 * 解析同步歌词（带时间戳）
 */
const parseSyncLyric = (
  syncLyric: any[],
  duration: string = '03:30',
): Array<{ time: number; text: string }> => {
  const result: Array<{ time: number; text: string }> = []

  syncLyric.forEach((item: any) => {
    let timeMs = 0

    // 处理时间字段
    if (typeof item.time === 'number') {
      timeMs = item.time
    } else if (typeof item.time === 'string') {
      // 解析 "00:15.20" 或 "01:23.456" 格式
      const [timePart, msPart = '00'] = item.time.split('.')
      const [minStr = '00', secStr = '00'] = timePart.split(':')

      const minutes = parseInt(minStr) || 0
      const seconds = parseInt(secStr) || 0
      const milliseconds = parseInt(msPart.padEnd(3, '0').substring(0, 3)) || 0

      timeMs = (minutes * 60 + seconds) * 1000 + milliseconds
    }

    result.push({
      time: timeMs,
      text: item.text || '',
    })
  })

  // 按时间排序
  return result.sort((a, b) => a.time - b.time)
}

/**
 * 解析纯文本歌词（按换行符分割）
 */
const parseRawLyricText = (
  text: string,
  duration: string = '03:30',
): Array<{ time: number; text: string }> => {
  console.log('开始解析纯文本歌词，文本长度:', text.length)

  if (!text || text.trim() === '') {
    return [
      { time: 0, text: '暂无歌词' },
      { time: 15000, text: '纯音乐，请欣赏' },
    ]
  }

  // 按换行符分割（支持 \n 和 \r\n）
  const lines = text.split(/\r?\n/).filter((line) => line.trim() !== '')
  console.log('分割后歌词行数:', lines.length)

  if (lines.length === 0) {
    return [
      { time: 0, text: '歌词解析失败' },
      { time: 10000, text: text.substring(0, 30) },
    ]
  }

  // 解析歌曲时长
  const [minStr = '0', secStr = '0'] = duration.split(':')
  const totalSeconds = parseInt(minStr) * 60 + parseInt(secStr)
  const totalMilliseconds = totalSeconds * 1000

  // 分配时间：5秒前奏，3秒尾奏
  const introTime = 5000
  const outroTime = 3000
  const availableTime = totalMilliseconds - introTime - outroTime

  // 计算每行歌词的间隔时间
  const lineInterval = Math.floor(availableTime / Math.max(lines.length, 1))

  // 为每行歌词分配时间
  const result = lines.map((line, index) => ({
    time: introTime + index * lineInterval,
    text: line.trim(),
  }))

  console.log('歌词时间分配:', {
    总时长: `${totalSeconds}秒`,
    前奏: `${introTime}毫秒`,
    每行间隔: `${lineInterval}毫秒`,
    歌词行数: result.length,
  })

  return result
}

/**
 * 毫秒转秒
 */
const msToSeconds = (ms: number): number => {
  return ms / 1000
}

/**
 * 格式化歌词时间（毫秒 → "00:00.00" 格式）
 */
const formatLyricTime = (ms: number): string => {
  const totalSeconds = ms / 1000
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, '0')
  const seconds = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, '0')
  const centiseconds = Math.floor((totalSeconds % 1) * 100)
    .toString()
    .padStart(2, '0')

  return `${minutes}:${seconds}.${centiseconds}`
}

// 格式化歌词（适配组件使用）
const formattedLyricList = computed<LyricLineDTO[]>(() => {
  if (!rawLyricList.value.length) {
    return [
      { time: '00:00.00', text: '暂无歌词' },
      { time: '00:15.00', text: '纯音乐，请欣赏' },
    ]
  }

  return rawLyricList.value.map((item, index) => {
    // 前几行打印调试信息
    if (index < 3) {
      console.log(
        `格式化歌词[${index}]: ${item.time}ms → ${formatLyricTime(item.time)} - "${item.text}"`,
      )
    }

    return {
      time: formatLyricTime(item.time),
      text: item.text || '',
    }
  })
})

// ==================== 歌词高亮逻辑 ====================

/**
 * 更新歌词高亮（根据当前播放时间）
 */
const updateLyricHighlight = (currentTimeSeconds: number) => {
  if (!rawLyricList.value.length) return

  const currentTimeMs = currentTimeSeconds * 1000
  let targetIndex = -1

  // 从后往前找，找到第一个时间小于等于当前时间的歌词
  for (let i = rawLyricList.value.length - 1; i >= 0; i--) {
    const lyric = rawLyricList.value[i]
    if (!lyric) continue

    if (currentTimeMs >= lyric.time) {
      targetIndex = i
      break
    }
  }

  // 如果没找到，使用第一句歌词（播放时间在0之前）
  if (targetIndex === -1 && rawLyricList.value.length > 0) {
    targetIndex = 0
  }

  if (currentLyricIndex.value !== targetIndex && targetIndex !== -1) {
    currentLyricIndex.value = targetIndex

    // 更新当前歌词时间显示
    const targetLyric = rawLyricList.value[targetIndex]
    if (targetLyric) {
      currentLyricTime.value = formatLyricTime(targetLyric.time)
    }

    console.log(
      `歌词高亮更新: 时间=${currentTimeSeconds.toFixed(2)}s, 索引=${targetIndex}, 歌词="${targetLyric?.text}"`,
    )
  }
}

// ==================== 主要业务函数 ====================

/**
 * 加载歌曲详情
 */
const isRawTextLyric = ref(false)
const loadSongDetail = async () => {
  const musicId = route.params.id as string
  if (!musicId) {
    error.value = '未找到歌曲ID'
    return
  }

  loading.value = true
  error.value = ''
  try {
    const res = await getMusicDetail(musicId)
    console.log('歌曲详情API响应:', res)

    if (res.success && res.data) {
      const data = res.data as unknown as MusicDetailVO
      songDetail.value = data

      console.log('歌曲详情数据:', {
        id: data.id,
        歌名: data.musicName,
        歌手: data.musicianName,
        时长: data.duration,
        歌词类型: data.lyricType,
        syncLyric存在: !!data.syncLyric,
        rawLyricText存在: !!data.rawLyricText,
        syncLyric长度: data.syncLyric?.length || 0,
        rawLyricText长度: data.rawLyricText?.length || 0,
      })

      isRawTextLyric.value = false
      if (data.syncLyric && Array.isArray(data.syncLyric) && data.syncLyric.length > 0) {
        console.log('使用同步歌词 (syncLyric)')
        rawLyricList.value = parseSyncLyric(data.syncLyric, data.duration)
      } else if (data.rawLyricText) {
        console.log('使用纯文本歌词 (rawLyricText)')
        rawLyricList.value = parseRawLyricText(data.rawLyricText, data.duration)
        isRawTextLyric.value = true
      } else {
        console.log('使用默认歌词')
        rawLyricList.value = [
          { time: 0, text: '暂无歌词' },
          { time: 15000, text: '纯音乐，请欣赏' },
        ]
      }

      // 确保歌词按时间排序
      rawLyricList.value.sort((a, b) => a.time - b.time)

      console.log('最终歌词数据（前10行）:')
      rawLyricList.value.slice(0, 10).forEach((lyric, index) => {
        console.log(`  [${index}] ${formatLyricTime(lyric.time)} - "${lyric.text}"`)
      })

      // 自动播放歌曲
      const currentSongId = playerStore.currentSong?.id
      const targetSongId = data.id || Number(musicId)

      if (currentSongId !== targetSongId) {
        console.log('开始播放歌曲，ID:', targetSongId)

        const songToPlay: MusicVO = {
          id: targetSongId,
          musicName: data.musicName || '未知歌曲',
          albumId: data.albumId || 0,
          albumName: data.albumName || '',
          bpm: data.bpm || 0,
          commentCount: data.commentCount || 0,
          coverUrl: data.coverUrl || '',
          duration: data.duration || '00:00',
          isLiked: data.isLiked || 0,
          isVip: data.isVip || 0,
          likeCount: data.likeCount || 0,
          musicianId: data.musicianId || 0,
          musicianName: data.musicianName || '未知歌手',
        }

        // 创建播放列表：当前歌曲 + 相似歌曲（转换为MusicVO类型）
        // 确保至少包含当前歌曲，避免播放列表为空
        const playList: MusicVO[] = [
          songToPlay,
          ...similarSongs.value.map(
            (song) =>
              ({
                id: song.id,
                musicName: song.musicName,
                albumId: song.albumId || 0,
                albumName: song.albumName || '',
                bpm: song.bpm || 0,
                commentCount: song.commentCount || 0,
                coverUrl: song.coverUrl || '',
                duration: song.duration || '00:00',
                isLiked: song.isLiked || 0,
                isVip: song.isVip || 0,
                likeCount: song.likeCount || 0,
                musicianId: song.musicianId || 0,
                musicianName: song.musicianName || '未知歌手',
              }) as MusicVO,
          ), // 显式断言每个对象为 MusicVO
        ]
        // 确保播放列表至少包含当前歌曲
        if (playList.length === 0) {
          playList.push(songToPlay)
        }
        await playerStore.playSong(songToPlay, playList)
      } else {
        console.log('歌曲已在播放中，跳过自动播放')
      }
    } else {
      error.value = res.errorMsg || '加载歌曲详情失败'
    }
  } catch (err: any) {
    console.error('加载歌曲详情失败:', err)
    error.value = err.message || '网络异常，加载失败'
  } finally {
    loading.value = false
  }
}

/**
 * 重试加载
 */
const retryLoadSong = () => {
  error.value = ''
  loadSongDetail()
}

/**
 * 歌词点击跳转
 */
const seekToLyric = (targetSeconds: number) => {
  const audio = playerStore.audioInstance
  if (!audio) {
    console.warn('音频实例不存在')
    return
  }

  const totalDuration = audio.duration || 0
  if (totalDuration <= 0) {
    console.warn('音频总时长无效')
    return
  }

  // 计算百分比
  const percentage = (targetSeconds / totalDuration) * 100
  console.log(`跳转歌词: 时间=${targetSeconds.toFixed(2)}s, 百分比=${percentage.toFixed(2)}%`)

  // 设置播放进度
  playerStore.setProgress(percentage)

  // 立即更新歌词高亮
  updateLyricHighlight(targetSeconds)
}

/**
 * 播放相似歌曲
 */
const playSimilarSong = async (song: any) => {
  console.log('播放相似歌曲:', song.title)
  ElMessage.success(`即将播放：${song.title}`)

  const mockSong: MusicVO = {
    id: song.id,
    musicName: song.title,
    albumId: song.albumId || 0,
    albumName: '',
    bpm: song.bpm || 0,
    commentCount: song.commentCount || 0,
    coverUrl: song.cover,
    duration: song.duration || '03:30',
    isLiked: song.isLiked || 0,
    isVip: 0,
    likeCount: song.likeCount || 0,
    musicianId: 0,
    musicianName: song.singer,
  }

  await playerStore.playSong(mockSong)
  activeTab.value = 'lyric'
}

/**
 * 返回处理
 */
const handleBack = () => {
  isShow.value = false
  backTimer = window.setTimeout(() => {
    router.back()
  }, 500)
}

// ==================== 监听与生命周期 ====================

// 监听播放进度，更新歌词高亮
let lyricUpdateTimer: number | null = null
watch(
  () => playerStore.progress,
  (progress) => {
    if (lyricUpdateTimer) clearTimeout(lyricUpdateTimer)

    lyricUpdateTimer = window.setTimeout(() => {
      // playerStore.progress 是当前播放时间（秒）
      console.log(`播放进度更新: ${progress.toFixed(2)}秒`)
      updateLyricHighlight(progress)
    }, 100)
  },
  { immediate: true },
)

// 监听音频实例，获取实际播放信息
watch(
  () => playerStore.audioInstance,
  (audio) => {
    if (audio) {
      console.log('音频实例已加载，时长:', audio.duration, '秒')

      // 监听音频时间更新（备用方案）
      audio.addEventListener('timeupdate', () => {
        console.log('音频时间更新:', audio.currentTime.toFixed(2), '秒')
      })
    }
  },
  { immediate: true },
)

// 监听路由参数id变化，重新加载歌曲详情
watch(
  () => route.params.id,
  (newId, oldId) => {
    if (newId !== oldId) {
      console.log(`路由参数变化: ${oldId} → ${newId}`)
      loadSongDetail()
    }
  },
  { immediate: true },
)

// 监听playerStore.currentSong变化，重新加载歌曲详情
watch(
  () => playerStore.currentSong,
  (newSong, oldSong) => {
    if (newSong && newSong.id && (!oldSong || newSong.id !== oldSong.id)) {
      console.log(`当前播放歌曲变化: ${oldSong?.id || '无'} → ${newSong.id}`)
      // 如果当前路由参数与新歌曲id不一致，更新路由
      if (route.params.id !== String(newSong.id)) {
        // 使用replace而不是push，避免历史记录堆积
        router.replace(`/music-player/${newSong.id}`)
      } else {
        // 如果路由参数一致，直接重新加载歌曲详情
        loadSongDetail()
      }
    }
  },
  { deep: true },
)

onMounted(() => {
  console.log('音乐播放器组件挂载')

  // 立即显示组件
  isShow.value = true

  // 加载歌曲详情
  loadSongDetail()

  // 添加调试监听
  debugUnwatch = watch(
    [() => currentLyricIndex.value, () => playerStore.isPlaying, () => rawLyricList.value.length],
    ([lyricIndex, isPlaying, lyricCount]) => {
      console.log(`调试信息: 歌词索引=${lyricIndex}, 播放状态=${isPlaying}, 歌词行数=${lyricCount}`)
    },
  )
})

// 在组件顶层注册onUnmounted
onUnmounted(() => {
  // 清理所有计时器
  if (showTimer) clearTimeout(showTimer)
  if (backTimer) clearTimeout(backTimer)
  if (lyricUpdateTimer) clearTimeout(lyricUpdateTimer)
  if (debugUnwatch) debugUnwatch()

  // 重置状态
  currentLyricIndex.value = 0
  currentLyricTime.value = '00:00.00'
  rawLyricList.value = []

  console.log('音乐播放器组件卸载')
})
</script>

<route lang="yaml">
meta:
  layout: empty
</route>

<style scoped>
/* 优化滚动条样式 */
::-webkit-scrollbar {
  width: 4px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 2px;
}

::-webkit-scrollbar-thumb {
  background: rgba(236, 72, 153, 0.3);
  border-radius: 2px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(236, 72, 153, 0.5);
}

/* 优化响应式 */
@media (max-width: 768px) {
  .flex-1 {
    overflow-y: auto;
  }

  .lg\:max-w-\[350px\] {
    max-width: 250px !important;
  }
}

/* 增加触摸反馈 */
button {
  -webkit-tap-highlight-color: transparent;
}

/* 歌词面板动画 */
.lyric-item {
  transition: all 0.2s ease;
}

.lyric-item.active {
  color: #ec4899;
  transform: scale(1.02);
}
</style>

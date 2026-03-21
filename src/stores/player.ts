import { defineStore } from 'pinia'
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getMusicPlayUrl } from '@/api/music'
import type { MusicPlayVO, MusicVO } from '@/types/personalCenter'

export const usePlayerStore = defineStore(
  'player',
  () => {
    // 核心播放状态
    const currentSong = ref<MusicPlayVO | null>(null)
    const audioInstance = ref<HTMLAudioElement | null>(null)
    const isPlaying = ref(false)
    const progress = ref(0) // 当前播放时间（秒）
    const progressPercentage = ref(0) // 进度百分比
    const volume = ref(80)
    const muted = ref(false)
    const shuffle = ref(false)
    const loop = ref(false)
    const isLiked = ref(false)
    const audioLoadingError = ref(false)

    // 播放列表
    const playList = ref<MusicVO[]>([])
    const currentIndex = ref(-1)

    // 格式化时间方法
    const formatTime = (time: number | string) => {
      let seconds: number
      if (typeof time === 'string') {
        // 处理 "04:10" 格式
        const [min, sec] = time.split(':')
        seconds = parseInt(min) * 60 + parseFloat(sec || '0')
      } else {
        seconds = time
      }
      const min = Math.floor(seconds / 60)
      const sec = Math.floor(seconds % 60)
      return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`
    }

    // 初始化音频实例
    const initAudio = () => {
      // 确保音频实例始终有效
      if (!audioInstance.value || !(audioInstance.value instanceof HTMLAudioElement)) {
        try {
          // 创建新的音频实例
          audioInstance.value = new Audio()

          // 添加事件监听
          audioInstance.value.addEventListener('error', handleAudioError)
          audioInstance.value.addEventListener('timeupdate', handleTimeUpdate)
          audioInstance.value.addEventListener('ended', handlePlayEnd)
          audioInstance.value.addEventListener('loadedmetadata', handleLoadedMetadata)
        } catch (error) {
          console.error('创建音频实例失败:', error)
          // 如果创建失败，再次尝试
          audioInstance.value = new Audio()
        }
      }
      return audioInstance.value
    }

    const handleLoadedMetadata = () => {
      console.log('音频元数据加载完成，时长:', audioInstance.value?.duration, '秒')
      audioLoadingError.value = false
    }

    // 音频错误处理
    const handleAudioError = (e: Event) => {
      console.error('音频播放错误:', e)
      const audio = e.target as HTMLAudioElement
      isPlaying.value = false
      audioLoadingError.value = true

      let errorMsg = '音频加载失败，请尝试刷新'
      if (audio.error) {
        switch (audio.error.code) {
          case MediaError.MEDIA_ERR_ABORTED:
            errorMsg = '音频加载被中断'
            break
          case MediaError.MEDIA_ERR_NETWORK:
            errorMsg = '网络异常，音频加载失败'
            break
          case MediaError.MEDIA_ERR_DECODE:
            errorMsg = '音频格式不支持或文件损坏（建议使用MP3格式）'
            break
          case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
            errorMsg = '音频链接无效或不被支持'
            break
        }
      }

      ElMessage.error(errorMsg)

      // 自动切换到下一首
      setTimeout(() => {
        if (playList.value.length > 0 && currentIndex.value >= 0) {
          console.log('尝试自动切换到下一首歌曲')
          playNextSong()
        }
      }, 1000)
    }

    // 播放进度更新
    const handleTimeUpdate = () => {
      if (!audioInstance.value || !currentSong.value || audioLoadingError.value) return

      const currentTime = audioInstance.value.currentTime
      const duration = audioInstance.value.duration || 0

      if (duration > 0) {
        progress.value = currentTime
        progressPercentage.value = (currentTime / duration) * 100
      }
    }

    // 播放结束处理
    const handlePlayEnd = () => {
      if (audioLoadingError.value) return

      if (loop.value) {
        playCurrentSong()
      } else if (shuffle.value) {
        playRandomSong()
      } else {
        playNextSong()
      }
    }

    // 音频质量映射函数
    const mapQuality = (audioList?: string[]): number => {
      if (!audioList || !Array.isArray(audioList) || audioList.length === 0) {
        return 1 // 默认标准音质
      }

      // 优先选择最高质量
      if (audioList.includes('空间音质')) return 4
      if (audioList.includes('无损')) return 3
      if (audioList.includes('高清')) return 2
      if (audioList.includes('标准')) return 1

      return 1 // 默认标准音质
    }

    // 播放歌曲
    const playSong = async (song: MusicVO, playListData?: MusicVO[]) => {
      audioLoadingError.value = false

      try {
        // 更新播放列表
        if (playListData && Array.isArray(playListData) && playListData.length > 0) {
          playList.value = playListData
          currentIndex.value = playList.value.findIndex((item) => item.id === song.id)
        } else {
          // 如果没有提供播放列表，检查现有播放列表
          if (playList.value.length === 0) {
            // 如果现有播放列表为空，创建一个包含当前歌曲的播放列表
            playList.value = [song]
            currentIndex.value = 0
          } else {
            // 如果现有播放列表不为空，保留现有播放列表
            // 只更新currentIndex以反映当前播放的歌曲
            const songIndex = playList.value.findIndex((item) => item.id === song.id)
            if (songIndex !== -1) {
              currentIndex.value = songIndex
            }
          }
        }

        // 获取播放链接
        const res = await getMusicPlayUrl({
          musicId: String(song.id),
          quality: mapQuality(song.audioList),
        })
        console.log('获取播放链接响应:', res)
        if (!res || !res.success) {
          throw new Error(res?.errorMsg || '获取播放链接失败')
        }

        const songData = res.data as MusicPlayVO
        if (!songData || !songData.audioUrl) {
          throw new Error('未获取到有效音频链接')
        }

        // 初始化音频
        const audio = initAudio()

        // 清空旧资源
        audio.pause()
        audio.src = ''

        // 设置新资源
        currentSong.value = songData
        isLiked.value = songData.isLiked === 1
        audio.src = songData.audioUrl

        // 等待音频加载
        await new Promise<void>((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error('音频加载超时'))
          }, 10000)

          const onLoaded = () => {
            clearTimeout(timeout)
            audio.removeEventListener('canplaythrough', onLoaded)
            audio.removeEventListener('error', onError)
            resolve()
          }

          const onError = () => {
            clearTimeout(timeout)
            audio.removeEventListener('canplaythrough', onLoaded)
            audio.removeEventListener('error', onError)
            reject(new Error('音频加载失败'))
          }

          audio.addEventListener('canplaythrough', onLoaded)
          audio.addEventListener('error', onError)
        })

        // 尝试播放
        try {
          await audio.play()
          isPlaying.value = true
          console.log('开始播放歌曲:', songData.musicName)
        } catch (playError: any) {
          console.warn('自动播放失败:', playError.name, playError.message)
          isPlaying.value = false

          if (playError.name === 'NotAllowedError') {
            ElMessage.warning('请点击播放按钮手动播放')
          } else {
            ElMessage.error('播放失败，请检查音频文件')
          }
        }
      } catch (error: any) {
        console.error('播放歌曲失败:', error)
        isPlaying.value = false
        currentSong.value = null
        audioLoadingError.value = true
        ElMessage.error(error.message || '播放失败，请重试')
      }
    }

    // 播放当前歌曲
    const playCurrentSong = async () => {
      if (!currentSong.value || !audioInstance.value) {
        ElMessage.warning('暂无播放歌曲')
        return
      }

      try {
        // 检查音频是否可以正常加载
        if (audioLoadingError.value || !audioInstance.value.src) {
          // 如果加载失败或没有音频源，重新获取播放链接
          console.log('音频加载失败或链接失效，重新获取播放链接')

          const res = await getMusicPlayUrl({
            musicId: String(currentSong.value.id),
            quality: mapQuality(currentSong.value.audioList),
          })

          if (!res || !res.success || !res.data?.audioUrl) {
            throw new Error('获取播放链接失败')
          }

          // 更新音频源
          audioInstance.value.src = res.data.audioUrl
          currentSong.value.audioUrl = res.data.audioUrl
          audioLoadingError.value = false
        }

        await audioInstance.value.play()
        isPlaying.value = true
      } catch (error) {
        console.error('继续播放失败:', error)
        isPlaying.value = false
        audioLoadingError.value = true
        ElMessage.error('播放失败，请检查网络或重新加载页面')
      }
    }

    // 暂停播放
    const pauseSong = () => {
      if (audioInstance.value) {
        audioInstance.value.pause()
        isPlaying.value = false
      }
    }

    // 切换播放/暂停
    const togglePlay = () => {
      if (!currentSong.value) {
        ElMessage.warning('暂无播放歌曲')
        return
      }
      if (audioLoadingError.value) {
        ElMessage.warning('音频加载失败，无法播放')
        return
      }
      isPlaying.value ? pauseSong() : playCurrentSong()
    }

    // 播放下一首/上一首/随机
    const playNextSong = () => {
      if (playList.value.length === 0) {
        ElMessage.warning('播放列表为空')
        return
      }
      audioLoadingError.value = false
      const newIndex = (currentIndex.value + 1) % playList.value.length
      const nextSong = playList.value[newIndex]
      if (nextSong) {
        currentIndex.value = newIndex
        playSong(nextSong)
      }
    }

    const playPrevSong = () => {
      if (playList.value.length === 0) {
        ElMessage.warning('播放列表为空')
        return
      }
      audioLoadingError.value = false
      const newIndex = (currentIndex.value - 1 + playList.value.length) % playList.value.length
      const prevSong = playList.value[newIndex]
      if (prevSong) {
        currentIndex.value = newIndex
        playSong(prevSong)
      }
    }

    const playRandomSong = () => {
      if (playList.value.length === 0) {
        ElMessage.warning('播放列表为空')
        return
      }
      audioLoadingError.value = false
      const randomIndex = Math.floor(Math.random() * playList.value.length)
      const randomSong = playList.value[randomIndex]
      if (randomSong) {
        currentIndex.value = randomIndex
        playSong(randomSong)
      }
    }

    // 调整播放进度
    const setProgress = (percentage: number) => {
      if (!audioInstance.value || !currentSong.value || audioLoadingError.value) return

      const clampedPercent = Math.max(0, Math.min(100, percentage))
      const duration = audioInstance.value.duration || 0

      if (duration > 0) {
        const newTime = (clampedPercent / 100) * duration
        audioInstance.value.currentTime = newTime
        progress.value = newTime
        progressPercentage.value = clampedPercent

        console.log(`设置播放进度: ${newTime.toFixed(2)}s (${clampedPercent.toFixed(2)}%)`)
      }
    }

    // 调整音量
    const setVolume = (newVolume: number) => {
      if (!audioInstance.value) return
      const clampedVolume = Math.max(0, Math.min(100, newVolume))
      volume.value = clampedVolume
      muted.value = clampedVolume === 0
      audioInstance.value.volume = clampedVolume / 100
    }

    // 切换静音
    const toggleMute = () => {
      if (!audioInstance.value) return
      muted.value = !muted.value
      audioInstance.value.volume = muted.value ? 0 : volume.value / 100
    }

    // 切换随机/循环/点赞
    const toggleShuffle = () => {
      shuffle.value = !shuffle.value
      ElMessage.success(shuffle.value ? '已开启随机播放' : '已关闭随机播放')
    }

    const toggleLoop = () => {
      loop.value = !loop.value
      ElMessage.success(loop.value ? '已开启单曲循环' : '已关闭单曲循环')
    }

    const toggleLike = async () => {
      if (!currentSong.value) {
        ElMessage.warning('暂无播放歌曲')
        return
      }
      isLiked.value = !isLiked.value
      ElMessage.success(isLiked.value ? '已喜欢该歌曲' : '已取消喜欢')
    }

    // 销毁音频实例
    const destroyAudio = () => {
      if (audioInstance.value) {
        audioInstance.value.pause()
        audioInstance.value.src = ''
        audioInstance.value.load()
        audioInstance.value = null
      }
      isPlaying.value = false
      currentSong.value = null
      progress.value = 0
      progressPercentage.value = 0
      audioLoadingError.value = false
    }

    // 页面加载时从持久化存储恢复状态后，需要执行的初始化逻辑
    onMounted(() => {
      if (currentSong.value) {
        // 重新创建音频实例
        const audio = initAudio()

        // 设置音频源
        audio.src = currentSong.value.audioUrl

        // 恢复播放进度
        if (progress.value > 0) {
          audio.currentTime = progress.value
        }

        // 刷新后保持暂停状态
        isPlaying.value = false

        // 初始化音量
        audio.volume = volume.value / 100
        audio.muted = muted.value
      }
    })

    return {
      // 状态
      currentSong,
      isPlaying,
      progress,
      progressPercentage,
      volume,
      muted,
      shuffle,
      loop,
      isLiked,
      playList,
      currentIndex,
      audioLoadingError,
      audioInstance,

      // 方法
      formatTime,
      playSong,
      togglePlay,
      playNextSong,
      playPrevSong,
      playRandomSong,
      setProgress,
      setVolume,
      toggleMute,
      toggleShuffle,
      toggleLoop,
      toggleLike,
      destroyAudio,
    }
  },
  {
    persist: {
      paths: [
        'currentSong',
        'progress',
        'progressPercentage',
        'volume',
        'muted',
        'shuffle',
        'loop',
        'isLiked',
        'playList',
        'currentIndex',
        'audioLoadingError',
      ],
      storage: localStorage,
    } satisfies import('pinia-plugin-persistedstate').PersistOptions,
  },
)

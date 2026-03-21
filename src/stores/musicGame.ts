// src/stores/musicGame.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// 定义歌曲类型（替代any，提升类型安全）
interface Song {
  id: number | string
  name: string
  singer: string
  lyric: string[]
  audioUrl: string
  difficulty: 'easy' | 'medium' | 'hard'
}

export const useMusicGameStore = defineStore('musicGame', () => {
  // ========== 状态 ==========
  // 歌曲库（核心状态）
  const songLibrary = ref<Song[]>([])
  // 最后更新时间（用于定时更新）
  const lastUpdateTime = ref<string>('')

  // ========== 计算属性 ==========
  // 按难度过滤歌曲（替代原getSongsByDifficulty）
  const songsByDifficulty = computed(() => {
    return (difficulty: 'easy' | 'medium' | 'hard') => {
      return songLibrary.value.filter((song) => song.difficulty === difficulty)
    }
  })

  // ========== 方法 ==========
  // 1. 存储歌曲库（同步到localStorage）
  const saveSongLibrary = (songs: Song[]) => {
    songLibrary.value = songs
    // 持久化到localStorage（需序列化）
    localStorage.setItem('musicGame_songLibrary', JSON.stringify(songs))
    // 更新最后修改时间
    lastUpdateTime.value = Date.now().toString()
    localStorage.setItem('musicGame_lastUpdate', lastUpdateTime.value)
  }

  // 2. 从localStorage加载歌曲库
  const loadSongLibrary = () => {
    const storedSongs = localStorage.getItem('musicGame_songLibrary')
    const storedUpdateTime = localStorage.getItem('musicGame_lastUpdate')

    if (storedSongs) {
      songLibrary.value = JSON.parse(storedSongs)
    }
    if (storedUpdateTime) {
      lastUpdateTime.value = storedUpdateTime
    }
  }

  // 3. 清空歌曲库
  const clearSongLibrary = () => {
    songLibrary.value = []
    localStorage.removeItem('musicGame_songLibrary')
    localStorage.removeItem('musicGame_lastUpdate')
  }

  // 4. 检查是否需要更新（超过24小时）
  const needUpdate = () => {
    if (!lastUpdateTime.value) return true
    const now = Date.now()
    const diff = now - Number(lastUpdateTime.value)
    // 24小时 = 86400000 毫秒
    return diff > 86400000
  }

  // ========== 初始化 ==========
  // 页面加载时自动从localStorage加载
  loadSongLibrary()

  return {
    songLibrary,
    lastUpdateTime,
    songsByDifficulty,
    saveSongLibrary,
    loadSongLibrary,
    clearSongLibrary,
    needUpdate,
  }
})

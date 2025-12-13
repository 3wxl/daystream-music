// src/stores/playList.ts
import { defineStore } from 'pinia'
import type { PlaylistVO } from '@/types/personalCenter/index'

export const usePlaylistStore = defineStore('playlist', {
  state: () => ({
    currentPlaylistId: '',
    currentPlaylistBasicInfo: null as PlaylistVO | null,
  }),
  actions: {
    setCurrentPlaylist(id: number | string, basicInfo?: PlaylistVO) {
      // 加调试日志：确认方法是否执行、ID是否正确
      console.log('Pinia存入ID：', {
        原始ID: id,
        转字符串后: String(id),
        基础信息: basicInfo?.name,
      })
      this.currentPlaylistId = String(id)
    },
    clearCurrentPlaylist() {
      console.log('Pinia清空ID')
      this.currentPlaylistId = ''
      this.currentPlaylistBasicInfo = null
    },
  },
})

<template>
  <div
    class="works-container min-h-screen bg-linear-to-br from-[#1a0f1f] via-[#050505] to-[#1a0b2e] text-white pt-24 pb-10 px-4 md:px-8"
  >
    <div class="max-w-7xl mx-auto">
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1
            class="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-pink-500 to-orange-400"
          >
            作品管理
          </h1>
          <p class="text-gray-400 mt-2 text-sm">管理你的音乐、专辑与歌单</p>
        </div>
        <div class="flex gap-3"></div>
      </div>

      <div class="flex gap-8 border-b border-gray-800 mb-8">
        <button
          v-for="tab in tabs"
          :key="tab.value"
          @click="currentTab = tab.value"
          class="pb-4 px-2 text-sm font-medium transition-all relative"
          :class="currentTab === tab.value ? 'text-pink-500' : 'text-gray-400 hover:text-white'"
        >
          {{ tab.label }}
          <span
            v-if="currentTab === tab.value"
            class="absolute bottom-0 left-0 w-full h-0.5 bg-linear-to-r from-pink-500 to-orange-400"
          ></span>
        </button>
      </div>

      <div>
        <!-- 歌曲块 -->
        <MySongs v-if="currentTab === 'songs'" />
        <!-- 专辑块 -->
        <MyAlbums v-else-if="currentTab === 'albums'" />
        <!-- 歌单块 -->
        <MyPlaylists v-else-if="currentTab === 'playlists'" />
        <!-- MV块 -->
        <MyMVs v-else-if="currentTab === 'mvs'" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import MyAlbums from '@/components/MusicUpload/MyAlbums.vue'
import MyMVs from '@/components/MusicUpload/MyMVs.vue'
import MyPlaylists from '@/components/MusicUpload/MyPlaylists.vue'
import MySongs from '@/components/MusicUpload/MySongs.vue'
import { ref } from 'vue'

const currentTab = ref('songs')
const tabs = [
  { label: '歌曲', value: 'songs' },
  { label: '专辑', value: 'albums' },
  { label: '歌单', value: 'playlists' },
  { label: 'MV', value: 'mvs' },
]
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

:deep(.dark-dialog) {
  background: #1a1b1e;
  border: 1px solid #333;
}
:deep(.el-dialog__title) {
  color: white;
}
:deep(.el-form-item__label) {
  color: #ccc;
}
:deep(.dark-input .el-input__wrapper) {
  background-color: #0f1014;
  box-shadow: 0 0 0 1px #333 inset;
}
:deep(.dark-input .el-input__inner) {
  color: white;
}
</style>

<route lang="yaml">
meta:
  layout: musician
</route>

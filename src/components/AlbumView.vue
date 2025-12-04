<template>
  <div class="h-full flex flex-col bg-gray-800 rounded-lg">
    <header class="shrink-0 p-4 flex items-center justify-between border-b border-purple-900/50">
      <div>
        <h1 class="text-lg font-semibold text-gray-500">{{ info.title }}</h1>
      </div>

      <div class="flex items-center space-x-3">
        <button
          class="w-9 h-9 flex items-center justify-center rounded-full bg-pink-600 text-white hover:bg-pink-500 transition-colors"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"
            ></path>
          </svg>
        </button>
        <button
          class="w-9 h-9 flex items-center justify-center rounded-full bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
              clip-rule="evenodd"
            ></path>
          </svg>
        </button>
        <button
          class="w-9 h-9 flex items-center justify-center rounded-full bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              d="M10 3a1 1 0 011 1v4h4a1 1 0 110 2h-4v4a1 1 0 11-2 0v-4H5a1 1 0 110-2h4V4a1 1 0 011-1z"
            ></path>
          </svg>
        </button>
        <button
          class="w-9 h-9 flex items-center justify-center rounded-full bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clip-rule="evenodd"
            ></path>
          </svg>
        </button>
      </div>
    </header>

    <div class="flex-grow flex flex-col md:flex-row overflow-hidden">
      <div class="w-full md:w-1/4 flex-shrink-0 overflow-y-auto p-6 space-y-4 music-content">
        <img
          :src="info.cover"
          alt="Album Cover"
          class="w-full rounded-lg shadow-lg aspect-square object-cover"
        />

        <div class="flex items-center space-x-2">
          <img :src="info.creatorAvatar" alt="Creator Avatar" class="w-8 h-8 rounded-full" />
          <span class="text-sm font-medium text-gray-200">{{ info.creatorName }}</span>
        </div>

        <div class="text-xs text-gray-400">
          <span>歌曲总数：{{ info.count }}首</span>
        </div>

        <p class="text-sm text-gray-300 leading-relaxed">
          {{ info.description }}
        </p>
        <p class="text-sm text-gray-300 leading-relaxed">
          这里是更多的简介内容，用于测试滚动条。Lorem ipsum dolor sit amet, consectetur adipiscing
          elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
          veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </p>
        <p class="text-sm text-gray-300 leading-relaxed">
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
          nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
          deserunt mollit anim id est laborum.
        </p>
        <p class="text-sm text-gray-300 leading-relaxed">
          Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque
          laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi
          architecto beatae vitae dicta sunt explicabo.
        </p>
      </div>

      <div class="w-full md:flex-grow overflow-y-auto p-6 space-y-2 music-items">
        <MusicListItem :items="musicList" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import MusicListItem from '@/components/MusicListItem.vue'
import { computed } from 'vue'

const props = defineProps(['playlist', 'albumlist', 'musicList'])

const info = computed(() => {
  const data = props.playlist || props.albumlist || {}
  return {
    title: data.name || data.albumName || '未知标题',
    cover: data.coverImg || data.coverUrl || data.imgUrl || 'https://placehold.co/400x400/333/FFF?text=No+Cover',
    creatorName: data.creator?.name || data?.singerName || data.artist || '未知艺术家',
    creatorAvatar: data.creator?.avatar || data?.artistAvatar || 'https://placehold.co/100x100/333/FFF?text=A',
    description: data.description || data.introduction || '暂无简介',
    count: data.musicCount || data.colletCount || 0
  }
})
</script>



<style lang="scss" scoped>
.music-content,
.music-items {
  -ms-overflow-style: none;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
}
</style>

<template>
  <div v-if="likedSongs.length === 0" class="py-12 text-center">
    <el-empty description="空空如也" class="text-gray-500" />
  </div>

  <div class="song-list">
    <div
      v-for="(song, index) in likedSongs"
      :key="song.id"
      class="relative flex items-center px-5 py-3 hover:bg-gray-800/30 transition-colors group cursor-pointer justify-between"
    >
      <div class="flex items-center shrink-0 w-[280px]">
        <div class="w-8 text-center text-gray-400 mr-4">
          <span class="inline-block text-gray-400 group-hover:hidden transition-opacity">{{
            index + 1
          }}</span>
          <i class="iconfont text-pink-500 hidden group-hover:inline-block transition-opacity"
            >&#xe638;</i
          >
        </div>
        <img :src="song.cover" class="w-10 h-10 rounded object-cover shrink-0" />
        <div class="ml-3 min-w-0">
          <div class="flex items-center gap-2 mb-0.5">
            <span
              class="text-white text-sm font-medium group-hover:text-pink-400 transition-colors truncate max-w-[150px]"
            >
              {{ song.name }}
            </span>
            <template v-for="(tag, tagIndex) in song.tags" :key="tagIndex">
              <span :class="getTagClass(tag)" class="text-xs px-1.5 py-0.25 rounded">
                {{ tag }}
              </span>
            </template>
          </div>
          <div class="text-gray-500 text-xs truncate">
            {{ song.artist }}
          </div>
        </div>
      </div>

      <div class="flex items-center w-[500px]">
        <div class="flex items-center gap-6 opacity-0 group-hover:opacity-100 transition-opacity">
          <el-tooltip content="下载" placement="top" custom-class="tooltip-small">
            <el-button
              type="text"
              class="text-gray-400 hover:text-white transition-colors p-0 text-sm"
              style="
                width: 20px;
                height: 20px;
                display: flex;
                alignment-baseline: center;
                justify-content: center;
              "
            >
              <i class="iconfont text-sm">&#xe605;</i>
            </el-button>
          </el-tooltip>

          <el-tooltip content="添加到歌单" placement="top">
            <button
              class="flex items-center justify-center w-5 h-5 transition-colors"
              :class="song.isLiked ? 'text-amber-400' : 'text-gray-400 hover:text-amber-400'"
              @click.stop="handleLike(song.id)"
            >
              <i class="iconfont text-sm">&#xe6cb;</i>
            </button>
          </el-tooltip>

          <el-tooltip content="评论" placement="top">
            <button
              class="flex items-center justify-center w-5 h-5 text-gray-400 hover:text-white transition-colors"
            >
              <i class="iconfont text-sm">&#xe62c;</i>
            </button>
          </el-tooltip>
          <el-tooltip content="分享" placement="top">
            <button
              class="flex items-center justify-center w-5 h-5 text-gray-400 hover:text-white transition-colors"
            >
              <i class="iconfont text-sm">&#xe64f;</i>
            </button>
          </el-tooltip>
        </div>
        <div class="w-[200px] text-gray-500 text-xs text-center">
          {{ song.album }}
        </div>
      </div>

      <div class="flex items-center gap-3 shrink-0 w-[100px] justify-end">
        <i
          class="iconfont cursor-pointer transition-all text-lg"
          :class="song.isLiked ? 'text-[#FF4D4F]' : 'text-gray-500 hover:text-[#FF4D4F]'"
          @click.stop="handleLike(song.id)"
        >
          &#xe8c3;
        </i>
        <div class="text-gray-500 text-xs">
          {{ formatTime(song.duration) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const visible = ref(false)
const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

const getTagClass = (tag: string) => {
  switch (tag) {
    case '超清母带':
      return 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
    case 'VIP':
      return 'bg-pink-500/20 text-pink-400 border border-pink-500/30'
    case 'MV':
      return 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
    case '无损':
      return 'bg-green-500/20 text-green-400 border border-green-500/30'
    default:
      return 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
  }
}

const likedSongs = ref([
  {
    id: 1,
    name: '夏日晚风',
    artist: 'Daystream Music',
    album: '晚风集',
    cover: 'https://picsum.photos/80/80?random=1',
    duration: 237,
    tags: ['超清母带', 'MV'],
    isLiked: true,
  },
  {
    id: 2,
    name: '星光坠落时',
    artist: 'Daystream Music',
    album: '星光合集',
    cover: 'https://picsum.photos/80/80?random=2',
    duration: 198,
    tags: ['VIP', '无损'],
    isLiked: false,
  },
  {
    id: 3,
    name: '城市浪漫',
    artist: 'Daystream Music',
    album: '城市之声',
    cover: 'https://picsum.photos/80/80?random=3',
    duration: 215,
    tags: ['超清母带'],
    isLiked: true,
  },
  {
    id: 4,
    name: '深海回响',
    artist: 'Daystream Music',
    album: '深海秘境',
    cover: 'https://picsum.photos/80/80?random=4',
    duration: 242,
    tags: [],
    isLiked: false,
  },
])

const handleLike = (songId: number) => {
  const song = likedSongs.value.find((item) => item.id === songId)
  if (song) song.isLiked = !song.isLiked
}
</script>

<style scoped>
::v-deep .text-\[\#FF4D4F\] {
  text-shadow: 0 0 6px rgba(255, 77, 79, 0.4);
}

button.text-amber-400,
button.hover\:text-amber-400:hover {
  transform: scale(1.1);
}

.iconfont.hover\:text-\[\#FF4D4F\]:hover {
  transform: scale(1.1);
}
</style>

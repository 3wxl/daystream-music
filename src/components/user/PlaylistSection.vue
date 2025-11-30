<template>
  <div
    class="grid grid-cols-2 sm:grid-cols-auto-fill md:grid-cols-auto-fill lg:grid-cols-auto-fill gap-6"
    style="grid-template-columns: repeat(auto-fill, minmax(180px, 1fr))"
  >
    <div v-for="playlist in likedPlaylists" :key="playlist.id" class="group w-[180px]">
      <div class="relative overflow-hidden rounded-lg mb-2 aspect-square">
        <img
          :src="playlist.cover"
          class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div
          class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
        >
          <div
            class="w-12 h-12 rounded-full bg-pink-500 flex items-center justify-center transform translate-y-4 group-hover:translate-y-0 transition-transform"
          >
            <i class="iconfont icon-play" style="font-size: 20px; color: white">&#xe623;</i>
          </div>
        </div>
      </div>
      <div
        class="text-white text-sm font-medium line-clamp-1 group-hover:text-pink-400 transition-colors"
      >
        {{ playlist.name }}
      </div>
      <div class="text-gray-500 text-xs mt-1">{{ playlist.songCount }}首歌曲</div>
    </div>
  </div>
</template>

<script setup lang="ts">
const likedPlaylists = ref([
  { id: 1, name: '治愈系民谣', cover: 'https://picsum.photos/200/200?random=3', songCount: 24 },
  { id: 2, name: '深夜电子', cover: 'https://picsum.photos/200/200?random=4', songCount: 18 },
  { id: 3, name: '雨天BGM', cover: 'https://picsum.photos/200/200?random=5', songCount: 32 },
])

const createdPlaylists = ref([
  { id: 101, name: '我的私藏列表', cover: 'https://picsum.photos/200/200?random=6', songCount: 32 },
  { id: 102, name: '健身BGM', cover: 'https://picsum.photos/200/200?random=7', songCount: 15 },
  { id: 103, name: '通勤必备', cover: 'https://picsum.photos/200/200?random=8', songCount: 42 },
])
</script>

<style lang="scss" scoped>
::v-deep .el-input__inner {
  background-color: transparent !important;
  border: none !important;
  padding: 0 !important;
  color: white !important;
}

::v-deep .el-textarea__inner {
  background-color: transparent !important;
  border: none !important;
  resize: none !important;
  color: white !important;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.scrollbar-custom::-webkit-scrollbar {
  width: 8px;
}

.scrollbar-custom::-webkit-scrollbar-track {
  background: #2d2d2d;
  border-radius: 4px;
}

.scrollbar-custom::-webkit-scrollbar-thumb {
  background: #555;
  border-radius: 4px;
  transition: background 0.3s;
}

.scrollbar-custom::-webkit-scrollbar-thumb:hover {
  background: #888;
}

.fixed > div:last-child {
  animation: fadeIn 0.3s ease-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.cover-upload ::v-deep .el-upload {
  width: 100%;
}
::v-deep .el-textarea {
  --el-textarea-border-color: transparent !important;
}

::v-deep .el-textarea__wrapper {
  border: none !important;
  box-shadow: 0 0 0 1px transparent !important;
  transition: all 0.3s ease !important;
}

::v-deep .el-textarea__wrapper:hover {
  box-shadow: 0 0 0 1px rgba(255, 46, 147, 0.3) !important;
}

::v-deep .el-textarea:focus-within .el-textarea__wrapper {
  box-shadow:
    0 0 0 2px rgba(255, 46, 147, 0.5),
    0 0 8px rgba(255, 46, 147, 0.2) !important;
  outline: none !important;
}

::v-deep .el-textarea.is-disabled .el-textarea__wrapper {
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.05) !important;
  background-color: #121212 !important;
}
</style>

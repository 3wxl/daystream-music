<template>
  <div class="daily-recommend-page bg-[#0b0f1b] min-h-screen text-white">
    <div class="header-banner h-64 relative flex items-end px-10 pb-8">
      <div class="absolute inset-0 overflow-hidden">
        <img src="https://picsum.photos/seed/recommend/1200/400" class="w-full h-full object-cover opacity-40 blur-sm" />
        <div class="absolute inset-0 bg-linear-to-t from-[#0b0f1b] to-transparent"></div>
      </div>
      <div class="relative z-10 flex items-center gap-6">
        <div class="w-40 h-40 rounded-2xl shadow-2xl overflow-hidden border border-white/10">
          <img src="https://picsum.photos/seed/recommend/400/400" class="w-full h-full object-cover" />
        </div>
        <div>
          <h1 class="text-4xl font-bold mb-2">每日歌曲推荐</h1>
          <p class="text-gray-400">根据你的听歌口味，每天 6:00 更新</p>
          <div class="mt-4 flex gap-3">
             <el-button type="primary" class="play-btn" @click="handlePlayAll">
                <i class="iconfont mr-1">&#xe623;</i> 播放全部
             </el-button>
          </div>
        </div>
      </div>
    </div>

    <div class="px-10 py-8">
       <div v-if="loading" class="py-20 text-center text-gray-500">
          <i class="iconfont animate-spin text-2xl inline-block">&#xe623;</i>
          <p class="mt-2">正在为您生成专属推荐...</p>
       </div>
       <LikedSongs v-else :likedSongs="songs" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getRecommendMusic } from '@/api/home'
import LikedSongs from '@/components/user/LikedSongs.vue'
import { usePlayerStore } from '@/stores/player'
import { ElMessage } from 'element-plus'

const songs = ref<any[]>([])
const loading = ref(false)
const playerStore = usePlayerStore()

const loadData = async () => {
  loading.value = true
  try {
    const res: any = await getRecommendMusic()
    if (res.success && res.data) {
      // 这里的转换逻辑需要和 index.vue 保持一致，并确保符合 LikedSongs 期望的 MusicVO
      songs.value = res.data.map((item: any) => ({
        id: String(item.itemId || item.id), // 强制转字符串防止类型错误
        musicName: item.songName,
        musicianName: item.singer,
        coverUrl: item.coverUrl,
        albumName: '推荐',
        duration: '03:30', // 后端未返回，暂定
        isLiked: 0
      }))
    }
  } catch (error) {
    console.error('加载推荐失败', error)
  } finally {
    loading.value = false
  }
}

const handlePlayAll = () => {
  if (songs.value.length > 0) {
    playerStore.playSong(songs.value[0], songs.value)
  } else {
    ElMessage.warning('暂无歌曲可播放')
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped lang="scss">
.daily-recommend-page {
  padding-bottom: 100px;
}
.play-btn {
  background: linear-gradient(135deg, #ec4899, #f43f5e) !important;
  border: none !important;
  padding: 12px 24px !important;
  border-radius: 999px !important;
  font-weight: 600 !important;
  transition: transform 0.3s ease !important;
  &:hover {
    transform: scale(1.05);
  }
}
</style>

<route lang="yaml">
meta:
  layout: main
</route>

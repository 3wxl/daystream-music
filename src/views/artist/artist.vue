<template>
  <div class="music-card-container">
    <div class="music-card">
      <MusicCard
        v-for="item in musicData"
        :to="item.to"
        :img-url="item.data.imgUrl"
        variant="artist"
        show-play-button
        :key="item.id"
      >
        <span class="font-bold text-lg text-gray-300" style="font-size: 14px">{{ item.data.songCount }}</span>
        <span class="font-bold text-2xl truncate w-full group-hover:block" :title="item.data.singerName">{{ item.data.singerName }}</span>
      </MusicCard>
    </div>
  </div>
</template>

<script lang="ts" setup>
import MusicCard from '@/components/MusicCard.vue'
import { ref, onMounted } from 'vue'
import { getAllMusician } from '@/api/artist'
import { ElMessage } from 'element-plus'

const musicData = ref<any[]>([])
const loading = ref(false)

const loadMusicians = async () => {
  loading.value = true
  try {
    const res: any = await getAllMusician(1, 40)
    if (res.success && res.data && res.data.records) {
      musicData.value = res.data.records.map((artist: any) => {
        return {
          id: artist.id,
          to: { name: 'artist-id', params: { id: artist.id } },
          data: {
            imgUrl: artist.avatar,
            singerName: artist.stageName,
            songCount: `${artist.fansCount || 0} 粉丝`, 
          },
        }
      })
    } else {
      ElMessage.error(res.errorMsg || '获取歌手列表失败')
    }
  } catch (err) {
    console.error('获取歌手列表异常', err)
    ElMessage.error('获取歌手列表异常')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadMusicians()
})
</script>

<style lang="scss" scoped>
.music-card-container {
  height: 100%;
  overflow-y: auto;
  padding: 20px;
  box-sizing: border-box;
}

/* 隐藏滚动条但保持滚动功能 */
.music-card-container::-webkit-scrollbar {
  width: 8px;
}

.music-card-container::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
}

.music-card-container::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}

.music-card-container::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

.music-card {
  display: grid;
  /* 使用 auto-fill 自动填充，限制每个卡片的最大宽度为 200px */
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 20px;
  justify-content: start; /* 左对齐 */
  width: 100%;
  box-sizing: border-box;
}

.album-title {
  font-size: 18px; /* 4xl 太大了，通常卡片标题 16-20px */
  font-weight: bold;
  margin: 0;
  /* 限制两行，多出省略，大厂标准写法 */
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

/* 响应式：小屏幕时减少列数 */
@media (max-width: 768px) {
  .music-card {
    grid-template-columns: repeat(auto-fill, minmax(140px, 180px));
    gap: 15px;
  }
}

@media (max-width: 480px) {
  .music-card {
    grid-template-columns: repeat(auto-fill, minmax(120px, 150px));
    gap: 12px;
  }
}
</style>
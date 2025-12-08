<template>
  <div
    class="music-card-container"
    v-infinite-scroll="handleScrollLoad"
    :infinite-scroll-disabled="loading || noMore"
    infinite-scroll-distance="50"
  >
    <div class="music-card">
      <MusicCard
        v-for="item in listData"
        :key="item.id"
        :imgUrl="item.coverUrl"
        :title="item.albumName"
        :to="{ name: 'album-detailPage-id', params: { id: item.id } }"
        variant="album"
      >
        <h2 class="album-title">{{ item.albumName }}</h2>
      </MusicCard>

      <div v-if="loading" class="loading-text">加载中...</div>
      <div v-if="noMore" class="no-more-text">没有更多了</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { getAlbum } from '@/api/album/getAlbum'
import { useLoadMore } from '@/composables/loadMore'
import { onMounted, type Ref } from 'vue'

// const ListData = ref(
//   Array.from({ length: 50 }, (_, i) => {
//     const albumId = `album-${i + 1}`

//     return {
//       name: albumId,
//       type: 'album',
//       to: { name: 'list-id', params: { id: albumId } },
//       data: {
//         imgUrl: `https://picsum.photos/seed/${albumId}/400/400`,
//         title: `专辑封面 ${i + 1}`,
//         albumTitle: `测试专辑 ${i + 1}`,
//       },
//     }
//   }),
// )

interface AlbumItem {
  id: string | number
  coverUrl: string
  albumName: string
}

const { loading, noMore, listData, loadData } = useLoadMore(getAlbum) as {
  loading: Ref<boolean>
  noMore: Ref<boolean>
  listData: Ref<AlbumItem[]>
  loadData: (params?: any, isReset?: boolean) => Promise<void>
}
console.log(listData.value)

onMounted(() => {
  loadData(null, true)
})

const handleScrollLoad = () => {
  loadData(null, false)
}
</script>

<style lang="scss" scoped>
.music-card-container {
  height: 100%;
  overflow-y: auto;
  padding: 20px;
  box-sizing: border-box;
}

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
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 20px;
  justify-content: start;
  width: 100%;
  box-sizing: border-box;
}

.album-title {
  font-size: 18px;
  font-weight: bold;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

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

<route lang="yaml">
meta:
  layout: main
</route>

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
        <span class="font-bold text-lg">{{ item.data.songCount }} 单曲</span>
        <span class="font-bold text-2xl">{{ item.data.singerName }}</span>
      </MusicCard>
    </div>
  </div>
</template>

<script lang="ts" setup>
import MusicCard from '@/components/MusicCard.vue'
import { ref } from 'vue'

// 定义一组固定的歌手数据
const mockArtists = [
  { name: '周杰伦', id: 'jay-chou', songCount: 305 },
  { name: 'Taylor Swift', id: 'taylor-swift', songCount: 200 },
  { name: '陈奕迅', id: 'eason-chan', songCount: 450 },
  { name: '林俊杰', id: 'jj-lin', songCount: 288 },
  { name: 'Ariana Grande', id: 'ariana-grande', songCount: 155 },
  { name: 'Ed Sheeran', id: 'ed-sheeran', songCount: 120 },
  { name: '邓紫棋', id: 'gloria-tang', songCount: 110 },
  { name: '五月天', id: 'mayday', songCount: 180 },
  { name: 'Adele', id: 'adele', songCount: 85 },
  { name: '李荣浩', id: 'li-ronghao', songCount: 95 },
]

// 循环生成 musicData
const musicData = ref(
  // 为了达到 50 个卡片，我们将 mockArtists 重复几次
  Array.from({ length: 50 }, (_, i) => {
    // 循环使用 mockArtists 数组中的数据
    const artistIndex = i % mockArtists.length
    const artist = mockArtists[artistIndex]
    const uniqueId = `${artist.id}-${Math.floor(i / mockArtists.length)}` // 确保ID唯一

    // 随机调整歌曲数量，使其看起来更真实
    const randomCount = artist.songCount + Math.floor(Math.random() * 50) - 25

    return {
      // 用于 :key，保持唯一性
      id: uniqueId, 

      // 路由指向 "artist下的id页面"
      to: { name: 'artist-id', params: { id: artist.id } }, // 假设您的路由是 /artist/:id

      data: {
        // 使用 picsum.photos 并提供歌手ID作为 seed 来获取图片
        // 这样同一个歌手会有一致的封面图
        imgUrl: `https://picsum.photos/seed/${artist.id}/400/400`,
        // 对应模板中的 <span class="font-bold text-2xl">{{ item.data.singerName }}</span>
        singerName: artist.name, 
        // 对应模板中的 <span class="font-bold text-lg">{{ item.data.songCount }} 单曲</span>
        songCount: randomCount > 50 ? randomCount : 50, // 确保歌曲数量不小于一个合理的值
      },
    }
  }),
)
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
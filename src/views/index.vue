<template>
  <div class="home-wrapper bg-[#0b0f1b] text-white flex flex-col h-screen">
    <section class="px-10 pt-6 pb-4">
      <MusicCarousel />
    </section>

    <section class="main-header px-10">
      <div class="card-row">
        <MusicCard to="/daily-recommend" imgUrl="https://picsum.photos/seed/recommend/400/400" variant="recommend">
          <h3 class="text-xl font-bold mb-2">每日推荐</h3>
          <ul class="text-sm space-y-1 opacity-90">
            <li v-for="song in recommendSongsList" :key="song.id" class="truncate">
              {{ song.songName }}
            </li>
          </ul>
        </MusicCard>

        <MusicCard
          v-for="item in musicData"
          :to="item.to"
          :img-url="item.data.imgUrl"
          variant="artist"
          show-play-button
          :key="item.id"
        >
          <span class="font-bold text-lg">{{ item.data.songCount }}</span>
          <span class="font-bold text-2xl">{{ item.data.singerName }}</span>
        </MusicCard>
      </div>
    </section>

    <section class="main-content px-6 pb-10 flex-1">
      <div class="panel tags-panel">
        <div class="panel-header">
          <h2>歌单分类</h2>
          <router-link to="{ path: '/playlist' }" class="more-link">全部</router-link>
        </div>
        <TagBar :tags="tagsData"/>
      </div>

      <div class="panel list-panel flex flex-col">
        <div class="panel-header">
          <h2>本周最热音乐</h2>
          <button class="action-btn">播放全部</button>
        </div>
        <div class="list-wrapper flex-1">
          <MusicListItem :items="listData" @click-music="handlePlayHotMusic" />
          <div v-if="listData.length === 0" class="empty-state">
            <i class="fa fa-music empty-icon"></i>
            <p class="empty-text">暂无数据</p>
            <p class="empty-sub">热门音乐正在路上，请稍后再来~</p>
          </div>
        </div>
      </div>

      <div class="panel album-panel">
        <div class="panel-header">
          <h2>最新专辑</h2>
          <router-link to="/album" class="more-link">更多</router-link>
        </div>
        <div class="main-cards">
          <MusicCard
            v-for="item in albumData"
            :key="item.id"
            :imgUrl="item.coverUrl"
            :title="item.albumTitle"
            :to="{ name: 'album-detailPage-id', params: { id: item.id } }"
            variant="album"
          >
            <h2 class="album-title">{{ item.albumTitle }}</h2>
          </MusicCard>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { getAllMusician } from '@/api/artist'
import { getAlbum } from '@/api/album'
import { getRecommendMusic } from '@/api/home'
import { getAllTags } from '@/api/playlist'
import MusicCarousel from '@/components/MusicCarousel.vue'
import MusicListItem from '@/components/MusicListItem.vue'
import TagBar from '@/components/TagBar.vue'
import { usePlayerStore } from '@/stores/player'
import { ElMessage } from 'element-plus'

defineOptions({
  name: 'HomeIndex',
})

const rawData = ref<any[]>([])
const listData = ref<any[]>([])
const tagsData = ref<any[]>([])
const albumData = ref<any[]>([])
const musicData = ref<any[]>([])
const recommendSongsList = ref<any[]>([])

// 点击本周最热音乐列表触发播放
const playerStore = usePlayerStore()

onMounted(() => {
  // 获取推荐音乐和热门列表
  getRecommendMusic().then((res: any) => {
    if (res.success && res.data) {
      rawData.value = [...res.data]
      listData.value = (rawData.value as any[]).map((item: any) => {
        return {
          id: item.itemId,
          title: item.songName,
          image: item.coverUrl,
          desc: item.singer,
          raw: item
        }
      })
      
      // 取前三个用于首页推荐卡片预览
      recommendSongsList.value = res.data.slice(0, 3).map((item: any) => ({
        id: item.itemId,
        songName: `${item.songName} - ${item.singer}`
      }))
    }
  })

  // 获取热门歌手
  getAllMusician(1, 5).then((res: any) => {
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
    }
  })

  getAllTags().then((res) => {
    if (res.data) {
      const flatList = Object.values(res.data).flat()
      tagsData.value = (flatList as any[]).map((t: any) => {
        return {
          id: t.id,
          name: t.tagName,
          path: `/playlist?tagId=${t.id}`
        }
      })
    }
  })

  getAlbum('1', '30').then((res: any) => {
    if (res.success && res.data && res.data.records) {
      albumData.value = [...res.data.records]
    }
  })
})

const handlePlayHotMusic = async (item: any) => {
  if (!item.raw) return
  
  const data = item.raw
  const songToPlay = {
    id: String(data.itemId),
    musicName: data.songName,
    albumId: 0,
    albumName: '',
    bpm: 0,
    commentCount: 0,
    coverUrl: data.coverUrl,
    duration: '03:30',
    isLiked: 0,
    isVip: 0,
    likeCount: 0,
    musicianId: 0,
    musicianName: data.singer,
  }

  const currentList = rawData.value.map((d: any) => ({
    id: String(d.itemId),
    musicName: d.songName,
    albumId: 0,
    albumName: '',
    bpm: 0,
    commentCount: 0,
    coverUrl: d.coverUrl,
    duration: '03:30',
    isLiked: 0,
    isVip: 0,
    likeCount: 0,
    musicianId: 0,
    musicianName: d.singer,
  }))

  await playerStore.playSong(songToPlay as any, currentList as any)
  ElMessage.success(`正在播放: ${songToPlay.musicName}`)
}
//   {
//     type: 'album',
//     to: '/list/album-101',
//     data: {
//       id: 'album-101',
//       imgUrl: 'https://picsum.photos/seed/folklore/400',
//       alt: 'Folklore 专辑封面',
//       albumTitle: 'Folklore',
//     },
//   },
//   {
//     type: 'album',
//     to: '/list/album-102',
//     data: {
//       id: 'album-102',
//       imgUrl: 'https://picsum.photos/seed/afterhours/400',
//       alt: 'After Hours 专辑封面',
//       albumTitle: 'After Hours',
//     },
//   },
//   {
//     type: 'album',
//     to: '/list/album-103',
//     data: {
//       id: 'album-103',
//       imgUrl: 'https://picsum.photos/seed/1989/400',
//       alt: "1989 (Taylor's Version) 专辑封面",
//       albumTitle: "1989 (Taylor's Version)",
//     },
//   },
//   {
//     type: 'album',
//     to: '/list/album-104',
//     data: {
//       id: 'album-104',
//       imgUrl: 'https://picsum.photos/seed/divide/400',
//       alt: '÷ (Divide) 专辑封面',
//       albumTitle: '÷ (Divide)',
//     },
//   },
//   {
//     type: 'album',
//     to: '/list/album-105',
//     data: {
//       id: 'album-105',
//       imgUrl: 'https://picsum.photos/seed/astroworld/400',
//       alt: 'Astroworld 专辑封面',
//       albumTitle: 'Astroworld',
//     },
//   },
//   {
//     type: 'album',
//     to: '/list/album-106',
//     data: {
//       id: 'album-106',
//       imgUrl: 'https://picsum.photos/seed/discovery/400',
//       alt: 'Discovery 专辑封面',
//       albumTitle: 'Discovery',
//     },
//   },
//   {
//     type: 'album',
//     to: '/list/album-107',
//     data: {
//       id: 'album-107',
//       imgUrl: 'https://picsum.photos/seed/fantasy/400',
//       alt: '范特西 专辑封面',
//       albumTitle: '范特西',
//     },
//   },
//   {
//     type: 'album',
//     to: '/list/album-108',
//     data: {
//       id: 'album-108',
//       imgUrl: 'https://picsum.photos/seed/utopia/400',
//       alt: 'Utopia 专辑封面',
//       albumTitle: 'Utopia',
//     },
//   },
//   {
//     type: 'album',
//     to: '/list/album-109',
//     data: {
//       id: 'album-109',
//       imgUrl: 'https://picsum.photos/seed/meteora/400',
//       alt: 'Meteora 专辑封面',
//       albumTitle: 'Meteora',
//     },
//   },
//   {
//     type: 'album',
//     to: '/list/album-110',
//     data: {
//       id: 'album-110',
//       imgUrl: 'https://picsum.photos/seed/parachutes/400',
//       alt: 'Parachutes 专辑封面',
//       albumTitle: 'Parachutes',
//     },
//   },
//   {
//     type: 'album',
//     to: '/list/album-111',
//     data: {
//       id: 'album-111',
//       imgUrl: 'https://picsum.photos/seed/21/400',
//       alt: '21 专辑封面',
//       albumTitle: '21',
//     },
//   },
//   {
//     type: 'album',
//     to: '/list/album-112',
//     data: {
//       id: 'album-112',
//       imgUrl: 'https://picsum.photos/seed/ye/400',
//       alt: 'Ye 专辑封面',
//       albumTitle: 'Ye',
//     },
//   },
//   {
//     type: 'album',
//     to: '/list/album-113',
//     data: {
//       id: 'album-113',
//       imgUrl: 'https://picsum.photos/seed/greatestshowman/400',
//       alt: 'The Greatest Showman 专辑封面',
//       albumTitle: 'The Greatest Showman',
//     },
//   },
//   {
//     type: 'album',
//     to: '/list/album-114',
//     data: {
//       id: 'album-114',
//       imgUrl: 'https://picsum.photos/seed/currents/400',
//       alt: 'Currents 专辑封面',
//       albumTitle: 'Currents',
//     },
//   },
//   {
//     type: 'album',
//     to: '/list/album-115',
//     data: {
//       id: 'album-115',
//       imgUrl: 'https://picsum.photos/seed/xunmi/400',
//       alt: '寻 专辑封面',
//       albumTitle: '寻',
//     },
//   },
// ]

// tags模拟数据
// const tagsData = [
//   { name: '我的列表', path: '/MyList' },
//   { name: '流行', path: '/tags/pop' },
//   { name: '摇滚', path: '/tags/rock' },
//   { name: '电子', path: '/tags/electronic' },
//   { name: '民谣', path: '/tags/folk' },
//   { name: '嘻哈', path: '/tags/hip-hop' },
//   { name: 'R&B', path: '/tags/rnb' },
//   { name: '爵士', path: '/tags/jazz' },
//   { name: '古典', path: '/tags/classical' },
//   { name: 'K-Pop', path: '/tags/k-pop' },
//   { name: 'J-Pop', path: '/tags/j-pop' },
//   { name: '放松', path: '/moods/relax' },
//   { name: '专注', path: '/moods/focus' },
//   { name: '派对', path: '/moods/party' },
//   { name: '伤感', path: '/moods/sad' },
//   { name: '运动', path: '/moods/workout' },
//   { name: '助眠', path: '/moods/sleep' },
//   { name: '浪漫', path: 'moods/romantic' },
//   { name: '华语', path: '/regions/chinese' },
//   { name: '欧美', path: '/regions/western' },
//   { name: '日语', path: '/regions/japanese' },
//   { name: '韩语', path: '/regions/korean' },
//   { name: '经典', path: '/themes/classic' },
//   { name: '新歌', path: '/themes/new-releases' },
//   { name: '纯音乐', path: '/themes/instrumental' },
//   { name: 'ACG', path: '/themes/acg' },
//   { name: '播客', path: '/categories/podcasts' },
//   { name: '有声书', path: '/categories/audiobooks' },
//   { name: '现场', path: '/themes/live' },
//   { name: '电影原声', path: '/themes/soundtrack' },
//   { name: '周杰伦', path: '/artists/jay-chou' },
//   { name: '林俊杰', path: '/artists/jj-lin' },
//   { name: 'Taylor Swift', path: '/artists/taylor-swift' },
//   { name: 'G.E.M.邓紫棋', path: '/artists/gem' },
//   { name: '陈奕迅', path: '/artists/eason-chan' },
//   { name: '80年代', path: '/decades/80s' },
//   { name: '90年代', path: '/decades/90s' },
//   { name: '00年代', path: '/decades/00s' },
//   { name: '咖啡馆', path: '/scenes/cafe' },
//   { name: '驾驶', path: '/scenes/driving' },
//   { name: '阅读', path: '/scenes/reading' },
//   { name: '冥想', path: '/scenes/meditation' },
//   { name: '轻音乐', path: '/genres/light-music' },
//   { name: '乡村', path: '/genres/country' },
//   { name: '雷鬼', path: '/genres/reggae' },
//   { name: '蓝调', path: '/genres/blues' },
//   { name: '金属', path: '/genres/metal' },
//   { name: '拉丁', path: '/genres/latin' },
//   { name: '独立', path: '/genres/indie' },
//   { name: '游戏', path: '/themes/gaming' },
// ]

// list模拟数据
// const listData = [
//   {
//     id: 'song-001',
//     title: '七里香',
//     artist: '周杰伦',
//     imgUrl: 'https://picsum.photos/seed/jaychou/200',
//   },
//   {
//     id: 'song-002',
//     title: 'Blinding Lights',
//     artist: 'The Weeknd',
//     imgUrl: 'https://picsum.photos/seed/weeknd/200',
//   },
//   {
//     id: 'song-003',
//     title: '关键词',
//     artist: '林俊杰',
//     imgUrl: 'https://picsum.photos/seed/jjlin/200',
//   },
//   {
//     id: 'song-004',
//     title: 'Lover',
//     artist: 'Taylor Swift',
//     imgUrl: 'https://picsum.photos/seed/taylor/200',
//   },
//   {
//     id: 'song-005',
//     title: '富士山下',
//     artist: '陈奕迅',
//     imgUrl: 'https://picsum.photos/seed/eason/200',
//   },
//   {
//     id: 'song-006',
//     title: '泡沫',
//     artist: 'G.E.M.邓紫棋',
//     imgUrl: 'https://picsum.photos/seed/gem/200',
//   },
//   {
//     id: 'song-007',
//     title: 'As It Was',
//     artist: 'Harry Styles',
//     imgUrl: 'https://picsum.photos/seed/harry/200',
//   },
//   {
//     id: 'song-008',
//     title: 'Viva La Vida',
//     artist: 'Coldplay',
//     imgUrl: 'https://picsum.photos/seed/coldplay/200',
//   },
//   {
//     id: 'song-009',
//     title: 'Rolling in the Deep',
//     artist: 'Adele',
//     imgUrl: 'https://picsum.photos/seed/adele/200',
//   },
//   {
//     id: 'song-010',
//     title: 'Shape of You',
//     artist: 'Ed Sheeran',
//     imgUrl: 'https://picsum.photos/seed/ed/200',
//   },
//   {
//     id: 'song-011',
//     title: 'Bad Guy',
//     artist: 'Billie Eilish',
//     imgUrl: 'https://picsum.photos/seed/billie/200',
//   },
// ]
</script>

<style lang="scss" scoped>
.home-wrapper {
  background-image: radial-gradient(circle at top right, rgba(236, 72, 153, 0.18), transparent 45%);
}

.main-header {
  padding-bottom: 1.5rem;
}

.card-row {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1.25rem;
}

.main-content {
  display: grid;
  grid-template-columns: 1.1fr 1.6fr 2.2fr;
  gap: 1.5rem;
  align-items: flex-start;
}

.panel {
  background: rgba(15, 23, 42, 0.65);
  border-radius: 1.75rem;
  padding: 1.5rem;
  border: 1px solid rgba(148, 163, 184, 0.15);
  box-shadow: 0 25px 50px -12px rgba(15, 23, 42, 0.35);
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
}

.panel-header h2 {
  font-size: 1.1rem;
  font-weight: 600;
}

.more-link {
  font-size: 0.85rem;
  color: #fb7185;
  text-decoration: none;
}

.more-link:hover {
  color: #fecaca;
}

.action-btn {
  padding: 0.4rem 1.1rem;
  border-radius: 999px;
  background: linear-gradient(120deg, #ec4899, #f97316);
  color: #0f172a;
  font-size: 0.85rem;
  font-weight: 600;
}

.list-wrapper {
  background: rgba(15, 23, 42, 0.65);
  border-radius: 1.25rem;
  padding: 0.5rem;
  height: 100%;
}

.main-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 1rem;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  min-height: 200px;
}

.empty-icon {
  font-size: 3rem;
  background: linear-gradient(135deg, #ec4899, #8b5cf6);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 1rem;
  opacity: 0.6;
}

.empty-text {
  font-size: 1rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 0.25rem;
}

.empty-sub {
  font-size: 0.8rem;
  color: rgba(148, 163, 184, 0.6);
}


@media (max-width: 1200px) {
  .main-content {
    grid-template-columns: 1fr;
  }
}
</style>

<route lang="yaml">
meta:
  layout: main
</route>

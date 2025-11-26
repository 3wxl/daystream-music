<template>
  <div class="home-wrapper bg-[#0b0f1b] text-white flex flex-col h-screen overflow-y-auto">
    <section class="px-10 pt-8 pb-4">
      <div class="flex flex-col gap-2">
        <p class="text-sm text-white/60">下午好，哈哈哈</p>
        <h1 class="text-3xl font-semibold tracking-tight">继续你的音乐旅程</h1>
        <p class="text-white/50 text-sm">为你准备了最新的推荐、热歌与专辑</p>
      </div>
    </section>

    <section class="main-header px-10">
      <div class="card-row">
        <MusicCards
        :to = recommendData.to
        :imgUrl = recommendData.data.imgUrl
        variant="recommend"
        >
         <h3 class="text-xl font-bold mb-2">每日推荐</h3>
          <ul class="text-sm space-y-1 opacity-90">
            <li v-for="song in recommendData.data.list" :key="song.songName">
              {{ song.songName }}
            </li>
          </ul>
        </MusicCards>

        <MusicCards
        v-for="item in musicData"
        :to="item.to"
        :img-url="item.data.imgUrl"
        variant="artist"
        show-play-button
        :key="item.to"
        >
          <span class="font-bold text-lg">{{ item.data.songCount }} 首单曲</span>
          <span class="font-bold text-2xl">{{ item.data.singerName }}</span>
        </MusicCards>
      </div>
    </section>

    <section class="main-content px-6 pb-10 flex-1">
      <div class="panel tags-panel">
        <div class="panel-header">
          <h2>歌单分类</h2>
          <router-link to="/list" class="more-link">全部</router-link>
        </div>
        <TagBar :tags="tagsData" />
      </div>

      <div class="panel list-panel flex flex-col">
        <div class="panel-header">
          <h2>本周最热音乐</h2>
          <button class="action-btn">播放全部</button>
        </div>
        <div class="list-wrapper flex-1">
          <MusicListItem :items="listData" />
        </div>
      </div>

      <div class="panel album-panel">
        <div class="panel-header">
          <h2>最新专辑</h2>
          <router-link to="/album" class="more-link">更多</router-link>
        </div>
        <div class="main-cards">
           <MusicCards
            v-for="item in albumData"
            :key="item.name"
            :imgUrl = item.data.imgUrl
            :title = item.data.title
            :to = item.to
            variant = 'album'
     >
        <h2 class="album-title">{{ item.data.albumTitle }}</h2>
     </MusicCards>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
import MusicCards from '@/components/MusicCards.vue';
import MusicListItem from '@/components/MusicListItem.vue';
import TagBar from '@/components/TagBar.vue';

defineOptions({
  name: 'HomeIndex'
})

// recommend模拟数据
const recommendData =
    // 1. 类型: recommend
  {
    type: 'recommend',
    to: '/list/daily-recommend-123', // 指向每日推荐详情页
    data: {
      id: 'daily-recommend-123',
      imgUrl: 'https://picsum.photos/seed/recommend/400/400', // 示例图片
      alt: '每日推荐封面',
      title: '根据你的听歌口味推荐', // v-if="type == 'recommend'" 中的 .album-title
      list: [
        { id: 'song-001', songName: '七里香 - 周杰伦' },
        { id: 'song-002', songName: '关键词 - 林俊杰' },
        { id: 'song-003', songName: '泡沫 - G.E.M.邓紫棋' }
      ]
    }
  }


// musicCard模拟数据1
const musicData = [
  // 2. 类型: artist
  {
    type: 'artist',
    to: '/list/artist-1001', // 指向歌手详情页
    data: {
      id: 'artist-1001',
      imgUrl: 'https://picsum.photos/seed/jjlin/400/400', // 示例图片
      alt: '林俊杰',
      songCount: '128 首', // v-else 中的 data.songCount
      singerName: '林俊杰' // v-else 中的 data.singerName
    }
  },

  // 3. 类型: artist
  {
    type: 'artist',
    to: '/list/artist-1002',
    data: {
      id: 'artist-1002',
      imgUrl: 'https://picsum.photos/seed/jaychou/400/400',
      alt: '周杰伦',
      songCount: '210 首',
      singerName: '周杰伦'
    }
  },

  // 4. 类型: artist
  {
    type: 'artist',
    to: '/list/artist-1003',
    data: {
      id: 'artist-1003',
      imgUrl: 'https://picsum.photos/seed/gem/400/400',
      alt: 'G.E.M.邓紫棋',
      songCount: '92 首',
      singerName: 'G.E.M.邓紫棋'
    }
  },

  // 5. 类型: artist
  {
    type: 'artist',
    to: '/list/artist-1004',
    data: {
      id: 'artist-1004',
      imgUrl: 'https://picsum.photos/seed/eason/400/400',
      alt: '陈奕迅',
      songCount: '175 首',
      singerName: '陈奕迅'
    }
  },

  // 6.类型：artist
   {
    type: 'artist',
    to: '/list/artist-1001', // 指向歌手详情页
    data: {
      id: 'artist-1001',
      imgUrl: 'https://picsum.photos/seed/jjlin/400/400', // 示例图片
      alt: '林俊杰',
      songCount: '128 首', // v-else 中的 data.songCount
      singerName: '林俊杰' // v-else 中的 data.singerName
    }
  },
]

// musicCard模拟数据1
const albumData = [
  {
    type: 'album',
    to: '/list/album-101',
    data: {
      id: 'album-101',
      imgUrl: 'https://picsum.photos/seed/folklore/400',
      alt: 'Folklore 专辑封面',
      albumTitle: 'Folklore'
    }
  },
  {
    type: 'album',
    to: '/list/album-102',
    data: {
      id: 'album-102',
      imgUrl: 'https://picsum.photos/seed/afterhours/400',
      alt: 'After Hours 专辑封面',
      albumTitle: 'After Hours'
    }
  },
  {
    type: 'album',
    to: '/list/album-103',
    data: {
      id: 'album-103',
      imgUrl: 'https://picsum.photos/seed/1989/400',
      alt: '1989 (Taylor\'s Version) 专辑封面',
      albumTitle: '1989 (Taylor\'s Version)'
    }
  },
  {
    type: 'album',
    to: '/list/album-104',
    data: {
      id: 'album-104',
      imgUrl: 'https://picsum.photos/seed/divide/400',
      alt: '÷ (Divide) 专辑封面',
      albumTitle: '÷ (Divide)'
    }
  },
  {
    type: 'album',
    to: '/list/album-105',
    data: {
      id: 'album-105',
      imgUrl: 'https://picsum.photos/seed/astroworld/400',
      alt: 'Astroworld 专辑封面',
      albumTitle: 'Astroworld'
    }
  },
  {
    type: 'album',
    to: '/list/album-106',
    data: {
      id: 'album-106',
      imgUrl: 'https://picsum.photos/seed/discovery/400',
      alt: 'Discovery 专辑封面',
      albumTitle: 'Discovery'
    }
  },
  {
    type: 'album',
    to: '/list/album-107',
    data: {
      id: 'album-107',
      imgUrl: 'https://picsum.photos/seed/fantasy/400',
      alt: '范特西 专辑封面',
      albumTitle: '范特西'
    }
  },
  {
    type: 'album',
    to: '/list/album-108',
    data: {
      id: 'album-108',
      imgUrl: 'https://picsum.photos/seed/utopia/400',
      alt: 'Utopia 专辑封面',
      albumTitle: 'Utopia'
    }
  },
  {
    type: 'album',
    to: '/list/album-109',
    data: {
      id: 'album-109',
      imgUrl: 'https://picsum.photos/seed/meteora/400',
      alt: 'Meteora 专辑封面',
      albumTitle: 'Meteora'
    }
  },
  {
    type: 'album',
    to: '/list/album-110',
    data: {
      id: 'album-110',
      imgUrl: 'https://picsum.photos/seed/parachutes/400',
      alt: 'Parachutes 专辑封面',
      albumTitle: 'Parachutes'
    }
  },
  {
    type: 'album',
    to: '/list/album-111',
    data: {
      id: 'album-111',
      imgUrl: 'https://picsum.photos/seed/21/400',
      alt: '21 专辑封面',
      albumTitle: '21'
    }
  },
  {
    type: 'album',
    to: '/list/album-112',
    data: {
      id: 'album-112',
      imgUrl: 'https://picsum.photos/seed/ye/400',
      alt: 'Ye 专辑封面',
      albumTitle: 'Ye'
    }
  },
  {
    type: 'album',
    to: '/list/album-113',
    data: {
      id: 'album-113',
      imgUrl: 'https://picsum.photos/seed/greatestshowman/400',
      alt: 'The Greatest Showman 专辑封面',
      albumTitle: 'The Greatest Showman'
    }
  },
  {
    type: 'album',
    to: '/list/album-114',
    data: {
      id: 'album-114',
      imgUrl: 'https://picsum.photos/seed/currents/400',
      alt: 'Currents 专辑封面',
      albumTitle: 'Currents'
    }
  },
  {
    type: 'album',
    to: '/list/album-115',
    data: {
      id: 'album-115',
      imgUrl: 'https://picsum.photos/seed/xunmi/400',
      alt: '寻 专辑封面',
      albumTitle: '寻'
    }
  }
]

// tags模拟数据
const tagsData = [
  { "name": "我的列表", "path": "/MyList" },
  { "name": "流行", "path": "/tags/pop" },
  { "name": "摇滚", "path": "/tags/rock" },
  { "name": "电子", "path": "/tags/electronic" },
  { "name": "民谣", "path": "/tags/folk" },
  { "name": "嘻哈", "path": "/tags/hip-hop" },
  { "name": "R&B", "path": "/tags/rnb" },
  { "name": "爵士", "path": "/tags/jazz" },
  { "name": "古典", "path": "/tags/classical" },
  { "name": "K-Pop", "path": "/tags/k-pop" },
  { "name": "J-Pop", "path": "/tags/j-pop" },
  { "name": "放松", "path": "/moods/relax" },
  { "name": "专注", "path": "/moods/focus" },
  { "name": "派对", "path": "/moods/party" },
  { "name": "伤感", "path": "/moods/sad" },
  { "name": "运动", "path": "/moods/workout" },
  { "name": "助眠", "path": "/moods/sleep" },
  { "name": "浪漫", "path": "moods/romantic" },
  { "name": "华语", "path": "/regions/chinese" },
  { "name": "欧美", "path": "/regions/western" },
  { "name": "日语", "path": "/regions/japanese" },
  { "name": "韩语", "path": "/regions/korean" },
  { "name": "经典", "path": "/themes/classic" },
  { "name": "新歌", "path": "/themes/new-releases" },
  { "name": "纯音乐", "path": "/themes/instrumental" },
  { "name": "ACG", "path": "/themes/acg" },
  { "name": "播客", "path": "/categories/podcasts" },
  { "name": "有声书", "path": "/categories/audiobooks" },
  { "name": "现场", "path": "/themes/live" },
  { "name": "电影原声", "path": "/themes/soundtrack" },
  { "name": "周杰伦", "path": "/artists/jay-chou" },
  { "name": "林俊杰", "path": "/artists/jj-lin" },
  { "name": "Taylor Swift", "path": "/artists/taylor-swift" },
  { "name": "G.E.M.邓紫棋", "path": "/artists/gem" },
  { "name": "陈奕迅", "path": "/artists/eason-chan" },
  { "name": "80年代", "path": "/decades/80s" },
  { "name": "90年代", "path": "/decades/90s" },
  { "name": "00年代", "path": "/decades/00s" },
  { "name": "咖啡馆", "path": "/scenes/cafe" },
  { "name": "驾驶", "path": "/scenes/driving" },
  { "name": "阅读", "path": "/scenes/reading" },
  { "name": "冥想", "path": "/scenes/meditation" },
  { "name": "轻音乐", "path": "/genres/light-music" },
  { "name": "乡村", "path": "/genres/country" },
  { "name": "雷鬼", "path": "/genres/reggae" },
  { "name": "蓝调", "path": "/genres/blues" },
  { "name": "金属", "path": "/genres/metal" },
  { "name": "拉丁", "path": "/genres/latin" },
  { "name": "独立", "path": "/genres/indie" },
  { "name": "游戏", "path": "/themes/gaming" }
]

// list模拟数据
const listData = [
  {
    id: 'song-001',
    title: '七里香',
    artist: '周杰伦',
    imgUrl: 'https://picsum.photos/seed/jaychou/200'
  },
  {
    id: 'song-002',
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    imgUrl: 'https://picsum.photos/seed/weeknd/200'
  },
  {
    id: 'song-003',
    title: '关键词',
    artist: '林俊杰',
    imgUrl: 'https://picsum.photos/seed/jjlin/200'
  },
  {
    id: 'song-004',
    title: 'Lover',
    artist: 'Taylor Swift',
    imgUrl: 'https://picsum.photos/seed/taylor/200'
  },
  {
    id: 'song-005',
    title: '富士山下',
    artist: '陈奕迅',
    imgUrl: 'https://picsum.photos/seed/eason/200'
  },
  {
    id: 'song-006',
    title: '泡沫',
    artist: 'G.E.M.邓紫棋',
    imgUrl: 'https://picsum.photos/seed/gem/200'
  },
  {
    id: 'song-007',
    title: 'As It Was',
    artist: 'Harry Styles',
    imgUrl: 'https://picsum.photos/seed/harry/200'
  },
  {
    id: 'song-008',
    title: 'Viva La Vida',
    artist: 'Coldplay',
    imgUrl: 'https://picsum.photos/seed/coldplay/200'
  },
  {
    id: 'song-009',
    title: 'Rolling in the Deep',
    artist: 'Adele',
    imgUrl: 'https://picsum.photos/seed/adele/200'
  },
  {
    id: 'song-010',
    title: 'Shape of You',
    artist: 'Ed Sheeran',
    imgUrl: 'https://picsum.photos/seed/ed/200'
  },
  {
    id: 'song-011',
    title: 'Bad Guy',
    artist: 'Billie Eilish',
    imgUrl: 'https://picsum.photos/seed/billie/200'
  }
]
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


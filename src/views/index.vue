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
          @play="handlePlayArtist(item)"
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
          <button class="action-btn" @click="handlePlayAllHot">播放全部</button>
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

const handlePlayArtist = (item: any) => {
  console.log('---------测试调用player是否传入指定参数 (歌手播放测试)------------')
  console.log('点击的数据项:', item)
  ElMessage.info(`即将播放 ${item.data.singerName} 的热门作品...`)
  // 此处可根据需要调用接口获取歌手歌曲后播放，目前先进行友好提示
}

const handlePlayAllHot = async () => {
  if (rawData.value.length === 0) {
    ElMessage.warning('暂无歌曲可播放')
    return
  }

  const listToPlay = rawData.value.map((d: any) => ({
    id: String(d.itemId),
    audioList: d.audioList || [],
    musicName: d.songName,
    coverUrl: d.coverUrl,
    musicianName: d.singer,
  }))

  console.log('---------测试调用player是否传入指定参数 (播放全部)------------')
  console.log('首曲参数:', listToPlay[0], '完整列表:', listToPlay)

  await playerStore.playSong(listToPlay[0] as any, listToPlay as any)
  ElMessage.success('正在播放本周最热音乐列表')
}

const handlePlayHotMusic = async (item: any) => {
  if (!item.raw) return

  const data = item.raw
  const songToPlay = {
    id: String(data.itemId),
    audioList: data.audioList || [],
    musicName: data.songName,
    coverUrl: data.coverUrl,
    musicianName: data.singer,
  }

  const currentList = rawData.value.map((d: any) => ({
    id: String(d.itemId),
    audioList: d.audioList || [],
    musicName: d.songName,
    coverUrl: d.coverUrl,
    musicianName: d.singer,
  }))
  console.log('---------测试调用player是否传入指定参数 (单曲播放)------------')
  console.log('歌曲参数:', songToPlay, '上下文列表:', currentList)

  await playerStore.playSong(songToPlay as any, currentList as any)
  ElMessage.success(`正在播放: ${songToPlay.musicName}`)
}
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

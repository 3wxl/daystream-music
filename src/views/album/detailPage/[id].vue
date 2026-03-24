<template>
  <MusicDetailTemplate
    :id="albumId"
    :type="3"
    :music-name="albumDetail?.albumName"
    :avatar="DEFAULT_AVATAR"
    :person-name="albumDetail?.musicianName"
    :release-time="albumDetail?.releaseDate"
    :description="albumDetail?.introduction"
    :music-count="albumDetail?.musicCount"
    :music-list="musicList"
    :cover="albumDetail?.coverUrl"
    :comment-count="albumDetail?.commentCount"
    :collectors="collectors"
    :loading="loading"
    @play-all="handlePlayAll"
  />
</template>

<script setup lang="ts">
import { getAlbumDetail } from '@/api/album'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { onMounted, ref, watch } from 'vue'
import MusicDetailTemplate from '@/components/common/MusicDetailTemplate.vue'

const DEFAULT_COVER = 'https://picsum.photos/300/300?random=10'
const DEFAULT_AVATAR = 'https://picsum.photos/100/100?random=11'

const route = useRoute()
const albumId = ref(route.params.id as string)
const albumDetail = ref<any>({})
const musicList = ref<any[]>([])
const collectors = ref<any[]>([])
const loading = ref(false)

const handlePlayAll = async () => {
  if (musicList.value.length === 0) {
    ElMessage.warning('专辑中没有歌曲数据')
    return
  }
  // 接入播放器逻辑
  ElMessage.success('开始播放专辑歌曲')
}

const loadData = async (id: string) => {
  loading.value = true
  try {
    const res: any = await getAlbumDetail(id)
    console.log('Album Detail Response:', res)
    if (res.success && res.data) {
      const data = res.data
      albumDetail.value = data
      
      // 处理歌曲列表
      if (data.records && data.records.length > 0) {
        musicList.value = data.records
      } else {
        console.warn('后端返回专辑无歌曲列表，使用 mock 数据填充')
        musicList.value = Array.from({ length: 5 }).map((_, i) => ({
          musicId: `mock-music-${i}`,
          musicName: `专辑歌曲 ${i + 1}`,
          musicianName: data.musicianName || '未知歌手',
          albumName: data.albumName || '未知专辑',
          timeMillisecond: 180000 + Math.random() * 60000,
          coverUrl: data.coverUrl || DEFAULT_COVER,
          id: `mock-id-${i}`
        }))
      }
    } else {
      ElMessage.error(res.errorMsg || '获取专辑详情失败')
    }
  } catch (err) {
    console.log('获取专辑详情失败', err)
    ElMessage.error('获取专辑详情失败')
  } finally {
    loading.value = false
  }

  // 模拟收藏者数据
  collectors.value = Array.from({ length: 12 }).map((_, i) => ({
    id: `collector-${i}`,
    userName: `听歌狂人${i+1}`,
    avatar: `https://picsum.photos/50/50?random=${30+i}`,
    gender: i % 2 === 0 ? 1 : 2,
    introduction: '热爱音乐，享受生活',
    collectPlaylistCount: Math.floor(Math.random() * 20),
    fansCount: Math.floor(Math.random() * 500)
  }))
}

onMounted(() => {
  loadData(albumId.value)
})

watch(() => route.params.id, (newVal) => {
  albumId.value = newVal as string
  loadData(newVal as string)
})
</script>



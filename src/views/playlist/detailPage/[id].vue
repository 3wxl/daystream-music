<template>
  <MusicDetailTemplate
    :id="playlistId"
    :type="2"
    :music-name="playlistDetail?.name"
    :avatar="playlistDetail?.avatar"
    :person-name="playlistDetail?.creator"
    :release-time="playlistDetail?.createdTime"
    :description="playlistDetail?.description"
    :music-count="playlistDetail?.musicCount"
    :music-list="musicList"
    :cover="playlistDetail?.cover"
    :comment-count="playlistDetail?.commentCount"
    :collectors="collectors"
    :loading="loading"
    :has-more="hasMore"
    :is-loading-more="isLoadingMore"
    @load-more="handleLoadMore"
    @play-all="handlePlayAll"
  />
</template>

<script lang="ts" setup>
import { getPlayListDetail } from '@/api/playlist'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { onMounted, ref, watch } from 'vue'
import MusicDetailTemplate from '@/components/common/MusicDetailTemplate.vue'

const route = useRoute()
const playlistId = ref(route.params.id as string)
const playlistDetail = ref<any>({})
const musicList = ref<any[]>([])
const collectors = ref<any[]>([])
const loading = ref(false)
const isLoadingMore = ref(false)
const hasMore = ref(false)
const pageNum = ref(1)
const pageSize = ref(10)

const handlePlayAll = () => {
  if (musicList.value.length === 0) {
    ElMessage.warning('歌单中没有歌曲')
    return
  }
  ElMessage.success('开始播放歌单歌曲')
}

const handleLoadMore = () => {
  if (hasMore.value && !isLoadingMore.value) {
    pageNum.value++
    loadData(playlistId.value, true)
  }
}

const loadData = async (id: string, isLoadMore = false) => {
  if (isLoadMore) {
    isLoadingMore.value = true
  } else {
    loading.value = true
    pageNum.value = 1
    musicList.value = []
  }

  try {
    const res: any = await getPlayListDetail(id)
    console.log('Playlist Detail Response:', res)
    
    if (res.success && res.data) {
      const data = res.data
      playlistDetail.value = data
   
      const songData = data.musicDetailVOList || {}
      const records = songData.records || []
      
      if (isLoadMore) {
        musicList.value = [...musicList.value, ...records]
      } else {
        musicList.value = records
      }
      
      // 判断是否还有更多内容
      hasMore.value = pageNum.value < (songData.pages || 0)
    } else {
      ElMessage.error(res.errorMsg || '获取歌单详情失败')
    }
  } catch (err) {
    console.log('获取歌单详情失败', err)
    ElMessage.error('获取歌单详情失败')
  } finally {
    loading.value = false
    isLoadingMore.value = false
  }

  // 模拟收藏者数据
  if (!isLoadMore) {
    collectors.value = Array.from({ length: 8 }).map((_, i) => ({
      id: `collector-${i}`,
      userName: `收藏达人${i+1}`,
      avatar: `https://picsum.photos/50/50?random=${50+i}`,
      gender: i % 2 === 0 ? 1 : 2,
      introduction: '听歌是为了遇见更好的自己',
      collectPlaylistCount: Math.floor(Math.random() * 30),
      fansCount: Math.floor(Math.random() * 200)
    }))
  }
}

onMounted(() => {
  loadData(playlistId.value)
})

watch(() => route.params.id, (newVal) => {
  playlistId.value = newVal as string
  loadData(newVal as string)
})
</script>



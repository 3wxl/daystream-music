<template>
  <div class="h-full flex flex-col overflow-hidden">
    <div class="shrink-0 overflow-x-auto overflow-y-hidden tag-bar-container">
      <TagBars :tags="mvTags" />
    </div>

    <!-- MV列表 -->
    <div class="flex-1 min-h-0 overflow-y-auto" ref="containerRef" @scroll="handleScroll">
      <div class="mv-grid">
        <div v-for="mv in listData" :key="mv.id" @click="goToPlayer(mv.id)">
          <MvCard
            :img-url="mv.coverUrl || mv.cover"
            :title="mv.mvName || mv.name || mv.title"
            :author="mv.musicianName || mv.artistName || checkArtistName(mv.artists)"
            :duration="formatDuration(mv.duration)"
          />
        </div>
      </div>

      <div v-if="loading" class="py-4 text-center text-gray-500">加载中...</div>
      <div v-if="noMore && listData.length > 0" class="py-4 text-center text-gray-500">
        没有更多了
      </div>
      <div v-if="isError" class="py-4 text-center text-red-500 cursor-pointer" @click="retry">
        加载失败，点击重试
      </div>

      <!-- 空数据展示 -->
      <div
        v-if="!loading && listData.length === 0 && !isError"
        class="h-full flex items-center justify-center text-gray-500"
      >
        暂无数据
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { getHotMv, getNewMv, getVipMv } from '@/api/mv'
import MvCard from '@/components/MvCard.vue'
import TagBars from '@/components/TagBars.vue'
import { useLoadMore } from '@/composables/loadMore'
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const containerRef = ref<HTMLElement | null>(null)

const mvTags = [
  { name: '热门', path: '/mv', query: { type: 'hot' } },
  { name: '最新', path: '/mv', query: { type: 'new' } },
  { name: 'VIP专属', path: '/mv', query: { type: 'vip' } },
]

// 封装API请求
const currentApi = async (params: any, pageNum: number, pageSize: number) => {
  const type = route.query.type || 'hot'
  // pageNum就是页码，pageSize是每页数量

  let res
  if (type === 'new') {
    res = await getNewMv(pageSize.toString(), pageNum.toString())
  } else if (type === 'vip') {
    res = await getVipMv(pageSize.toString(), pageNum.toString())
  } else {
    // 默认热门
    res = await getHotMv(pageSize.toString(), pageNum.toString())
  }
  return res
}

const { listData, loading, noMore, loadData, isError } = useLoadMore(currentApi)

const formatDuration = (ms: number) => {
  if (!ms) return '00:00'
  const minutes = Math.floor(ms / 1000 / 60)
  const seconds = Math.floor((ms / 1000) % 60)
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

const checkArtistName = (artists: any[]) => {
  if (artists && artists.length > 0) {
    return artists.map((a) => a.name).join('/')
  }
  return '未知歌手'
}

const handleScroll = (e: Event) => {
  const target = e.target as HTMLElement
  if (target.scrollTop + target.clientHeight >= target.scrollHeight - 50) {
    loadData({})
  }
}

const retry = () => {
  loadData({})
}

const goToPlayer = (id: number | string) => {
  router.push(`/mv/player/${id}`)
}

watch(
  () => route.query.type,
  () => {
    loadData({}, true)
  },
)

onMounted(() => {
  loadData({}, true)
})
</script>

<style lang="scss" scoped>
.tag-bar-container {
  display: flex;
  white-space: nowrap;
  padding: 12px 20px;
  background-color: transparent;
  min-width: min-content;
}

.tag-bar-container::-webkit-scrollbar {
  display: none;
}

.tag-bar-container {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>

<route lang="yaml">
meta:
  layout: main
</route>

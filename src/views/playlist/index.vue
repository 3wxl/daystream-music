<template>
  <div class="h-full flex flex-col overflow-hidden">
    <div class="shrink-0 overflow-x-auto overflow-y-hidden tag-bar-container">
      <MultiBar v-model="filterValue" :filter-groups="filterGroups" />
    </div>

    <div
      class="music-card-container flex-1 min-h-0"
      v-infinite-scroll="handleScrollLoad"
      :infinite-scroll-disabled="loading || noMore"
      infinite-scroll-distance="50"
    >
      <div class="music-card">
        <MusicCard
          v-for="item in listData"
          :key="item.id"
          :imgUrl="item.cover"
          :title="item.name"
          :to="{ name: 'playlist-detailPage-id', params: { id: item.id } }"
          variant="album"
        >
          <h2 class="album-title">{{ item.name }}</h2>
        </MusicCard>

        <div v-if="loading" class="loading-text">加载中...</div>
        <div v-if="noMore" class="no-more-text">没有更多了</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { getAllTags } from '@/api/playlist/AllTag'
import MultiBar from '@/components/MultiBar.vue'
import { useLoadMore } from '@/Hooks/LoadMore'
import { transformFilterGroups } from '@/utils/transformFilterGroups'
import { ElMessage } from 'element-plus'
import { onMounted, provide, ref, watch } from 'vue'
import {useRoute} from 'vue-router'

const filterValue = ref({
  area: '',
  type: '',
  genre: '',
})

const route = useRoute()
const filterGroups = ref([])

// 提供给 useLoadMore 或其他子组件使用
provide('globalFilterValue', filterValue)

import { getlistByTags } from '@/api/playlist/ByTags'

const { loading, noMore, listData, loadData } = useLoadMore(getlistByTags)

// 提取标签对象中的有效值组成数组
const getTagValues = (tags: Record<string, string | number>) => {
  return Object.entries(tags).flatMap(([key,value])=> {
    if(value !==''){
      return [Number(value)]
    }
    
    const group =filterGroups.value.find((g:any) => g.key === key)
    if (group) {
      return group.options.map((opt: any) => Number(opt.value))
    }
    
    return []
  })
}

// 获取标签数据
const fetchTags = async () => {
  try {
    const res = await getAllTags()
    if (res.data) {
      filterGroups.value = transformFilterGroups(res.data)
    }
  } catch (err: any) {
    ElMessage.error(err.message || '获取标签失败')
  }
}

watch(
  filterValue,
  (newTags) => {
    loadData(getTagValues(newTags), true)
  },
  { deep: true },
)

const handleScrollLoad = () => {
  loadData(getTagValues(filterValue.value), false)
}

onMounted(() => {
  fetchTags()
    .then(() => {
      

      const tagId = route.query.tagId
      if(tagId){
        for(const group of filterGroups.value){
          const foundTag = group.options.find((tag) => tag.value == tagId)
          if(foundTag) {
            filterValue.value[group.key] = foundTag.value
            break
          }
        }
      }

      // 初始加载列表数据
      loadData(getTagValues(filterValue.value), true)
    })
    .catch((err) => {
      console.log(err)
    })
})
// const ListData = ref(
//   Array.from({ length: 50 }, (_, i) => {
//     const albumId = `album-${i + 1}` // 唯一的ID

//     return {
//       name: albumId, // 用于 :key, 必须唯一
//       type: 'album', // 统一类型为 'album'

//       // 路由指向 "List下的id页面"
//       to: { name: 'list-id', params: { id: albumId } },

//       // 'album' 类型所需的数据
//       data: {
//         // 使用 picsum.photos 并提供唯一的 seed 来获取 50 张不同的图片
//         imgUrl: `https://picsum.photos/seed/${albumId}/400/400`,
//         title: `专辑封面 ${i + 1}`,
//         albumTitle: `测试专辑 ${i + 1}`,
//       },
//     }
//   }),
// )
</script>

<style lang="scss" scoped>
.tag-bar-container {
  display: flex;
  white-space: nowrap;
  padding: 12px 20px;
  background-color: transparent;
  min-width: min-content;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.tag-bar-container::-webkit-scrollbar {
  display: none;
}

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

<template>
  <div class="carousel-container">
    <el-skeleton :loading="loading" animated>
      <template #template>
        <div class="px-10">
          <el-skeleton-item variant="rect" style="width: 100%; height: 320px; border-radius: 20px;" />
        </div>
      </template>
      <template #default>
        <el-carousel :interval="4000" type="card" height="320px" class="custom-carousel">
          <el-carousel-item v-for="item in banners" :key="item.id">
            <div 
              class="carousel-item-content" 
              :style="{ backgroundImage: `url(${item.imageUrl})` }"
              @click="handleBannerClick(item)"
            >
              <div class="glass-overlay">
                <h3 class="text-2xl font-bold text-white mb-2">{{ item.title || 'Daydream Music' }}</h3>
                <p class="text-white/80">探索无限音乐可能</p>
              </div>
            </div>
          </el-carousel-item>
        </el-carousel>
      </template>
    </el-skeleton>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getBannerList, type Banner } from '@/api/home/operations'

const banners = ref<Banner[]>([])
const router = useRouter()
const loading = ref(true)

const ActionType = {
  'NONE':'0',
  'TO_PLAYLIST':'1',
  'TO_SINGER':'2',
  'TO_ALBUM':'3',
  'TO_MV':'4',
  'TO_ACTIVITY':'5'
}

const fetchBanners = async () => {
  loading.value = true
  try {
    const res = await getBannerList(1, 4)
    if (res.success && res.data?.records) {
      // 只展示前四个
      banners.value = res.data.records.slice(0, 4)
    }
    console.log("-------------轮播图数据--------------")
    console.log(banners.value)
  } catch (error) {
    console.error('获取轮播图失败:', error)
  } finally {
    loading.value = false
  }
}

const jumpLogic = {
  [ActionType.TO_PLAYLIST]:(id)=> router.push({name:'playlist-detailPage-id',params:{id:id}}),
  [ActionType.TO_SINGER]:(id)=> router.push({name:'artist-id',params:{id:id}}),
  [ActionType.TO_ALBUM]:(id)=> router.push({name:'album-detailPage-id',params:{id:id}}),
  [ActionType.TO_MV]:(id)=> router.push({name:'mv-player-id',params:{id:id}}),
  [ActionType.NONE]:()=> router.push({name:'home'}),
  // 后续添加活动页面后，取消注释即可
  // [ActionType.TO_ACTIVITY]:(id)=> router.push({name:'activity-id',params:{id:id}})
}

const handleBannerClick = (item: Banner) => {
  const { actionType, targetId } = item
  // 处理跳转逻辑
  const handle = jumpLogic[actionType]
  if(handle){
    handle(targetId)
  }
}

onMounted(() => {
  fetchBanners()
})
</script>

<style lang="scss" scoped>
.custom-carousel {
  :deep(.el-carousel__item) {
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    transition: transform 0.4s ease-in-out;
  }

  :deep(.el-carousel__mask) {
    background-color: #0b0f1b;
    opacity: 0.6;
  }
}

.carousel-item-content {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-size: cover;
  background-position: center;
  position: relative;
  cursor: pointer;
}
</style>

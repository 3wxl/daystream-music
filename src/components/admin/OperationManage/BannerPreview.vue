<template>
  <AdminConfirm v-model="isPreview" :isCustom="true" width="1400px" >
    <el-carousel :interval="4000" type="card" height="320px" class="custom-carousel my-10">
      <el-carousel-item v-for="item,index in bannerData" :key="item.id">
        <div class="carousel-item-content" :class="`bg-[url(${item.imageUrl})]`" :style="`background-image: url(${item.imageUrl})`">
          <div class="glass-overlay">
            <h3 class="text-2xl font-bold text-white mb-2">{{ item.name }}</h3>
            <p class="text-white/80">{{ item.linkUrl ? '' : item.musicId ? item.musicName : item.playlistId ? item.playlistName : '' }}</p>
          </div>
        </div>
      </el-carousel-item>
    </el-carousel>
  </AdminConfirm>
</template>

<script setup lang="ts">
  import AdminConfirm from '../AdminConfirm.vue';

  let isPreview = defineModel<boolean>({
    default: false
  })
  let {bannerData} = defineProps<{
    bannerData: Array<{
      id: number,
      name: string,
      imageUrl: string,
      startTime: string,
      endTime: string,
      isDefault: boolean, // 标记为默认轮播图
      clickType: string,
      linkUrl: string,
      linkTarget: string,
      musicId: string,
      musicName: string,
      playlistId: string,
      playlistName: string
    }>
  }>()
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
}

.glass-overlay {
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(4px);
  padding: 20px 40px;
  border-radius: 12px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

</style>

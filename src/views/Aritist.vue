<template>
  <div class="h-full flex flex-col overflow-hidden">
    <div class="flex-1 min-h-0 overflow-y-auto">
      <ArtistList />
    </div>
  </div>
</template>

<script lang="ts" setup>

import ArtistList from '@/views/artist/artist.vue';

</script>

<style lang="scss" scoped>
.tag-bar-container {
  display: flex;
  white-space: nowrap; /* 防止标签换行 */
  padding: 12px 20px;
  background-color: transparent; /* 透明背景，使用父容器的深色背景 */
  min-width: min-content; /* 确保内容不会被压缩 */
}

/* 隐藏滚动条但保持滚动功能 */
.tag-bar-container::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}

.tag-bar-container {
  -ms-overflow-style: none; /* IE 和 Edge */
  scrollbar-width: none; /* Firefox */
}
</style>

<route lang="yaml">
meta:
  layout: main
</route>
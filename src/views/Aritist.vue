<template>
  <div class="h-full flex flex-col overflow-hidden">
    <div class="shrink-0 overflow-x-auto overflow-y-hidden tag-bar-container">
      <TagBar :tags="artistFilterTags" />
    </div>

    <div class="flex-1 min-h-0 overflow-y-auto">
      <router-view />
    </div>
  </div>
</template>

<script lang="ts" setup>
import TagBar from '@/components/TagBar.vue';

// 修改后的歌手标签数据
const artistFilterTags = [
  // 路径修改为 /artist/artist
  { name: '歌手/推荐', path: '/artist/artist' },

  // 以下标签的 path 保持 /album/mylist，并增加 query 参数用于筛选
  { name: '周杰伦', path: '/album/mylist', query: { cat: 'jay-chou' } },
  { name: '陈奕迅', path: '/album/mylist', query: { cat: 'eason-chan' } },
  { name: 'Taylor Swift', path: '/album/mylist', query: { cat: 'taylor-swift' } },
  { name: 'Ariana Grande', path: '/album/mylist', query: { cat: 'ariana-grande' } },
  { name: '林俊杰', path: '/album/mylist', query: { cat: 'jj-lin' } },
  { name: '邓紫棋', path: '/album/mylist', query: { cat: 'gloria-tang' } },
  { name: 'Ed Sheeran', path: '/album/mylist', query: { cat: 'ed-sheeran' } },
  { name: 'BTS', path: '/album/mylist', query: { cat: 'bts' } },
  { name: 'Blackpink', path: '/album/mylist', query: { cat: 'blackpink' } },
  { name: '五月天', path: '/album/mylist', query: { cat: 'mayday' } },
  { name: 'Adele', path: '/album/mylist', query: { cat: 'adele' } },
  { name: '窦唯', path: '/album/mylist', query: { cat: 'dou-wei' } },
  { name: '坂本龙一', path: '/album/mylist', query: { cat: 'sakamoto' } },
  { name: 'Billie Eilish', path: '/album/mylist', query: { cat: 'billie-eilish' } },
  { name: '王菲', path: '/album/mylist', query: { cat: 'faye-wong' } },
  { name: '李荣浩', path: '/album/mylist', query: { cat: 'li-ronghao' } },
];
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
<template>
  <div class="h-full flex flex-col overflow-hidden">
    <!-- TagBar 区域：固定高度，横向滚动 -->
    <div class="shrink-0 overflow-x-auto overflow-y-hidden tag-bar-container">
      <TagBar :tags="categoryFilterTags"/>
    </div>

    <!-- 子路由内容区域：占据剩余空间，竖直滚动 -->
    <div class="flex-1 min-h-0 overflow-y-auto">
      <router-view />
    </div>
  </div>
</template>

<script lang="ts" setup>
import TagBar from '@/components/TagBar.vue';


const categoryFilterTags = [
  // 为了让 MyList 页面知道显示哪个分类，我们使用 query.
  // 路径会解析为 /mylist?cat=recommend
  { name: '推荐', path: '/album/mylist'},

  // 路径会解析为 /mylist?cat=chinese
  { name: '华语',  path: '/album/mylist' },

  // 路径会解析为 /mylist?cat=western
  { name: '欧美',  path: '/album/mylist' },

  { name: '日语', path:  '/album/mylist' },
  { name: '韩语', path:  '/album/mylist' },
  { name: '流行', path:  '/album/mylist'  },
  { name: '摇滚', path:  '/album/mylist' },
  { name: '民谣', path:  '/album/mylist' },
  { name: '电子', path:  '/album/mylist'},
  { name: '轻音乐', path:  '/album/mylist' },
  { name: '古典', path:  '/album/mylist'},
  { name: '爵士', path:  '/album/mylist'},
  { name: '乡村', path:  '/album/mylist'},
  { name: 'R&B', path:  '/album/mylist'},
  { name: '说唱', path:  '/album/mylist'},
  { name: 'ACG', path:  '/album/mylist'},
  { name: '学习', path:  '/album/mylist'},
  { name: '助眠', path:  '/album/mylist'},
  { name: '派对', path:  '/album/mylist'},
  { name: '治愈', path:  '/album/mylist'},
  { name: '浪漫', path:  '/album/mylist'}
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

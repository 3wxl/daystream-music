<template>
  <div class="h-full flex flex-col overflow-hidden">
    <div class="shrink-0 overflow-x-auto overflow-y-hidden tag-bar-container">
      <TagBars :tags="mvTags" />
    </div>

    <div class="flex-1 min-h-0 overflow-y-auto">
      <router-view />
    </div>
  </div>
</template>

<script lang="ts" setup>
import TagBars from '@/components/TagBars.vue'

const mvTags = [
  { name: '全部', path: '/mv/MvList' },
  { name: '内地', path: '/mv/MvList', query: { area: 'mainland' } },
  { name: '港台', path: '/mv/MvList', query: { area: 'hktw' } },
  { name: '欧美', path: '/mv/MvList', query: { area: 'western' } },
  { name: '日本', path: '/mv/MvList', query: { area: 'japan' } },
  { name: '韩国', path: '/mv/MvList', query: { area: 'korea' } },
]
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

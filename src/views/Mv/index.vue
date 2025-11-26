<template>
  <div class="h-full flex flex-col overflow-hidden">
    <!-- TagBar 区域：固定高度，横向滚动 -->
      <div class="shrink-0 overflow-x-auto overflow-y-hidden tag-bar-container">
        <TagBar :tags="categoryFilterTags"/>
      </div>

      <div class="flex-1 min-h-0 overflow-y-auto">
        <MvCard />
      </div>
  </div>
</template>


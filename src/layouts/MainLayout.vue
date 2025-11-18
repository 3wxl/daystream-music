<template>
  <div class="h-screen flex overflow-hidden bg-gray-900">
    <left-menu class="shrink-0" />
    <div class="flex flex-col flex-1 min-h-0 min-w-0">
      <top-header class="shrink-0" />
      <main class="flex-1  min-w-0 overflow-hidden bg-gray-900">
        <div class="h-full">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
/* 确保整体布局占满屏幕 */
</style>

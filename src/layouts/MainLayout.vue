<template>
  <div class="h-screen flex overflow-hidden bg-gray-900">
    <left-menu class="shrink-0" />
    <div class="flex flex-col flex-1 min-h-0 min-w-0">
      <top-header class="shrink-0" />
      <main class="flex-1  min-w-0 overflow-hidden bg-gray-900">
        <div class="h-full  overflow-y-auto">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>

<style lang="scss" scoped>
main {
  -ms-overflow-style: none;  /* IE 和 Edge */
  scrollbar-width: none;  /* Firefox */

  /* 隐藏 Chrome、Safari 和 Opera 的滚动条 */
  &::-webkit-scrollbar {
      display: none;
  }
}
</style>

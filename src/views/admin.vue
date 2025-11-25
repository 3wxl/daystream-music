<!-- /admin的页面 -->
<template>
  <router-view></router-view>
</template>

<script setup>

</script>

<route lang="yaml">
  meta:
    layout: admin
    title: "后台"
</route>

<style>
  html {
    scrollbar-width: none; /* Firefox 特有：隐藏滚动条，保留功能 */
    -ms-overflow-style: none; /* IE 和 Edge 特有：隐藏滚动条 */
  }

  /* 隐藏 Chrome、Safari 等 WebKit 内核浏览器的滚动条 */
  html::-webkit-scrollbar {
    display: none; /* 隐藏滚动条轨道和滑块 */
  }
</style>

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
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  html::-webkit-scrollbar {
    display: none;
  }
</style>

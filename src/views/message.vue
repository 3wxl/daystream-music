<template>
  <MessageTopHeader></MessageTopHeader>
  <div class="flex relative items-start overflow-y-auto bg-gray-900/60 rounded-xl border border-gray-800 overflow-hidden shadow-lg backdrop-blur-sm" style="height: calc(-160px + 100vh);">
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
  import MessageTopHeader from '@/components/message/MessageTopHeader.vue'
</script>

<style scoped>

</style>

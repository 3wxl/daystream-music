<template>
  <div class="shadow-md/4 border-[#e4e7ed] bg-white rounded-[10px] p-[15px]">
    <!-- 推荐歌曲管理 -->
    <RecommendSongs />
    <!-- 推荐歌单管理 -->
    <RecommendGd />
  </div>
</template>

<script setup lang="ts">
  import RecommendGd from '@/components/admin/OperationManage/RecommendManage/RecommendGd.vue'
  import RecommendSongs from '@/components/admin/OperationManage/RecommendManage/RecommendSongs.vue'
</script>

<style scoped>

</style>

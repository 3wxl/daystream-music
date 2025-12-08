<template>
  <div class="w-full px-[15px] m-[15px]">
    <LikeMessageCard v-for="item in 9"/>
    <div class="text-center mt-2">
      <span class="text-[15px] text-[#e5e7eb]">没有更多点赞了~</span>
    </div>
  </div>
</template>

<script setup lang="ts">
  import LikeMessageCard from "@/components/message/LikeMessage/LikeMessageCard.vue";
</script>

<style scoped></style>

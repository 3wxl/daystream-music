<template>
  <div class="w-full px-[15px] m-[15px]">
    <FollowerMessageCard v-for="item in 9"/>
    <div class="text-center mt-2">
      <span class="text-[15px] text-[#e5e7eb]">没有更多粉丝了~</span>
    </div>
  </div>
</template>

<script setup lang="ts">
  import FollowerMessageCard from "@/components/message/FollowerMessage/FollowerMessageCard.vue";
</script>

<style scoped></style>

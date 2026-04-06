<template>
  <div class="w-full px-[15px] m-[15px]">
    <LikeMessageCard v-for="item in likeMessageList" :data="item" :key="item.id"/>
    <div class="text-center mt-2">
      <span class="text-[15px] text-[#e5e7eb]">没有更多点赞了~</span>
    </div>
  </div>
</template>

<script setup lang="ts">
  import LikeMessageCard from "@/components/Message/LikeMessage/LikeMessageCard.vue";
  import {GetLikeMessageListAPI} from "@/api/messageChat";
  import {GetLikeMessageListInterface,GetLikeMessageListDataInterface} from "@/types/message";

  let likeMessageList = reactive<GetLikeMessageListDataInterface[]>([])

  async function getLikeMessageList(){
    let res = await GetLikeMessageListAPI(1, 20) as GetLikeMessageListInterface
    likeMessageList = res.data
  }
  onMounted(()=>{
    getLikeMessageList()
  })
</script>

<style scoped></style>

<template>
  <div class="w-full px-[15px] m-[15px]">
    <FollowerMessageCard v-for="item in followerMessageList" :key="item.id" :data="item"/>
    <div class="text-center mt-2">
      <span class="text-[15px] text-[#e5e7eb]">没有更多粉丝了~</span>
    </div>
  </div>
</template>

<script setup lang="ts">
  import FollowerMessageCard from "@/components/Message/FollowerMessage/FollowerMessageCard.vue";
  import {GetFollowerMessageListAPI} from "@/api/messageChat";
  import {GetFollowerMessageListInterface,GetFollowerMessageListDataInterface} from "@/types/message";

  let followerMessageList = reactive<GetFollowerMessageListDataInterface[]>([])

  async function getFollowerMessageList(){
    let res = await GetFollowerMessageListAPI(1, 20) as GetFollowerMessageListInterface
    followerMessageList = res.data
  }
  onMounted(()=>{
    getFollowerMessageList()
  })
</script>

<style scoped></style>

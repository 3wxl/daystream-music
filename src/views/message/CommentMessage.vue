<template>
  <div class="w-full px-[15px] m-[15px]">
    <CommentMessageCard v-for="item in commentMessageList" :key="item.id" :data="item"/>
    <div class="text-center mt-2">
      <span class="text-[15px] text-[#e5e7eb]">没有更多评论了~</span>
    </div>
  </div>
</template>

<script setup lang="ts">
  import CommentMessageCard from "@/components/Message/CommentMessage/CommentMessageCard.vue";
  import {GetCommentMessageListAPI} from "@/api/messageChat";
  import {GetCommentMessageListInterface,GetCommentMessageListDataInterface} from "@/types/message";

  let commentMessageList = reactive<GetCommentMessageListDataInterface[]>([])

  async function getCommentMessageList(){
    let res = await GetCommentMessageListAPI(1, 20) as GetCommentMessageListInterface
    commentMessageList = res.data
  }
  onMounted(()=>{
    getCommentMessageList()
  })
</script>

<style scoped></style>

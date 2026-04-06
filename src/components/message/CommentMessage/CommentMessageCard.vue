<template>
  <transition name="slide-up-appear" appear>
    <div class="p-[15px] w-full flex mb-2">
      <div class="w-[50px] h-[50px] rounded-full overflow-hidden">
        <img :src="data.fromUserAvatar" class="w-[50px] h-[50px] rounded-full cursor-pointer hover:scale-110 duration-500"></img>
      </div>
      <div class="flex-grow-1 flex border-b-1 border-gray-400/20 pb-2">
        <div class="ml-4 flex flex-col">
          <div class="flex items-center">
            <span class="text-white text-[16px] font-bold hover:text-pink-500 duration-200 cursor-pointer">{{ data.fromUserName }}</span>
            <span class="ml-3 text-[14px] text-[#e5e7eb]">回复了我的评论</span>
          </div>
          <div class="mt-[6px]">
            <p class="text-[14px] text-[#e5e7eb] line-clamp-3 pr-10">{{ data.content }}</p>
          </div>
          <div class="mt-[6px] flex items-center">
            <span class="text-[#e5e7eb] text-[13px]">{{ data.createTime }}</span>
            <span class="group ml-6 cursor-pointer">
              <IconFontSymbol name="icon" size="16px" class="mr-1 group-hover:text-pink-600 text-white duration-150"></IconFontSymbol>
              <span class="text-[14px] group-hover:text-pink-600 text-white duration-150">点赞</span>
            </span>
            <span class="ml-6 group cursor-pointer">
              <IconFontSymbol name="chakantiezihuifu" size="20px" class="font-[600] mr-1 relative bottom-[1px] group-hover:text-pink-600 text-white duration-150"></IconFontSymbol>
              <span class="text-white text-[14px] group-hover:text-pink-600 duration-150">回复</span>
            </span>
          </div>
        </div>
        <div class="ml-[auto] w-[150px]">
          <p class="text-[15px] text-[#e5e7eb] line-clamp-3 hover:text-pink-400 duration-200 cursor-pointer">{{ data.targetContent }}</p>
        </div>
      </div>
    </div>
  </transition>

</template>

<script setup lang="ts">
  import {GetCommentMessageListDataInterface} from "@/types/message";
  let props = defineProps<{
    data: GetCommentMessageListDataInterface
  }>()
</script>

<style scoped>
.slide-up-appear-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}
.slide-up-appear-enter-active {
  transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.slide-up-appear-enter-to {
  opacity: 1;
  transform: translateY(0);
}
.flex-grow {
  flex-grow: 1;
}
</style>

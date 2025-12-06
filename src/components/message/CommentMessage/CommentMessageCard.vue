<template>
  <transition name="slide-up-appear" appear>
    <div class="p-[15px] w-full flex mb-2">
      <div class="w-[50px] h-[50px] rounded-full overflow-hidden">
        <img src="https://picsum.photos/200/200" class="w-[50px] h-[50px] rounded-full cursor-pointer hover:scale-110 duration-500"></img>
      </div>
      <div class="flex-grow-1 flex border-b-1 border-gray-400/20 pb-2">
        <div class="ml-4 flex flex-col">
          <div class="flex items-center">
            <span class="text-white text-[16px] font-bold hover:text-pink-500 duration-200 cursor-pointer">给你评论的人的名字</span>
            <span class="ml-3 text-[14px] text-[#e5e7eb]">回复了我的评论</span>
          </div>
          <div class="mt-[6px]">
            <p class="text-[14px] text-[#e5e7eb] line-clamp-3 pr-10">别人回复我的别人回复我的别人回复我的别人回复我的别人回复我的别人回复我的别人回复我的别人回复我的别人回复我的别人回复我的别人回复我的别人回复我的别人回复我的别人回复我的</p>
          </div>
          <div class="mt-[6px] flex items-center">
            <span class="text-[#e5e7eb] text-[13px]">2025-10-15 10:10:10</span>
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
          <p class="text-[15px] text-[#e5e7eb] line-clamp-3 hover:text-pink-400 duration-200 cursor-pointer">奥维互动i啊我活动i啊我活动i啊挖好的达瓦阿瓦达家谱为大家片尾动画网hi</p>
        </div>
      </div>
    </div>
  </transition>

</template>

<script setup lang="ts"></script>

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

<template>
  <transition name="slide-up-appear" appear>
    <div class="pb-1 group relative shadow-custom mx-[10px] rounded-[12px] duration-300 cursor-pointer mb-3 hover:bg-pink-500/10" :class="isActived?'bg-pink-500/10':''" @click="updateActive">
      <div class="flex h-20 items-center">
        <div class="w-[50px] h-[50px] rounded-[30px] overflow-hidden] ml-3 relative">
          <img class="w-full h-full rounded-[30px] hover:scale-110 duration-500" src="https://picsum.photos/200/300" alt=""></img>
          <div class="absolute bottom-[0px] right-[2px] w-[16px] h-[16px] bg-white rounded-[9px] flex items-center justify-center shadow-b-pink">
            <span class="inline-block w-[12px] h-[12px] rounded-[10px] bg-pink-500 absolute"></span>
          </div>
          <!-- <div class="absolute bottom-[0px] right-[2px] w-[16px] h-[16px] bg-white rounded-[9px] flex items-center justify-center shadow-b-gray">
            <span class="inline-block w-[12px] h-[12px] rounded-[10px] bg-gray-500 absolute"></span>
          </div> -->
        </div>
        <div class="ml-3 flex flex-col">
          <p class="max-w-[100px] text-[15px] text-[white] line-clamp-1">私聊对象名称私聊对象名称</p>
          <p class="max-w-[120px] text-[13px] text-[#e5e7eb] line-clamp-1">最后一次私聊内容最后一次私聊内容</p>
        </div>
        <div class="ml-2">
          <span class="mt-7 text-pink-400/80 line-clamp-1 text-[12px]">20分钟前</span>
        </div>
        <div class="ml-auto mr-1">
          <span class="inline-block w-[24px] h-[24px] rounded-[12px] bg-pink-500 text-[white] text-[12px]/[24px] text-center font-[700]">22</span>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
  let props = defineProps(['isActived','index'])
  let emit = defineEmits(['updateActive'])

  function updateActive(){
    emit('updateActive',props.index)
  }
</script>

<style scoped>
  .shadow-custom:hover{
    box-shadow: 0px 0px 10px 0px rgba(238, 50,153,0.2);
  }
  .shadow-b-pink{
    box-shadow: 0px 5px 10px 0 rgb(238, 50,153);
  }
  .shadow-b-gray{
    box-shadow: 0px 5px 10px 0 rgb(168, 168,168);
  }
</style>

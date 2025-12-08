<template>
  <header class="p-[15px] flex items-center bg-[#131526] border-b-1 border-[#222440]">
    <div class="w-[50px] h-[50px] rounded-[30px] overflow-hidden] ml-4 relative">
      <img class="w-full h-full rounded-[30px] hover:scale-110 duration-500" src="https://picsum.photos/200/300" alt=""></img>
      <div class="absolute bottom-[0px] right-[2px] w-[16px] h-[16px] bg-white rounded-[9px] flex items-center justify-center shadow-b-pink">
        <span class="inline-block w-[12px] h-[12px] rounded-[10px] bg-pink-500 absolute"></span>
      </div>
      <!-- <div class="absolute bottom-[0px] right-[2px] w-[16px] h-[16px] bg-white rounded-[9px] flex items-center justify-center shadow-b-gray">
        <span class="inline-block w-[12px] h-[12px] rounded-[10px] bg-gray-500 absolute"></span>
      </div> -->
    </div>
    <div class="ml-4 flex flex-col justify-center gap-[2px]">
      <p class="text-[16px] text-[white] font-[600] max-w-[300px] line-clamp-1 mt-1">私聊对象昵称</p>
      <p class="text-[12px] text-pink-400 font-[600] max-w-[300px] line-clamp-1 mt-1">在线</p>
    </div>
    <div class="ml-auto mr-5">
      <IconFontSymbol name="sandian" class="hover:text-pink-500 text-white cursor-pointer duration-300" size="20px"/>
    </div>
  </header>
  <section class="w-full relative" style="height: calc(100% - 84px)">
    <ChatContent :id="id"/>
  </section>
</template>

<script setup lang="ts">
  import { useRoute } from 'vue-router'
  const route = useRoute()
  let id = ref(route.params.id)

  watch(
    () => route.params.id,
    (newId) => {
      id.value = newId
      // 更新聊天记录和顶部信息
    }
  )

</script>

<style scoped>
  .shadow-b-pink{
    box-shadow: 0px 5px 10px 0 rgb(238, 50,153);
  }
  .shadow-b-gray{
    box-shadow: 0px 5px 10px 0 rgb(168, 168,168);
  }
</style>

<template>
  <div class="w-full h-full rounded-[12px] relative overflow-hidden bg-sky-50 group cursor-move move-card">
    <div class="w-full h-full rounded-[12px] flex ">
      <div class="flex items-center">
        <span class="ml-2 w-[26px] h-[26px] inline-block text-center text-[15px]/[26px] rounded-[13px] bg-[rgba(0,0,0,0.2)] text-[white]">
          {{ index + 1 }}
        </span>
      </div>
      <div class="p-[7.5px]">
        <img :src="recommendSong.cover" :alt="recommendSong.name" class="w-[40px] h-[40px] rounded-[8px] object-cover">
      </div>
      <div class="flex flex-col justify-center">
        <p class="">{{ recommendSong.name }}</p>
        <p class="text-[13px]">{{ recommendSong.author }}</p>
      </div>
      <div class="ml-auto">
        <span
          @click="updateSong"
          @mousedown.stop
          class=" opacity-0 group-hover:opacity-[1] duration-800 p-1 px-2 rounded-[100px] absolute right-3 bottom-3 bg-[rgba(255,255,255,0.1)] cursor-pointer"
        >
          <IconFontSymbol name="a-shezhi-shucaidanshezhi-copy" class="text-[#666]" size="16px"/>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import IconFontSymbol from '@/components/IconFontSymbol.vue';
  let props = defineProps<{
    recommendSong:{
      id:string,
      cover:string,
      name:string,
      author:string,
      type:string[],
      createTime:string,
    }
    index:number
  }>();

  // 方法
  let emit = defineEmits(['select'])
  function updateSong(){
    emit('select',props.recommendSong.id)
  }
</script>

<style scoped>
</style>

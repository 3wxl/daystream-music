<template>
  <div class="basis-[15%] aspect-square rounded-[12px] relative cursor-pointer group">
    <div class="w-full h-full absolute top-0 left-0 z-0 rounded-[12px] overflow-hidden">
      <img
        :src="data.imgUrl"
        alt=""
        class="w-full h-full rounded-[12px] group-hover:scale-[1.1] duration-800 "
      >
      <div class="w-full h-full rounded-[12px] opacity-0 absolute top-0 left-0 z-1 bg-[rgba(0,0,0,0.2)] group-hover:opacity-[1] duration-800"></div>
    </div>
    <div class="w-full h-full absolute top-0 left-0 z-10 p-3" @click.self="updateGd">
      <span class="w-[26px] h-[26px] inline-block text-center text-[15px]/[26px] rounded-[13px] bg-[rgba(0,0,0,0.14)] text-[white]">
        {{ index }}
      </span>
      <div @click.self="updateGd">
        <span class="text-[white] text-[20px] font-bold">{{ data.description }}</span>
      </div>
      <div class="flex mt-1" @click.self="updateGd">
        <span class="text-[white] text-[13px]">{{ data.songCount }}</span>
      </div>
      <!-- 关键：添加 card-drag-handle 类，作为拖拽触发柄 -->
      <span class="card-drag-handle opacity-0 group-hover:opacity-[1] duration-800 p-1 px-2 rounded-[100px] absolute right-3 bottom-3 bg-[rgba(255,255,255,0.1)]">
        <IconFontSymbol name="a-shezhi-shucaidanshezhi-copy" class="text-white" size="16px"/>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
  import IconFontSymbol from '@/components/IconFontSymbol.vue';
  let isActionDrawerOpen = defineModel<boolean>();
  let props = defineProps<{
    data: {
      id: string;
      imgUrl: string;
      description: string;
      songCount: string;
      singerName: string;
    };
    index: number;
  }>();

  // 方法
  let emit = defineEmits(['select'])
  function updateGd(){
    emit('select',props.data.id)
  }
</script>

<style scoped>
.card-drag-handle {
  cursor: move;
}
</style>

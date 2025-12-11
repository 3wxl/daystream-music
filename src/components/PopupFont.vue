<template>
  <Teleport to="body">
    <transition name="mask-fade" appear>
      <div v-show="isShow" class="absolute w-full h-full z-9 left-0 top-0 bg-transparent flex justify-center items-center">
        <div class="absolute w-full h-full z-10 left-0 top-0 bg-black opacity-50" @click="isShow = false"></div>
        <transition name="content" appear>
          <div class="absolute z-10000 w-[680px] rounded-[14px]" v-if="isShow">
            <div class="relative h-18 w-full rounded-[14px]">        <!-- 弹窗头部 -->
              <div class="bg-[#121212] h-18 w-full px-6 py-4 flex justify-between items-center border-b border-white/10 absolute inset-0 rounded-t-[14px]">
                <div class="flex items-center gap-3">
                  <img src="@/assets/logo_0.png" class="w-10 h-10 rounded-full" alt="">
                  <h2 class="text-xl font-semibold text-white">{{ title }}</h2>
                </div>
                <button class="text-[#8A8A8A] hover:text-white transition-colors cursor-pointer" @click="isShow = false" type="button">
                  <IconFontSymbol name="guanbi"/>
                </button>
              </div>
            </div>
            <div class="bg-[#1E1E1E] w-full p-6 overflow-y-auto overflow-y-auto max-h-[calc(85vh-4.5rem)] scrollbar-custom rounded-b-[14px]">       <!-- 内容区 -->
              <slot></slot>
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </Teleport>
</template>

<script lang="ts" setup>
  let props = defineProps<{
    title:string
  }>()
  let isShow = defineModel()
</script>

<style scoped>
  .mask-fade-enter-from{
    opacity: 0;
  }
  .mask-fade-enter-to{
    opacity: 1;
  }
  .mask-fade-enter-active{
    transition: 0.3s;
  }
  .content-enter-from{
    opacity: 0;
    scale: 0.9;
    transform: translateY(-50px);
  }
  .content-enter-to{
    opacity: 1;
    scale: 1;
    transform: translateY(0);
  }
  .content-enter-active{
    transition: 0.4s;
  }
</style>

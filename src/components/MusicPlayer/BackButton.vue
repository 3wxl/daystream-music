<template>
  <div class="relative z-10 pt-4 px-4">
    <i
      @click="$emit('back')"
      class="iconfont icon-chevron-left cursor-pointer text-pink-400 hover:text-pink-300 hover:scale-110 transition-all duration-300 text-xl transform -rotate-90 backdrop-blur-sm bg-pink-500/5 w-8 h-8 rounded-full flex items-center justify-center border border-pink-400/30"
      >&#xe62e;</i
    >
  </div>
</template>

<script setup>
defineEmits(['back'])
</script>

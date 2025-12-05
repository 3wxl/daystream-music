<template>
  <div class="fixed inset-0 pointer-events-none overflow-hidden z-0">
    <div
      class="absolute inset-0 bg-gradient-to-br from-pink-400/10 via-pink-500/5 to-pink-300/10"
    ></div>
    <div
      v-for="i in 15"
      :key="i"
      class="absolute w-0.5 h-0.5 bg-pink-400/30 rounded-full animate-pulse"
      :style="{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 2}s`,
        animationDuration: `${2 + Math.random() * 3}s`,
      }"
    ></div>
  </div>
</template>

<script setup>
// 这个组件不需要props或逻辑
</script>

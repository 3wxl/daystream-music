<template>
  <section class="animate-fade-in-up" style="--delay: 0.3s">
    <div class="flex items-center space-x-2 mb-6">
      <div
        class="w-2 h-6 bg-gradient-to-b from-pink-300 to-pink-400 rounded-full animate-pulse-glow"
      ></div>
      <h2 class="text-2xl font-bold text-pink-400">歌手排行榜</h2>
      <span
        class="ml-2 px-2 py-1 bg-pink-500/20 rounded-full text-xs text-pink-300 animate-bounce-subtle"
      >
        <i class="fa fa-fire mr-1"></i>人气歌手
      </span>
    </div>

    <!-- 歌手排行榜网格 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <SingerItem
        v-for="(singer, index) in singers"
        :key="singer.id"
        :singer="singer"
        :rank="index + 1"
      />
    </div>
  </section>
</template>

<script setup>
import { defineProps } from 'vue'
import SingerItem from './SingerItem.vue'

// 接收父组件参数
const props = defineProps({
  singers: {
    type: Array,
    required: true,
  },
})
</script>

<style scoped>
/* 淡入上滑动画 */
.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out forwards;
  opacity: 0;
  transform: translateY(20px);
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 脉冲发光动画 */
.animate-pulse-glow {
  animation: pulseGlow 2s ease-in-out infinite alternate;
}

@keyframes pulseGlow {
  0% {
    opacity: 0.7;
  }
  100% {
    opacity: 1;
    box-shadow: 0 0 8px rgba(236, 72, 153, 0.6);
  }
}

/* 轻微弹跳动画 */
.animate-bounce-subtle {
  animation: bounceSubtle 2s ease-in-out infinite alternate;
}

@keyframes bounceSubtle {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-2px);
  }
}
</style>

<template>
  <section class="animate-fade-in-up" style="--delay: 0.15s">
    <div class="flex items-center space-x-2 mb-4">
      <div
        class="w-2 h-6 bg-gradient-to-b from-pink-300 to-pink-400 rounded-full animate-pulse-glow"
      ></div>
      <h2 class="text-xl font-bold text-pink-400">榜单分类</h2>
    </div>

    <div class="flex overflow-x-auto pb-2 gap-2 mb-6 scrollbar-hide">
      <button
        v-for="(category, index) in categories"
        :key="index"
        @click="handleCategoryChange(index)"
        class="px-4 py-2 rounded-full whitespace-nowrap transition-all duration-300"
        :class="[
          activeIndex === index
            ? 'bg-gradient-to-r from-puink-500/70 to-pink-500/30 border border-pink-500/50 text-white shadow-lg shadow-pink-500/10'
            : 'glass-effect text-gray-300 hover:text-white',
        ]"
      >
        {{ category }}
      </button>
    </div>
  </section>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

// 接收父组件参数
const props = defineProps({
  categories: {
    type: Array,
    required: true,
  },
  activeIndex: {
    type: Number,
    default: 0,
  },
})

// 向父组件传递分类切换事件
const emit = defineEmits(['category-change'])

const handleCategoryChange = (index) => {
  emit('category-change', index)
}
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

/* 隐藏水平滚动条 */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* 玻璃态效果 */
.glass-effect {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
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
</style>

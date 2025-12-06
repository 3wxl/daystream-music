<template>
  <section
    class="relative rounded-3xl overflow-hidden h-48 md:h-64 group banner-section"
    @mouseenter="startBannerAnimation"
    @mouseleave="stopBannerAnimation"
  >
    <img
      :src="bannerImage"
      alt="音乐推荐"
      class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      :class="{ 'animate-pan': isBannerAnimating }"
    />
    <div
      class="absolute inset-0 bg-gradient-to-r from-pink-700/80 via-pink-600/80 to-pink-700/80 mix-blend-multiply animate-gradient"
    ></div>
    <div class="absolute inset-0 flex flex-col justify-center p-6 md:p-10 z-10">
      <p class="text-white/90 text-sm md:text-base mb-2 animate-text-slide" style="--delay: 0.1s">
        本周推荐
      </p>
      <h2
        class="text-2xl md:text-4xl font-bold mb-3 max-w-md animate-text-slide"
        style="--delay: 0.2s"
      >
        发现最热门的<br />流行音乐榜单
      </h2>
      <button
        class="w-fit px-5 py-2.5 rounded-full glass-effect border border-white/30 hover:bg-white/30 transition-all duration-300 flex items-center gap-2 animate-text-slide hover:scale-105 hover:shadow-lg hover:shadow-pink-500/25"
        style="--delay: 0.3s"
        @mouseenter="buttonHover = true"
        @mouseleave="buttonHover = false"
      >
        <span class="relative">
          立即探索
          <span
            v-if="buttonHover"
            class="absolute -bottom-1 left-0 w-full h-0.5 bg-white rounded-full animate-underline"
          ></span>
        </span>
        <i
          class="fa fa-arrow-right text-sm transition-transform duration-300"
          :class="{ 'translate-x-1': buttonHover }"
        ></i>
      </button>
    </div>

    <!-- 浮动音乐图标 -->
    <div class="absolute top-4 right-4 flex space-x-2">
      <div
        v-for="n in 3"
        :key="n"
        class="w-2 h-2 rounded-full bg-white/60 animate-pulse"
        :style="`animation-delay: ${n * 0.2}s`"
      ></div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

// 接收父组件传递的 banner 图片地址
const props = defineProps({
  bannerImage: {
    type: String,
    default:
      'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=1200&h=600&fit=crop&auto=format',
  },
})

// 响应式数据
const isBannerAnimating = ref(false)
const buttonHover = ref(false)

// 动画控制
const startBannerAnimation = () => {
  isBannerAnimating.value = true
}

const stopBannerAnimation = () => {
  isBannerAnimating.value = false
}
</script>

<style scoped>
.banner-section {
  position: relative;
}

/* 背景平移动画 */
.animate-pan {
  animation: pan 15s ease-in-out infinite alternate;
}

@keyframes pan {
  0% {
    transform: scale(1.1) translateX(0);
  }
  100% {
    transform: scale(1.1) translateX(-5%);
  }
}

/* 背景渐变动画 */
.animate-gradient {
  background: linear-gradient(-45deg, #8b5cf6, #ec4899, #8b5cf6, #ec4899);
  background-size: 400% 400%;
  animation: gradient 15s ease infinite;
}

@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* 玻璃态效果 */
.glass-effect {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
</style>

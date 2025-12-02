<template>
  <section class="relative py-20 md:py-32 px-4 md:px-8 lg:px-16 min-h-screen">
    <div class="container mx-auto">
      <div class="max-w-4xl mx-auto text-center">
        <h1 class="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 animate-on-scroll">
          <span class="block text-gray-800">音乐发行</span>
          <span class="gradient-text">全网领先的一站式发行服务</span>
        </h1>

        <p
          class="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto animate-on-scroll animate-delay-200"
        >
          护航你的音乐之路，从创作到发行，我们提供全方位的专业支持
        </p>

        <div
          class="flex flex-col sm:flex-row justify-center gap-4 animate-on-scroll animate-delay-300"
        >
          <!-- 主按钮：渐变从紫色系→纯粉色系（深粉→浅粉） -->
          <router-link to="/Musician/MusicianJoin">
            <button
              class="px-8 py-4 rounded-full bg-gradient-to-r from-pink-400 to-rose-300 text-white font-bold text-lg hover:shadow-2xl hover:shadow-pink-600/30 transition-all duration-300 transform hover:-translate-y-1"
            >
              免费体验发行服务
            </button>
          </router-link>
          <!-- 次要按钮：图标颜色从紫色→粉色 -->
          <!-- <button
            class="px-8 py-4 rounded-full bg-white text-gray-800 font-bold text-lg border border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 flex items-center justify-center"
          >
            <i class="fas fa-play-circle mr-2 text-pink-600"></i> 观看介绍视频
          </button> -->
        </div>

        <!-- 统计数据 -->
        <div
          class="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 animate-on-scroll animate-delay-400"
        >
          <div class="text-center">
            <div class="text-4xl md:text-5xl font-bold gradient-text mb-2" id="artistCount">0</div>
            <div class="text-gray-500">合作音乐人</div>
          </div>
          <div class="text-center">
            <div class="text-4xl md:text-5xl font-bold gradient-text mb-2" id="platformCount">
              0
            </div>
            <div class="text-gray-500">全球发行平台</div>
          </div>
          <div class="text-center">
            <div class="text-4xl md:text-5xl font-bold gradient-text mb-2" id="songCount">0</div>
            <div class="text-gray-500">已发行歌曲</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 装饰元素：紫色→粉色系淡色 -->
    <!-- <div
      class="absolute top-1/4 left-1/4 w-96 h-96 bg-pink-100 rounded-full blur-3xl opacity-50 pointer-events-none"
    ></div>
    <div
      class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-rose-100 rounded-full blur-3xl opacity-50 pointer-events-none"
    ></div> -->
  </section>
</template>

<script setup>
import { onMounted } from 'vue'

// 数字动画函数（保持不变）
const animateCounter = (elementId, targetValue, duration = 2000) => {
  const element = document.getElementById(elementId)
  if (!element) return

  let startValue = 0
  const increment = targetValue / (duration / 16)
  let currentValue = startValue

  const timer = setInterval(() => {
    currentValue += increment
    if (currentValue >= targetValue) {
      element.textContent = targetValue.toLocaleString()
      clearInterval(timer)
    } else {
      element.textContent = Math.floor(currentValue).toLocaleString()
    }
  }, 16)
}

onMounted(() => {
  setTimeout(() => {
    animateCounter('artistCount', 8560)
    animateCounter('platformCount', 240)
    animateCounter('songCount', 125000)
  }, 1000)
})
</script>

<style scoped>
/* 渐变文字：紫色系→粉色系（深粉→浅粉，保持渐变层次） */
.gradient-text {
  background: linear-gradient(to right, #be185d, #ec4899);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-shadow: 0 2px 4px rgba(236, 72, 153, 0.1);
}

/* 动画相关样式（保持不变） */
.animate-on-scroll {
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 0.8s ease forwards;
}

.animate-delay-200 {
  animation-delay: 0.2s;
}

.animate-delay-300 {
  animation-delay: 0.3s;
}

.animate-delay-400 {
  animation-delay: 0.4s;
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式调整（保持不变，仅继承颜色） */
@media (max-width: 768px) {
  h1 {
    font-size: 3xl !important;
  }

  p {
    font-size: 1.1rem !important;
  }

  button {
    padding: 6px 12px !important;
    font-size: 1rem !important;
  }

  .absolute {
    width: 60vw !important;
    height: 60vw !important;
  }
}

/* 确保组件背景透明（保持不变） */
section {
  background: transparent;
}
</style>

<template>
  <div class="default-layout">
    <header
      class="fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out"
      :style="{
        backgroundColor: `rgba(0, 0, 0, ${navOpacity})`,
        boxShadow: navOpacity > 0 ? '0 2px 15px rgba(0, 0, 0, 0.4)' : 'none',
      }"
    >
      <nav class="container mx-auto">
        <div class="flex justify-between items-center px-8 py-4">
          <div class="rounded-lg overflow-hidden h-12 flex items-center justify-center">
            <img
              src="../../src/assets/微信图片_20251129094823_15_2.jpg.png"
              alt=""
              class="w-80 object-cover"
            />
          </div>

          <div class="space-x-10 mr-auto">
            <router-link
              to="/musician/musician-settle-in"
              class="text-white text-base hover:text-pink-300 transition-colors duration-300"
            >
              首页
            </router-link>
            <router-link
              to="/musician/ai-chat"
              class="text-white text-base hover:text-pink-300 transition-colors duration-300 relative"
            >
              创作实验室
              <span
                class="absolute -top-3 -right-4 bg-pink-500 text-white text-xs rounded-full px-2 py-1"
                >New</span
              >
            </router-link>
            <router-link
              to="/musician/Works"
              class="text-white text-base hover:text-pink-300 transition-colors duration-300"
            >
              作品管理
            </router-link>
            <router-link
              to="/musician/Upload"
              class="text-white text-base hover:text-pink-300 transition-colors duration-300"
            >
              发布作品
            </router-link>
          </div>

          <div class="flex items-center gap-5">
            <button class="text-white hover:text-pink-300 transition-colors duration-300 relative">
              <i class="fa fa-bell text-xl"></i>
              <span
                class="absolute -top-2 -right-2 bg-pink-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
                >1</span
              >
            </button>
            <div class="w-30 h-10 overflow-hidden hover:border-white transition-all duration-300">
              <router-link to="/user/musician-center" class="text-white hover:text-pink-300">
                个人中心</router-link
              >
            </div>
          </div>
        </div>
      </nav>
    </header>

    <main class="">
      <router-view />
    </main>

    <!-- 暗黑 + 粉色 · 拖拽悬浮按钮 - 黑粉配色升级版 -->
    <div
      ref="draggableRef"
      class="fixed z-50 cursor-move select-none"
      :style="{ left: currentX + 'px', top: currentY + 'px' }"
      @mousedown="startDrag"
    >
      <div class="group relative">
        <!-- 主按钮：黑粉渐变 + 炫光效果 -->
        <div
          class="w-14 h-14 bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a] border-2 border-pink-500/60 rounded-full flex items-center justify-center text-pink-400 text-xl shadow-2xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 group-hover:shadow-[0_0_20px_rgba(236,72,153,0.6)] group-hover:border-pink-400"
        >
          <i class="fa fa-home"></i>
        </div>

        <!-- 右侧展开菜单：暗黑玻璃质感 + 粉红点缀 -->
        <div
          class="absolute left-full top-1/2 -translate-y-1/2 ml-3 opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100 pointer-events-none group-hover:pointer-events-auto flex flex-row gap-2 bg-black/80 backdrop-blur-xl border border-pink-500/30 p-2 rounded-2xl shadow-2xl transition-all duration-300"
        >
          <button
            @click.stop="goBack"
            class="px-4 py-2 bg-black/60 hover:bg-pink-600/40 text-gray-200 hover:text-white rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 border border-pink-500/20 hover:border-pink-400/60 backdrop-blur-sm"
          >
            ← 返回上一页
          </button>
          <button
            @click.stop="goToHome"
            class="px-4 py-2 bg-black/60 hover:bg-pink-600/40 text-gray-200 hover:text-white rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 border border-pink-500/20 hover:border-pink-400/60 backdrop-blur-sm"
          >
            🎵 听音乐
          </button>
        </div>
      </div>
    </div>

    <footer class="bg-gray-900 text-white py-10">
      <div class="container mx-auto px-4 text-center">
        <p class="text-lg font-medium">&copy; 2025 音乐开放平台. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const navOpacity = ref(0)
const scrollThreshold = 2000
const handleScroll = () => {
  const scrollTop = window.scrollY || document.documentElement.scrollTop
  if (scrollTop <= 0) {
    navOpacity.value = 0
  } else if (scrollTop > scrollThreshold) {
    navOpacity.value = 0.5
  } else {
    navOpacity.value = (scrollTop / scrollThreshold) * 0.5
  }
}

// 可拖拽组件相关状态
const draggableRef = ref<HTMLElement | null>(null)
const isDragging = ref(false)
const startX = ref(0)
const startY = ref(0)
const currentX = ref(0)
const currentY = ref(0)

// 初始化位置在右下角
currentX.value = window.innerWidth - 80
currentY.value = window.innerHeight - 120

// 开始拖拽
const startDrag = (e: MouseEvent) => {
  isDragging.value = true
  startX.value = e.clientX - currentX.value
  startY.value = e.clientY - currentY.value
  document.addEventListener('mousemove', drag)
  document.addEventListener('mouseup', stopDrag)
}

// 拖拽中
const drag = (e: MouseEvent) => {
  if (!isDragging.value) return
  currentX.value = e.clientX - startX.value
  currentY.value = e.clientY - startY.value

  const windowWidth = window.innerWidth
  const windowHeight = window.innerHeight
  const elementWidth = 56
  const elementHeight = 56

  currentX.value = Math.max(0, Math.min(currentX.value, windowWidth - elementWidth))
  currentY.value = Math.max(0, Math.min(currentY.value, windowHeight - elementHeight))
}

// 停止拖拽
const stopDrag = () => {
  isDragging.value = false
  document.removeEventListener('mousemove', drag)
  document.removeEventListener('mouseup', stopDrag)
}

// 返回上一页
const goBack = () => {
  router.back()
}

// 跳转到首页
const goToHome = () => {
  router.push('/')
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  document.removeEventListener('mousemove', drag)
  document.removeEventListener('mouseup', stopDrag)
})
</script>

<style scoped>
.router-link {
  position: relative;
}

.router-link::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #ff4081, #ff80ab);
  transition: width 0.3s ease;
}

.router-link:hover::after,
.router-link-active::after {
  width: 100%;
}

@media (max-width: 768px) {
  header nav .flex {
    padding: 0.5rem 1rem;
  }

  .w-80 {
    width: 60px !important;
  }

  .space-x-10 > :not([hidden]) ~ :not([hidden]) {
    --tw-space-x-reverse: 0;
    margin-right: calc(4px * var(--tw-space-x-reverse));
    margin-left: calc(4px * (1 - var(--tw-space-x-reverse)));
  }

  main {
    padding-top: 12px !important;
  }
}
</style>

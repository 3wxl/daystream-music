<template>
  <div class="h-screen flex flex-col overflow-hidden bg-gray-900 relative">
    <div class="flex-1 flex overflow-hidden min-h-0">
      <transition name="slide-fade">
        <left-menu v-show="isSidebarVisible" class="shrink-0 !h-full" />
      </transition>

      <div class="flex flex-col flex-1 min-h-0 min-w-0">
        <top-header class="shrink-0" />
        <main class="flex-1 min-w-0 overflow-hidden bg-gray-900">
          <div class="h-full overflow-y-auto custom-scrollbar layout-scrollbar">
            <slot />
          </div>
        </main>
      </div>
    </div>

    <PlayerControls class="static! w-full! z-40 shrink-0" />

    <!-- 悬浮按钮 -->
    <div
      ref="fabRef"
      class="fixed z-50 cursor-pointer shadow-lg hover:scale-110 transition-transform active:scale-95"
      :style="{ left: fabPos.x + 'px', top: fabPos.y + 'px' }"
      @mousedown="startDrag"
      @click.stop="toggleSidebar"
    >
      <div
        class="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-gray-800 flex items-center justify-center border border-white/20 backdrop-blur-sm"
      >
        <svg
          v-if="isSidebarVisible"
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
          />
        </svg>
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { useChatStore } from '@/stores/chat'

const userStore = useUserStore()
const chatStore = useChatStore()

onMounted(() => {
  if (userStore.token) {
    console.log('已登录，自动连接websoket...')
    chatStore.connect()
  }
})

const isSidebarVisible = ref(true)
const fabRef = ref<HTMLElement | null>(null)
const fabPos = ref({ x: 20, y: window.innerHeight - 80 })
const isDragging = ref(false)
const dragOffset = ref({ x: 0, y: 0 })

const toggleSidebar = () => {
  if (!isDragging.value) {
    isSidebarVisible.value = !isSidebarVisible.value
  }
}

const startDrag = (e: MouseEvent) => {
  isDragging.value = false
  const startX = e.clientX
  const startY = e.clientY

  dragOffset.value = {
    x: startX - fabPos.value.x,
    y: startY - fabPos.value.y,
  }

  const onMouseMove = (e: MouseEvent) => {
    if (Math.abs(e.clientX - startX) > 3 || Math.abs(e.clientY - startY) > 3) {
      isDragging.value = true
    }

    let newX = e.clientX - dragOffset.value.x
    let newY = e.clientY - dragOffset.value.y

    const maxX = window.innerWidth - 60
    const maxY = window.innerHeight - 60

    newX = Math.max(10, Math.min(newX, maxX))
    newY = Math.max(10, Math.min(newY, maxY))

    fabPos.value = { x: newX, y: newY }
  }

  const onMouseUp = () => {
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
  }

  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', onMouseUp)
}

const handleResize = () => {
  const maxX = window.innerWidth - 60
  const maxY = window.innerHeight - 60
  if (fabPos.value.x > maxX) fabPos.value.x = maxX
  if (fabPos.value.y > maxY) fabPos.value.y = maxY
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style lang="scss" scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(-20px);
  opacity: 0;
  width: 0;
  margin-right: 0;
}

main {
  -ms-overflow-style: none; /* IE 和 Edge */
  scrollbar-width: none; /* Firefox */

  /* 隐藏 Chrome、Safari 和 Opera 的滚动条 */
  &::-webkit-scrollbar {
    display: none;
  }
}
.custom-scrollbar::-webkit-scrollbar {
  width: 6px; /* 滚动条宽度 */
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.3); /* 滚动滑块颜色 */
  border-radius: 3px; /* 滚动滑块圆角 */
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent; /* 隐藏滚动轨道 */
}

/* Firefox 浏览器 */
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
}
</style>

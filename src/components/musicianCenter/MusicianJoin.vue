<!-- layouts/DefaultLayout.vue -->
<template>
  <div class="default-layout">
    <!-- 导航栏：添加动态样式绑定，实现滚动渐变 -->
    <header
      class="fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out"
      :style="{
        backgroundColor: `rgba(0, 0, 0, ${navOpacity})`,
        backdropFilter: navOpacity > 0 ? 'blur(8px)' : 'none',
        boxShadow: navOpacity > 0 ? '0 2px 15px rgba(0, 0, 0, 0.4)' : 'none',
      }"
    >
      <nav class="container mx-auto">
        <div class="flex justify-between items-center px-8 py-4">
          <!-- Logo 区域（保持原有样式） -->
          <div class="rounded-lg overflow-hidden h-12 flex items-center justify-center">
            <img
              src="../../src/assets/微信图片_20251129094823_15_2.jpg.png"
              alt=""
              class="w-80 object-cover"
            />
          </div>

          <!-- 导航链接（保持原有样式，白色文字适配透明/半透明背景） -->
          <div class="space-x-10 mr-auto">
            <router-link
              to="/MusicianSettleIn"
              class="text-white text-base hover:text-gray-200 transition-colors duration-300"
            >
              首页
            </router-link>
            <router-link
              to="/music"
              class="text-white text-base hover:text-gray-200 transition-colors duration-300"
            >
              音乐展示
            </router-link>
            <router-link
              to="/about"
              class="text-white text-base hover:text-gray-200 transition-colors duration-300"
            >
              关于我们
            </router-link>
            <router-link
              to="/lab"
              class="text-white text-base hover:text-gray-200 transition-colors duration-300 relative"
            >
              创作实验室
              <span
                class="absolute -top-3 -right-4 bg-red-500 text-white text-xs rounded-full px-2 py-1"
                >New</span
              >
            </router-link>
          </div>

          <!-- 右侧用户区域（保持原有样式） -->
          <div class="flex items-center gap-5">
            <button class="text-white hover:text-gray-200 transition-colors duration-300 relative">
              <i class="fa fa-bell text-xl"></i>
              <span
                class="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
                >1</span
              >
            </button>
            <div
              class="w-10 h-10 rounded-full overflow-hidden border-2 border-white/60 hover:border-white transition-all duration-300"
            >
              <img
                src="https://picsum.photos/id/64/200/200"
                alt="用户头像"
                class="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </nav>
    </header>

    <!-- 主内容区：调整 padding-top 确保不被导航栏遮挡（关键！） -->
    <main class="pt-16 md:pt-12">
      <!-- 适配导航栏高度，避免内容遮挡 -->
      <router-view />
    </main>

    <!-- 页脚（保持原有样式） -->
    <footer class="bg-gray-900 text-white py-10">
      <div class="container mx-auto px-4 text-center">
        <p class="text-lg font-medium">&copy; 2025 音乐开放平台. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// 导航栏透明度：0 = 完全透明，0.8 = 黑色半透明（可自定义）
const navOpacity = ref(0)

// 滚动阈值：滚动超过 80px 后固定半透明（可调整）
const scrollThreshold = 80

// 监听滚动事件（适配 Web 端，兼容 Vue Router 页面）
const handleScroll = () => {
  const scrollTop = window.scrollY || document.documentElement.scrollTop
  // 根据滚动距离计算透明度
  if (scrollTop <= 0) {
    navOpacity.value = 0 // 未滚动时完全透明
  } else if (scrollTop > scrollThreshold) {
    navOpacity.value = 0.8 // 超过阈值后固定半透明
  } else {
    // 滚动过程中渐变（0 → 0.8 平滑过渡）
    navOpacity.value = (scrollTop / scrollThreshold) * 0.8
  }
}

onMounted(() => {
  // 页面加载时监听滚动事件
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  // 组件卸载时移除监听，避免内存泄漏
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
/* 保留原有导航链接动画样式 */
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
  background: linear-gradient(90deg, #ff4081, #ff80ab); /* 改为粉色系，与主题一致 */
  transition: width 0.3s ease;
}

.router-link:hover::after,
.router-link-active::after {
  width: 100%;
}

/* 调整导航栏响应式高度，避免移动端遮挡 */
@media (max-width: 768px) {
  header nav .flex {
    padding: 0.5rem 1rem;
  }

  .w-80 {
    width: 60px !important; /* 移动端缩小 Logo 宽度 */
  }

  .space-x-10 {
    space-x: 4px !important; /* 移动端缩小导航间距 */
  }

  main {
    padding-top: 12px !important; /* 移动端调整内容上边距 */
  }
}
</style>

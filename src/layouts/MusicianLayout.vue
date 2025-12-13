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
              to="/musician/AiChat"
              class="text-white text-base hover:text-gray-200 transition-colors duration-300 relative"
            >
              创作实验室
              <span
                class="absolute -top-3 -right-4 bg-red-500 text-white text-xs rounded-full px-2 py-1"
                >New</span
              >
            </router-link>
            <router-link
              to="/musician/Works"
              class="text-white text-base hover:text-gray-200 transition-colors duration-300"
            >
              作品管理
            </router-link>
            <router-link
              to="/musician/Upload"
              class="text-white text-base hover:text-gray-200 transition-colors duration-300"
            >
              发布作品
            </router-link>
          </div>

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

    <main class="">
      <router-view />
    </main>
    <footer class="bg-gray-900 text-white py-10">
      <div class="container mx-auto px-4 text-center">
        <p class="text-lg font-medium">&copy; 2025 音乐开放平台. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
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

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
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

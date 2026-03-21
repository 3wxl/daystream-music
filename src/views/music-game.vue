<template>
  <div class="relative w-full bg-[#0a0a0f] font-['Inter',sans-serif] overflow-hidden">
    <!-- 背景光晕 -->
    <div
      class="absolute inset-0 pointer-events-none z-0"
      :style="{
        background:
          'radial-gradient(circle at 30% 20%, rgba(231, 79, 160, 0.18) 0%, transparent 45%), radial-gradient(circle at 90% 70%, rgba(255, 107, 157, 0.2) 0%, transparent 50%)',
      }"
    ></div>

    <!-- 首页：游戏选择 -->
    <div
      v-if="currentView === 'home'"
      class="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col items-center"
    >
      <!-- 页面标题 - 缩小尺寸 -->
      <div class="text-center animate-[floatTitle_3s_ease-in-out_infinite]">
        <h1
          class="text-2xl sm:text-4xl font-black tracking-wider bg-[length:300%_300%] bg-gradient-to-r from-[#ff8abb] via-[#e74fa0] to-[#ff6fa8] bg-clip-text text-transparent animate-[gradientShift_8s_ease_infinite, flicker_5s_infinite]"
        >
          ♫ 音律迷域 ♫
        </h1>
        <p class="text-[#c0b5d6] text-base sm:text-lg mt-2 backdrop-blur-sm">
          黑暗幻境 · 粉红脉搏 · 挑战你的音乐魂
        </p>
      </div>

      <!-- 加载状态 -->
      <div v-if="isLoading" class="min-h-[50vh] flex flex-col items-center justify-center gap-6">
        <div
          class="w-20 h-20 rounded-full border-4 border-[rgba(231,79,160,0.2)] border-t-[#ff3d9e] border-r-[#b22b77] animate-[spin_1.2s_cubic-bezier(0.68,-0.55,0.27,1.55)_infinite] shadow-[0_0_30px_#ff80b5]"
          :style="{
            animation:
              'spin 1.2s cubic-bezier(0.68, -0.55, 0.27, 1.55) infinite, neonGlow 1.8s ease-in-out infinite alternate',
          }"
        ></div>
        <p class="text-[#f1d0e6] font-medium tracking-wide">正在加载歌曲库...</p>
      </div>

      <div v-else class="relative w-full min-h-[450px] flex justify-center items-center">
        <!-- 藤蔓主干 - 修改为粉色系渐变 -->
        <div
          class="absolute w-2 h-[340px] bg-gradient-to-b from-[#ff8abb] via-[#e74fa0] via-[#ff6b9d] to-[#ff3988] rounded-xl z-0 shadow-[0_0_40px_#e74fa0,0_0_80px_#ff3988] animate-[trunkPulse_6s_infinite_alternate]"
          style="
            pointer-events: none;
            transform: none !important;
            left: 50%;
            transform: translateX(-50%);
          "
        ></div>

        <!-- 连接线容器 - 修改为粉色系 -->
        <div class="absolute inset-0 z-15 pointer-events-none" style="transform: none !important">
          <!-- 左侧卡片到中间卡片的连接线 - 粉色渐变 -->
          <div
            class="hidden md:block absolute w-[240px] h-1 bg-gradient-to-r from-[#ff8abb] via-[#e74fa0] to-[#ff3988] rounded-full shadow-[0_0_32px_#e74fa0]"
            style="
              top: 45%;
              left: calc(50% - 380px);
              transform: rotate(3deg) translateY(-50%);
              transition: none;
            "
          ></div>

          <!-- 中间卡片左侧连接线 - 粉色渐变 -->

          <!-- 右侧卡片到中间卡片的连接线 - 粉色渐变 -->
          <div
            class="hidden md:block absolute w-[240px] h-1 bg-gradient-to-r from-[#ff3988] via-[#e74fa0] to-[#ff8abb] rounded-full shadow-[0_0_32px_#e74fa0]"
            style="
              top: 55%;
              right: calc(50% - 380px);
              transform: rotate(-3deg) translateY(-50%);
              transition: none;
            "
          ></div>
        </div>

        <!-- 游戏卡片容器 - 再放大卡片尺寸，保持横向间距 -->
        <div
          class="relative z-20 flex flex-col md:flex-row gap-20 md:gap-48 items-center justify-center w-full px-8"
        >
          <!-- 歌词接龙卡片 - 再放大，保持向左偏移 -->
          <div
            class="group relative cursor-pointer transition-all duration-500 hover:scale-105 hover:-translate-y-3 hover:z-50 hover:drop-shadow-[0_0_8px_#ff70b0] md:translate-y-[-24px] md:rotate-[-3deg] md:-ml-32"
            @click="goToGame('lyric')"
          >
            <div
              class="backdrop-blur-xl backdrop-saturate-180 bg-[rgba(8,8,18,0.75)] rounded-2xl p-6 pb-7 min-w-[210px] text-center border border-[rgba(255,122,184,0.45)] border-t-2 border-t-[rgba(255,140,200,0.75)] border-b-2 border-b-[rgba(170,70,200,0.5)] shadow-[0_30px_40px_-20px_black,inset_0_0_40px_rgba(255,107,187,0.2)] group-hover:bg-[rgba(18,12,28,0.9)] group-hover:border-[#ffa0d0] group-hover:shadow-[0_30px_50px_-15px_black,0_0_0_1px_rgba(255,107,187,0.5),0_0_15px_2px_#ff3388] group-hover:scale-102 transition-all duration-400"
            >
              <div
                class="text-5xl mb-2 filter drop-shadow-[0_0_15px_#ff90c4] group-hover:scale-115 group-hover:rotate-6 group-hover:drop-shadow-[0_0_8px_#ffb8dc] transition-all duration-500"
              >
                🎵🔥
              </div>
              <h3
                class="text-2xl font-extrabold mb-2 bg-gradient-to-r from-[#fba9d2] via-[#ffc1dd] to-[#ff80b5] bg-clip-text text-transparent tracking-wide"
              >
                歌词接龙
              </h3>
              <p class="text-[#cdc2f0] opacity-90 leading-relaxed text-sm">
                依据上句暗语<br />召唤下一句粉红旋律
              </p>
            </div>
          </div>

          <!-- 猜歌游戏卡片 - 再放大，保持中间位置 -->
          <div
            class="group relative cursor-pointer transition-all duration-500 hover:scale-105 hover:-translate-y-3 hover:z-50 hover:drop-shadow-[0_0_8px_#ff70b0] md:translate-y-5 md:rotate-[1.5deg]"
            @click="goToGame('guess')"
          >
            <div
              class="backdrop-blur-xl backdrop-saturate-180 bg-[rgba(8,8,18,0.75)] rounded-2xl p-6 pb-7 min-w-[210px] text-center border border-[rgba(255,122,184,0.45)] border-t-2 border-t-[rgba(255,140,200,0.75)] border-b-2 border-b-[rgba(170,70,200,0.5)] shadow-[0_30px_40px_-20px_black,inset_0_0_40px_rgba(255,107,187,0.2)] group-hover:bg-[rgba(18,12,28,0.9)] group-hover:border-[#ffa0d0] group-hover:shadow-[0_30px_50px_-15px_black,0_0_0_1px_rgba(255,107,187,0.5),0_0_15px_2px_#ff3388] group-hover:scale-102 transition-all duration-400"
            >
              <div
                class="text-5xl mb-2 filter drop-shadow-[0_0_15px_#ff90c4] group-hover:scale-115 group-hover:rotate-6 group-hover:drop-shadow-[0_0_8px_#ffb8dc] transition-all duration-500"
              >
                🎸🌙
              </div>
              <h3
                class="text-2xl font-extrabold mb-2 bg-gradient-to-r from-[#fba9d2] via-[#ffc1dd] to-[#ff80b5] bg-clip-text text-transparent tracking-wide"
              >
                听音猜歌
              </h3>
              <p class="text-[#cdc2f0] opacity-90 leading-relaxed text-sm">
                聆听破碎的音符<br />锁定歌名密码
              </p>
            </div>
          </div>

          <!-- 猜作者卡片 - 再放大，保持向右偏移 -->
          <div
            class="group relative cursor-pointer transition-all duration-500 hover:scale-105 hover:-translate-y-3 hover:z-50 hover:drop-shadow-[0_0_8px_#ff70b0] md:translate-y-[-19px] md:rotate-[4deg] md:-mr-32"
            @click="goToGame('author')"
          >
            <div
              class="backdrop-blur-xl backdrop-saturate-180 bg-[rgba(8,8,18,0.75)] rounded-2xl p-6 pb-7 min-w-[210px] text-center border border-[rgba(255,122,184,0.45)] border-t-2 border-t-[rgba(255,140,200,0.75)] border-b-2 border-b-[rgba(170,70,200,0.5)] shadow-[0_30px_40px_-20px_black,inset_0_0_40px_rgba(255,107,187,0.2)] group-hover:bg-[rgba(18,12,28,0.9)] group-hover:border-[#ffa0d0] group-hover:shadow-[0_30px_50px_-15px_black,0_0_0_1px_rgba(255,107,187,0.5),0_0_15px_2px_#ff3388] group-hover:scale-102 transition-all duration-400"
            >
              <div
                class="text-5xl mb-2 filter drop-shadow-[0_0_15px_#ff90c4] group-hover:scale-115 group-hover:rotate-6 group-hover:drop-shadow-[0_0_8px_#ffb8dc] transition-all duration-500"
              >
                🎤🖤
              </div>
              <h3
                class="text-2xl font-extrabold mb-2 bg-gradient-to-r from-[#fba9d2] via-[#ffc1dd] to-[#ff80b5] bg-clip-text text-transparent tracking-wide"
              >
                猜作者
              </h3>
              <p class="text-[#cdc2f0] opacity-90 leading-relaxed text-sm">
                从歌名透视<br />灵魂歌者
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 游戏页面 -->
    <div
      v-else
      class="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-[fadeSlide_0.4s_ease]"
    >
      <!-- 返回按钮 - 稍微缩小 -->
      <button
        @click="goBack"
        class="inline-flex items-center gap-2 bg-[rgba(20,8,18,0.7)] text-[#ffbfdf] border-2 border-[#ff70b5] rounded-full py-2.5 px-6 cursor-pointer transition-all duration-300 mb-8 text-base font-semibold backdrop-blur-sm shadow-[0_0_30px_rgba(255,80,160,0.3)] hover:bg-[#ff3988] hover:text-black hover:border-[#ffc0e0] hover:-translate-x-2 hover:scale-105 hover:shadow-[0_0_50px_#ff5fa0] tracking-wide"
      >
        <i class="text-xl transition-transform duration-200 group-hover:-translate-x-2">←</i>
        返回游戏列表
      </button>

      <!-- 游戏组件 -->
      <LyricSolitaire v-if="currentView === 'lyric'" />
      <GuessSong v-if="currentView === 'guess'" />
      <GuessAuthor v-if="currentView === 'author'" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMusicGameStore } from '../stores/musicGame'
import { getHotSongs } from '../api/musicGame'
const musicStore = useMusicGameStore()
const currentView = ref<'home' | 'lyric' | 'guess' | 'author'>('home')
const isLoading = ref(false)

const initSongLibrary = async () => {
  isLoading.value = true
  try {
    if (musicStore.songLibrary.length > 0) {
      console.log('使用 Pinia 存储的歌曲库')
      isLoading.value = false
      return
    }

    console.log('从 API 加载热门歌曲...')
    const hotSongs = await getHotSongs(20)
    console.log('API 加载完成，歌曲数量：', hotSongs)
    if (hotSongs.length > 0) {
      console.log('API 加载成功，歌曲数量：', hotSongs)
      musicStore.saveSongLibrary(hotSongs)
      isLoading.value = false
      return
    }

    console.error('未能加载歌曲库')
    isLoading.value = false
  } catch (error) {
    console.error('初始化歌曲库失败：', error)
    isLoading.value = false
  }
}

const goToGame = (game: 'lyric' | 'guess' | 'author') => {
  currentView.value = game
}

const goBack = () => {
  currentView.value = 'home'
}

onMounted(() => {
  initSongLibrary()
})
</script>

<style scoped>
/* 自定义动画 keyframes */
@keyframes floatTitle {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-6px);
  }
}

@keyframes gradientShift {
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

@keyframes flicker {
  0%,
  100% {
    opacity: 1;
    text-shadow:
      0 0 10px #f25aa3,
      0 0 30px #b03a7a;
  }
  25% {
    opacity: 0.95;
    text-shadow:
      0 0 15px #ff7eb3,
      0 0 45px #d9488c;
  }
  70% {
    opacity: 1;
    text-shadow:
      0 0 8px #e6519c,
      0 0 28px #972c62;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes neonGlow {
  from {
    box-shadow:
      0 0 10px #ff3388,
      0 0 20px #a1306b;
  }
  to {
    box-shadow:
      0 0 20px #ff80b5,
      0 0 60px #c9368c;
  }
}

@keyframes trunkPulse {
  0% {
    opacity: 0.9;
    box-shadow:
      0 0 30px #ff8abb,
      0 0 60px #e74fa0;
  }
  100% {
    opacity: 1;
    box-shadow:
      0 0 60px #ff6b9d,
      0 0 110px #ff3988;
  }
}

@keyframes fadeSlide {
  0% {
    opacity: 0;
    transform: translateX(20px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

/* 自定义工具类 */
.scale-102 {
  --tw-scale-x: 1.02;
  --tw-scale-y: 1.02;
  transform: scale(var(--tw-scale-x)) scale(var(--tw-scale-y));
}
.scale-110 {
  --tw-scale-x: 1.1;
  --tw-scale-y: 1.1;
  transform: scale(var(--tw-scale-x)) scale(var(--tw-scale-y));
}
.scale-120 {
  --tw-scale-x: 1.2;
  --tw-scale-y: 1.2;
  transform: scale(var(--tw-scale-x)) scale(var(--tw-scale-y));
}
.rotate-6 {
  transform: rotate(6deg);
}
.-translate-y-4 {
  transform: translateY(-1rem);
}

/* 强制藤蔓和连接线不响应hover */
[style*='pointer-events: none'] {
  transition: none !important;
  animation: inherit !important;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .md\:translate-y-\[-25px\] {
    transform: none;
  }
  .md\:rotate-\[-3deg\] {
    transform: none;
  }
  .md\:translate-y-5 {
    transform: none;
  }
  .md\:rotate-\[1deg\] {
    transform: none;
  }
  .md\:translate-y-\[-18px\] {
    transform: none;
  }
  .md\:rotate-\[4deg\] {
    transform: none;
  }
  .md\:-ml-32 {
    margin-left: 0;
  }
  .md\:-mr-32 {
    margin-right: 0;
  }

  /* 移动端隐藏连接线 */
  .hidden.md\:block {
    display: none !important;
  }

  /* 移动端减小间距 */
  .gap-24 {
    gap: 1.5rem;
  }
}
</style>

<template>
  <section class="relative py-20 px-4 md:px-8 lg:px-16 min-h-screen">
    <div class="container mx-auto">
      <div class="text-center mb-16">
        <h2 class="text-3xl md:text-5xl font-bold mb-6 animate-on-scroll text-white">
          为什么选择我们的<span class="gradient-text">一站式发行服务</span>
        </h2>
        <p class="text-xl text-gray-400 max-w-3xl mx-auto animate-on-scroll animate-delay-200">
          我们不仅提供发行服务，更为你打造完整的音乐事业生态
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          class="feature-card group relative bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 animate-on-scroll overflow-hidden"
          @mouseenter="handleCardHover(0)"
          @mouseleave="handleCardLeave(0)"
          :class="{ 'card-hovered': hoverStates[0] }"
        >
          <div
            class="absolute inset-0 bg-gradient-to-br from-pink-400/0 via-pink-5400/0 to-purple-400/0 transition-all duration-500 group-hover:via-pink-500/10 group-hover:to-purple-600/10"
          ></div>
          <div
            class="relative w-16 h-16 rounded-xl bg-pink-400 flex items-center justify-center mb-6 float-animation group-hover:scale-110 group-hover:rotate-6 transition-all duration-500"
          >
            <i
              class="iconfont text-white group-hover:text-pink-200 transition-colors duration-500"
              style="font-size: 45px"
              >&#xe601;</i
            >
            <div
              class="absolute -inset-2 bg-pink-400/30 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            ></div>
          </div>

          <h3
            class="text-xl font-bold mb-4 text-white relative z-10 group-hover:text-pink-300 transition-colors duration-300"
          >
            自主发行网络
          </h3>
          <p
            class="text-gray-300 mb-6 relative z-10 group-hover:text-gray-200 transition-colors duration-300"
          >
            作品发布简单快捷，第一时间跟粉丝分享你的音乐。我们打造了极简式的一站式发布流程，无需繁琐的格式转换、平台适配、信息填写等操作
          </p>
          <div
            class="absolute top-4 right-4 w-4 h-4 rounded-full bg-pink-400/30 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100"
          ></div>
          <div
            class="absolute bottom-4 left-4 w-3 h-3 rounded-full bg-purple-400/30 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-300"
          ></div>
        </div>
        <div
          class="feature-card group relative bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 animate-on-scroll animate-delay-200 overflow-hidden"
          @mouseenter="handleCardHover(1)"
          @mouseleave="handleCardLeave(1)"
          :class="{ 'card-hovered': hoverStates[1] }"
        >
          <div
            class="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-indigo-500/0 to-purple-500/0 transition-all duration-500 group-hover:via-blue-500/10 group-hover:to-purple-500/10"
          ></div>
          <div
            class="relative w-16 h-16 rounded-xl bg-[#7256df] flex items-center justify-center mb-6 float-animation group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500"
            style="animation-delay: 0.5s"
          >
            <i
              class="iconfont text-white group-hover:text-blue-200 transition-colors duration-500"
              style="font-size: 45px"
              >&#xe68b;</i
            >
            <div
              class="absolute -inset-2 bg-[#7256df]/30 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            ></div>
          </div>
          <h3
            class="text-xl font-bold mb-4 text-white relative z-10 group-hover:text-blue-300 transition-colors duration-300"
          >
            数据管理
          </h3>
          <p
            class="text-gray-300 mb-6 relative z-10 group-hover:text-gray-200 transition-colors duration-300"
          >
            丰富全面的数据分析，每一步成长尽在掌握。我们为音乐人打造多维度、精细化的数据分析体系，覆盖播放量、听众画像、地域分布、曲风偏好、传播链路等核心维度
          </p>
          <div
            class="absolute top-4 right-4 w-4 h-4 rounded-full bg-blue-400/30 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100"
          ></div>
          <div
            class="absolute bottom-4 left-4 w-3 h-3 rounded-full bg-indigo-400/30 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-300"
          ></div>
        </div>
        <div
          class="feature-card group relative bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 animate-on-scroll animate-delay-400 overflow-hidden"
          @mouseenter="handleCardHover(2)"
          @mouseleave="handleCardLeave(2)"
          :class="{ 'card-hovered': hoverStates[2] }"
        >
          <div
            class="absolute inset-0 bg-gradient-to-br from-emerald-500/0 via-green-500/0 to-teal-500/0 transition-all duration-500 group-hover:via-emerald-500/10 group-hover:to-teal-500/10"
          ></div>
          <div
            class="relative w-16 h-16 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 flex items-center justify-center mb-6 float-animation group-hover:scale-110 group-hover:rotate-12 transition-all duration-500"
            style="animation-delay: 1s"
          >
            <i
              class="iconfont text-white group-hover:text-emerald-200 transition-colors duration-500"
              style="font-size: 45px"
              >&#xe671;</i
            >
            <div
              class="absolute -inset-2 bg-emerald-500/30 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            ></div>
          </div>
          <h3
            class="text-xl font-bold mb-4 text-white relative z-10 group-hover:text-emerald-300 transition-colors duration-300"
          >
            版权保护系统
          </h3>
          <p
            class="text-gray-300 mb-6 relative z-10 group-hover:text-gray-200 transition-colors duration-300"
          >
            一站式原创保护，做你原创力的捍卫者。从创作灵感落地的那一刻起，我们便为你的音乐、歌词、旋律等原创成果筑牢全维度保护屏障
          </p>
          <div
            class="absolute top-4 right-4 w-4 h-4 rounded-full bg-emerald-400/30 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100"
          ></div>
          <div
            class="absolute bottom-4 left-4 w-3 h-3 rounded-full bg-teal-400/30 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-300"
          ></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const hoverStates = ref([false, false, false])

const handleCardHover = (index) => {
  hoverStates.value[index] = true
}

const handleCardLeave = (index) => {
  hoverStates.value[index] = false
}
</script>

<style scoped>
.feature-card {
  transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  transform: perspective(1000px) rotateX(0) rotateY(0) translateZ(0);
  will-change: transform, box-shadow;
}

.feature-card:hover {
  transform: perspective(1000px) rotateX(5deg) rotateY(-2deg) translateZ(20px);
  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.3),
    0 0 60px rgba(var(--card-color, 139, 92, 246), 0.2);
  border-color: rgba(255, 255, 255, 0.3);
}

.feature-card:nth-child(1):hover {
  --card-color: 236, 72, 153;
}

.feature-card:nth-child(2):hover {
  --card-color: 114, 86, 223;
}

.feature-card:nth-child(3):hover {
  --card-color: 16, 185, 129;
}

.float-animation {
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-10px) rotate(5deg);
  }
}

.feature-card:hover .float-animation {
  animation-play-state: paused;
}

.feature-card::before {
  content: '';
  position: absolute;
  inset: -1px;
  background: linear-gradient(
    45deg,
    transparent 0%,
    rgba(var(--card-color, 139, 92, 246), 0.5) 50%,
    transparent 100%
  );
  border-radius: 1rem;
  opacity: 0;
  transition: opacity 0.5s ease;
  z-index: -1;
}

.feature-card:hover::before {
  opacity: 1;
  animation: borderGlow 3s linear infinite;
}

@keyframes borderGlow {
  0% {
    background-position: 0% 0%;
  }
  100% {
    background-position: 200% 200%;
  }
}
.feature-card > * {
  transition: all 0.4s ease;
}

.feature-card:hover > *:nth-child(2) {
  transition-delay: 0.1s;
}

.feature-card:hover > *:nth-child(3) {
  transition-delay: 0.2s;
}

.feature-card:hover > *:nth-child(4) {
  transition-delay: 0.3s;
}

.feature-card:hover > *:nth-child(5) {
  transition-delay: 0.4s;
}
@media (max-width: 768px) {
  .feature-card:hover {
    transform: perspective(1000px) rotateX(3deg) rotateY(-1deg) translateZ(10px);
  }
}
.feature-card {
  animation: subtlePulse 8s ease-in-out infinite;
}

@keyframes subtlePulse {
  0%,
  100% {
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }
  50% {
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
}
.feature-card:hover {
  animation: none;
}

.feature-card:nth-child(1) {
  --hover-color: #ec4899;
}

.feature-card:nth-child(2) {
  --hover-color: #7256df;
}

.feature-card:nth-child(3) {
  --hover-color: #10b981;
}

.feature-card:hover {
  border-color: var(--hover-color);
}
</style>

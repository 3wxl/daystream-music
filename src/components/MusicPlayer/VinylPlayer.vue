<template>
  <div class="relative w-full max-w-md mb-25">
    <!-- 发光背景 -->
    <div
      class="absolute -inset-4 bg-gradient-to-r from-pink-400/10 via-pink-500/10 to-pink-300/10 blur-3xl rounded-full opacity-60"
    ></div>

    <!-- 唱臂容器 -->
    <div class="relative w-full h-full">
      <!-- 唱臂底座（在唱片上方中间） -->
      <div
        class="absolute -top-9 left-1/2 w-6 h-6 bg-gradient-to-br from-gray-900 z-300 to-black rounded-full border-2 border-pink-400/50 shadow-[0_0_15px_rgba(255,166,193,0.4)] z-30 -translate-x-1/2"
      ></div>

      <!-- 唱臂（从顶部中间延伸到唱片边缘） -->
      <div
        class="absolute -top-8 left-1/2 -translate-x-1/2 z-30 transition-all duration-1000 ease-in-out"
        :style="{
          transformOrigin: 'right center',
          transform: isPlaying
            ? 'translateX(-50%) rotate(-50deg)'
            : 'translateX(-50%) rotate(-20deg)',
        }"
      >
        <!-- 唱臂杆 -->
        <div
          class="relative w-36 h-1.5 bg-gradient-to-b from-gray-800 via-pink-900/80 to-gray-300 rounded-full"
          :class="{ 'shadow-[0_0_15px_rgba(255,166,193,0.4)]': isPlaying }"
        >
          <!-- 唱臂杆装饰线 -->
          <div
            class="absolute inset-0 bg-gradient-to-b from-transparent via-pink-400/30 to-transparent rounded-full"
          ></div>

          <!-- 唱针（在唱片边缘） -->
          <div class="absolute bottom-0 left-0 transform translate-y-1/2">
            <!-- 唱针头 -->
            <div class="relative">
              <!-- 唱针杆 -->
              <div
                class="w-8 h-6 bg-gradient-to-b from-gray-900 to-black rounded-sm border border-pink-400/30"
              >
                <!-- 钻石针尖 -->
                <div
                  class="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-gradient-to-br from-pink-400 to-pink-500 rotate-45 shadow-[0_0_8px_rgba(255,166,193,0.6)]"
                ></div>
              </div>
              <!-- 唱针支架 -->
              <div
                class="absolute -top-4 left-1/2 -translate-x-1/2 w-2 h-4 bg-gradient-to-b from-pink-300 via-pink-400 to-pink-500 rounded-t-md"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 黑胶唱片 -->
      <div
        class="relative w-80 h-80 md:w-88 md:h-88 mx-auto mt-16 rounded-full overflow-hidden border-4 border-pink-400/40 shadow-[0_0_50px_rgba(255,166,193,0.4)] cursor-pointer group"
        :class="{ rotate: isPlaying }"
        @click="$emit('toggle-play')"
      >
        <!-- 唱片渐变底色（黑粉色渐变） -->
        <div
          class="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-pink-950/40"
        ></div>

        <!-- 唱片纹路（粉色渐变） -->
        <div
          class="absolute inset-0 opacity-20"
          style="
            background:
              repeating-radial-gradient(
                circle at 50% 50%,
                transparent 0,
                transparent 2px,
                #f472b6 3px,
                #f472b6 4px,
                transparent 5px
              ),
              repeating-radial-gradient(
                circle at 50% 50%,
                transparent 0,
                transparent 10px,
                #ec4899 11px,
                #ec4899 12px,
                transparent 13px
              );
          "
        ></div>

        <!-- 唱片动态光效 -->
        <div
          v-if="isPlaying"
          class="absolute inset-0 bg-gradient-to-r from-transparent via-pink-400/10 to-transparent animate-gradient-rotate"
          style="animation-duration: 8s"
        ></div>

        <!-- 唱针接触点光效 -->
        <div
          v-if="isPlaying"
          class="absolute top-1/2 left-1/2 w-80 h-80 md:w-88 md:h-88 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        >
          <!-- 接触点位置（唱片边缘） -->
          <div
            class="absolute top-1/2 left-1/2 w-1.5 h-1.5 rounded-full bg-pink-400 shadow-[0_0_20px_rgba(255,166,193,0.9)] animate-pulse"
            style="transform: translate(135px, -135px) rotate(45deg); animation-duration: 1.5s"
          ></div>
        </div>

        <!-- 专辑封面 -->
        <div
          class="absolute inset-10 rounded-full overflow-hidden border-4 border-pink-400/30 transition-all duration-700 group-hover:border-pink-400/60"
        >
          <img
            src="https://picsum.photos/300/300?random=3"
            alt="You 专辑封面"
            class="w-full h-full object-cover rounded-full transition-transform duration-700 group-hover:scale-110"
          />
          <!-- 播放覆盖层 -->
          <div
            class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
          >
            <div
              class="w-16 h-16 rounded-full bg-gradient-to-r from-pink-400 via-pink-500 to-pink-300 flex items-center justify-center shadow-[0_0_30px_rgba(255,166,193,0.7)]"
            >
              <i
                :class="
                  isPlaying
                    ? 'iconfont icon-pause text-white text-lg'
                    : 'iconfont icon-play text-white text-lg ml-1'
                "
              ></i>
            </div>
          </div>
        </div>

        <!-- 唱片中心（使用粉色渐变） -->
        <div class="absolute inset-0 flex items-center justify-center">
          <div
            class="w-24 h-24 rounded-full bg-gradient-to-br from-black to-gray-900 flex items-center justify-center border-2 border-pink-400/40 shadow-inner"
          >
            <div
              class="w-10 h-10 rounded-full bg-gradient-to-r from-pink-400 via-pink-500 to-pink-300 flex items-center justify-center"
            >
              <div class="w-4 h-4 rounded-full bg-white/90 shadow-inner"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  isPlaying: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['toggle-play'])
</script>

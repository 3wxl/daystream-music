<template>
  <section class="relative py-20 px-4 md:px-8 lg:px-16">
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        class="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-[#FFD6E7]/30 via-[#FFC2D6]/20 to-transparent rounded-full blur-[100px]"
      ></div>
      <div
        class="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-gradient-to-tl from-[#FFB8D9]/25 via-[#FFA3CC]/20 to-transparent rounded-full blur-[100px]"
      ></div>
      <div
        class="absolute inset-0 opacity-10"
        style="
          background-image:
            linear-gradient(#ff80ab 1px, transparent 1px),
            linear-gradient(90deg, #ff80ab 1px, transparent 1px);
          background-size: 40px 40px;
        "
      ></div>

      <div
        class="absolute top-1/3 left-1/3 w-3 h-3 rounded-full bg-[#FF80AB]/50 animate-pulse"
      ></div>
      <div
        class="absolute top-2/3 right-1/3 w-2 h-2 rounded-full bg-[#EC4899]/60 animate-pulse"
        style="animation-delay: 0.5s"
      ></div>
      <div
        class="absolute bottom-1/3 left-2/3 w-2.5 h-2.5 rounded-full bg-[#FFB6C1]/70 animate-pulse"
        style="animation-delay: 1s"
      ></div>
    </div>

    <div class="container mx-auto relative z-10">
      <div class="text-center mb-16">
        <div class="inline-block mb-4">
          <span
            class="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-[#FFEBF1] to-[#FFE4EC] text-[#FF4081] text-sm font-medium shadow-sm animate-on-scroll"
          >
            简单四步，开启音乐之旅
          </span>
        </div>
        <h2
          class="text-4xl md:text-6xl font-bold mb-6 animate-on-scroll text-[#111827] tracking-tight"
        >
          四步完成
          <span class="bg-gradient-to-r from-[#FF4081] to-[#FF80AB] bg-clip-text text-transparent">
            音乐发行
          </span>
        </h2>
        <p
          class="text-xl text-[#374151] max-w-3xl mx-auto animate-on-scroll animate-delay-200 leading-relaxed"
        >
          从创作到全平台听众，我们为您打造的是一条清晰、高效的音乐发行之路
        </p>
      </div>
      <div class="relative mb-20">
        <div
          class="hidden lg:block absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FFB6C1]/60 to-transparent -translate-y-1/2"
        ></div>
        <div
          class="hidden lg:block absolute top-1/2 left-0 right-0 h-[2px] bg-gradient-to-r from-[#FF4081]/0 via-[#FF4081]/40 to-[#FF4081]/0 -translate-y-1/2 blur-sm"
        ></div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 relative z-10">
          <div
            class="text-center animate-on-scroll group relative"
            @mouseenter="handleStepHover(0)"
            @mouseleave="handleStepLeave(0)"
          >
            <div
              class="relative bg-white/95 backdrop-blur-sm rounded-2xl p-8 border border-[#FFC1D5] shadow-[0_8px_32px_rgba(255,64,129,0.12)] hover:shadow-[0_16px_48px_rgba(255,64,129,0.18)] transition-all duration-500 group-hover:-translate-y-2 overflow-hidden"
            >
              <div
                class="absolute inset-0 bg-gradient-to-br from-[#FFEBF1]/0 via-[#FFE4EC]/0 to-[#FFD6E7]/0 group-hover:via-[#FFE4EC]/40 group-hover:to-[#FFD6E7]/50 transition-all duration-500"
              ></div>
              <div class="relative mb-8">
                <div
                  class="relative w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-[#FFE4EC] to-white shadow-inner group-hover:shadow-lg transition-all duration-500"
                >
                  <div
                    class="absolute inset-2 rounded-xl bg-gradient-to-br from-[#FF80AB] to-[#FF4081] opacity-20 group-hover:opacity-30 transition-opacity duration-500"
                  ></div>
                  <span
                    class="relative text-3xl font-bold bg-gradient-to-br from-[#FF4081] to-[#FF80AB] bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-500 block h-full flex items-center justify-center"
                  >
                    01
                  </span>
                  <div
                    class="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-[#FF4081] to-[#FF80AB] rounded-lg opacity-0 group-hover:opacity-100 rotate-12 transition-all duration-500"
                  ></div>
                </div>
              </div>
              <h3
                class="text-2xl font-bold mb-4 text-[#111827] group-hover:text-[#FF4081] transition-colors duration-300"
              >
                上传作品
              </h3>
              <p
                class="text-[#374151] mb-6 leading-relaxed group-hover:text-[#1F2937] transition-colors duration-300"
              >
                上传高质量音频与元数据，开启音乐发行第一步
              </p>
              <div
                class="mt-6 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500"
              >
                <div
                  class="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#FFEBF1] to-[#FFE4EC] text-[#FF4081] text-sm"
                >
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  <span>支持多种格式</span>
                </div>
              </div>
            </div>
            <div
              class="hidden lg:block absolute top-1/2 -right-5 w-3 h-3 rounded-full bg-gradient-to-br from-[#FF4081] to-[#FF80AB] opacity-60 group-hover:opacity-100 transition-opacity duration-300"
            ></div>
          </div>
          <div
            class="text-center animate-on-scroll animate-delay-100 group relative"
            @mouseenter="handleStepHover(1)"
            @mouseleave="handleStepLeave(1)"
          >
            <div
              class="relative bg-white/95 backdrop-blur-sm rounded-2xl p-8 border border-[#FFC1D5] shadow-[0_8px_32px_rgba(255,64,129,0.12)] hover:shadow-[0_16px_48px_rgba(255,64,129,0.18)] transition-all duration-500 group-hover:-translate-y-2 overflow-hidden"
            >
              <div
                class="absolute inset-0 bg-gradient-to-br from-[#FFEBF1]/0 via-[#FFE4EC]/0 to-[#FFD6E7]/0 group-hover:via-[#FFE4EC]/40 group-hover:to-[#FFD6E7]/50 transition-all duration-500"
              ></div>

              <div class="relative mb-8">
                <div
                  class="relative w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-[#FFE4EC] to-white shadow-inner group-hover:shadow-lg transition-all duration-500"
                >
                  <div
                    class="absolute inset-2 rounded-xl bg-gradient-to-br from-[#FF80AB] to-[#FF4081] opacity-20 group-hover:opacity-30 transition-opacity duration-500"
                  ></div>
                  <span
                    class="relative text-3xl font-bold bg-gradient-to-br from-[#FF4081] to-[#FF80AB] bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-500 block h-full flex items-center justify-center"
                  >
                    02
                  </span>
                  <div
                    class="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-[#FF4081] to-[#FF80AB] rounded-lg opacity-0 group-hover:opacity-100 rotate-12 transition-all duration-500"
                  ></div>
                </div>
              </div>

              <h3
                class="text-2xl font-bold mb-4 text-[#111827] group-hover:text-[#FF4081] transition-colors duration-300"
              >
                平台审核
              </h3>
              <p
                class="text-[#374151] mb-6 leading-relaxed group-hover:text-[#1F2937] transition-colors duration-300"
              >
                专业团队快速审核，确保作品质量与合规性
              </p>

              <div
                class="mt-6 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-100"
              >
                <div
                  class="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#FFEBF1] to-[#FFE4EC] text-[#FF4081] text-sm"
                >
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  <span>24小时完成</span>
                </div>
              </div>
            </div>

            <div
              class="hidden lg:block absolute top-1/2 -right-5 w-3 h-3 rounded-full bg-gradient-to-br from-[#FF4081] to-[#FF80AB] opacity-60 group-hover:opacity-100 transition-opacity duration-300"
            ></div>
          </div>
          <div
            class="text-center animate-on-scroll animate-delay-200 group relative"
            @mouseenter="handleStepHover(2)"
            @mouseleave="handleStepLeave(2)"
          >
            <div
              class="relative bg-white/95 backdrop-blur-sm rounded-2xl p-8 border border-[#FFC1D5] shadow-[0_8px_32px_rgba(255,64,129,0.12)] hover:shadow-[0_16px_48px_rgba(255,64,129,0.18)] transition-all duration-500 group-hover:-translate-y-2 overflow-hidden"
            >
              <div
                class="absolute inset-0 bg-gradient-to-br from-[#FFEBF1]/0 via-[#FFE4EC]/0 to-[#FFD6E7]/0 group-hover:via-[#FFE4EC]/40 group-hover:to-[#FFD6E7]/50 transition-all duration-500"
              ></div>

              <div class="relative mb-8">
                <div
                  class="relative w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-[#FFE4EC] to-white shadow-inner group-hover:shadow-lg transition-all duration-500"
                >
                  <div
                    class="absolute inset-2 rounded-xl bg-gradient-to-br from-[#FF80AB] to-[#FF4081] opacity-20 group-hover:opacity-30 transition-opacity duration-500"
                  ></div>
                  <span
                    class="relative text-3xl font-bold bg-gradient-to-br from-[#FF4081] to-[#FF80AB] bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-500 block h-full flex items-center justify-center"
                  >
                    03
                  </span>
                  <div
                    class="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-[#FF4081] to-[#FF80AB] rounded-lg opacity-0 group-hover:opacity-100 rotate-12 transition-all duration-500"
                  ></div>
                </div>
              </div>

              <h3
                class="text-2xl font-bold mb-4 text-[#111827] group-hover:text-[#FF4081] transition-colors duration-300"
              >
                平台发行
              </h3>
              <p
                class="text-[#374151] mb-6 leading-relaxed group-hover:text-[#1F2937] transition-colors duration-300"
              >
                同步至白昼音流平台，触达数十亿听众
              </p>

              <div
                class="mt-6 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-200"
              >
                <div
                  class="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#FFEBF1] to-[#FFE4EC] text-[#FF4081] text-sm"
                >
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  <span>10万+覆盖</span>
                </div>
              </div>
            </div>

            <div
              class="hidden lg:block absolute top-1/2 -right-5 w-3 h-3 rounded-full bg-gradient-to-br from-[#FF4081] to-[#FF80AB] opacity-60 group-hover:opacity-100 transition-opacity duration-300"
            ></div>
          </div>
          <div
            class="text-center animate-on-scroll animate-delay-300 group relative"
            @mouseenter="handleStepHover(3)"
            @mouseleave="handleStepLeave(3)"
          >
            <div
              class="relative bg-white/95 backdrop-blur-sm rounded-2xl p-8 border border-[#FFC1D5] shadow-[0_8px_32px_rgba(255,64,129,0.12)] hover:shadow-[0_16px_48px_rgba(255,64,129,0.18)] transition-all duration-500 group-hover:-translate-y-2 overflow-hidden"
            >
              <div
                class="absolute inset-0 bg-gradient-to-br from-[#FFEBF1]/0 via-[#FFE4EC]/0 to-[#FFD6E7]/0 group-hover:via-[#FFE4EC]/40 group-hover:to-[#FFD6E7]/50 transition-all duration-500"
              ></div>

              <div class="relative mb-8">
                <div
                  class="relative w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-[#FFE4EC] to-white shadow-inner group-hover:shadow-lg transition-all duration-500"
                >
                  <div
                    class="absolute inset-2 rounded-xl bg-gradient-to-br from-[#FF80AB] to-[#FF4081] opacity-20 group-hover:opacity-30 transition-opacity duration-500"
                  ></div>
                  <span
                    class="relative text-3xl font-bold bg-gradient-to-br from-[#FF4081] to-[#FF80AB] bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-500 block h-full flex items-center justify-center"
                  >
                    04
                  </span>
                  <div
                    class="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-[#FF4081] to-[#FF80AB] rounded-lg opacity-0 group-hover:opacity-100 rotate-12 transition-all duration-500"
                  ></div>
                </div>
              </div>

              <h3
                class="text-2xl font-bold mb-4 text-[#111827] group-hover:text-[#FF4081] transition-colors duration-300"
              >
                数据追踪
              </h3>
              <p
                class="text-[#374151] mb-6 leading-relaxed group-hover:text-[#1F2937] transition-colors duration-300"
              >
                实时监控播放数据，洞察听众喜好，优化发行策略
              </p>

              <div
                class="mt-6 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-300"
              >
                <div
                  class="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#FFEBF1] to-[#FFE4EC] text-[#FF4081] text-sm"
                >
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                    <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                  </svg>
                  <span>实时数据监控</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="flex flex-wrap justify-center gap-4 mb-16 animate-on-scroll animate-delay-400">
        <div
          class="px-6 py-3 rounded-full bg-gradient-to-r from-[#FFEBF1] to-[#FFE4EC] text-[#FF4081] font-medium shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer"
        >
          🚀 7天快速上线
        </div>
        <div
          class="px-6 py-3 rounded-full bg-gradient-to-r from-[#FFEBF1] to-[#FFE4EC] text-[#FF4081] font-medium shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer"
        >
          🛡️ 专业版权保护
        </div>
        <div
          class="px-6 py-3 rounded-full bg-gradient-to-r from-[#FFEBF1] to-[#FFE4EC] text-[#FF4081] font-medium shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer"
        >
          📊 智能数据报告
        </div>
        <div
          class="px-6 py-3 rounded-full bg-gradient-to-r from-[#FFEBF1] to-[#FFE4EC] text-[#FF4081] font-medium shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer"
        >
          🌍 全平台覆盖
        </div>
      </div>

      <div class="text-center animate-on-scroll animate-delay-500">
        <button
          class="group relative inline-flex items-center justify-center px-12 py-5 rounded-full bg-gradient-to-r from-[#FF4081] to-[#FF80AB] text-white text-xl font-bold transition-all duration-500 hover:shadow-[0_20px_60px_rgba(255,64,129,0.3)] hover:-translate-y-1 overflow-hidden"
        >
          <div
            class="absolute inset-0 bg-gradient-to-r from-[#FF80AB] to-[#FF4081] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          ></div>
          <router-link to="/Musician/MusicianJoin">
            <span class="relative z-10">开始音乐发行之旅</span>
          </router-link>
          <svg
            class="relative z-10 w-5 h-5 ml-3 transform group-hover:translate-x-2 transition-transform duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>

          <div
            class="absolute -inset-0.5 bg-gradient-to-r from-[#FF4081] via-[#FF80AB] to-[#FF4081] rounded-full opacity-0 group-hover:opacity-100 blur group-hover:blur-md transition-all duration-500"
          ></div>
        </button>

        <p class="text-[#4B5563] text-sm mt-6 animate-on-scroll animate-delay-600">
          已有超过8,560位音乐人选择我们，开启他们的音乐事业
        </p>
      </div>
    </div>
  </section>
</template>

<script setup>
const stepHoverStates = ref([false, false, false, false])
const handleStepHover = (index) => {
  stepHoverStates.value[index] = true
}

const handleStepLeave = (index) => {
  stepHoverStates.value[index] = false
}
onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated')
        }
      })
    },
    { threshold: 0.1 },
  )

  document.querySelectorAll('.animate-on-scroll').forEach((el) => {
    observer.observe(el)
  })

  return () => observer.disconnect()
})
</script>

<style scoped>
@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}
.group:hover .rounded-2xl {
  animation: float 2s ease-in-out infinite;
}
@keyframes pulse {
  0%,
  100% {
    opacity: 0.5;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.2);
  }
}

.animate-pulse {
  animation: pulse 2s ease-in-out infinite;
}
@keyframes numberGlow {
  0% {
    box-shadow: 0 0 0 rgba(255, 64, 129, 0);
  }
  50% {
    box-shadow: 0 0 20px rgba(255, 64, 129, 0.4);
  }
  100% {
    box-shadow: 0 0 0 rgba(255, 64, 129, 0);
  }
}

.group:hover .relative.w-20.h-20 {
  animation: numberGlow 1.5s ease-in-out infinite;
}
@media (max-width: 768px) {
  .grid-cols-4 {
    grid-template-columns: 1fr !important;
    gap: 2rem !important;
  }

  .hidden.lg\:block {
    display: none !important;
  }

  h2 {
    font-size: 3xl !important;
  }

  p {
    font-size: 1.1rem !important;
  }
}
.animate-on-scroll {
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.animate-on-scroll.animated {
  opacity: 1;
  transform: translateY(0);
}

.animate-delay-100 {
  transition-delay: 0.1s;
}
.animate-delay-200 {
  transition-delay: 0.2s;
}
.animate-delay-300 {
  transition-delay: 0.3s;
}
.animate-delay-400 {
  transition-delay: 0.4s;
}
.animate-delay-500 {
  transition-delay: 0.5s;
}
.animate-delay-600 {
  transition-delay: 0.6s;
}
</style>

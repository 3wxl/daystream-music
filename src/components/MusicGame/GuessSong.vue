<template>
  <div class="w-full p-6 bg-transparent border-none shadow-none">
    <!-- 游戏头部 -->
    <div class="flex items-center gap-4 mb-6 pb-4 border-b border-pink-500/10">
      <div
        class="w-12 h-12 bg-gradient-to-br from-[#e74fa0] to-[#ff6b9d] rounded-xl flex items-center justify-center shadow-lg shadow-pink-500/30"
      >
        <i class="iconfont text-2xl text-white">&#xe623;</i>
      </div>
      <div class="flex-1">
        <h2 class="text-lg font-bold text-white mb-1">听音猜歌</h2>
        <p class="text-xs text-gray-400">听音乐片段，猜出正确的歌曲</p>
      </div>
      <div class="flex gap-6">
        <div class="flex flex-col items-center gap-0.5">
          <span class="text-xs text-gray-400">得分</span>
          <span class="text-lg font-bold text-[#e74fa0]">{{ score }}</span>
        </div>
        <div class="flex flex-col items-center gap-0.5">
          <span class="text-xs text-gray-400">连击</span>
          <span class="text-lg font-bold text-[#e74fa0]">{{ streak }}</span>
        </div>
      </div>
    </div>

    <!-- 游戏内容区域 -->
    <div class="min-h-[350px] flex flex-col gap-6">
      <!-- 游戏进行状态 -->
      <div v-if="gameState === 'playing'" class="relative flex flex-col gap-6">
        <!-- 进度条 - 现在会正确显示 -->
        <div class="h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            class="h-full bg-gradient-to-r from-[#e74fa0] to-[#ff6b9d] rounded-full transition-all duration-300"
            :style="{ width: progressPercent + '%' }"
          ></div>
        </div>

        <!-- 唱片区域 -->
        <div class="flex flex-col items-center gap-4 my-4">
          <!-- 黑胶唱片容器 -->
          <div
            @click="togglePlayPause"
            class="relative w-48 h-48 md:w-56 md:h-56 mx-auto cursor-pointer hover:scale-[1.02] transition-transform duration-300 group"
          >
            <!-- 唱片外圈光晕 -->
            <div
              class="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500/20 via-pink-400/10 to-pink-500/20 animate-pulse"
              :class="{ 'opacity-70': isPlaying }"
            ></div>

            <!-- 唱片本体 -->
            <div
              class="absolute inset-3 md:inset-4 rounded-full bg-gradient-to-br from-gray-800 to-black border-4 border-pink-500/30 shadow-[0_0_30px_rgba(244,114,182,0.4)] transition-all duration-700"
              :class="{
                'animate-spin-slow': isPlaying,
                'opacity-90': !isPlaying,
              }"
            >
              <!-- 唱片纹理层 -->
              <div class="absolute inset-0 rounded-full overflow-hidden">
                <!-- 基础纹理 -->
                <div
                  class="absolute inset-0"
                  :style="{
                    backgroundImage:
                      'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.1) 0%, transparent 50%)',
                  }"
                ></div>

                <!-- 唱片纹路 - 多个同心圆 -->
                <div
                  v-for="i in 8"
                  :key="i"
                  class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/5"
                  :style="{
                    width: `${i * 12}px`,
                    height: `${i * 12}px`,
                  }"
                ></div>

                <!-- 反光效果 -->
                <div
                  class="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent"
                  :class="{ 'animate-shimmer': isPlaying }"
                ></div>
              </div>

              <!-- 唱片中心区域 -->
              <div class="absolute top-1/2 left-1/2 w-16 h-16 -translate-x-1/2 -translate-y-1/2">
                <!-- 中心环1 -->
                <div
                  class="absolute inset-0 rounded-full bg-gradient-to-br from-pink-500 to-pink-700 shadow-lg"
                ></div>

                <!-- 中心环2 -->
                <div
                  class="absolute top-1/2 left-1/2 w-10 h-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-gray-800 to-black border-2 border-pink-400/30"
                ></div>

                <!-- 中心孔 -->
                <div
                  class="absolute top-1/2 left-1/2 w-3 h-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black border border-pink-300/50"
                ></div>
              </div>

              <!-- 歌曲封面/图标 -->
              <div
                class="absolute top-1/2 left-1/2 w-32 h-32 -translate-x-1/2 -translate-y-1/2 rounded-full overflow-hidden border-2 border-pink-400/30"
              >
                <div
                  class="w-full h-full bg-gradient-to-br from-pink-500/30 to-purple-500/30 flex items-center justify-center"
                >
                  <i class="iconfont text-3xl text-white/70">🎵</i>
                </div>
              </div>
            </div>

            <!-- 唱针 -->
            <div
              v-if="isPlaying"
              class="absolute -top-2 -right-2 w-16 origin-top-right transition-transform duration-700 z-10 rotate-12"
            >
              <div class="relative">
                <!-- 唱臂 -->
                <div class="w-16 h-1 bg-gradient-to-r from-gray-600 to-gray-800 rounded-full"></div>
                <!-- 唱头 -->
                <div
                  class="absolute -right-1 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center"
                >
                  <div class="w-2 h-2 rounded-full bg-black/80"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- 隐藏的播放按钮 -->
          <div class="hidden">
            <button class="play-btn" @click="togglePlayPause">
              <i class="iconfont">{{ isPlaying ? '⏸' : '▶' }}</i>
            </button>
          </div>
        </div>

        <!-- 答题区域 -->
        <div class="flex-1">
          <div class="text-sm text-white mb-3 text-center font-semibold">选择正确的歌曲</div>
          <div class="grid grid-cols-2 gap-3">
            <div
              v-for="(option, index) in currentSong.options"
              :key="index"
              class="bg-white/5 border border-pink-500/10 rounded-lg p-3 cursor-pointer flex items-center gap-2 transition-all duration-300 hover:border-pink-500/40 hover:bg-pink-500/5 hover:-translate-y-0.5"
              :class="{
                'border-pink-500 bg-pink-500/10': selectedOption === index,
                'border-green-500 bg-green-500/10':
                  showResult && index === currentSong.correctIndex,
                'border-red-500 bg-red-500/10':
                  showResult && selectedOption === index && index !== currentSong.correctIndex,
              }"
              @click="selectOption(index)"
            >
              <span
                class="w-6 h-6 bg-pink-500/10 rounded-md flex items-center justify-center font-bold text-pink-500 flex-shrink-0 text-xs"
              >
                {{ ['A', 'B', 'C', 'D'][index] }}
              </span>
              <span class="text-xs text-gray-200 leading-relaxed">{{ option }}</span>
            </div>
          </div>
        </div>

        <!-- 计时器 -->
        <div class="flex justify-center mt-4">
          <div class="relative w-[50px] h-[50px]">
            <svg viewBox="0 0 36 36" class="w-full h-full -rotate-90">
              <path
                class="fill-none stroke-white/10 stroke-2"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                class="fill-none stroke-[#e74fa0] stroke-2 stroke-linecap-round transition-all duration-300"
                :style="{ strokeDasharray: `${timerProgress}, 100` }"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span
              class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-sm font-bold text-white"
              >{{ remainingTime }}</span
            >
          </div>
        </div>
      </div>

      <!-- 游戏结束状态 - 优化样式 -->
      <div v-else-if="gameState === 'ended'" class="game-ended">
        <div class="result-card animate-[fadeInUp_0.6s_ease]">
          <div class="result-icon">
            <i class="iconfont">🎵</i>
          </div>
          <h3 class="result-title">游戏结束</h3>
          <div class="result-score">
            <span class="score-label">最终得分</span>
            <span class="score-value">{{ score }}</span>
          </div>
          <div class="result-stats">
            <div class="result-stat">
              <span class="stat-name">正确率</span>
              <span class="stat-val">{{ accuracy }}%</span>
            </div>
            <div class="result-stat">
              <span class="stat-name">最高连击</span>
              <span class="stat-val">{{ maxStreak }}</span>
            </div>
            <div class="result-stat">
              <span class="stat-name">总题数</span>
              <span class="stat-val">{{ QUESTIONS_PER_GAME }}</span>
            </div>
          </div>
          <div class="result-actions">
            <button class="restart-btn" @click="restartGame">
              <i class="iconfont">▶</i>
              再玩一次
            </button>
            <button class="back-btn" @click="goBack">
              <i class="iconfont">←</i>
              返回主页
            </button>
          </div>
        </div>
      </div>

      <!-- 准备开始状态 -->
      <div v-else class="game-ready">
        <div class="max-w-[500px] mx-auto">
          <div class="text-5xl text-[#e74fa0] mb-4">🎵</div>
          <h3 class="text-xl font-bold text-white mb-4">准备好了吗？</h3>
          <p class="text-sm text-gray-400 mb-8 leading-relaxed">听音乐片段，选择正确的歌曲名称</p>

          <!-- 难度选择 -->
          <div class="mb-8">
            <h4 class="text-base text-white mb-6 font-semibold text-center">选择难度</h4>
            <div class="flex justify-center gap-6">
              <div
                v-for="difficulty in difficulties"
                :key="difficulty.value"
                class="bg-white/5 border-2 border-pink-500/20 rounded-xl p-6 min-w-[120px] cursor-pointer transition-all duration-300 text-center relative overflow-hidden hover:border-pink-500/60 hover:bg-pink-500/10 hover:-translate-y-1 hover:scale-105 hover:shadow-lg hover:shadow-pink-500/30"
                :class="{
                  'border-pink-500 bg-gradient-to-br from-pink-500/20 to-pink-500/10 shadow-[0_0_25px_rgba(231,79,160,0.4)] -translate-y-0.5':
                    selectedDifficulty === difficulty.value,
                }"
                @click="selectedDifficulty = difficulty.value"
              >
                <div class="text-3xl mb-3">{{ difficulty.icon }}</div>
                <div class="difficulty-info">
                  <div class="text-sm font-bold text-white mb-2">{{ difficulty.name }}</div>
                  <div class="text-xs text-gray-400 leading-relaxed">{{ difficulty.desc }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- 开始按钮 -->
          <button
            class="bg-gradient-to-br from-[#e74fa0] to-[#ff6b9d] text-white border-none rounded-full px-12 py-4 text-base font-semibold cursor-pointer transition-all duration-300 shadow-lg shadow-pink-500/30 relative overflow-hidden hover:-translate-y-1 hover:shadow-xl hover:shadow-pink-500/40 inline-flex items-center gap-2 group"
            @click="startGame"
          >
            <span class="btn-text mr-2">开始游戏</span>
            <span class="btn-icon transition-transform duration-300 group-hover:translate-x-1"
              >▶</span
            >
          </button>
        </div>
      </div>
    </div>

    <!-- 反馈提示 -->
    <transition name="fade">
      <div
        v-if="showFeedback"
        class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-8 py-4 rounded-lg font-semibold text-sm z-[1000] animate-[feedbackAnimation_1.2s_ease-in-out] flex items-center gap-2"
        :class="
          feedbackType === 'success' ? 'bg-green-500/90 text-white' : 'bg-red-500/90 text-white'
        "
      >
        <i class="iconfont">{{ feedbackType === 'success' ? '✓' : '✗' }}</i>
        <span>{{ feedbackMessage }}</span>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

// ========== 核心状态定义 ==========
const gameState = ref<'ready' | 'playing' | 'ended'>('ready')
const score = ref(0)
const streak = ref(0)
const maxStreak = ref(0)
const accuracy = ref(0)
const isPlaying = ref(false)
const selectedOption = ref<number | null>(null)
const showResult = ref(false)
const remainingTime = ref(10)
const timerProgress = ref(100)
const showFeedback = ref(false)
const feedbackType = ref<'success' | 'error'>('success')
const feedbackMessage = ref('')
const totalQuestions = ref(0)

// 新增：当前题目索引和总题数
const currentQuestionIndex = ref(0)
const QUESTIONS_PER_GAME = 10

// 进度条百分比 - 基于 currentQuestionIndex 计算
const progressPercent = computed(() => (currentQuestionIndex.value / QUESTIONS_PER_GAME) * 100)

// 难度选择
const selectedDifficulty = ref('easy')
const difficulties = ref([
  { value: 'easy', name: '简单', icon: '🍃', desc: '歌曲片段较长，选项简单' },
  { value: 'medium', name: '中等', icon: '🔥', desc: '歌曲片段中等，选项较多' },
  { value: 'hard', name: '困难', icon: '⚡', desc: '歌曲片段极短，干扰项多' },
])

// 当前歌曲数据
const currentSong = ref({
  options: ['晴天', '七里香', '告白气球', '夜曲'],
  correctIndex: 3,
  audioUrl: '',
})

// 音频对象
const audio = ref<HTMLAudioElement | null>(null)

// ========== 核心方法 ==========
const togglePlayPause = () => {
  isPlaying.value = !isPlaying.value
  if (isPlaying.value) {
    // 播放音频的逻辑可以在这里添加
  } else {
    // 暂停音频的逻辑
  }
}

const selectOption = (index: number) => {
  if (showResult.value) return
  selectedOption.value = index

  showResult.value = true
  stopTimer()
  totalQuestions.value++

  if (index === currentSong.value.correctIndex) {
    // 答对
    score.value += 100 * (remainingTime.value / 10)
    streak.value += 1
    maxStreak.value = Math.max(maxStreak.value, streak.value)
    showFeedbackToast('回答正确！', 'success')
  } else {
    // 答错
    streak.value = 0
    showFeedbackToast('回答错误！', 'error')
  }

  accuracy.value = Math.round((score.value / (score.value / 100 + 1)) * 100)

  // 增加题目索引
  currentQuestionIndex.value++

  // 检查是否完成所有题目
  if (currentQuestionIndex.value >= QUESTIONS_PER_GAME) {
    endGame()
  } else {
    setTimeout(() => {
      nextQuestion()
    }, 1500)
  }
}

const showFeedbackToast = (message: string, type: 'success' | 'error') => {
  feedbackMessage.value = message
  feedbackType.value = type
  showFeedback.value = true

  setTimeout(() => {
    showFeedback.value = false
  }, 1200)
}

const nextQuestion = () => {
  selectedOption.value = null
  showResult.value = false
  remainingTime.value = 10
  timerProgress.value = 100
  isPlaying.value = false

  // 模拟获取下一题
  const songOptions = [
    { options: ['晴天', '七里香', '告白气球', '夜曲'], correctIndex: 3 },
    { options: ['成都', '重庆', '兰州', '西安'], correctIndex: 0 },
    { options: ['小幸运', '大梦想家', '青春修炼手册', '宠爱'], correctIndex: 0 },
  ]
  currentSong.value = songOptions[Math.floor(Math.random() * songOptions.length)]
}

let timerInterval: number | null = null

const startTimer = () => {
  if (timerInterval) clearInterval(timerInterval)
  timerInterval = window.setInterval(() => {
    remainingTime.value -= 1
    timerProgress.value = (remainingTime.value / 10) * 100

    if (remainingTime.value <= 0) {
      stopTimer()
      showResult.value = true
      streak.value = 0
      totalQuestions.value++

      // 超时也算完成一题，增加题目索引
      currentQuestionIndex.value++
      showFeedbackToast('时间到！', 'error')

      // 检查是否完成所有题目
      if (currentQuestionIndex.value >= QUESTIONS_PER_GAME) {
        endGame()
      } else {
        setTimeout(() => {
          nextQuestion()
        }, 1500)
      }
    }
  }, 1000)
}

const stopTimer = () => {
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
}

const startGame = () => {
  gameState.value = 'playing'
  score.value = 0
  streak.value = 0
  maxStreak.value = 0
  totalQuestions.value = 0
  accuracy.value = 0
  currentQuestionIndex.value = 0 // 重置题目索引
  nextQuestion()
}

const endGame = () => {
  gameState.value = 'ended'
  stopTimer()
  if (audio.value) {
    audio.value.pause()
  }
  isPlaying.value = false
}

const restartGame = () => {
  gameState.value = 'ready'
}

// 返回主页
const goBack = () => {
  gameState.value = 'ready'
  // 如果需要实际返回上一页，可以使用 emit 或 router
  // emit('go-back')
}

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval)
  if (audio.value) {
    audio.value.pause()
    audio.value.src = ''
    audio.value.load()
  }
})
</script>

<style lang="scss" scoped>
@keyframes spin-slow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%) rotate(45deg);
  }
  100% {
    transform: translateX(100%) rotate(45deg);
  }
}

@keyframes feedbackAnimation {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.8);
  }
  20% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1.1);
  }
  80% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.8);
  }
}

.animate-spin-slow {
  animation: spin-slow 10s linear infinite;
}

.animate-shimmer {
  position: relative;
  overflow: hidden;
}

.animate-shimmer::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  animation: shimmer 3s infinite;
}

.rotate-12 {
  transform: rotate(12deg);
}

/* 隐藏滚动条 */
::-webkit-scrollbar {
  display: none;
}

* {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

// 游戏结束卡片样式
.result-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 153, 204, 0.2);
  border-radius: 20px;
  padding: 2.5rem;
  max-width: 400px;
  margin: 0 auto;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);

  .result-icon {
    width: 80px;
    height: 80px;
    background: linear-gradient(135deg, #e74fa0 0%, #ff6b9d 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1.5rem;
    box-shadow: 0 10px 20px rgba(231, 79, 160, 0.4);

    i {
      font-size: 32px;
      color: #fff;
    }
  }

  .result-title {
    font-size: 24px;
    font-weight: 700;
    color: #fff;
    margin-bottom: 1.5rem;
  }

  .result-score {
    margin-bottom: 2rem;

    .score-label {
      display: block;
      font-size: 14px;
      color: #9ca3af;
      margin-bottom: 0.5rem;
    }

    .score-value {
      display: block;
      font-size: 48px;
      font-weight: 700;
      color: #e74fa0;
      text-shadow: 0 0 20px rgba(231, 79, 160, 0.5);
    }
  }

  .result-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
    margin-bottom: 2.5rem;

    .result-stat {
      text-align: center;

      .stat-name {
        display: block;
        font-size: 12px;
        color: #9ca3af;
        margin-bottom: 0.5rem;
      }

      .stat-val {
        display: block;
        font-size: 20px;
        font-weight: 700;
        color: #fff;
      }
    }
  }

  .result-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;

    .restart-btn,
    .back-btn {
      padding: 1rem 2rem;
      border: none;
      border-radius: 25px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 0.5rem;

      i {
        font-size: 16px;
      }
    }

    .restart-btn {
      background: linear-gradient(135deg, #e74fa0 0%, #ff6b9d 100%);
      color: #fff;
      box-shadow: 0 4px 15px rgba(231, 79, 160, 0.3);

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(231, 79, 160, 0.4);
      }
    }

    .back-btn {
      background: rgba(255, 255, 255, 0.1);
      color: #fff;
      border: 1px solid rgba(255, 255, 255, 0.2);

      &:hover {
        background: rgba(255, 255, 255, 0.15);
        transform: translateY(-2px);
      }
    }
  }
}
</style>

<template>
  <div class="lyric-solitaire-game">
    <div class="game-header">
      <div class="game-icon">
        <i class="iconfont">🎵</i>
      </div>
      <div class="game-info">
        <h2 class="game-title">歌词接龙</h2>
        <p class="game-desc">根据上一句歌词，接出下一句</p>
      </div>
      <div class="game-stats">
        <div class="stat-item">
          <span class="stat-label">得分</span>
          <span class="stat-value">{{ score }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">连击</span>
          <span class="stat-value">{{ streak }}</span>
        </div>
      </div>
    </div>

    <div class="game-content">
      <!-- 游戏进行状态 -->
      <div v-if="gameState === 'playing'" class="game-playing">
        <!-- 优化的进度条 -->
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
          <div class="progress-text">{{ currentQuestionIndex }}/{{ QUESTIONS_PER_GAME }}</div>
        </div>

        <div class="lyric-display">
          <div class="lyric-label">上一句</div>
          <div class="lyric-text">{{ currentLyric.prevLine }}</div>
        </div>

        <div class="answer-section">
          <div class="lyric-label">请接下一句</div>
          <div class="options-grid">
            <div
              v-for="(option, index) in currentLyric.options"
              :key="index"
              class="option-card"
              :class="{
                selected: selectedOption === index,
                correct: showResult && index === currentLyric.correctIndex,
                wrong:
                  showResult && selectedOption === index && index !== currentLyric.correctIndex,
              }"
              @click="selectOption(index)"
            >
              <span class="option-label">{{ ['A', 'B', 'C', 'D'][index] }}</span>
              <span class="option-text">{{ option }}</span>
            </div>
          </div>
        </div>

        <div class="timer-section">
          <div class="timer-circle">
            <svg viewBox="0 0 36 36">
              <path
                class="timer-bg"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                class="timer-progress"
                :stroke-dasharray="timerProgress + ', 100'"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span class="timer-text">{{ remainingTime }}</span>
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
              <span class="stat-val">{{ totalQuestions }}</span>
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
        <div class="ready-card">
          <div class="ready-icon">
            <i class="iconfont">🎵</i>
          </div>
          <h3 class="ready-title">准备好了吗？</h3>
          <p class="ready-desc">根据给出的歌词，选择正确的下一句</p>
          <div class="difficulty-select">
            <h4 class="select-label">选择难度</h4>
            <div class="difficulty-options">
              <div
                v-for="difficulty in difficulties"
                :key="difficulty.value"
                class="difficulty-option"
                :class="{ active: selectedDifficulty === difficulty.value }"
                @click="selectedDifficulty = difficulty.value"
              >
                <div class="difficulty-icon">{{ difficulty.icon }}</div>
                <div class="difficulty-info">
                  <div class="difficulty-name">{{ difficulty.name }}</div>
                  <div class="difficulty-desc">{{ difficulty.desc }}</div>
                </div>
              </div>
            </div>
          </div>
          <button class="start-btn" @click="startGame">
            <span class="btn-text">开始游戏</span>
            <span class="btn-icon">▶</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 反馈提示 -->
    <transition name="fade">
      <div v-if="showFeedback" class="feedback-toast" :class="feedbackType">
        <i class="iconfont">{{ feedbackType === 'success' ? '✓' : '✗' }}</i>
        <span>{{ feedbackMessage }}</span>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useMusicGameStore } from '@/stores/musicGame'
import { ElMessage } from 'element-plus'

const musicGameStore = useMusicGameStore()
// 游戏状态
const gameState = ref<'ready' | 'playing' | 'ended'>('ready')
const selectedDifficulty = ref<'easy' | 'medium' | 'hard'>('easy')
const score = ref(0)
const streak = ref(0)
const maxStreak = ref(0)
const totalQuestions = ref(0)
const correctAnswers = ref(0)

// 难度选项
const difficulties = [
  { value: 'easy', name: '简单', icon: '🌱', desc: '时间充足，选项较少' },
  { value: 'medium', name: '中等', icon: '⚡', desc: '时间适中，选项适中' },
  { value: 'hard', name: '困难', icon: '🔥', desc: '时间紧张，选项较多' },
]

// 当前题目
const currentLyric = ref<{
  song: any
  prevLine: string
  correctLine: string
  options: string[]
  correctIndex: number
} | null>(null)

const selectedOption = ref<number | null>(null)
const showResult = ref(false)

// 计时器
const TIME_LIMIT = 15
const remainingTime = ref(TIME_LIMIT)
const timerProgress = computed(() => (remainingTime.value / TIME_LIMIT) * 100)
let timerInterval: NodeJS.Timeout | null = null

// 进度条
const currentQuestionIndex = ref(0)
const QUESTIONS_PER_GAME = 10
const progressPercent = computed(() => (currentQuestionIndex.value / QUESTIONS_PER_GAME) * 100)

// 反馈
const showFeedback = ref(false)
const feedbackType = ref<'success' | 'error'>('success')
const feedbackMessage = ref('')

// 正确率
const accuracy = computed(() => {
  if (totalQuestions.value === 0) return 0
  return Math.round((correctAnswers.value / totalQuestions.value) * 100)
})

// 开始游戏
const startGame = () => {
  if (musicGameStore.songLibrary.length === 0) {
    ElMessage.warning('歌曲库正在加载中，请稍后再试')
    return
  }

  gameState.value = 'playing'
  score.value = 0
  streak.value = 0
  maxStreak.value = 0
  totalQuestions.value = 0
  correctAnswers.value = 0
  currentQuestionIndex.value = 0

  nextQuestion()
}

// 生成下一题
const nextQuestion = () => {
  if (currentQuestionIndex.value >= QUESTIONS_PER_GAME) {
    endGame()
    return
  }

  // 获取当前难度歌曲
  const songs = musicGameStore.songsByDifficulty(selectedDifficulty.value)
  if (songs.length === 0) {
    ElMessage.warning('该难度暂无歌曲，请切换难度')
    gameState.value = 'ready'
    return
  }

  // 随机选择一首歌曲
  const song = songs[Math.floor(Math.random() * songs.length)]
  if (!song.lyric || song.lyric.length < 2) {
    nextQuestion()
    return
  }

  // 随机选择一行（不能是最后一行）
  const lineIndex = Math.floor(Math.random() * (song.lyric.length - 1))
  const prevLine = song.lyric[lineIndex]
  const correctLine = song.lyric[lineIndex + 1]

  // 生成干扰选项
  const options = generateOptions(correctLine, song.lyric, lineIndex)
  const correctIndex = options.indexOf(correctLine)

  currentLyric.value = {
    song,
    prevLine,
    correctLine,
    options,
    correctIndex,
  }

  selectedOption.value = null
  showResult.value = false
  remainingTime.value = TIME_LIMIT
  currentQuestionIndex.value++

  startTimer()
}

// 生成选项
const generateOptions = (correctLine: string, allLyrics: string[], correctIndex: number) => {
  const options = [correctLine]
  const otherLyrics = allLyrics.filter(
    (_, index) => index !== correctIndex && index !== correctIndex + 1,
  )

  // 从其他歌词中随机选择3个
  while (options.length < 4 && otherLyrics.length > 0) {
    const randomIndex = Math.floor(Math.random() * otherLyrics.length)
    const line = otherLyrics[randomIndex]
    if (!options.includes(line)) {
      options.push(line)
    }
    otherLyrics.splice(randomIndex, 1)
  }

  // 打乱顺序
  return options.sort(() => Math.random() - 0.5)
}

// 开始计时
const startTimer = () => {
  if (timerInterval) clearInterval(timerInterval)

  timerInterval = setInterval(() => {
    remainingTime.value--
    if (remainingTime.value <= 0) {
      handleTimeout()
    }
  }, 1000)
}

// 处理超时
const handleTimeout = () => {
  if (timerInterval) clearInterval(timerInterval)
  showResult.value = true
  streak.value = 0
  totalQuestions.value++
  showFeedbackMsg('error', '时间到！')

  setTimeout(() => {
    nextQuestion()
  }, 1500)
}

// 选择选项
const selectOption = (index: number) => {
  if (showResult.value || !currentLyric.value) return

  selectedOption.value = index
  showResult.value = true
  totalQuestions.value++

  if (timerInterval) clearInterval(timerInterval)

  if (index === currentLyric.value.correctIndex) {
    // 答对
    streak.value++
    if (streak.value > maxStreak.value) {
      maxStreak.value = streak.value
    }
    correctAnswers.value++

    // 计算得分（基础分 + 连击加成 + 时间加成）
    const baseScore = 100
    const streakBonus = Math.min(streak.value * 10, 50)
    const timeBonus = remainingTime.value * 5
    const roundScore = baseScore + streakBonus + timeBonus
    score.value += roundScore

    showFeedbackMsg('success', `+${roundScore}分！`)
  } else {
    // 答错
    streak.value = 0
    showFeedbackMsg('error', '答错了！')
  }

  setTimeout(() => {
    nextQuestion()
  }, 1500)
}

// 显示反馈
const showFeedbackMsg = (type: 'success' | 'error', message: string) => {
  feedbackType.value = type
  feedbackMessage.value = message
  showFeedback.value = true

  setTimeout(() => {
    showFeedback.value = false
  }, 1200)
}

// 结束游戏
const endGame = () => {
  gameState.value = 'ended'
  if (timerInterval) clearInterval(timerInterval)
}

// 重新开始
const restartGame = () => {
  gameState.value = 'ready'
}

// 返回主页
const goBack = () => {
  // 这里可以通过路由或父组件事件返回主页
  // 暂时直接重置游戏状态
  gameState.value = 'ready'
}

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval)
})
</script>

<style lang="scss" scoped>
.lyric-solitaire-game {
  width: 100%;
  padding: 1.5rem;
  background: transparent;
  border: none;
  box-shadow: none;
}

.game-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 153, 204, 0.1);
}

.game-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #e74fa0 0%, #ff6b9d 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(231, 79, 160, 0.3);

  i {
    font-size: 24px;
    color: #fff;
  }
}

.game-info {
  flex: 1;

  .game-title {
    font-size: 18px;
    font-weight: 700;
    color: #fff;
    margin: 0 0 4px 0;
  }

  .game-desc {
    font-size: 12px;
    color: #9ca3af;
    margin: 0;
  }
}

.game-stats {
  display: flex;
  gap: 1.5rem;

  .stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;

    .stat-label {
      font-size: 10px;
      color: #9ca3af;
    }

    .stat-value {
      font-size: 18px;
      font-weight: 700;
      color: #e74fa0;
    }
  }
}

.game-content {
  min-height: 350px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

// 游戏进行中
.game-playing {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

// 优化的进度条样式
.progress-bar {
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
  position: relative;
  margin-bottom: 1.5rem;

  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #e74fa0 0%, #ff6b9d 100%);
    border-radius: 4px;
    transition: width 0.3s ease;
    box-shadow: 0 0 10px rgba(231, 79, 160, 0.5);
  }

  .progress-text {
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
    font-size: 12px;
    color: #9ca3af;
    font-weight: 500;
  }
}

.lyric-display {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 10px;
  padding: 1.5rem;
  text-align: center;
  border: 1px solid rgba(255, 153, 204, 0.1);
}

.lyric-label {
  font-size: 10px;
  color: #9ca3af;
  margin-bottom: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.lyric-text {
  font-size: 16px;
  color: #fff;
  font-weight: 500;
  line-height: 1.5;
}

.answer-section {
  flex: 1;
}

.options-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.option-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 153, 204, 0.1);
  border-radius: 8px;
  padding: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;

  &:hover:not(.selected):not(.correct):not(.wrong) {
    border-color: rgba(231, 79, 160, 0.4);
    background: rgba(231, 79, 160, 0.05);
    transform: translateY(-1px);
  }

  &.selected {
    border-color: #e74fa0;
    background: rgba(231, 79, 160, 0.1);
  }

  &.correct {
    border-color: #10b981;
    background: rgba(16, 185, 129, 0.1);
  }

  &.wrong {
    border-color: #ef4444;
    background: rgba(239, 68, 68, 0.1);
  }
}

.option-label {
  width: 24px;
  height: 24px;
  background: rgba(255, 153, 204, 0.1);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: #e74fa0;
  flex-shrink: 0;
  font-size: 12px;
}

.option-text {
  font-size: 12px;
  color: #e0e0e0;
  line-height: 1.4;
}

// 计时器
.timer-section {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}

.timer-circle {
  position: relative;
  width: 50px;
  height: 50px;

  svg {
    width: 100%;
    height: 100%;
    transform: rotate(-90deg);
  }

  .timer-bg {
    fill: none;
    stroke: rgba(255, 255, 255, 0.1);
    stroke-width: 2;
  }

  .timer-progress {
    fill: none;
    stroke: #e74fa0;
    stroke-width: 2;
    stroke-linecap: round;
    transition: stroke-dasharray 0.3s ease;
  }

  .timer-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 14px;
    font-weight: 700;
    color: #fff;
  }
}

// 游戏结束
.game-ended {
  text-align: center;
  padding: 2rem 0;
}

.game-over-title {
  font-size: 24px;
  font-weight: 700;
  color: #e74fa0;
  margin-bottom: 1rem;
}

.final-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin: 2rem 0;

  .final-stat-item {
    text-align: center;

    .final-stat-value {
      font-size: 24px;
      font-weight: 700;
      color: #fff;
      margin-bottom: 0.5rem;
    }

    .final-stat-label {
      font-size: 12px;
      color: #9ca3af;
    }
  }
}

.restart-btn {
  background: linear-gradient(135deg, #e74fa0 0%, #ff6b9d 100%);
  color: #fff;
  border: none;
  border-radius: 20px;
  padding: 0.75rem 2rem;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(231, 79, 160, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(231, 79, 160, 0.4);
  }
}

// 游戏准备
.game-ready {
  padding: 1.5rem 0;
  text-align: center;
}

.ready-card {
  background: transparent;
  border: none;
  box-shadow: none;
  padding: 0;
}

.ready-title {
  font-size: 20px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 1rem;
}

.ready-desc {
  font-size: 14px;
  color: #9ca3af;
  margin-bottom: 2rem;
  line-height: 1.5;
}

/* 难度选择 */
.difficulty-select {
  margin-bottom: 2rem;

  .select-label {
    font-size: 16px;
    color: #fff;
    margin-bottom: 1.5rem;
    font-weight: 600;
    text-align: center;
  }

  .difficulty-options {
    display: flex;
    justify-content: center;
    gap: 1.5rem;
    flex-wrap: wrap;
  }

  .difficulty-option {
    background: rgba(255, 255, 255, 0.05);
    border: 2px solid rgba(231, 79, 160, 0.2);
    border-radius: 12px;
    padding: 1.5rem 1rem;
    min-width: 120px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    text-align: center;
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(231, 79, 160, 0.1), transparent);
      transition: left 0.5s ease;
    }

    &:hover {
      border-color: rgba(231, 79, 160, 0.6);
      background: rgba(231, 79, 160, 0.1);
      transform: translateY(-4px) scale(1.05);
      box-shadow: 0 8px 20px rgba(231, 79, 160, 0.3);

      &::before {
        left: 100%;
      }
    }

    &.active {
      border-color: #e74fa0;
      background: linear-gradient(135deg, rgba(231, 79, 160, 0.2), rgba(255, 107, 157, 0.1));
      box-shadow: 0 0 25px rgba(231, 79, 160, 0.4);
      transform: translateY(-2px);

      &::before {
        left: 100%;
      }
    }

    &:active {
      transform: translateY(0) scale(0.98);
      transition: all 0.1s ease;
    }

    .difficulty-icon {
      font-size: 28px;
      margin-bottom: 0.75rem;
      display: block;
    }

    .difficulty-info {
      .difficulty-name {
        font-size: 14px;
        font-weight: 700;
        color: #fff;
        margin-bottom: 0.5rem;
      }

      .difficulty-desc {
        font-size: 12px;
        color: #9ca3af;
        line-height: 1.3;
      }
    }
  }
}

/* 开始按钮 */
.start-btn {
  background: linear-gradient(135deg, #e74fa0 0%, #ff6b9d 100%);
  color: #fff;
  border: none;
  border-radius: 25px;
  padding: 1rem 3rem;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 15px rgba(231, 79, 160, 0.3);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s ease;
  }

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(231, 79, 160, 0.4);

    &::before {
      left: 100%;
    }

    .btn-icon {
      transform: translateX(5px);
    }
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 4px 10px rgba(231, 79, 160, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  .btn-text {
    margin-right: 0.5rem;
  }

  .btn-icon {
    transition: transform 0.3s ease;
  }
}

/* 反馈提示 */
.feedback {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 1rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  z-index: 1000;
  animation: feedbackAnimation 1.2s ease-in-out;
}

.feedback.success {
  background: rgba(16, 185, 129, 0.9);
  color: #fff;
}

.feedback.error {
  background: rgba(239, 68, 68, 0.9);
  color: #fff;
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

/* 响应式设计 */
@media (max-width: 768px) {
  .lyric-solitaire-game {
    padding: 1rem;
  }

  .game-header {
    flex-direction: column;
    text-align: center;
    gap: 0.75rem;
  }

  .game-stats {
    justify-content: center;
  }

  .options-grid {
    grid-template-columns: 1fr;
  }

  .final-stats {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .difficulty-options {
    flex-direction: column;
    align-items: center;
  }

  .difficulty-card {
    width: 100%;
    max-width: 200px;
  }
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

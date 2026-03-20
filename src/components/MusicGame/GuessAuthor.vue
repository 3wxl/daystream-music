<template>
  <div class="guess-author-game">
    <div class="game-header">
      <div class="game-icon">
        <i class="iconfont">🎵</i>
      </div>
      <div class="game-info">
        <h2 class="game-title">猜作者</h2>
        <p class="game-desc">听音乐片段，猜出正确的作者</p>
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
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
          <div class="progress-text">{{ currentQuestionIndex }}/{{ QUESTIONS_PER_GAME }}</div>
        </div>

        <div class="song-info-section">
          <div class="song-cover">
            <div class="cover-placeholder">
              <i class="iconfont">🎵</i>
            </div>
          </div>
          <div class="song-details">
            <div class="song-name">{{ currentSong?.song.name }}</div>
            <div class="song-hint">提示: {{ currentSong?.song.hint }}</div>
          </div>
        </div>

        <div class="options-section">
          <div class="options-label">选择正确的作者</div>
          <div class="options-grid">
            <div
              v-for="(option, index) in currentSong?.options"
              :key="index"
              class="option-card"
              :class="{
                selected: selectedOption === index,
                correct: showResult && index === currentSong?.correctIndex,
                wrong:
                  showResult && selectedOption === index && index !== currentSong?.correctIndex,
              }"
              @click="selectOption(index)"
            >
              <div class="option-avatar">{{ getAvatarText(option) }}</div>
              <div class="option-name">{{ option }}</div>
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

      <!-- 游戏结束状态 -->
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
          <p class="ready-desc">听音乐片段，选择正确的作者</p>
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
const currentSong = ref<{
  song: any
  options: string[]
  correctIndex: number
} | null>(null)

const selectedOption = ref<number | null>(null)
const showResult = ref(false)

// 播放器状态
const isPlaying = ref(false)
const audio = ref<HTMLAudioElement | null>(null)

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

  // 生成干扰选项
  const options = generateOptions(song.singer, songs)
  const correctIndex = options.indexOf(song.singer)

  currentSong.value = {
    song,
    options,
    correctIndex,
  }

  selectedOption.value = null
  showResult.value = false
  remainingTime.value = TIME_LIMIT
  currentQuestionIndex.value++

  // 播放音乐
  playMusic(song.url)
  startTimer()
}

// 生成选项
const generateOptions = (correctSinger: string, allSongs: any[]) => {
  const options = [correctSinger]
  const otherSingers = [
    ...new Set(allSongs.map((s) => s.singer).filter((s) => s !== correctSinger)),
  ]

  // 从其他歌手中随机选择3个
  while (options.length < 4 && otherSingers.length > 0) {
    const randomIndex = Math.floor(Math.random() * otherSingers.length)
    const singer = otherSingers[randomIndex]
    if (!options.includes(singer)) {
      options.push(singer)
    }
    otherSingers.splice(randomIndex, 1)
  }

  // 打乱顺序
  return options.sort(() => Math.random() - 0.5)
}

// 播放音乐
const playMusic = (url: string) => {
  // 停止之前的音频
  if (audio.value) {
    audio.value.pause()
    audio.value.currentTime = 0
  }

  // 创建新的音频对象
  audio.value = new Audio(url)
  audio.value.volume = 0.5

  // 播放30秒后自动停止
  setTimeout(() => {
    if (audio.value) {
      audio.value.pause()
    }
  }, 30000)

  audio.value.play().catch((error) => {
    if (error.name !== 'AbortError') {
      console.error('播放失败:', error)
    }
  })

  isPlaying.value = true
}

// 切换播放/暂停
const togglePlayPause = () => {
  if (!audio.value) return

  if (isPlaying.value) {
    audio.value.pause()
  } else {
    audio.value.play().catch((error) => {
      if (error.name !== 'AbortError') {
        console.error('播放失败:', error)
      }
    })
  }

  isPlaying.value = !isPlaying.value
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
  if (audio.value) {
    audio.value.pause()
  }
  isPlaying.value = false
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
  if (showResult.value || !currentSong.value) return

  selectedOption.value = index
  showResult.value = true
  totalQuestions.value++

  if (timerInterval) clearInterval(timerInterval)
  if (audio.value) {
    audio.value.pause()
  }
  isPlaying.value = false

  if (index === currentSong.value.correctIndex) {
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
  if (audio.value) {
    audio.value.pause()
  }
  isPlaying.value = false
}

// 重新开始
const restartGame = () => {
  gameState.value = 'ready'
  if (audio.value) {
    audio.value.pause()
    audio.value.currentTime = 0
  }
  isPlaying.value = false
}

// 返回主页
const goBack = () => {
  // 这里可以通过路由或父组件事件返回主页
  // 暂时直接重置游戏状态
  gameState.value = 'ready'
}

// 获取头像文本
const getAvatarText = (name: string) => {
  return name.charAt(0).toUpperCase()
}

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval)
  if (audio.value) {
    audio.value.pause()
  }
})
</script>

<style lang="scss" scoped>
.guess-author-game {
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

.progress-bar {
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
  position: relative;

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

.song-info-section {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 10px;
  border: 1px solid rgba(255, 153, 204, 0.1);
}

.song-cover {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
}

.cover-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #e74fa0 0%, #ff6b9d 100%);
  display: flex;
  align-items: center;
  justify-content: center;

  i {
    font-size: 32px;
    color: #fff;
  }
}

.song-details {
  flex: 1;

  .song-name {
    font-size: 16px;
    font-weight: 600;
    color: #fff;
    margin-bottom: 0.5rem;
  }

  .song-hint {
    font-size: 12px;
    color: #9ca3af;
    line-height: 1.4;
  }
}

.options-section {
  flex: 1;
}

.options-label {
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 1rem;
  text-align: center;
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
  gap: 12px;
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

.option-avatar {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #e74fa0 0%, #ff6b9d 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 700;
  color: #fff;
  flex-shrink: 0;
}

.option-name {
  font-size: 14px;
  color: #e0e0e0;
  font-weight: 500;
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
.feedback-toast {
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
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.feedback-toast.success {
  background: rgba(16, 185, 129, 0.9);
  color: #fff;
}

.feedback-toast.error {
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

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
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

/* 响应式设计 */
@media (max-width: 768px) {
  .guess-author-game {
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

  .song-info-section {
    flex-direction: column;
    text-align: center;
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
</style>

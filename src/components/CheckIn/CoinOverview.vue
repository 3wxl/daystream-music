<template>
  <div class="animate-fade-in-up">
    <div
      class="bg-gray-800/50 backdrop-blur-md border border-gray-700/50 rounded-2xl p-6 shadow-2xl"
    >
      <div class="flex flex-col md:flex-row items-center justify-between gap-6">
        <!-- 音浪数量 -->
        <div class="flex items-center gap-4">
          <div class="coin animate-pulse-glow">
            <div class="coin-text">
              <div>音浪</div>
              <div class="text-xs opacity-80">COIN</div>
            </div>
          </div>
          <div>
            <p class="text-gray-400 text-sm">我的音浪</p>
            <h2 class="text-3xl font-bold text-white">
              {{ currentCoins }} <span class="text-lg text-pink-400">音浪</span>
            </h2>
            <p class="text-xs text-gray-500 mt-1">可用于兑换VIP特权</p>
          </div>
        </div>

        <!-- 签到按钮插槽 -->
        <slot name="checkin-button">
          <CheckInButton
            :has-checked-in="hasCheckedIn"
            :loading="loading"
            :continuous-days="consecutiveDays"
            :tomorrow-reward="nextDayCoins"
            :current-waves="currentCoins"
            @checkin="handleCheckIn"
            @success="handleCheckInSuccess"
            @error="handleCheckInError"
          />
        </slot>

        <!-- 连续签到信息 -->
        <div class="text-center">
          <p class="text-gray-400 text-sm">连续签到</p>
          <h3 class="text-2xl font-bold text-white">
            {{ consecutiveDays }} <span class="text-lg text-pink-400">天</span>
          </h3>
          <p class="text-xs text-gray-500 mt-1">明日可得 {{ nextDayCoins }} 音浪</p>
          <!-- <div v-if="consecutiveDays > 0" class="mt-2">
            <div class="w-24 h-1.5 bg-gray-700 rounded-full mx-auto overflow-hidden">
              <div
                class="h-full bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-500"
                :style="{ width: `${Math.min((consecutiveDays % 7) * 14.28, 100)}%` }"
              ></div>
            </div> -->
          <!-- <p class="text-xs text-pink-400 mt-1">
              再签到 {{ 7 - (consecutiveDays % 7) }} 天解锁更高奖励
            </p> -->
          <!-- </div> -->
        </div>
      </div>

      <!-- 音浪变化动画 -->
      <transition name="fade">
        <div v-if="showCoinChange" class="mt-4 text-center">
          <div
            class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-green-500/20 to-green-400/10 border border-green-500/30"
          >
            <i class="iconfont icon-coin text-green-400"></i>
            <span class="text-green-300 text-sm font-medium">+{{ lastReward }} 音浪</span>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BaseResponse } from '@/types/checkIn'

interface Props {
  currentCoins: number
  consecutiveDays: number
  hasCheckedIn: boolean
  nextDayCoins: number
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
})

const emit = defineEmits<{
  (e: 'checkin'): void
  (e: 'success', result: BaseResponse<string>): void
  (e: 'error', error: Error): void
  (e: 'coins-changed', newCoins: number): void
}>()

// 内部状态
const showCoinChange = ref(false)
const lastReward = ref(0)
const coinsAnimation = ref(false)

// 计算属性
const coinDisplayValue = computed(() => {
  return coinsAnimation.value ? props.currentCoins - lastReward.value : props.currentCoins
})

// 处理签到
const handleCheckIn = () => {
  console.log('开始签到')
  emit('checkin')
}

// 处理签到成功
const handleCheckInSuccess = (result: BaseResponse<string>) => {
  console.log('签到成功:', result)

  // 触发成功事件给父组件
  emit('success', result)

  // 显示音浪变化效果
  if (result.data?.includes('成功')) {
    // 尝试从消息中提取奖励数量
    const match = result.data.match(/获得(\d+)音浪/)
    if (match && match[1]) {
      lastReward.value = parseInt(match[1])
    } else {
      // 默认奖励
      lastReward.value = props.nextDayCoins || 10
    }

    // 显示音浪变化动画
    showCoinChange.value = true
    coinsAnimation.value = true

    setTimeout(() => {
      coinsAnimation.value = false
    }, 1500)

    setTimeout(() => {
      showCoinChange.value = false
    }, 3000)
  }

  // 触发音浪变化事件
  const newCoins = props.currentCoins + lastReward.value
  emit('coins-changed', newCoins)
}

// 处理签到错误
const handleCheckInError = (error: Error) => {
  console.error('签到失败:', error)
  emit('error', error)
}

// 监听音浪变化
watch(
  () => props.currentCoins,
  (newValue, oldValue) => {
    if (newValue > oldValue) {
      lastReward.value = newValue - oldValue
      showCoinChange.value = true

      setTimeout(() => {
        showCoinChange.value = false
      }, 2000)
    }
  },
)

// 监听连续签到天数变化
watch(
  () => props.consecutiveDays,
  (newDays, oldDays) => {
    if (newDays > oldDays) {
      console.log(`连续签到天数更新: ${oldDays} → ${newDays}`)
    }
  },
)
</script>

<style scoped>
@keyframes pulse-glow {
  0%,
  100% {
    box-shadow: 0 0 10px rgba(236, 72, 153, 0.3);
  }
  50% {
    box-shadow: 0 0 25px rgba(236, 72, 153, 0.6);
  }
}

@keyframes coin-pop {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.coin {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #000;
  font-weight: bold;
  box-shadow: 0 4px 15px rgba(251, 191, 36, 0.5);
  position: relative;
  transition: all 0.3s ease;
}

.coin:hover {
  transform: rotate(15deg);
  box-shadow: 0 8px 25px rgba(251, 191, 36, 0.7);
}

.coin::before {
  content: '';
  position: absolute;
  top: 5px;
  left: 5px;
  right: 5px;
  bottom: 5px;
  border-radius: 50%;
  background: linear-gradient(135deg, #fde68a, #fbbf24);
  z-index: 1;
}

.coin-text {
  position: relative;
  z-index: 2;
  font-size: 12px;
  text-align: center;
  line-height: 1.2;
  font-weight: 700;
}

.animate-pulse-glow {
  animation: pulse-glow 2s infinite;
}

.coin.animate {
  animation: coin-pop 0.5s ease-out;
}

.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.5s ease,
    transform 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.animate-fade-in-up {
  animation: fade-in-up 0.6s ease-out forwards;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .coin {
    width: 50px;
    height: 50px;
  }

  .coin-text {
    font-size: 10px;
  }
}
</style>

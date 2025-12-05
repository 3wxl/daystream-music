<template>
  <div class="flex flex-col items-center gap-2">
    <div
      class="checkin-button relative"
      :class="{
        'opacity-50 cursor-not-allowed': disabled,
        'cursor-pointer hover:scale-105': !disabled,
      }"
      @click="handleClick"
    >
      <i
        class="iconfont text-2xl"
        style="font-size: 35px"
        :class="{
          'text-white': !hasCheckedIn,
          'text-green-300': hasCheckedIn,
          'animate-pulse': loading,
        }"
        >&#xe608;</i
      >

      <!-- 加载动画 -->
      <div v-if="loading" class="absolute inset-0 flex items-center justify-center">
        <div
          class="w-12 h-12 border-2 border-white/30 border-t-white rounded-full animate-spin"
        ></div>
      </div>

      <!-- 签到成功动画（仅真正签到成功时显示） -->
      <div v-if="showSuccessAnimation" class="absolute inset-0 flex items-center justify-center">
        <div class="confetti-animation">
          <div v-for="i in 8" :key="i" class="confetti-piece" :style="getConfettiStyle(i)"></div>
        </div>
      </div>

      <!-- 签到状态标识 -->
      <div v-if="hasCheckedIn" class="absolute -top-1 -right-1">
        <div
          class="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center animate-pulse"
        >
          <i class="iconfont icon-check text-xs text-white"></i>
        </div>
      </div>
    </div>

    <p class="text-sm" :class="statusClass">
      {{ statusText }}
    </p>

    <!-- 动态提示框（根据后端返回消息显示） -->
    <transition name="fade">
      <div
        v-if="showTipMessage"
        class="mt-2 px-3 py-1.5 rounded-lg"
        :class="
          tipType === 'success'
            ? 'bg-gradient-to-r from-green-500/20 to-green-400/10 border border-green-500/30'
            : 'bg-gradient-to-r from-yellow-500/20 to-yellow-400/10 border border-yellow-500/30'
        "
      >
        <p class="text-xs" :class="tipType === 'success' ? 'text-green-300' : 'text-yellow-300'">
          <i class="iconfont icon-gift mr-1"></i>
          {{ tipMessage }}
        </p>
      </div>
    </transition>

    <!-- 连续签到信息 -->
    <div v-if="continuousDays > 0" class="text-xs text-pink-300 mt-1">
      已连续签到 {{ continuousDays }} 天
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCheckInStore } from '@/stores/checkIn'
import type { BaseResponse } from '@/types/checkIn'

interface Props {
  hasCheckedIn?: boolean
  disabled?: boolean
  loading?: boolean
  continuousDays?: number
  tomorrowReward?: number
  currentWaves?: number
}

const props = withDefaults(defineProps<Props>(), {
  hasCheckedIn: undefined,
  disabled: false,
  loading: false,
  continuousDays: 0,
  tomorrowReward: 10,
  currentWaves: 0,
})

// 修正 emit 类型
const emit = defineEmits<{
  (e: 'checkin'): void
  (e: 'success', result: BaseResponse<string>): void
  (e: 'error', error: Error): void
}>()

const checkInStore = useCheckInStore()

// 组件内部状态
const showSuccessAnimation = ref(false)
const showTipMessage = ref(false)
const tipMessage = ref('')
const tipType = ref<'success' | 'info'>('success')
const localLoading = ref(false)

// 计算属性
const actualHasCheckedIn = computed(() => {
  return props.hasCheckedIn ?? checkInStore.isCheckedIn
})

const actualContinuousDays = computed(() => {
  return props.continuousDays || checkInStore.continuousDays
})

const actualTomorrowReward = computed(() => {
  return props.tomorrowReward || checkInStore.tomorrowSignInReward
})

const actualCurrentWaves = computed(() => {
  return props.currentWaves || checkInStore.currentWaves
})

const statusText = computed(() => {
  if (localLoading.value || checkInStore.checkInLoading) return '签到中...'
  if (actualHasCheckedIn.value) return '今日已签到'
  return '点击签到'
})

const statusClass = computed(() => {
  if (localLoading.value || checkInStore.checkInLoading) return 'text-yellow-400'
  if (actualHasCheckedIn.value) return 'text-green-400'
  return 'text-gray-400'
})

const disabled = computed(() => {
  return (
    props.disabled ||
    actualHasCheckedIn.value ||
    localLoading.value ||
    checkInStore.checkInLoading ||
    props.loading
  )
})

// 处理点击事件
const handleClick = async () => {
  if (disabled.value) return

  localLoading.value = true
  showTipMessage.value = false
  showSuccessAnimation.value = false

  try {
    const result = await checkInStore.doCheckIn()

    if (result) {
      const responseMsg = result.data || ''

      // 根据后端消息类型显示不同提示
      if (responseMsg.includes('已签到') || responseMsg.includes('明日再来')) {
        tipType.value = 'info'
        tipMessage.value = responseMsg
        showSuccessAnimation.value = false
      } else if (responseMsg.includes('成功')) {
        tipType.value = 'success'
        tipMessage.value = responseMsg
        showSuccessAnimation.value = true // 签到成功显示动画
      } else {
        // 其他情况
        tipType.value = 'success'
        tipMessage.value = responseMsg
        showSuccessAnimation.value = false
      }

      // 显示提示框
      showTipMessage.value = true

      // 触发事件给父组件
      emit('success', result)
      emit('checkin')

      // 自动关闭提示
      setTimeout(() => {
        showTipMessage.value = false
      }, 3000)
    }
  } catch (error: any) {
    console.error('签到失败:', error)
    emit('error', error)
  } finally {
    localLoading.value = false
    // 重置动画状态
    setTimeout(() => {
      showSuccessAnimation.value = false
    }, 1000)
  }
} // 移除硬编码的奖励逻辑
const getConfettiStyle = (index: number) => {
  const angle = (index / 8) * 360
  const distance = 50 + Math.random() * 30
  const tx = Math.cos((angle * Math.PI) / 180) * distance
  const ty = Math.sin((angle * Math.PI) / 180) * distance
  const colors = ['#ec4899', '#f472b6', '#fbbf24', '#10b981', '#3b82f6']
  const color = colors[Math.floor(Math.random() * colors.length)]

  return {
    '--tx': `${tx}px`,
    '--ty': `${ty}px`,
    background: `linear-gradient(135deg, ${color}, ${color}80)`,
    animationDelay: `${index * 0.1}s`,
  }
}

// 监听store状态变化
watch(
  () => checkInStore.isCheckedIn,
  (newVal) => {
    if (newVal && props.hasCheckedIn === undefined) {
      // 同步更新按钮状态
    }
  },
)

defineExpose({
  triggerCheckIn: handleClick,
  refreshStatus: () => checkInStore.loadCheckInStatus(),
  setCheckInStatus: (status: boolean) => {
    if (props.hasCheckedIn === undefined) {
      checkInStore.isCheckedIn = status
    }
  },
})
</script>

<!-- 样式部分不变 -->
<style scoped>
/* 原有样式保持不变 */
.checkin-button {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ec4899, #f472b6);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  transition: all 0.3s ease;
  box-shadow: 0 6px 16px rgba(236, 72, 153, 0.4);
  position: relative;
  overflow: hidden;
}

.checkin-button:hover:not(.opacity-50) {
  transform: scale(1.05);
  box-shadow: 0 8px 20px rgba(236, 72, 153, 0.6);
}

.confetti-animation {
  position: absolute;
  width: 100%;
  height: 100%;
}
.confetti-piece {
  position: absolute;
  width: 8px;
  height: 16px;
  background: linear-gradient(135deg, #ec4899, #f472b6, #fbbf24);
  top: 50%;
  left: 50%;
  opacity: 0;
  animation: confetti 1s ease-out forwards;
}

@keyframes confetti {
  0% {
    opacity: 1;
    transform: translate(0, 0) rotate(0deg);
  }
  100% {
    opacity: 0;
    transform: translate(var(--tx), var(--ty)) rotate(360deg);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.checkin-button::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.3s;
}

.checkin-button:hover::before {
  opacity: 1;
}
</style>

<template>
  <div
    class="p-6 rounded-2xl bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-lg border border-white/10 waves-exchange-card"
  >
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-xl font-bold flex items-center gap-2">
        <i class="iconfont icon-exchange text-purple-400"></i>
        音浪兑换VIP
      </h3>
      <el-tooltip content="使用签到获得的音浪兑换VIP时长" placement="top">
        <i class="iconfont icon-question text-gray-400 cursor-help"></i>
      </el-tooltip>
    </div>

    <div class="space-y-4">
      <div>
        <label class="block text-sm text-gray-400 mb-2">选择兑换时长</label>
        <el-select
          :model-value="exchangeDuration"
          placeholder="请选择"
          class="w-full"
          size="large"
          @change="handleDurationChange"
        >
          <el-option
            v-for="duration in exchangeOptions"
            :key="duration.value"
            :label="duration.label"
            :value="duration.value"
          >
            <div class="flex justify-between items-center w-full">
              <span>{{ duration.label }}</span>
              <span class="text-purple-400">{{ duration.waves }}音浪</span>
            </div>
          </el-option>
        </el-select>
      </div>

      <!-- 兑换信息 -->
      <div
        class="p-4 rounded-lg bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 exchange-info"
      >
        <div class="space-y-2">
          <div class="flex justify-between">
            <span class="text-gray-400">兑换时长</span>
            <span class="font-semibold">{{ selectedExchangeOption?.label || '请选择' }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-400">所需音浪</span>
            <span class="text-yellow-400 font-bold">{{ requiredWaves }}音浪</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-400">当前音浪</span>
            <span
              :class="[
                'font-bold',
                userData.waves >= requiredWaves ? 'text-green-400' : 'text-red-400',
              ]"
            >
              {{ userData.waves }}音浪
            </span>
          </div>
          <div v-if="requiredWaves > 0" class="flex justify-between">
            <span class="text-gray-400">兑换后剩余</span>
            <span class="font-semibold"> {{ userData.waves - requiredWaves }}音浪 </span>
          </div>
        </div>
      </div>

      <!-- 兑换按钮 -->
      <el-button
        class="w-full bg-gradient-to-r from-purple-500 to-blue-500 border-0 hover:opacity-90 transition-all duration-300 transform hover:-translate-y-0.5 exchange-button"
        :disabled="!exchangeDuration || userData.waves < requiredWaves"
        :loading="isExchanging"
        @click="handleExchange"
      >
        <template #loading>
          <i class="iconfont icon-loading animate-spin mr-2"></i>
          兑换中...
        </template>
        <template v-if="!isExchanging">
          <i class="iconfont icon-exchange mr-2"></i>
          {{ userData.waves < requiredWaves ? '音浪不足' : '确认兑换' }}
        </template>
      </el-button>

      <!-- 提示信息 -->
      <div class="text-xs text-gray-500 tips">
        <p class="flex items-center gap-1 mb-1">
          <i class="iconfont icon-check-circle text-green-400"></i>
          兑换后VIP时长将累加到当前VIP有效期
        </p>
        <p class="flex items-center gap-1 mb-1">
          <i class="iconfont icon-warning text-yellow-400"></i>
          音浪不可退还，请确认后再兑换
        </p>
        <p class="flex items-center gap-1">
          <i class="iconfont icon-gift text-purple-400"></i>
          每日签到可获得更多音浪
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { UserData, ExchangeOption } from '@/types/vip/vipExchange'

interface Props {
  userData: UserData
  exchangeOptions: ExchangeOption[]
  exchangeDuration: number | null
  requiredWaves: number
  isExchanging: boolean
}

interface Emits {
  (e: 'update:exchangeDuration', value: number | null): void
  (e: 'exchange'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const selectedExchangeOption = computed(() => {
  return props.exchangeOptions.find((opt) => opt.value === props.exchangeDuration)
})

const handleDurationChange = (value: number | null): void => {
  emit('update:exchangeDuration', value)
}

const handleExchange = (): void => {
  emit('exchange')
}
</script>

<style scoped>
/* 保持原有样式不变 */
.waves-exchange-card {
  position: relative;
  overflow: hidden;
}

.waves-exchange-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, #8b5cf6, #3b82f6, #8b5cf6);
  background-size: 200% 100%;
  animation: gradientFlow 3s linear infinite;
}

@keyframes gradientFlow {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.exchange-info {
  position: relative;
  overflow: hidden;
}

.exchange-info::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(45deg, transparent 30%, rgba(139, 92, 246, 0.1) 50%, transparent 70%);
  animation: infoShine 5s infinite linear;
}

@keyframes infoShine {
  0% {
    transform: translateX(-100%) translateY(-100%) rotate(45deg);
  }
  100% {
    transform: translateX(100%) translateY(100%) rotate(45deg);
  }
}

.exchange-button {
  position: relative;
  overflow: hidden;
}

.exchange-button::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    to bottom right,
    transparent 30%,
    rgba(255, 255, 255, 0.2) 50%,
    transparent 70%
  );
  transform: rotate(30deg);
  animation: buttonShimmer 2s infinite;
}

@keyframes buttonShimmer {
  0% {
    transform: translateX(-100%) translateY(-100%) rotate(30deg);
  }
  100% {
    transform: translateX(100%) translateY(100%) rotate(30deg);
  }
}

.tips p {
  transition: all 0.3s ease;
  padding: 2px 4px;
  border-radius: 4px;
}

.tips p:hover {
  background: rgba(255, 255, 255, 0.05);
  transform: translateX(5px);
}
</style>

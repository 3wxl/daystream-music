<template>
  <section class="animate-fade-in-up" :style="{ animationDelay: animationDelay }">
    <div
      class="bg-gray-800/50 backdrop-blur-xl border border-pink-400/20 rounded-2xl p-6 shadow-2xl shadow-pink-500/5 overflow-hidden relative"
    >
      <div class="absolute -top-20 -right-20 w-64 h-64 bg-pink-500/5 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-16 -left-16 w-48 h-48 bg-pink-400/5 rounded-full blur-3xl"></div>
      <div class="flex items-center justify-between mb-8 relative z-10">
        <div class="flex items-center gap-3">
          <div
            class="w-10 h-10 rounded-full bg-gradient-to-r from-pink-400/20 to-pink-500/20 flex items-center justify-center border border-pink-400/30"
          >
            <i class="iconfont icon-vip text-pink-300 text-lg" style="font-size: 28px">&#xe640;</i>
          </div>
          <div>
            <h2 class="text-xl font-bold text-white tracking-wider">VIP兑换进度</h2>
            <p class="text-xs text-gray-400 mt-1">消耗音浪兑换VIP特权</p>
          </div>
        </div>
        <div class="bg-gray-800/80 border border-gray-700/50 rounded-lg px-3 py-1.5">
          <span class="text-sm text-gray-300 font-medium">{{ currentCoins }}</span>
          <span class="text-xs text-gray-400 ml-1">音浪</span>
        </div>
      </div>
      <div class="mb-10 relative z-10 mx-3">
        <div class="relative h-2 bg-gray-800/80 rounded-full border border-gray-700/50 mb-8">
          <div
            class="absolute h-full bg-gradient-to-r from-pink-400 via-pink-500 to-pink-300 rounded-full transition-all duration-1000 ease-out"
            :style="{ width: Math.min(vipProgress, 100) + '%' }"
          >
            <div
              class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"
            ></div>
          </div>
          <div
            v-for="(target, index) in vipTargets"
            :key="index"
            class="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2"
            :style="{ left: (target.value / maxWaves) * 100 + '%' }"
          >
            <div
              class="w-6 h-6 rounded-full flex items-center justify-center transition-all duration-400 relative"
              :class="{
                'border-2 border-pink-400 bg-pink-500/20 scale-110': currentCoins >= target.value,
                'border-2 border-gray-600 bg-gray-800/80': currentCoins < target.value,
              }"
            >
              <div
                class="w-3 h-3 rounded-full transition-all duration-400 relative z-10"
                :class="
                  currentCoins >= target.value
                    ? 'bg-pink-400 animate-pulse scale-110'
                    : 'bg-gray-600'
                "
              ></div>
              <div
                v-if="currentCoins >= target.value"
                class="absolute inset-0 rounded-full bg-pink-400/20 animate-ping"
              ></div>
            </div>
            <div
              class="absolute -bottom-7 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-center"
            >
              <div
                class="text-xs font-medium px-1.5 py-0.5 rounded-md mb-0.5"
                :class="
                  currentCoins >= target.value
                    ? 'bg-pink-500/10 text-pink-300 border border-pink-400/20'
                    : 'bg-gray-800/80 text-gray-500 border border-gray-700/30'
                "
              >
                {{ target.value }}音浪
              </div>
              <div
                class="text-xs font-medium"
                :class="currentCoins >= target.value ? 'text-pink-400' : 'text-gray-600'"
              >
                {{ target.duration }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 relative z-10 mt-15">
        <div
          v-for="(target, index) in vipTargets"
          :key="index"
          class="text-center p-4 rounded-xl border transition-all duration-400 cursor-pointer group relative overflow-hidden"
          :class="{
            'bg-gradient-to-br from-pink-500/10 to-pink-400/5 border-pink-400/30 shadow-lg shadow-pink-500/10 hover:shadow-pink-500/20':
              currentCoins >= target.value,
            'bg-gradient-to-br from-gray-800/50 to-black/30 border-gray-700/50':
              currentCoins < target.value,
            'hover:border-pink-400/40 hover:bg-pink-500/5': currentCoins >= target.value,
            'hover:border-gray-600/80 hover:bg-gray-800/50': currentCoins < target.value,
          }"
          @click="handleRedeemTarget(target)"
        >
          <div v-if="currentCoins >= target.value" class="absolute top-0 right-0 w-12 h-12">
            <div
              class="absolute top-0 right-0 bg-pink-500/20 text-pink-300 text-[10px] font-bold px-1.5 py-0.5 rounded-bl-lg"
            >
              可兑换
            </div>
          </div>

          <div
            class="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 transition-all duration-400 group-hover:scale-110"
            :class="
              currentCoins >= target.value
                ? 'bg-gradient-to-r from-pink-300/20 to-pink-400/20 border border-pink-400/20'
                : 'bg-gray-800/50 border border-gray-700/30'
            "
          >
            <i
              class="iconfont icon-vip text-xl"
              :class="currentCoins >= target.value ? 'text-pink-300' : 'text-gray-500'"
              style="font-size: 25px"
              >&#xe649;</i
            >
          </div>
          <p
            class="text-sm font-semibold mb-1"
            :class="currentCoins >= target.value ? 'text-pink-300' : 'text-gray-400'"
          >
            {{ target.duration }}
          </p>
          <p
            class="text-xs mb-2"
            :class="currentCoins >= target.value ? 'text-pink-400' : 'text-gray-500'"
          >
            {{ target.value }} 音浪
          </p>
          <div class="mt-1">
            <span
              class="text-xs px-2 py-1 rounded-full transition-all duration-300"
              :class="
                currentCoins >= target.value
                  ? 'bg-pink-400/20 text-pink-300 border border-pink-400/20 hover:bg-pink-400/30'
                  : 'bg-gray-800 text-gray-500 border border-gray-700/30'
              "
            >
              {{ currentCoins >= target.value ? '立即兑换' : '音浪不足' }}
            </span>
          </div>
        </div>
      </div>
      <div
        class="mb-6 p-4 rounded-xl border relative z-10 overflow-hidden transition-all duration-400 hover:shadow-lg"
        :class="
          getBestSuggestion().canRedeem
            ? 'bg-gradient-to-r from-pink-500/10 to-pink-400/5 border-pink-400/20 hover:shadow-pink-500/10'
            : 'bg-gradient-to-r from-gray-800/50 to-gray-900/50 border-gray-700/50 hover:shadow-gray-800/20'
        "
      >
        <div
          class="absolute top-0 left-0 w-1 h-full"
          :class="
            getBestSuggestion().canRedeem
              ? 'bg-gradient-to-b from-pink-400 to-pink-300'
              : 'bg-gray-700'
          "
        ></div>

        <div class="flex items-center gap-3 relative z-10">
          <div
            class="w-10 h-10 rounded-full flex items-center justify-center"
            :class="
              getBestSuggestion().canRedeem
                ? 'bg-gradient-to-r from-pink-300/20 to-pink-400/20 border border-pink-400/20'
                : 'bg-gray-800/50 border border-gray-700/30'
            "
          >
            <i
              class="iconfont text-lg"
              :class="getBestSuggestion().canRedeem ? 'text-pink-300' : 'text-gray-500'"
              >&#xe646;</i
            >
          </div>
          <div class="flex-1 min-w-0">
            <p
              class="text-sm font-medium"
              :class="getBestSuggestion().canRedeem ? 'text-pink-300' : 'text-gray-400'"
            >
              {{ getBestSuggestion().title }}
            </p>
            <p class="text-xs text-gray-500 mt-0.5 truncate">
              {{ getBestSuggestion().description }}
            </p>
          </div>
          <button
            v-if="getBestSuggestion().canRedeem"
            @click="handleBestSuggestionClick"
            class="ml-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-400 bg-gradient-to-r from-pink-400 to-pink-500 hover:from-pink-500 hover:to-pink-400 text-white hover:shadow-[0_0_15px_rgba(244,114,182,0.4)] hover:scale-105 active:scale-95"
          >
            立即兑换
          </button>
        </div>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3 relative z-10">
        <div
          v-for="(privilege, index) in privileges"
          :key="index"
          class="text-center p-3 rounded-lg bg-gradient-to-br from-gray-800/50 to-black/30 hover:from-pink-500/10 hover:to-pink-400/10 border border-white/5 hover:border-pink-400/30 transition-all duration-400 cursor-pointer group hover:scale-[1.02] active:scale-[0.98]"
          @click="showPrivilegeDetail(privilege)"
        >
          <div
            class="w-10 h-10 rounded-full bg-gradient-to-r from-pink-300/10 to-pink-400/10 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform border border-pink-400/10"
          >
            <i
              class="iconfont text-pink-300 group-hover:text-pink-400 transition-colors"
              style="font-size: 18px"
              v-html="privilege.icon"
            ></i>
          </div>
          <p class="text-xs text-gray-300 group-hover:text-white transition-colors font-medium">
            {{ privilege.title }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { VipPrivilege } from '@/types/checkIn/index.ts'

interface Props {
  currentCoins: number
  privileges: VipPrivilege[]
  animationDelay?: string
}

interface VipTarget {
  value: number
  duration: string
  label: string
  days: number
}

const props = withDefaults(defineProps<Props>(), {
  animationDelay: '0.1s',
})

const emit = defineEmits<{
  'show-privilege': [privilege: VipPrivilege]
  'redeem-vip': [target: VipTarget]
}>()

const router = useRouter()
const vipTargets: VipTarget[] = [
  { value: 1, duration: '7天VIP', label: '体验会员', days: 7 },
  { value: 25, duration: '30天VIP', label: '月度会员', days: 30 },
  { value: 68, duration: '90天VIP', label: '季度会员', days: 90 },
  { value: 198, duration: '365天VIP', label: '年度会员', days: 365 },
]
const maxWaves = 200
const currentTargetIndex = computed(() => {
  for (let i = vipTargets.length - 1; i >= 0; i--) {
    const target = vipTargets[i]
    if (target && props.currentCoins >= target.value) {
      return i
    }
  }
  return -1
})

const canRedeemAny = computed(() => {
  return currentTargetIndex.value >= 0
})

const getCurrentTarget = () => {
  const index = currentTargetIndex.value
  if (index >= 0 && index < vipTargets.length && vipTargets[index]) {
    return vipTargets[index].value
  }
  return vipTargets[0]?.value ?? 0
}

const remainingCoins = computed(() => {
  const currentIndex = currentTargetIndex.value
  if (currentIndex >= 0 && currentIndex < vipTargets.length - 1) {
    const nextTarget = vipTargets[currentIndex + 1]
    if (nextTarget) {
      return Math.max(0, nextTarget.value - props.currentCoins)
    }
  }
  // 如果已经是最后一个目标或无下一目标，则返回0
  return 0
})

const vipProgress = computed(() => {
  if (props.currentCoins >= maxWaves) {
    return 100
  }
  return (props.currentCoins / maxWaves) * 100
})
const handleBestSuggestionClick = () => {
  const suggestion = getBestSuggestion()
  if (suggestion.target) {
    handleRedeemTarget(suggestion.target)
  }
}
const getBestSuggestion = () => {
  const index = currentTargetIndex.value
  if (index >= 0 && index < vipTargets.length && vipTargets[index]) {
    const target = vipTargets[index]
    return {
      title: `可兑换${target.duration}`,
      description: `消耗${target.value}音浪，享受${target.duration}特权`,
      canRedeem: true,
      target,
    }
  }

  const nextTarget = vipTargets[0]
  let neededCoins = 0 // 修改为 let 并初始化默认值
  if (nextTarget) {
    neededCoins = nextTarget.value - props.currentCoins
  }

  return {
    title: `还差${neededCoins}音浪`,
    description: `获取${neededCoins}音浪即可兑换${nextTarget?.duration || ''}`,
    canRedeem: false,
    target: nextTarget,
  }
}
const handleRedeemTarget = (target: VipTarget) => {
  if (props.currentCoins >= target.value) {
    emit('redeem-vip', target)
    router.push({
      path: '/VipExchangePage',
      query: {
        targetValue: target.value.toString(),
        duration: target.duration,
        days: target.days.toString(),
        waves: props.currentCoins.toString(),
      },
    })
  }
}

const showPrivilegeDetail = (privilege: VipPrivilege) => {
  emit('show-privilege', privilege)
}
</script>

<style scoped>
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes shimmer {
  0% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(100%);
  }
}
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.1);
  }
}
@keyframes ping {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  75%,
  100% {
    transform: scale(2);
    opacity: 0;
  }
}
.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out forwards;
}

.animate-shimmer {
  animation: shimmer 2s infinite linear;
}

.animate-pulse {
  animation: pulse 2s ease-in-out infinite;
}

.animate-ping {
  animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
}
@media (max-width: 768px) {
  .text-xl {
    font-size: 1.125rem;
  }

  .grid-cols-4 {
    grid-template-columns: repeat(2, 1fr);
  }

  .p-6 {
    padding: 1.25rem;
  }

  .p-4 {
    padding: 0.75rem;
  }

  .w-12 {
    width: 10rem;
    height: 10rem;
  }
}

@media (max-width: 480px) {
  .grid-cols-2 {
    grid-template-columns: 1fr;
  }

  .flex {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .ml-auto,
  .ml-2 {
    margin-left: 0;
    width: 100%;
  }

  .w-10 {
    width: 8rem;
    height: 8rem;
  }

  .mb-8 {
    margin-bottom: 1.5rem;
  }

  .mb-6 {
    margin-bottom: 1rem;
  }
}
</style>

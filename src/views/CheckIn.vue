<template>
  <div class="min-h-screen bg-gray-900 text-gray-100 font-sans px-4 py-6">
    <main class="max-w-6xl mx-auto space-y-6">
      <!-- 音浪概览 -->
      <section class="animate-fade-in-up">
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
              </div>
            </div>

            <!-- 签到按钮 -->
            <div class="flex flex-col items-center gap-2">
              <div
                class="checkin-button"
                :class="{ 'opacity-50 cursor-not-allowed': hasCheckedIn }"
                @click="checkIn"
              >
                <i class="iconfont text-2xl" style="font-size: 35px">&#xe608;</i>
              </div>
              <p class="text-sm" :class="hasCheckedIn ? 'text-green-400' : 'text-gray-400'">
                {{ hasCheckedIn ? '今日已签到' : '点击签到' }}
              </p>
            </div>

            <!-- 连续签到 -->
            <div class="text-center">
              <p class="text-gray-400 text-sm">连续签到</p>
              <h3 class="text-2xl font-bold text-white">
                {{ consecutiveDays }} <span class="text-lg text-pink-400">天</span>
              </h3>
              <p class="text-xs text-gray-500">明日可得 {{ nextDayCoins }} 音浪</p>
            </div>
          </div>
        </div>
      </section>

      <!-- VIP兑换进度 -->
      <section class="animate-fade-in-up" style="animation-delay: 0.1s">
        <div
          class="bg-gray-800/50 backdrop-blur-md border border-gray-700/50 rounded-2xl p-6 shadow-2xl"
        >
          <div class="flex items-center justify-between mb-4">
            <h2
              class="text-xl font-bold bg-gradient-to-r from-pink-500 to-pink-300 bg-clip-text text-transparent"
            >
              VIP兑换进度
            </h2>
            <span class="text-sm text-gray-400"
              >{{ currentCoins }} / {{ vipRequirement }} 音浪</span
            >
          </div>

          <!-- 进度条 -->
          <div class="mb-4">
            <div class="h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                class="h-full bg-gradient-to-r from-pink-500 to-pink-300 rounded-full transition-all duration-500"
                :style="{ width: vipProgress + '%' }"
              ></div>
            </div>
            <div class="flex justify-between text-xs text-gray-400 mt-2">
              <span>还差 {{ remainingCoins }} 音浪</span>
              <span>{{ vipProgress.toFixed(1) }}%</span>
            </div>
          </div>

          <!-- VIP兑换按钮 -->
          <button
            class="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-pink-300 text-white font-semibold flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/25 mb-4"
            :class="{ 'opacity-50 cursor-not-allowed': !canRedeemVip }"
            @click="redeemVip"
            :disabled="!canRedeemVip"
          >
            <i class="iconfont" style="font-size: 22px; margin-top: 1px">&#xe60d;</i>
            <span>{{ canRedeemVip ? '立即兑换VIP会员' : '音浪不足，无法兑换' }}</span>
          </button>

          <!-- VIP特权说明 -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div class="text-center p-3 rounded-lg bg-pink-500/10">
              <i class="iconfont text-pink-400 mb-1" style="font-size: 20px">&#xe6e0;</i>
              <p class="text-xs text-gray-300">无损音质</p>
            </div>
            <div class="text-center p-3 rounded-lg bg-pink-500/10">
              <i class="iconfont text-pink-400 mb-1" style="font-size: 20px">&#xe648;</i>
              <p class="text-xs text-gray-300">免费下载</p>
            </div>
            <div class="text-center p-3 rounded-lg bg-pink-500/10">
              <i class="iconfont text-pink-400 mb-1" style="font-size: 20px">&#xe617;</i>
              <p class="text-xs text-gray-300">专属音效</p>
            </div>
            <div class="text-center p-3 rounded-lg bg-pink-500/10">
              <i class="iconfont text-pink-400 mb-1" style="font-size: 20px">&#xe640;</i>
              <p class="text-xs text-gray-300">专属标识</p>
            </div>
          </div>
        </div>
      </section>

      <!-- 任务中心 -->
      <section class="animate-fade-in-up" style="animation-delay: 0.2s">
        <div class="mb-4">
          <h2
            class="text-xl font-bold bg-gradient-to-r from-pink-500 to-pink-300 bg-clip-text text-transparent mb-2"
          >
            任务中心
          </h2>
          <p class="text-gray-400 text-sm">完成任务获取更多音浪</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <!-- 任务卡片 -->
          <div
            v-for="task in tasks"
            :key="task.id"
            class="bg-gray-800 border border-gray-700 rounded-xl p-4 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-pink-500/10 relative"
            :class="{ 'opacity-70': task.completed, 'neon-border': !task.completed }"
            @click="completeTask(task)"
          >
            <div class="flex items-start justify-between mb-4">
              <div class="flex items-start gap-3 flex-1">
                <div
                  class="w-10 h-10 rounded-lg flex items-center justify-center"
                  :class="
                    task.completed
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-pink-500/20 text-pink-400'
                  "
                >
                  <i class="iconfont" v-html="task.icon" style="font-size: 20px"></i>
                </div>
                <div class="flex-1 min-w-0">
                  <h3 class="font-semibold text-white text-sm mb-1">{{ task.title }}</h3>
                  <p class="text-gray-400 text-xs">{{ task.description }}</p>
                </div>
              </div>

              <div
                class="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold"
                :class="
                  task.completed ? 'bg-green-500/20 text-green-400' : 'bg-pink-500/20 text-pink-400'
                "
              >
                <span>+{{ task.reward }}</span>
                <i class="fas fa-music text-xs"></i>
              </div>
            </div>

            <button
              class="w-full py-2 rounded-lg text-sm font-medium transition-all duration-300"
              :class="
                task.completed
                  ? 'bg-gray-700 text-gray-400 cursor-default'
                  : 'bg-gradient-to-r from-pink-500 to-pink-300 text-white hover:shadow-lg hover:shadow-pink-500/25'
              "
              :disabled="task.completed"
            >
              {{ task.completed ? '已完成' : '立即完成' }}
            </button>
          </div>
        </div>
      </section>

      <!-- 音浪记录 -->
      <section class="animate-fade-in-up" style="animation-delay: 0.3s">
        <h2
          class="text-xl font-bold bg-gradient-to-r from-pink-500 to-pink-300 bg-clip-text text-transparent mb-4"
        >
          音浪记录
        </h2>

        <div
          class="bg-gray-800/50 backdrop-blur-md border border-gray-700/50 rounded-xl p-4 max-h-80 overflow-y-auto custom-scrollbar"
        >
          <div
            v-for="record in coinRecords"
            :key="record.id"
            class="flex items-center justify-between py-3 border-b border-gray-700/50 last:border-b-0"
          >
            <div class="flex items-center gap-3">
              <div
                class="w-8 h-8 rounded-full flex items-center justify-center"
                :class="
                  record.type === 'earn'
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-pink-400/20 text-pink-300'
                "
              >
                <i class="iconfont" style="font-size: 18px" v-html="record.icon"></i>
              </div>
              <div>
                <h4 class="font-medium text-white text-sm">{{ record.title }}</h4>
                <p class="text-gray-400 text-xs">{{ record.time }}</p>
              </div>
            </div>

            <div
              class="font-semibold"
              :class="record.type === 'earn' ? 'text-green-400' : 'text-pink-300'"
            >
              {{ record.type === 'earn' ? '+' : '-' }}{{ record.amount }}
              <i class="iconfont">&#xe6ac;</i>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// 响应式数据
const currentCoins = ref(300)
const consecutiveDays = ref(7)
const hasCheckedIn = ref(false)
const nextDayCoins = ref(15)
const vipRequirement = ref(500)

// 任务数据
const tasks = ref([
  {
    id: 1,
    title: '完善个人信息',
    description: '补充您的个人资料',
    icon: '&#xe618;',
    reward: 30,
    completed: true,
  },
  {
    id: 2,
    title: '更换头像',
    description: '上传个性化头像',
    icon: '&#xe60e;',
    reward: 20,
    completed: false,
  },
  {
    id: 3,
    title: '绑定手机号',
    description: '绑定手机号保障账户安全',
    icon: '&#xe60c;',
    reward: 50,
    completed: false,
  },
  {
    id: 4,
    title: '每日听歌',
    description: '累计听歌30分钟',
    icon: '&#xe617;',
    reward: 10,
    completed: false,
  },
  {
    id: 5,
    title: '分享歌曲',
    description: '分享歌曲给好友',
    icon: '&#xe64f;',
    reward: 15,
    completed: true,
  },
  {
    id: 6,
    title: '创建歌单',
    description: '创建您的第一个歌单',
    icon: '&#xe619;',
    reward: 25,
    completed: false,
  },
])

// 音浪记录
const coinRecords = ref([
  {
    id: 1,
    title: '每日签到',
    time: '2023-11-15 09:30',
    amount: 10,
    type: 'earn',
    icon: '&#xe608;',
  },
  {
    id: 2,
    title: '完善个人信息',
    time: '2023-11-14 14:20',
    amount: 30,
    type: 'earn',
    icon: '&#xe618;',
  },
  {
    id: 3,
    title: '分享歌曲',
    time: '2023-11-13 16:45',
    amount: 15,
    type: 'earn',
    icon: '&#xe64f;',
  },
  {
    id: 4,
    title: '连续签到奖励',
    time: '2023-11-12 10:15',
    amount: 25,
    type: 'earn',
    icon: '&#xe68e;',
  },
  {
    id: 5,
    title: 'VIP兑换',
    time: '2023-10-28 11:30',
    amount: 500,
    type: 'spend',
    icon: '&#xe640;',
  },
])

// 计算属性
const vipProgress = computed(() => {
  return (currentCoins.value / vipRequirement.value) * 100
})

const remainingCoins = computed(() => {
  return vipRequirement.value - currentCoins.value
})

const canRedeemVip = computed(() => {
  return currentCoins.value >= vipRequirement.value
})

// 方法
const checkIn = () => {
  if (hasCheckedIn.value) return

  // 模拟签到过程
  hasCheckedIn.value = true
  currentCoins.value += 10
  consecutiveDays.value += 1

  // 添加记录
  coinRecords.value.unshift({
    id: Date.now(),
    title: '每日签到',
    time: new Date().toLocaleString(),
    amount: 10,
    type: 'earn',
    icon: 'fas fa-calendar-check',
  })

  // 模拟API调用
  console.log('签到成功！获得10音浪')
}

const completeTask = (task) => {
  if (task.completed) return

  // 模拟完成任务
  task.completed = true
  currentCoins.value += task.reward

  // 添加记录
  coinRecords.value.unshift({
    id: Date.now(),
    title: task.title,
    time: new Date().toLocaleString(),
    amount: task.reward,
    type: 'earn',
    icon: task.icon,
  })

  // 模拟API调用
  console.log(`完成任务: ${task.title}，获得${task.reward}音浪`)
}

const redeemVip = () => {
  if (!canRedeemVip.value) return

  // 模拟兑换VIP
  currentCoins.value -= vipRequirement.value

  // 添加记录
  coinRecords.value.unshift({
    id: Date.now(),
    title: 'VIP兑换',
    time: new Date().toLocaleString(),
    amount: vipRequirement.value,
    type: 'spend',
    icon: 'fas fa-crown',
  })

  // 模拟API调用
  console.log('成功兑换VIP会员！')

  // 这里可以添加兑换成功后的逻辑，比如显示成功提示、跳转页面等
  alert('恭喜您成功兑换VIP会员！')
}

// 初始化
onMounted(() => {
  // 这里可以添加初始化逻辑，比如检查今日是否已签到
  console.log('音浪签到页面加载完成')
})
</script>

<style scoped>
/* 动画效果 */
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

@keyframes pulse-glow {
  0%,
  100% {
    box-shadow: 0 0 5px rgba(236, 72, 153, 0.3);
  }
  50% {
    box-shadow: 0 0 20px rgba(236, 72, 153, 0.6);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out forwards;
}

.animate-pulse-glow {
  animation: pulse-glow 2s infinite;
}

/* 音浪硬币样式 */
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
  box-shadow: 0 4px 12px rgba(251, 191, 36, 0.4);
  position: relative;
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
}

/* 签到按钮样式 */
.checkin-button {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ec4899, #f472b6);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 6px 16px rgba(236, 72, 153, 0.4);
  position: relative;
  overflow: hidden;
}

.checkin-button::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  transform: rotate(45deg);
  transition: all 0.5s ease;
}

.checkin-button:hover:not(.opacity-50) {
  transform: scale(1.05);
  box-shadow: 0 8px 20px rgba(236, 72, 153, 0.6);
}

.checkin-button:hover:not(.opacity-50)::before {
  transform: rotate(45deg) translate(50%, 50%);
}

/* 霓虹边框效果 */
.neon-border {
  position: relative;
}

.neon-border::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 0.75rem;
  padding: 2px;
  background: linear-gradient(135deg, #ec4899, #f472b6, #ec4899);
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.neon-border:hover::before {
  opacity: 1;
}

/* 自定义滚动条 */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(236, 72, 153, 0.3);
  border-radius: 3px;
  transition: all 0.3s ease;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(236, 72, 153, 0.5);
}
</style>

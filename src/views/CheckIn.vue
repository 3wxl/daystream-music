<template>
  <div class="min-h-screen bg-gray-900 text-gray-100 font-sans px-4 py-6">
    <main class="max-w-6xl mx-auto space-y-6">
      <!-- 音浪概览 -->
      <CoinOverview
        :current-coins="userData.currentWaves"
        :consecutive-days="userData.continuousDays"
        :has-checked-in="userData.isCheckedIn"
        :next-day-coins="userData.tomorrowSignInReward"
        :loading="loading"
        @checkin="handleCheckIn"
      />

      <!-- VIP兑换进度 -->
      <VipProgress
        :current-coins="userData.currentWaves"
        :vip-requirement="vipRequirement"
        :can-redeem-vip="canRedeemVip"
        :privileges="vipPrivileges"
        @redeem="handleRedeemVip"
        @show-privilege="showPrivilegeDetail"
      />

      <!-- 任务中心 -->
      <TaskCenter :tasks="tasks" @complete-task="handleCompleteTask" />

      <!-- 音浪记录 -->
      <CoinRecords :records="coinRecords" @show-record="showRecordDetail" />
    </main>

    <!-- VIP特权详情弹窗 -->
    <el-dialog
      v-model="showPrivilegeDialog"
      title="VIP特权详情"
      width="500px"
      class="vip-detail-dialog"
      style="background-color: #101828"
    >
      <div v-if="selectedPrivilege" class="p-4 bg-gray-900">
        <!-- 头部 -->
        <div class="flex items-center gap-3 mb-6">
          <div
            class="w-12 h-12 rounded-lg bg-gradient-to-br from-pink-400 to-pink-500 flex items-center justify-center"
          >
            <i class="iconfont text-2xl text-white" v-html="selectedPrivilege.icon"></i>
          </div>
          <div>
            <h3 class="text-xl font-bold text-pink-300">{{ selectedPrivilege.title }}</h3>
            <div class="flex items-center gap-2 mt-1">
              <span
                class="text-xs px-2 py-0.5 bg-pink-900/50 text-pink-300 rounded-full border border-pink-700/50"
              >
                VIP专属
              </span>
              <span class="text-xs text-gray-400">特权详情</span>
            </div>
          </div>
        </div>

        <!-- 内容 -->
        <div class="space-y-4">
          <!-- 特权介绍 -->
          <!-- <div class="bg-black/40 p-4 rounded-lg border border-gray-800">
            <h4 class="text-sm font-semibold text-pink-400 mb-2">特权介绍</h4>
            <p class="text-gray-300 text-sm leading-relaxed">
              这里是关于 {{ selectedPrivilege.title }} 的详细介绍，为您提供更优质的音乐体验。
            </p>
          </div> -->

          <!-- 特权特点 -->
          <div class="bg-black/40 p-4 rounded-lg border border-gray-800">
            <h4 class="text-sm font-semibold text-pink-400 mb-3">特权特点</h4>
            <ul class="space-y-2">
              <li
                v-for="(feature, index) in ['独家音乐资源', '高清音质体验', '专属客服支持']"
                :key="index"
                class="flex items-start gap-2"
              >
                <i class="iconfont text-pink-500 text-sm mt-0.5">&#xe611;</i>
                <span class="text-gray-300 text-sm">{{ feature }}</span>
              </li>
            </ul>
          </div>

          <!-- 使用说明 -->
          <div class="bg-black/40 p-4 rounded-lg border border-gray-800">
            <h4 class="text-sm font-semibold text-pink-400 mb-3">使用说明</h4>
            <div class="text-gray-300 text-sm space-y-1">
              <p>· 本特权仅限VIP会员使用</p>
              <p>· 特权有效期内可无限次使用</p>
              <p>· 如遇问题请联系客服</p>
            </div>
          </div>
        </div>

        <!-- 底部按钮 -->
        <!-- <div class="mt-6 pt-4 border-t border-gray-800 flex justify-end gap-3">
          <el-button
            class="px-4 py-2 text-sm bg-gray-800 hover:bg-gray-700 text-gray-300 border-gray-700 hover:border-gray-600"
            @click="showPrivilegeDialog = false"
          >
            关闭
          </el-button>
        </div> -->
      </div>
    </el-dialog>

    <!-- 音浪记录详情弹窗 -->
    <el-dialog
      v-model="showRecordDialog"
      title="记录详情"
      width="400px"
      class="record-detail-dialog"
    >
      <div v-if="selectedRecord" class="p-4">
        <div class="space-y-3">
          <div>
            <p class="text-gray-400 text-sm">类型</p>
            <p class="text-white">{{ selectedRecord.type === 'earn' ? '获得' : '消耗' }}</p>
          </div>
          <div>
            <p class="text-gray-400 text-sm">金额</p>
            <p :class="selectedRecord.type === 'earn' ? 'text-green-400' : 'text-pink-300'">
              {{ selectedRecord.type === 'earn' ? '+' : '-' }}{{ selectedRecord.amount }} 音浪
            </p>
          </div>
          <div>
            <p class="text-gray-400 text-sm">时间</p>
            <p class="text-white">{{ selectedRecord.time }}</p>
          </div>
        </div>
      </div>
    </el-dialog>

    <!-- 加载中遮罩 -->
    <div v-if="loading" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="flex flex-col items-center gap-3">
        <i class="iconfont icon-loading text-3xl text-pink-400 animate-spin"></i>
        <p class="text-white">加载中...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { useCheckInStore } from '@/stores/checkIn'
import type { Task, CoinRecord, VipPrivilege, Data, BaseResponse } from '@/types/checkIn/index.ts'

// 使用签到 store
const checkInStore = useCheckInStore()

// 用户数据 - 直接使用 store 中的响应式数据
const userData = computed(() => ({
  currentWaves: checkInStore.currentWaves,
  continuousDays: checkInStore.continuousDays,
  isCheckedIn: checkInStore.isCheckedIn,
  tomorrowSignInReward: checkInStore.tomorrowSignInReward,
  monthCheckInDays: checkInStore.monthCheckInDays,
}))

// 响应式数据
const vipRequirement = ref(500)
const loading = ref(false)

// 弹窗控制
const showPrivilegeDialog = ref(false)
const showRecordDialog = ref(false)
const selectedPrivilege = ref<VipPrivilege | null>(null)
const selectedRecord = ref<CoinRecord | null>(null)

// 计算属性
const vipProgress = computed(() => {
  return (userData.value.currentWaves / vipRequirement.value) * 100
})

const remainingCoins = computed(() => {
  return vipRequirement.value - userData.value.currentWaves
})

const canRedeemVip = computed(() => {
  return userData.value.currentWaves >= vipRequirement.value
})

// VIP特权数据
const vipPrivileges = ref<VipPrivilege[]>([
  { icon: '&#xe6e0;', title: '无损音质' },
  { icon: '&#xe648;', title: '免费下载' },
  { icon: '&#xe617;', title: '专属音效' },
  { icon: '&#xe640;', title: '专属标识' },
])

// 任务数据
const tasks = ref<Task[]>([
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

// 音浪记录数据
const coinRecords = ref<CoinRecord[]>([
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

// 监听用户数据变化
watch(
  () => checkInStore.currentWaves,
  (newWaves, oldWaves) => {
    // 当音浪变化时，可以触发一些效果
    if (newWaves > oldWaves) {
      // 音浪增加的效果
      console.log(`音浪增加：${oldWaves} → ${newWaves}`)
    }
  },
)

// 方法
const handleCheckIn = async () => {
  // 这里不需要实际调用，因为子组件已经调用了 store 的方法
  console.log('父组件收到签到事件')
}

// 父组件中
// 父组件中的事件处理
const handleCheckInSuccess = (result: BaseResponse<string>) => {
  console.log('签到成功回调:', result)

  // 添加签到记录到本地列表
  coinRecords.value.unshift({
    id: Date.now(),
    title: '每日签到',
    time: new Date().toLocaleString(),
    amount: 10, // 这里需要根据实际奖励设置，可以从其他接口获取
    type: 'earn',
    icon: '&#xe608;',
  })

  // 显示消息
  ElMessage.success(result.data || '签到成功！')
}
const handleCheckInError = (error: Error) => {
  console.error('签到失败回调:', error)
  ElMessage.error(error.message || '签到失败')
}

const handleRedeemVip = () => {
  if (!canRedeemVip.value) {
    ElMessage.warning('音浪不足，无法兑换VIP')
    return
  }

  try {
    // 模拟VIP兑换逻辑
    // 注意：这里应该调用 store 的方法来更新音浪
    // 暂时直接更新，实际应该调用 API

    // 添加兑换记录
    coinRecords.value.unshift({
      id: Date.now(),
      title: 'VIP兑换',
      time: new Date().toLocaleString(),
      amount: vipRequirement.value,
      type: 'spend',
      icon: '&#xe640;',
    })

    ElMessage.success('恭喜您成功兑换VIP会员！')

    // 这里可以调用实际的VIP兑换API
    // await vipExchangeAPI.redeem(vipRequirement.value)
  } catch (error) {
    console.error('VIP兑换失败:', error)
    ElMessage.error('兑换失败，请稍后重试')
  }
}

const handleCompleteTask = (task: Task) => {
  if (task.completed) return

  task.completed = true
  // 这里应该调用 API 完成任务并获取奖励
  // 暂时直接更新音浪
  checkInStore.currentWaves += task.reward

  coinRecords.value.unshift({
    id: Date.now(),
    title: task.title,
    time: new Date().toLocaleString(),
    amount: task.reward,
    type: 'earn',
    icon: task.icon,
  })

  ElMessage.success(`完成任务: ${task.title}，获得${task.reward}音浪`)
}

const showPrivilegeDetail = (privilege: VipPrivilege) => {
  selectedPrivilege.value = privilege
  showPrivilegeDialog.value = true
}

const showRecordDetail = (record: CoinRecord) => {
  selectedRecord.value = record
  showRecordDialog.value = true
}

// 加载用户签到状态
const loadUserStatus = async () => {
  loading.value = true
  try {
    await checkInStore.loadCheckInStatus()
  } catch (error) {
    console.error('加载用户状态失败:', error)
    ElMessage.error('加载数据失败，请刷新重试')
  } finally {
    loading.value = false
  }
}

// 初始化
onMounted(() => {
  // 加载用户状态
  loadUserStatus()

  // 设置定时检查签到状态（每分钟检查一次）
  setInterval(() => {
    const now = new Date()
    // 如果是新的一天（00:00），刷新签到状态
    if (now.getHours() === 0 && now.getMinutes() === 0) {
      checkInStore.loadCheckInStatus()
    }
  }, 60000)
})
</script>

<style scoped>
/* 全局动画 */
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

.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out forwards;
}

/* 弹窗样式 */
.vip-detail-dialog :deep(.el-dialog) {
  background: linear-gradient(135deg, #111827, #1f2937);
  border: 1px solid rgba(236, 72, 153, 0.2);
  border-radius: 1rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.vip-detail-dialog :deep(.el-dialog__header) {
  border-bottom: 1px solid rgba(236, 72, 153, 0.1);
  color: white;
  padding: 20px 24px;
}

.vip-detail-dialog :deep(.el-dialog__title) {
  color: white;
  font-weight: 600;
}

.record-detail-dialog :deep(.el-dialog) {
  background: linear-gradient(135deg, #111827, #1f2937);
  border: 1px solid rgba(236, 72, 153, 0.2);
  border-radius: 1rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.record-detail-dialog :deep(.el-dialog__header) {
  border-bottom: 1px solid rgba(236, 72, 153, 0.1);
  color: white;
  padding: 20px 24px;
}

.record-detail-dialog :deep(.el-dialog__title) {
  color: white;
  font-weight: 600;
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
:deep(.vip-detail-dialog .el-dialog) {
  background: #111827;
  border: 1px solid rgba(244, 114, 182, 0.2);
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(244, 114, 182, 0.1);
}

:deep(.vip-detail-dialog .el-dialog__header) {
  background: linear-gradient(90deg, rgba(17, 24, 39, 0.9) 0%, rgba(45, 0, 35, 0.9) 100%);
  border-bottom: 1px solid rgba(244, 114, 182, 0.2);
  padding: 16px 20px;
  margin: 0;
  border-radius: 12px 12px 0 0;
}

:deep(.vip-detail-dialog .el-dialog__title) {
  color: #f9a8d4;
  font-weight: bold;
  font-size: 16px;
}

:deep(.vip-detail-dialog .el-dialog__headerbtn) {
  top: 16px;
  right: 20px;
}

:deep(.vip-detail-dialog .el-dialog__headerbtn .el-dialog__close) {
  color: #f472b6;
  font-size: 18px;
}

:deep(.vip-detail-dialog .el-dialog__headerbtn:hover .el-dialog__close) {
  color: #f9a8d4;
}

/* 按钮样式覆盖 */
:deep(.el-button) {
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s ease;
}

:deep(.el-button:hover) {
  transform: translateY(-1px);
}
</style>

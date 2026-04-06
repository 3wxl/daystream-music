<template>
  <div class="min-h-screen bg-gray-900 text-gray-100 font-sans px-4 py-6">
    <main class="mx-auto space-y-6 px-10">
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
      <TaskCenter :tasks="tasks" @complete-task="handleTaskClick" />
    </main>

    <!-- VIP特权详情弹窗 -->
    <div class="dialog-wrapper">
      <el-dialog
        v-model="showPrivilegeDialog"
        title="VIP特权详情"
        width="500px"
        class="vip-detail-dialog"
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
        </div>
      </el-dialog>
    </div>
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
import { ref, computed, onMounted, watch, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter, useRoute } from 'vue-router'
import { useCheckInStore } from '@/stores/checkIn'
import { getUserInfo } from '@/api/personalCenter'
import { getUserTaskList, claimTaskReward } from '@/api/checkIn'
import type {
  Task,
  CoinRecord,
  VipPrivilege,
  BaseResponse,
  UserTaskVO,
} from '@/types/checkIn/index.ts'
import type { UserInfoVO } from '@/types/personalCenter'

// ========== 核心变量定义（修复：补全缺失变量、统一初始化） ==========
const router = useRouter()
const route = useRoute()
const checkInStore = useCheckInStore()

// 用户信息响应式数据
const userInfo = ref<UserInfoVO>({
  isVip: false,
  playCount: 0,
  createdCount: 0,
  followCount: 0,
  fansCount: 0,
  likeCount: 0,
  onlineStatus: 0,
  userRole: '普通用户',
  likePlaylistId: '',
  username: '', // 补全缺失字段
  introduction: '', // 补全缺失字段
  avatar: '', // 补全缺失字段
  phone: '', // 补全缺失字段
})

// 响应式数据（修复：统一初始化，避免未定义）
const vipRequirement = ref(500)
const loading = ref(false)
const showPrivilegeDialog = ref(false)
const showRecordDialog = ref(false)
const selectedPrivilege = ref<VipPrivilege | null>(null)
const selectedRecord = ref<CoinRecord | null>(null)

// VIP特权数据
const vipPrivileges = ref<VipPrivilege[]>([
  { icon: '&#xe6e0;', title: '无损音质' },
  { icon: '&#xe648;', title: '免费下载' },
  { icon: '&#xe617;', title: '专属音效' },
  { icon: '&#xe640;', title: '专属标识' },
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

// 任务ID到图标的映射
const taskIconMap: Record<number, string> = {
  1: '&#xe618;', // 完善个人信息
  2: '&#xe60e;', // 更换头像
  3: '&#xe60c;', // 绑定手机号
  4: '&#xe617;', // 每日听歌
  5: '&#xe649;', // 兑换会员
  6: '&#xe619;', // 创建歌单
}

// 任务ID到跳转路径的映射
const taskTargetPathMap: Record<number, string> = {
  1: '/user/personal-center', // 完善个人信息
  2: '/profile/edit', // 更换头像
  3: '/user/personal-center', // 绑定手机号
  4: '/', // 每日听歌
  5: '/vip-exchange-page', // 兑换会员
  6: '/user/personal-center', // 创建歌单
}

// // 任务ID到任务Key的映射
// const taskKeyMap: Record<number, string> = {
//   1: 'complete_profile', // 完善个人信息
//   2: '/user/personal-center', // 更换头像
//   3: 'bind_phone', // 绑定手机号
//   4: 'daily_listen', // 每日听歌
//   5: 'redeem_membership', // 兑换会员
//   6: 'create_playlist', // 创建歌单
// }

// 任务列表（修复：补全Task类型缺失字段，优化校验逻辑）
const tasks = ref<Task[]>([])

// ========== 计算属性（修复：统一定义，避免分散） ==========
const userData = computed(() => ({
  currentWaves: checkInStore.currentWaves,
  continuousDays: checkInStore.continuousDays,
  isCheckedIn: checkInStore.isCheckedIn,
  tomorrowSignInReward: checkInStore.tomorrowSignInReward,
  monthCheckInDays: checkInStore.monthCheckInDays,
}))

const vipProgress = computed(() => {
  return (userData.value.currentWaves / vipRequirement.value) * 100
})

const remainingCoins = computed(() => {
  return vipRequirement.value - userData.value.currentWaves
})

const canRedeemVip = computed(() => {
  return userData.value.currentWaves >= vipRequirement.value
})

// ========== 核心方法（修复：去重、优化路由监听、补全逻辑） ==========
/**
 * 加载用户信息并校验任务状态
 */
const loadAndValidateTasks = async () => {
  loading.value = true
  try {
    // 调用用户信息接口并更新本地数据
    const userRes = await getUserInfo()
    console.log('用户信息接口返回数据:', userRes)
    if (userRes && userRes.data) {
      userInfo.value = { ...userInfo.value, ...userRes.data }
    }

    // 调用获取用户任务列表接口
    const taskRes = await getUserTaskList(1) // 暂时获取第1页，每页10条
    console.log('用户任务列表接口返回数据:', taskRes)

    if (taskRes && taskRes.success && taskRes.data?.records) {
      // 将后端返回的UserTaskVO转换为前端展示的Task类型
      const backendTasks = taskRes.data.records
      const frontendTasks: Task[] = backendTasks.map((userTask: UserTaskVO) => {
        // 获取用户信息来校验任务状态
        const isCompleted = userTask.taskStatus >= 1 // 1=已完成，2=已领奖
        const rewardClaimed = isCompleted && !!userTask.rewardGetTime
        console.log(rewardClaimed)
        return {
          id: userTask.taskId,
          title: userTask.taskName,
          description: userTask.taskDesc,
          icon: taskIconMap[userTask.taskId] || '&#xe618;', // 默认图标
          reward: userTask.reward,
          completed: isCompleted,
          rewardClaimed: rewardClaimed,
          targetPath: taskTargetPathMap[userTask.taskId] || '/',
          taskStatus: userTask.taskStatus,
          rewardGetTime: userTask.rewardGetTime,
          // validate: (info) => {
          //   // 根据不同任务类型进行校验
          //   switch (userTask.taskId) {
          //     case 1: // 完善个人信息
          //       return !!info.username && !!info.introduction
          //     case 2: // 更换头像
          //       return !!info.avatar
          //     case 3: // 绑定手机号
          //       return !!info.phone
          //     case 4: // 每日听歌
          //       return info.playCount >= 10
          //     case 5: // 兑换会员
          //       return !!info.isVip
          //     case 6: // 创建歌单
          //       return info.createdCount >= 1
          //     default:
          //       return false
          //   }
          // },
        }
      })

      tasks.value = frontendTasks
    }
  } catch (error) {
    console.error('加载用户信息并校验任务失败:', error)
    ElMessage.error('加载任务状态失败')
  } finally {
    loading.value = false
  }
}

const claimReward = async (task: Task) => {
  if (!task.completed || task.rewardClaimed) return // 未完成/已领取则返回

  loading.value = true
  try {
    const res = await claimTaskReward(task.id) // 调用领取奖励接口
    if (res && res.success) {
      // 1. 更新任务状态：标记为已领取
      const taskIndex = tasks.value.findIndex((t) => t.id === task.id)
      if (taskIndex > -1) {
        tasks.value[taskIndex]!.rewardClaimed = true
        tasks.value[taskIndex]!.rewardGetTime = new Date().toISOString() // 本地临时赋值，实际以接口返回为准
      }

      // 2. 更新音浪数和音浪记录
      checkInStore.currentWaves += task.reward
      coinRecords.value.unshift({
        id: Date.now(),
        title: `领取${task.title}奖励`,
        time: new Date().toLocaleString(),
        amount: task.reward,
        type: 'earn',
        icon: task.icon,
      })

      ElMessage.success(`成功领取${task.reward}音浪！`)
    } else {
      ElMessage.error(res?.errorMsg || '领取奖励失败')
    }
  } catch (error) {
    console.error('领取任务奖励失败:', error)
    ElMessage.error('领取奖励失败，请稍后重试')
  } finally {
    loading.value = false
  }
}
/**
 * 加载用户签到状态
 */
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

/**
 * 任务点击处理（跳转+返回刷新）
 */
const handleTaskClick = (task: Task) => {
  if (task.completed) {
    if (!task.rewardClaimed) {
      // 已完成但未领取 → 调用领取奖励
      claimReward(task)
    }
    return // 已领取则无操作
  }

  // 未完成 → 跳转任务页面
  const targetPath = task.targetPath
  const currentPath = route.fullPath

  const unWatch = watch(
    () => route.fullPath,
    (newPath) => {
      if (newPath === currentPath) {
        loadAndValidateTasks() // 返回后刷新任务状态
        unWatch()
      }
    },
    { once: true },
  )

  router.push(targetPath).catch((err) => {
    console.error('跳转任务页面失败:', err)
    unWatch()
  })
}

/**
 * 完成任务并发放奖励
 */
const completeTaskAndReward = async (task: Task) => {
  if (task.completed) return

  try {
    task.completed = true
    task.taskStatus = 1 // 更新任务状态为已完成
    checkInStore.currentWaves += task.reward
    // 添加音浪记录
    coinRecords.value.unshift({
      id: Date.now(),
      title: task.title,
      time: new Date().toLocaleString(),
      amount: task.reward,
      type: 'earn',
      icon: task.icon,
    })
    ElMessage.success(`完成任务: ${task.title}，获得${task.reward}音浪`)
    // }
  } catch (error) {
    console.error('完成任务失败:', error)
    ElMessage.error('领取奖励失败，请稍后重试')
  }
}

/**
 * 签到处理
 */
const handleCheckIn = async () => {
  try {
    const result = await checkInStore.doCheckIn()
    if (result?.success) {
      handleCheckInSuccess(result)
    }
  } catch (error) {
    handleCheckInError(error as Error)
  }
}

/**
 * 签到成功回调
 */
const handleCheckInSuccess = (result: BaseResponse<string>) => {
  console.log('签到成功回调:', result)
  // 添加签到记录
  coinRecords.value.unshift({
    id: Date.now(),
    title: '每日签到',
    time: new Date().toLocaleString(),
    amount: 10,
    type: 'earn',
    icon: '&#xe608;',
  })
  ElMessage.success(result.data || '签到成功！')
}

/**
 * 签到失败回调
 */
const handleCheckInError = (error: Error) => {
  console.error('签到失败回调:', error)
  ElMessage.error(error.message || '签到失败')
}

/**
 * 兑换VIP处理
 */
const handleRedeemVip = () => {
  if (!canRedeemVip.value) {
    ElMessage.warning('音浪不足，无法兑换VIP')
    return
  }

  try {
    // 添加兑换记录
    coinRecords.value.unshift({
      id: Date.now(),
      title: 'VIP兑换',
      time: new Date().toLocaleString(),
      amount: vipRequirement.value,
      type: 'spend',
      icon: '&#xe640;',
    })
    // 扣除音浪
    checkInStore.currentWaves -= vipRequirement.value
    ElMessage.success('恭喜您成功兑换VIP会员！')
  } catch (error) {
    console.error('VIP兑换失败:', error)
    ElMessage.error('兑换失败，请稍后重试')
  }
}

/**
 * 显示VIP特权详情
 */
const showPrivilegeDetail = (privilege: VipPrivilege) => {
  selectedPrivilege.value = privilege
  showPrivilegeDialog.value = true
}

/**
 * 显示音浪记录详情
 */
const showRecordDetail = (record: CoinRecord) => {
  selectedRecord.value = record
  showRecordDialog.value = true
}

// ========== 生命周期（修复：去重onMounted，优化定时器） ==========
let checkInTimer: number | null = null

onMounted(async () => {
  // 并行加载用户状态和任务状态，提升性能
  await Promise.all([loadUserStatus(), loadAndValidateTasks()])

  // 设置定时检查签到状态（优化：使用精准定时器，避免内存泄漏）
  checkInTimer = window.setInterval(() => {
    const now = new Date()
    if (now.getHours() === 0 && now.getMinutes() === 0) {
      checkInStore.loadCheckInStatus()
      loadAndValidateTasks() // 每日刷新任务状态
    }
  }, 60000)
})

// 组件卸载时清理定时器，避免内存泄漏
onUnmounted(() => {
  if (checkInTimer) {
    clearInterval(checkInTimer)
  }
})

// 监听音浪变化（可选：用于触发动画/提示）
watch(
  () => checkInStore.currentWaves,
  (newWaves, oldWaves) => {
    if (newWaves > oldWaves) {
      console.log(`音浪增加：${oldWaves} → ${newWaves}`)
    }
  },
)
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

.dialog-wrapper :deep(.el-dialog) {
  --el-dialog-bg-color: transparent; /* 浅红色背景 */
}
/* 可选：覆盖弹窗内容区的默认 padding 和背景（如果需要） */
.vip-detail-dialog :deep(.el-dialog__body) {
  padding: 0; /* 去掉默认 padding，避免和你自定义的 p-4 冲突 */
  background: transparent;
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
  background: linear-gradient(90deg, rgba(17, 24, 39, 0.449) 0%, rgba(45, 0, 35, 0.592) 100%);
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

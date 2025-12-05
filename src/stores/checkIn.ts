import { checkIn, getCheckInStatus } from '@/api/checkIn'
import { defineStore } from 'pinia'
import type { BaseResponse, CheckInStatusVO } from '@/types/checkIn'

export const useCheckInStore = defineStore('checkIn', () => {
  // === 状态定义 ===
  const currentWaves = ref<number>(0)
  const continuousDays = ref<number>(0)
  const monthCheckInDays = ref<number>(0)
  const isCheckedIn = ref<boolean>(false)
  const tomorrowSignInReward = ref<number>(0)
  const loading = ref<boolean>(false)
  const checkInLoading = ref<boolean>(false)

  const lastCheckInResult = ref<BaseResponse<string> | null>(null)
  const lastCheckInTime = ref<string | null>(null)

  // === 计算属性 ===
  const canCheckIn = computed<boolean>(() => {
    return !isCheckedIn.value && !checkInLoading.value && !loading.value
  })

  const checkInButtonText = computed<string>(() => {
    if (checkInLoading.value) return '签到中...'
    if (isCheckedIn.value) return '已签到'
    return '立即签到'
  })

  const checkInButtonStatus = computed<{
    disabled: boolean
    loading: boolean
    type: 'success' | 'warning' | 'default'
  }>(() => {
    if (isCheckedIn.value) {
      return { disabled: true, loading: false, type: 'success' }
    }
    if (checkInLoading.value) {
      return { disabled: true, loading: true, type: 'warning' }
    }
    return { disabled: false, loading: false, type: 'default' }
  })

  const todayDate = computed<string>(() => {
    const date = new Date()
    return date.toISOString().split('T')[0] ?? ''
  })

  // === 方法 ===
  const loadCheckInStatus = async (): Promise<void> => {
    if (loading.value) return
    loading.value = true

    try {
      // 直接获取 BaseResponse<CheckInStatusVO>
      const response = await getCheckInStatus()

      if (response.success && response.data) {
        const statusData = response.data
        currentWaves.value = statusData.currentWaves || 0
        continuousDays.value = statusData.continuousDays || 0
        monthCheckInDays.value = statusData.monthCheckInDays || 0
        isCheckedIn.value = statusData.checkedIn || false // 注意字段名
        tomorrowSignInReward.value = statusData.tomorrowSignInReward || 0
        console.log(response)
        localStorage.setItem(
          'checkIn_status',
          JSON.stringify({
            lastCheckDate: todayDate.value,
            isCheckedIn: isCheckedIn.value,
            currentWaves: currentWaves.value,
          }),
        )
      } else {
        console.error('加载签到状态失败:', response.errorMsg)
        throw new Error(response.errorMsg || '加载签到状态失败')
      }
    } catch (error: any) {
      console.error('请求签到状态失败:', error)
      if (error.code === 'ERR_NETWORK') {
        const localStatus = localStorage.getItem('checkIn_status')
        if (localStatus) {
          const status = JSON.parse(localStatus)
          if (status.lastCheckDate !== todayDate.value) {
            isCheckedIn.value = false
          }
        }
      }
      throw error
    } finally {
      loading.value = false
    }
  }

  const doCheckIn = async (): Promise<BaseResponse<string> | null> => {
    // 前端预检查
    if (isCheckedIn.value) {
      ElMessage.warning('今天已经签到过了')
      return null
    }

    checkInLoading.value = true

    try {
      // 直接获取 BaseResponse<string>
      const response = await checkIn()
      console.log(response)
      if (response.success) {
        const responseMsg = response.data || ''
        lastCheckInResult.value = response
        lastCheckInTime.value = new Date().toISOString()

        // 根据后端消息判断
        if (responseMsg.includes('已签到') || responseMsg.includes('明日再来')) {
          // 已签到过的情况
          isCheckedIn.value = true
          ElMessage.info(responseMsg)
        } else if (responseMsg.includes('成功')) {
          // 签到成功的情况
          isCheckedIn.value = true
          // 重新获取最新状态
          await loadCheckInStatus()
          ElMessage.success(responseMsg)
        } else {
          // 其他成功消息
          isCheckedIn.value = true
          ElMessage.success(responseMsg)
        }

        localStorage.setItem(
          'checkIn_status',
          JSON.stringify({
            lastCheckDate: todayDate.value,
            isCheckedIn: true,
            lastCheckInTime: lastCheckInTime.value,
          }),
        )

        return response
      } else {
        console.error('签到失败:', response.errorMsg)
        ElMessage.error(response.errorMsg || '签到失败')
        throw new Error(response.errorMsg || '签到失败')
      }
    } catch (error: any) {
      console.error('签到请求失败:', error)

      // 检查是否是已签到的错误（虽然API返回success:true，但可能被catch到）
      if (
        error.response?.data?.data?.includes?.('已签到') ||
        error.response?.data?.data?.includes?.('明日再来')
      ) {
        isCheckedIn.value = true
        ElMessage.warning(error.response.data.data)
      } else if (error.response) {
        ElMessage.error(error.response.data?.errorMsg || '签到失败')
      } else if (error.request) {
        ElMessage.error('网络错误，请检查网络连接')
      } else {
        ElMessage.error('签到失败，请稍后重试')
      }
      throw error
    } finally {
      checkInLoading.value = false
    }
  }

  const getCheckInPreview = computed(() => {
    return {
      description: `连续签到 ${continuousDays.value} 天`,
    }
  })

  const getUserStatusSummary = computed(() => {
    return {
      currentWaves: currentWaves.value,
      continuousDays: continuousDays.value,
      monthCheckInDays: monthCheckInDays.value,
      isCheckedIn: isCheckedIn.value,
      canCheckIn: canCheckIn.value,
      tomorrowSignInReward: tomorrowSignInReward.value,
    }
  })

  const reset = (): void => {
    currentWaves.value = 0
    continuousDays.value = 0
    monthCheckInDays.value = 0
    isCheckedIn.value = false
    loading.value = false
    checkInLoading.value = false
    lastCheckInResult.value = null
    lastCheckInTime.value = null
    localStorage.removeItem('checkIn_status')
  }

  const initialize = async (): Promise<void> => {
    try {
      await loadCheckInStatus()
    } catch (error) {
      console.error('初始化签到状态失败:', error)
    }
  }

  // 初始化
  initialize()

  return {
    // 状态
    currentWaves,
    continuousDays,
    monthCheckInDays,
    isCheckedIn,
    loading,
    checkInLoading,
    lastCheckInResult,
    lastCheckInTime,
    tomorrowSignInReward,

    // 计算属性
    canCheckIn,
    checkInButtonText,
    checkInButtonStatus,
    todayDate,
    getCheckInPreview,
    getUserStatusSummary,

    // 方法
    loadCheckInStatus,
    doCheckIn,
    reset,
    initialize,
  }
})

export type CheckInStore = ReturnType<typeof useCheckInStore>

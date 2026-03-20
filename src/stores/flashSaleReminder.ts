import { defineStore } from 'pinia'
import { ref, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getUpcomingSeckill } from '@/api/vip'
import type { UpcomingFlashSale } from '@/types/vip/vipExchange'

export const useFlashSaleReminderStore = defineStore(
  'flashSaleReminder',
  () => {
    // 已设置提醒的活动ID集合
    const reminders = ref<Set<string>>(new Set())
    // 定时器ID
    let checkTimer: number | null = null
    // 检查间隔（毫秒）
    const CHECK_INTERVAL = 5000 // 5秒检查一次

    // 从localStorage加载已保存的提醒
    const loadReminders = () => {
      try {
        const savedReminders = localStorage.getItem('flashSaleReminders')
        if (savedReminders) {
          const parsed = JSON.parse(savedReminders)
          // 确保始终是Set对象
          if (Array.isArray(parsed)) {
            reminders.value = new Set(parsed)
          } else {
            reminders.value = new Set()
          }
        } else {
          reminders.value = new Set()
        }
      } catch (error) {
        // 出错时重置为Set对象
        reminders.value = new Set()
      }
    }

    // 保存提醒到localStorage
    const saveReminders = () => {
      try {
        const remindersArray = [...reminders.value]
        localStorage.setItem('flashSaleReminders', JSON.stringify(remindersArray))
      } catch (error) {
        // 静默处理保存错误
      }
    }

    // 设置提醒
    const setReminder = (saleId: string, saleTitle?: string) => {
      try {
        // 确保reminders是Set对象
        if (!(reminders.value instanceof Set)) {
          reminders.value = new Set()
        }
        reminders.value.add(saleId)
        saveReminders()
        ElMessage.success(`已设置提醒，活动开始前将通知您！`)
      } catch (error) {
        ElMessage.error('设置提醒失败，请稍后重试')
      }
    }

    // 取消提醒
    const removeReminder = (saleId: string) => {
      try {
        // 确保reminders是Set对象
        if (!(reminders.value instanceof Set)) {
          reminders.value = new Set()
          return
        }
        reminders.value.delete(saleId)
        saveReminders()
        ElMessage.info(`已取消提醒！`)
      } catch (error) {
        ElMessage.error('取消提醒失败，请稍后重试')
      }
    }

    // 检查是否已设置提醒
    const isReminded = (saleId: string) => {
      try {
        // 确保reminders是Set对象
        if (!(reminders.value instanceof Set)) {
          reminders.value = new Set()
          return false
        }
        return reminders.value.has(saleId)
      } catch (error) {
        return false
      }
    }

    // 切换提醒状态
    const toggleReminder = (sale: UpcomingFlashSale) => {
      try {
        if (isReminded(sale.id)) {
          removeReminder(sale.id)
        } else {
          setReminder(sale.id, sale.title)
        }
      } catch (error) {
        ElMessage.error('操作失败，请稍后重试')
      }
    }

    // 检查活动是否开始
    const checkUpcomingSales = async () => {
      try {
        // 确保reminders是Set类型
        if (!reminders.value || !(reminders.value instanceof Set)) {
          reminders.value = new Set()
          return
        }

        const reminderIds = Array.from(reminders.value)

        // 如果没有设置提醒，跳过检查
        if (reminderIds.length === 0) {
          return
        }

        // 获取即将开始的秒杀活动
        const response = await getUpcomingSeckill(1, 100) // 获取足够多的活动

        // 检查API响应格式
        if (!response) {
          return
        }

        if (!response.success) {
          return
        }

        if (!response.data) {
          return
        }

        // 处理不同的数据结构
        let records = []
        if (Array.isArray(response.data)) {
          records = response.data
        } else if (Array.isArray(response.data.records)) {
          records = response.data.records
        } // 根据实际返回结构调整，假设 PageRespSeckillActivityVO 包含 records 字段
        else if ('records' in response.data && Array.isArray(response.data.records)) {
          records = response.data.records
        } else {
          return
        }

        if (records.length === 0) {
          return
        }

        const now = new Date()
        const startedSales: UpcomingFlashSale[] = []

        // 检查哪些活动已经开始
        records.forEach((record) => {
          try {
            if (!record || typeof record !== 'object') {
              return
            }

            // 提取活动ID - 同时支持id和activityId
            const saleId = record.id?.toString() || record.activityId?.toString() || ''
            if (!saleId) {
              return
            }

            // 检查用户是否设置了这个活动的提醒
            if (!reminderIds.includes(saleId)) {
              return
            }

            // 检查开始时间
            let startTime
            if (record.startTime) {
              if (typeof record.startTime === 'string') {
                startTime = new Date(record.startTime)
              } else if (typeof record.startTime === 'number') {
                startTime = new Date(record.startTime)
              } else {
                return
              }
            } else {
              return
            }

            if (startTime <= now) {
              // 活动已经开始
              // 构造符合类型定义的活动对象
              const sale: UpcomingFlashSale = {
                id: saleId,
                title: record.activityName || record.title || '未知活动',
                subtitle: record.message || record.subtitle || '',
                originalPrice: record.originalPrice || 0,
                flashPrice: record.seckillPrice || record.flashPrice || 0,
                total: record.totalStock || record.total || 0,
                sold:
                  record.totalStock && record.remainingStock
                    ? record.totalStock - record.remainingStock
                    : 0,
                remaining: record.remainingStock || 0,
                timeLeft: 0,
                startTime: record.startTime,
                unit: '音浪',
              }

              startedSales.push(sale)
            }
          } catch (error) {
            // 静默处理单个活动错误
          }
        })

        // 发送通知并移除提醒
        if (startedSales.length > 0) {
          startedSales.forEach((sale) => {
            try {
              // 确保DOM已就绪
              if (document && document.body) {
                // 使用Element Plus的消息提示
                ElMessage({
                  message: `活动 "${sale.title}" 已经开始！`,
                  type: 'success',
                  duration: 5000,
                  showClose: true,
                })
              } else {
                // 降级方案：使用浏览器原生通知
                if (Notification.permission === 'granted') {
                  new Notification('秒杀活动开始', {
                    body: `活动 "${sale.title}" 已经开始！`,
                    icon: '/favicon.ico',
                  })
                }
              }

              // 移除已开始活动的提醒
              reminders.value.delete(sale.id)
            } catch (error) {
              // 异常情况下仍移除提醒，避免重复检查
              reminders.value.delete(sale.id)
            }
          })

          // 保存更新后的提醒列表
          saveReminders()
        }
      } catch (error) {
        // 添加错误重试机制
        setTimeout(() => {
          checkUpcomingSales()
        }, CHECK_INTERVAL * 2)
      }
    }

    // 开始定期检查
    const startChecking = () => {
      if (!checkTimer) {
        checkTimer = window.setInterval(() => {
          checkUpcomingSales()
        }, CHECK_INTERVAL)
      }
    }

    // 停止定期检查
    const stopChecking = () => {
      if (checkTimer) {
        clearInterval(checkTimer)
        checkTimer = null
      }
    }

    const initReminderService = () => {
      try {
        loadReminders()
        startChecking()
      } catch (error) {
        // 静默处理初始化错误
      }
    }

    // 新增：销毁方法（仅在应用关闭时调用，非组件卸载）
    const destroyReminderService = () => {
      stopChecking()
    }

    return {
      reminders,
      setReminder,
      removeReminder,
      isReminded,
      toggleReminder,
      startChecking,
      stopChecking,
      initReminderService,
      destroyReminderService,
    }
  },
  {
    // 使用pinia-plugin-persistedstate进行持久化
    persist: {
      key: 'flashSaleReminders',
      storage: localStorage,
    },
  },
)

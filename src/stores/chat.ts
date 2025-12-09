import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useUserStore } from './user'

export const useChatStore = defineStore('chat', () => {
  const ws = ref<WebSocket | null>(null)
  const onlineUserIds = ref<string[]>([])

  const connect = () => {
    const userStore = useUserStore()
    // 登录才连接
    if (!userStore.token) return

    // 如果已经连接，先断开
    if (ws.value) {
      disconnect()
    }

    const wsUrl = `ws://39.96.214.163:8080/chat?token=${userStore.token}`
    ws.value = new WebSocket(wsUrl)

    ws.value.onopen = () => {
      console.log('websoket连接成功')
      startHeartbeat() //启动心跳
    }

    ws.value.onclose = () => {
      console.log('连接断开')
      stopHeartbeat()
    }
  }

  const disconnect = () => {
    if (ws.value) {
      ws.value.close()
      ws.value = null
    }
    stopHeartbeat()
  }

  // 心跳逻辑
  let heartbeatTimer: any = null
  const startHeartbeat = () => {
    heartbeatTimer = setInterval(() => {
      if (ws.value?.readyState === WebSocket.OPEN) {
        ws.value.send(
          JSON.stringify({
            system: true,
            message: 'ping',
            fromUser: useUserStore().userInfo.id,
            toUser: null,
          }),
        )
      }
    }, 20000)
  }

  const stopHeartbeat = () => {
    if (heartbeatTimer) {
      clearInterval(heartbeatTimer)
      heartbeatTimer = null
    }
  }

  // ...处理消息逻辑...

  return { connect, disconnect }
})

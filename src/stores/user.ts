import { LoginByemail } from '@/api/auth/Login'
import { getUserInfo } from '@/api/home/getUserInfo'
import { getToken, removeToken, setToken } from '@/utils/request'
import { defineStore } from 'pinia'
import { useChatStore } from './chat'

export const useUserStore = defineStore(
  'user',
  () => {
    const token = ref(getToken() || '')
    const userInfo = ref<any>({})

    const login = async (loginForm: any) => {
      const res = await LoginByemail(loginForm)
      console.log('登录响应:', res)

      const accessToken = res.data?.token

      if (accessToken) {
        // 务必先更新 localStorage，因为 request.ts 依赖它
        setToken(accessToken)
        token.value = accessToken
        console.log('Token 已更新:', accessToken)
        await getUsersInfo()
      } else {
        console.error('登录成功但 Token 解析失败', res)
      }

      const chatStore = useChatStore()
      chatStore.connect()

      return res
    }

    const getUsersInfo = async () => {
      try {
        const res = await getUserInfo()
        console.log('用户信息:', res.data)
        userInfo.value = res.data
      } catch (error) {
        logout()
        console.log(error)
      }
    }

    const logout = () => {
      token.value = ''
      userInfo.value = {}
      removeToken()
      const chatStore = useChatStore()
      chatStore.disconnect()
    }

    return {
      token,
      userInfo,
      login,
      logout,
      getUsersInfo,
    }
  },
  {
    persist: true,
  },
)

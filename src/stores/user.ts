import { LoginByemail } from '@/api/Auth/Login'
import { getUserInfo } from '@/api/Home/getUserInfo'
import { getToken, removeToken, setToken } from '@/utils/request'
import { defineStore } from 'pinia'

export const useUserStore = defineStore(
  'user',
  () => {
    const token = ref(getToken() || '')
    const userInfo = ref<any>({})

    const login = async (loginForm: any) => {
      const res = await LoginByemail(loginForm)
      console.log('登录响应:', res)

<<<<<<< HEAD
      const accessToken = res.data?.token
=======
      // 兼容不同的 Token 返回结构
      let accessToken = res.data?.token
      if (!accessToken && typeof res.data === 'string') {
        accessToken = res.data
      } else if (!accessToken && (res as any).token) {
        accessToken = (res as any).token
      }
>>>>>>> 7290f7b8f25730b7d63b4ce73de0e81e3c3c1789

      if (accessToken) {
        // 务必先更新 localStorage，因为 request.ts 依赖它
        setToken(accessToken)
        token.value = accessToken
        console.log('Token 已更新:', accessToken)
<<<<<<< HEAD
        await getUsersInfo()
=======
        try {
          await getUsersInfo()
        } catch (e) {
          console.error('获取用户信息失败:', e)
        }
>>>>>>> 7290f7b8f25730b7d63b4ce73de0e81e3c3c1789
      } else {
        console.error('登录成功但 Token 解析失败', res)
      }

      return res
    }

    const getUsersInfo = async () => {
      try {
        const res = await getUserInfo()
        console.log('用户信息:', res.data)
        userInfo.value = res.data
      } catch (error) {
<<<<<<< HEAD
        // logout()
        console.log(error)
=======
        // logout() 
        console.error('获取用户信息出错:', error)
>>>>>>> 7290f7b8f25730b7d63b4ce73de0e81e3c3c1789
      }
    }

    const logout = () => {
      token.value = ''
      userInfo.value = {}
      removeToken()
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

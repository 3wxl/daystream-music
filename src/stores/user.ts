import { LoginByemail } from '@/api/Auth/Login'
import { getToken, removeToken, setToken } from '@/utils/request'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const token = ref(getToken() || '')
  const userInfo = ref<any>({})

  const login = async (loginForm: any) => {
    const res = await LoginByemail(loginForm)
    const headers = res.headers || {}

    const newToken = headers['authorization'] || headers['Authorization']
    const isRefreshed = headers['token-refreshed'] || headers['Token-Refreshed']

    let accessToken = ''

    if (isRefreshed && newToken) {
      accessToken = newToken
    } else {
      accessToken = res.data.token
    }

    if (accessToken) {
      removeToken()
      token.value = accessToken
      setToken(accessToken)
      // userInfo.value = res.data.userInfo
    } else {
      console.warn('登录成功但未获取到 Token')
    }

    return res
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
  }
})

import { LoginByemail } from '@/api/Auth/Login'
import { getToken, setToken, removeToken } from '@/utils/request'
import {defineStore} from 'pinia'

export const useUserStore =defineStore('user',() => {

  const token = ref(getToken() || '')
  const userInfo = ref([])

  const login = async (loginForm: any) => {
    LoginByemail(loginForm).then((res) => {
      const newToken = res.headers.get('Authorization')
      const isRefreshed = res.headers.get('Token-Refreshed')
      if (isRefreshed) {
        token.value = newToken
        setToken(newToken)
        return res
      }else{
         const accessToken = res.data.token
         if (accessToken) {
           token.value = accessToken
           setToken(accessToken)
         }
         return res
      }
    })
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

import { LoginByemail } from '@/api/Auth/Login'
import { getToken, setToken, removeToken } from '@/utils/request'
import {defineStore} from 'pinia'

export const useUserStore =defineStore('user',() => {

  const token = ref(getToken() || '')
  const userInfo = ref([])

  const login = async (loginForm: any) => {
        // 调用登录api(
        const res = await LoginByemail(loginForm)
        // 拿到数据存一下
        const accessToken = res.data.token
        // 把toekn数据赋值给token 存pinia
        token.value = accessToken
        // 存本地
        setToken(accessToken)
        //结果返回去，让组件进行跳转
        return
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

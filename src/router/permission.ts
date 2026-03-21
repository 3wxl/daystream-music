import { useUserStore } from '@/stores/user'
import { getToken, setToken } from '@/utils/request'
import router from './index'
import { getQQLoginCallback } from '@/api/auth'
import { ElMessage } from 'element-plus'

const whiteList = ['UserAuth']

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  
  // 拦截 QQ 回调的 code (自己去换取 Token)
  if (to.query.code && to.query.state) {
    try {
      ElMessage.info('正在验证授权信息...')
      const res = await getQQLoginCallback(to.query.code as string, to.query.state as string)
      // 根据接口定义，获取到的字符串/对象作为 token
      const accessToken = typeof res.data === 'string' ? res.data : (res.data as any)?.token
      
      if (accessToken) {
        setToken(accessToken)
        userStore.token = accessToken
        console.log('QQ授权成功，Token已获取')
        await userStore.getUsersInfo().catch((err) => {
          console.error('获取用户信息失败', err)
        })
      }
    } catch (err: any) {
      console.error('获取QQ登录Token失败', err)
      ElMessage.error(err.message || 'QQ登录验证失败')
    }

    // 清除地址栏的 code 和 state 并重定向到首页
    const newQuery = { ...to.query }
    delete newQuery.code
    delete newQuery.state
    next({ path: '/', query: newQuery, replace: true })
    return
  }

  // 2. 兼容之前的后端直接发 Token 拦截逻辑
  if (to.query.token) {
    const accessToken = to.query.token as string
    setToken(accessToken)
    userStore.token = accessToken
    console.log('第三方登录成功')
    await userStore.getUsersInfo().catch((err) => {
      console.error('获取用户信息失败', err)
    })

    // 重定向到主页
    const newQuery = { ...to.query }
    delete newQuery.token
    next({ path: '/', query: newQuery, replace: true })
    return
  }
  const hasToken = getToken()

  if (hasToken) {
    if (to.name === 'UserAuth') {
      next({ path: '/' })
    } else {
      if (Object.keys(userStore.userInfo).length > 0) {
        next()
      } else {
        try {
          await userStore.getUsersInfo()
          next({ ...to, replace: true })
        } catch (error) {
          console.error('Token失效或获取用户信息失败', error)
          next('/UserAuth')
        }
      }
    }
  } else {
    if (whiteList.includes(to.name as string)) {
      next()
    } else {
      next('/UserAuth')
    }
  }
})

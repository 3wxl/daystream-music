import { useUserStore } from '@/stores/user'
import { getToken, setToken } from '@/utils/request' 
import router from './index'

const whiteList = ['UserAuth']

router.beforeEach(async (to, from, next) => {
  
  const userStore = useUserStore()
  // 拦截QQ回调的token
  if(to.query.token){
    const accessToken = to.query.token as string
    setToken(accessToken)
    userStore.token = accessToken
    console.log('第三方登录成功')
    await userStore.getUsersInfo().catch((err) => {
      console.error('获取用户信息失败',err)
    })

    // 重定向
    const newQuery ={...to.query}
    delete newQuery.token
    next({ path: to.path,query:newQuery,replace:true})
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
  }
  else {
    if (whiteList.includes(to.name as string)) {
      next()
    } else {
      next('/UserAuth')
    }
  }
})

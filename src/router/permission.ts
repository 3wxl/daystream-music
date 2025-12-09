import { useUserStore } from '@/stores/user'
import { getToken } from '@/utils/request'
import router from './index'

const whiteList = ['UserAuth']

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
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

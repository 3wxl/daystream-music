import { useUserStore } from '@/stores/user'
import { getToken } from '@/utils/request'
import router from './index'

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  const hasToken = getToken()

  if (hasToken) {
    if (Object.keys(userStore.userInfo).length === 0) {
      try {
        await userStore.getUsersInfo()
        next()
      } catch (error) {
        console.log(error)
        next('/UserAuth')
      }
    } else {
      next()
    }
  } else {
    // 没 token
    if (to.meta.requiresAuth) {
      next('/UserAuth')
    } else {
      next()
    }
  }
})

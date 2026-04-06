import { useRouter } from 'vue-router'
import { getOtherUserInfo } from '@/api/personalCenter' // 你给的接口

// 跳转到他人主页（自动判断身份）
export function useGoToUserPage() {
  const router = useRouter()

  const goToUserPage = async (userId: number) => {
    if (!userId) return

    try {
      // 调用你后端给的接口：获取他人信息 + 角色
      const res = await getOtherUserInfo({ userId })
      console.log(`获取他人信息成功：`, res.data)
      const user = res.data

      // 验证用户数据
      if (!user || !user.id) {
        console.error('获取用户信息失败：用户数据不完整')
        return
      }
      console.log('用户身份：', user.id)
      // ✅ 自动判断身份，跳对应页面（自动路由）
      if (user.userRole === '音乐人') {
        router.push({
          path: '/user/musician-center',
          query: {
            userId: user.id,
          },
        })
      } else {
        console.log(`用户${user.id}是普通用户`)
        router.push({
          path: '/user/personal-center',
          query: {
            userId: user.id,
          },
        })
      }
    } catch (error) {
      console.error('跳转到用户页面失败：', error)
    }
  }

  return { goToUserPage }
}

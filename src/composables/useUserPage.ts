import { useRouter } from 'vue-router'
import { getOtherUserInfo } from '@/api/personalCenter' // 你给的接口

// 跳转到他人主页（自动判断身份）
export function useGoToUserPage() {
  const router = useRouter()

  const goToUserPage = async (userId: number) => {
    if (!userId) return

    // 调用你后端给的接口：获取他人信息 + 角色
    const res = await getOtherUserInfo({ userId })
    const user = res.data

    // ✅ 自动判断身份，跳对应页面（自动路由）
    if (user.userRole === '音乐人') {
      router.push({
        path: `/user/musician-center?userId=${userId}`,
      })
    } else {
      router.push({
        path: `/user/personal-center?userId=${userId}`,
      })
    }
  }

  return { goToUserPage }
}

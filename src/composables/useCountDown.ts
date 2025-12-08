import {getEmailCaptcha} from '@/api/auth/Register'
import type { FormInstance } from 'element-plus'

// 验证码逻辑
interface EmailForm {
  email: string
  [key: string]: any
}

export const countdown = ref(0)

export const handleGetCode = async (formData: EmailForm, formRef: FormInstance | undefined) => {
  // 1.防抖处理，不可重复获取
  if (countdown.value > 0) return

  // 2.检验表单
  if (!formRef) return

  try {
    // 4.单独校验email格式
    await formRef.validateField('email')
    // 5.调用验证码接口
    await getEmailCaptcha(formData.email)
    ElMessage.success('验证码已发送')

    // 6.倒计时逻辑
    countdown.value = 60

    const timer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        clearInterval(timer)
      }
    }, 1000)
  } catch (error) {
    console.log(error, '校验失败，或者验证码发送不成功')
  }
}

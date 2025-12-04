import type { RegisterForm } from '@/types/Auth/register'
import request from '@/utils/request'

// 注册用户
export function registerUser(data: RegisterForm) {
  return request('/rejester/insertUser', 'post', data as any, { noToken: true })
}

// 获取验证码
export function getEmailCaptcha(toEmail: string) {
  return request(
    '/rejester/getEmailCaptcha',
    'get',
    {
      toEmail,
    },
    { timeout: 20000, noToken: true },
  )
}

import type { LoginForm } from '@/types/Auth/login'
import request from '@/utils/request'

export interface CaptchaResult {
  captchaBase64Image: string
  captchaUUId: string
}

export function getCaptcha() {
  return request<CaptchaResult>('/login/getCaptcha', 'get')
}

export interface LoginResult {
  token: string
}

export function LoginByemail(data: LoginForm) {
  return request<LoginResult>('/login/loginByemail', 'post', data as any)
}

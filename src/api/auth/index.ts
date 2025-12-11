import type { ForgotForm, LoginForm, RegisterForm } from '@/types/Auth'

import request from '@/utils/request'

export function setNewpassword(data: ForgotForm) {
  return request('/login/fogetPassword', 'post', data as any, { timeout: 20000, noToken: true })
}

export interface CaptchaResult {
  captchaBase64Image: string
  captchaUUId: string
}

export function getCaptcha() {
  return request<CaptchaResult>('/login/getCaptcha', 'get', undefined, { noToken: true })
}

export interface LoginResult {
  token: string
}

export function LoginByemail(data: LoginForm) {
  return request<LoginResult>('/login/loginByemail', 'post', data as any, { noToken: true })
}

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

// 获取QQ登录授权url
export function getQQLoginUrl() {
  return request<string>(
    '/login/url', 
    'get',
    {noToken:true}
  )
}

// 获取QQ登录回调
export function getQQLoginCallback(code:string,state:string) {
  return request<string>(
    '/login/callback',
    'get',
    {
      code,
      state,
    },
    { noToken: true }
  )
}
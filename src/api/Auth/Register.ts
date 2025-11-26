import request  from "@/utils/request";
import type { RegisterForm } from "@/types/Auth/register";

// 注册用户
export function registerUser(data:RegisterForm){
  return request(
    '/rejester/insertUser',
    'post',
    data
  )
}

// 获取验证码
export function getEmailCaptcha(toEmail: string){
 return request(
  '/rejester/getEmailCaptcha',
  'get',
  {
    toEmail
  },
  { timeout: 20000 }
 )
}

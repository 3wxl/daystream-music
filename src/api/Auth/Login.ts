import type { LoginForm } from "@/types/Auth/login";
import request  from "@/utils/request";

export function getCaptcha(){
 return request(
  '/login/getCaptcha',
  'get'
 )
}

export function LoginByemail(data:LoginForm){
  return request(
    '/login/loginByemail',
    'post',
    data
  )
}

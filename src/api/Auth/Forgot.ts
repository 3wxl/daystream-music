import type { ForgotForm } from "@/types/Auth/forgot";
import request from "@/utils/request";
export function setNewpassword(data:ForgotForm){
  return request(
    '/login/fogetPassword',
    'post',
    data,
    {timeout:20000}
  )
}

import request from "@/utils/request";

export const getUserInfo = () => {
  return request(
    '/userbase/getUserInfo', 
    'get'
  )
}
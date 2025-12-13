import request from "@/utils/request";
// 获取用户列表
export function GetUserList(data:{key?:string,status?:number,pageNum:number,pageSize:number}) {
  return request(
    `/adminUser/list`,
    'post',
    data
  )
}

import request from "@/utils/request";
// 获取用户列表
export function GetUserList(data:{key?:string,status?:number,pageNum:number,pageSize:number}) {
  return request(
    `/adminUser/list`,
    'post',
    data
  )
}

// 添加用户
export function AddUser(data:{username:string,password:string,confirmPassword:string,email:string,introduction?:string}) {
  return request(
    `/adminUser/addUser`,
    'post',
    data
  )
}

// 获取用户信息
export function GetUserInfo(id:string) {
  return request(
    `/adminUser/detailUser?userId=${id}`,
    'get',
  )
}

// 删除用户
export function DeleteUser(id:string) {
  return request(
    `/adminUser/deleteUser?userId=${id}`,
    'get',
  )
}

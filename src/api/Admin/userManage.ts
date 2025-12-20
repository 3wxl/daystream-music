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

// 修改用户信息
export function UpdateUserAPI(data:{id:string,username?:string,avatar?:string,introduction?:string,gender?:number,walletBalance?:number,vipExpireTime?:string}) {
  return request(
    `/adminUser/updateUser`,
    'post',
    data
  )
}

// 删除用户
export function DeleteUser(id:string) {
  return request(
    `/adminUser/deleteUser?userId=${id}`,
    'get',
  )
}

// 批量删除用户
export function DeleteUsersApi(userId:number[]) {
  return request(
    `/adminUser/deleteUsersList`,
    'post',
    {userId}
  )
}

// 封禁/解封用户
export function BanUser(userId:number) {
  return request(
    `/adminUser/banUser?userId=${userId}`,
    'get',
  )
}


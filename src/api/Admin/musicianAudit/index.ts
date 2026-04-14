import request from "@/utils/request";
// 音乐人审核

// 获取待审核音乐人列表
export function GetMusicianAuditListApi(data:{key?:string,status?:number,pageNum:number,pageSize:number}) {
  return request(
    `/admin/getMusicianList`,
    'post',
    data
  )
}


// [批量]通过待审核音乐人申请
export function PassMusicianAuditApi(applyId:[string]) {
  return request(
    `/admin/batchPass`,
    'post',
    { applyId }
  )
}

// [批量]驳回待审核音乐人申请
export function RejectMusicianAuditApi(applyId:[string]) {
  return request(
    `/admin/batchRefuse`,
    'post',
    { applyId }
  )
}

/////// 音乐人列表API
export function GetMusicianListApi(data:{nameKey?:string,status:number,pageNum:number,pageSize:number}){
  return request(
    `/adminMusician/list`,
    'post',
    data
  )
}

// 获取音乐人详情
export function GetMusicianDetailApi(id:string){
  return request(
    `/adminMusician/detailMusician?musicianId=${id}`,
    'get'
  )
}

// 封禁音乐人
export function BanMusicianApi(id:string){
  return request(
    `/adminMusician/banMusician?musicianId=${id}`,
    'get'
  )
}

// 删除音乐人
export function DeleteMusicianApi(id:string){
  return request(
    `/adminMusician/deleteMusician?musicianId=${id}`,
    'get'
  )
}

// 批量删除音乐人
export function DeleteMusicianBatchApi(ids:[string]){
  return request(
    `/adminMusician/deleteBatch`,
    'post',
    { ids:ids }
  )
}

// 修改音乐人信息
export function UpdateMusicianApi(data:any){
  return request(
    `/adminMusician/updateMusician`,
    'post',
    data
  )
}

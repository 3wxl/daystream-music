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

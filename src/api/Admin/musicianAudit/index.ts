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



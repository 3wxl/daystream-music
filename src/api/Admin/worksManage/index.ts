import request from "@/utils/request";
// 这里存放作品相关的API

// 歌曲审核相关：
export function getReviewSongsListApi(pageNum:number,pageSize:number,musicName:string,status:number){
  return request(
    `/admin/getMasterPieceList`,
    'post',
    {
      pageNum,
      pageSize,
      musicName,
      status
    }
  )
}

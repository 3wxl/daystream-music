import request from "@/utils/request";

export function getPlayListDetail(id:string){
  return request(
    `/playlist/detail/${id}`,
    'get'
  )
}
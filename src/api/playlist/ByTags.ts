import request from "@/utils/request";
export function getlistByTags(currentTag,pageNum,pageSize){
  return request(
    '/playlist/by-tags',
    'post',
    {
    tags:currentTag,
    pageNum,
    pageSize,
  })
}

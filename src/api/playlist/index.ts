import request from '@/utils/request'

export function getAllTags() {
  return request('/playlist/all-tags', 'get')
}


export function getPlayListDetail(id: string) {
  return request(`/playlist/detail/${id}`, 'get')
}

export function getlistByTags(currentTag: string[], pageNum: string, pageSize: string) {
  return request('/playlist/by-tags', 'post', {
    tags: currentTag,
    pageNum,
    pageSize,
  })
}

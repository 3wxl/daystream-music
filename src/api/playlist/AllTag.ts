import request from '@/utils/request'

export function getAllTags() {
  return request(
    '/playlist/all-tags',
    'get'
  )
}

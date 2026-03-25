import request from '@/utils/request'

// 热门MV
export function getHotMv(pageSize: string, pageNum: string) {
  return request('/mv/hot', 'get', {
    pageSize,
    pageNum,
  })
}

// 最新MV
export function getNewMv(pageSize: string, pageNum: string) {
  return request('/mv/new', 'get', {
    pageSize,
    pageNum,
  })
}

// VIP专属MV
export function getVipMv(pageSize: string, pageNum: string) {
  return request('/mv/vip', 'get', {
    pageSize,
    pageNum,
  })
}

// MV详情
export function getMvDetail(mvid: string) {
  return request(`/mv/detail/${mvid}`, 'get')
}

// 检验分片文件是否已经上传到MinIO
export function validateChunk(fileMd5: string, chunk: string, chunkMd5: string) {
  return request(
    '/file/check',
    'post',
    {
      fileMd5,
      chunk,
      chunkMd5,
    },
    { isParams: true },
  )
}

// 分片上传接口
export function uploadChunk(data: FormData) {
  return request('/mv/uploadMv', 'post', data)
}

// 合并分片文件接口
export function mergeChunks(data: FormData) {
  return request('/mv/merge', 'post', data)
}

// 获取我的MV列表
export function getMyMvList() {
  return request('/mv/my/list', 'get')
}

// 删除MV
export function deleteMv(mvId: string) {
  return request(`/mv/delete/${mvId}`, 'delete')
}

// 创建MV (MV管理 -> 创建MV)
// {
//   mvName: string,
//   musicId: number, (optional/faked for now)
//   duration: number,
//   coverUrl: string,
//   qualityList: [{ qualityType: number, mvUrl: string, fileSize: number, isVipLimit: number }]
// }
export function createMv(data: any) {
  return request('/mv/create', 'post', data)
}

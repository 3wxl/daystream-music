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
  return request('/mv/uploadMv', 'post', data,{timeout:18000})//同样设置为180秒
}

// 合并分片文件接口
export function mergeChunks(data: FormData) {
  return request('/mv/merge', 'post', data, { timeout: 360000 }) // 设置为 360 秒
}

// 获取我的MV列表
export function getMyMvList() {
  return request('/mv/my/list', 'get')
}

// MV多画质DTO
export interface MvQualityDTO {
  qualityType?: number; // 1-标清480P，2-高清720P，3-超清1080P，4-4K
  mvUrl?: string; // 播放地址
  fileSize?: number; // 文件大小
  isVipLimit?: number; // 是否仅VIP可播放（0-否，1-是）
  [property: string]: any;
}

// MV创建/更新请求参数
export interface MusicMvDTO {
  mvName?: string;
  musicId?: number;
  duration?: number;
  coverUrl?: string;
  releaseTime?: string;
  isVip?: number; // 0-否，1-是
  status?: number; // 0-待审核级，1-上架，2-下架
  qualityList?: MvQualityDTO[];
  [property: string]: any;
}

// 删除MV
export function deleteMv(mvId: string) {
  return request(`/mv/delete/${mvId}`, 'delete')
}

// 创建MV
export function createMv(data: MusicMvDTO) {
  return request('/mv/create', 'post', data)
}

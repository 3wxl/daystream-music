import request from '@/utils/request'

/**
 * 创建新会话接口
 * @returns Promise<string> 返回会话ID
 */
export const createNewSession = (): Promise<string> => {
  return request('/ai/newSession', 'GET').then((res) => {
    if (res.success && res.data) {
      return res.data as string
    } else {
      throw new Error(res.errorMsg || '创建会话失败')
    }
  })
}

/**
 * AI咨询接口
 * @param params 请求参数
 * @param params.memoryId 记忆ID（可选）
 * @param params.message 用户消息内容（可选）
 * @returns Promise<string[]> AI返回的响应内容数组
 */
export const aiChat = (params: { memoryId?: string; message?: string }): Promise<string[]> => {
  return request('/ai/chat', 'GET', undefined, { params }).then((res) => {
    if (res.success && Array.isArray(res.data)) {
      return res.data as string[]
    } else {
      throw new Error(res.errorMsg || 'AI咨询失败')
    }
  })
}

/**
 * AI创作歌曲接口
 * @param params 请求参数
 * @param params.memoryId 记忆ID（可选）
 * @param params.request 用户创作请求内容（可选）
 * @returns Promise<string[]> AI返回的创作内容数组
 */
export const aiMusicCreate = (params: {
  memoryId?: string
  request?: string
}): Promise<string[]> => {
  return request('/ai/music/create', 'GET', undefined, { params }).then((res) => {
    if (res.success && Array.isArray(res.data)) {
      return res.data as string[]
    } else {
      throw new Error(res.errorMsg || '歌曲创作失败')
    }
  })
}

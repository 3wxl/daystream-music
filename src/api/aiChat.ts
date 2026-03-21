import request from '@/utils/request'
import type { BaseResponse } from '@/types/checkIn'

/**
 * 创建新会话接口
 * @returns Promise<string> memoryId
 */
export const createNewSession = async (): Promise<string> => {
  try {
    const response = await request.get<BaseResponse<string>>('/ai/newSession')
    if (response.success && response.data) {
      return response.data
    }
    throw new Error(response.errorMsg || '创建会话失败')
  } catch (error) {
    console.error('创建新会话接口调用失败:', error)
    throw error
  }
}

/**
 * AI咨询接口
 * @param params 请求参数
 * @returns Promise<string[]>
 */
export const aiChat = async (params: {
  memoryId?: string
  message?: string
}): Promise<string[]> => {
  try {
    const response = await request.get<string[]>('/ai/chat', { params, responseType: 'plain' })
    // 解析返回的字符串数组
    if (typeof response === 'string') {
      // 处理可能返回的JSON字符串
      try {
        return JSON.parse(response)
      } catch (e) {
        // 如果不是JSON，按行分割
        return response.split('\n')
      }
    }
    return response
  } catch (error) {
    console.error('AI咨询接口调用失败:', error)
    throw error
  }
}

/**
 * AI创作歌曲接口
 * @param params 请求参数
 * @returns Promise<string[]>
 */
export const aiMusicCreate = async (params: {
  memoryId?: string
  request?: string
}): Promise<string[]> => {
  try {
    const response = await request.get<string[]>('/ai/music/create', {
      params,
      responseType: 'plain',
    })
    // 解析返回的字符串数组
    if (typeof response === 'string') {
      // 处理可能返回的JSON字符串
      try {
        return JSON.parse(response)
      } catch (e) {
        // 如果不是JSON，按行分割
        return response.split('\n')
      }
    }
    return response
  } catch (error) {
    console.error('AI创作歌曲接口调用失败:', error)
    throw error
  }
}

import request from '@/utils/request'
import type { Data } from '@/utils/request'

/**
 * 流式请求方法 - 使用 POST 方法
 * @param url 请求地址
 * @param params 请求参数
 * @param onMessage 消息回调
 * @param onError 错误回调
 * @param onComplete 完成回调
 */
export const fetchStream = async (
  url: string,
  params: { memoryId?: string; message?: string; request?: string },
  onMessage: (data: string) => void,
  onError?: (error: Error) => void,
  onComplete?: () => void,
  signal?: AbortSignal,
): Promise<void> => {
  try {
    const token = localStorage.getItem('auth_token') || ''

    const response = await fetch(`/api${url}`, {
      method: 'POST',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
        Accept: 'text/event-stream', // 或者 'text/plain'
      },
      body: JSON.stringify(params),
      signal,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const reader = response.body?.getReader()
    if (!reader) {
      throw new Error('No response body')
    }

    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })

      // 处理服务器发送的数据
      const lines = buffer.split('\n')

      for (let i = 0; i < lines.length - 1; i++) {
        const line = lines[i]?.trim() ?? ''
        if (line) {
          let cleanLine = line.replace(/^data:\s*/, '').trim()
          cleanLine = cleanLine.replace(/^data:\s*/, '').trim()

          if (cleanLine === '[DONE]') {
            onComplete?.()
            return
          }

          // 只推送清理后的数据
          if (cleanLine) {
            onMessage(cleanLine)
          }
        }
      }
      buffer = lines[lines.length - 1] || ''
    }

    // 处理最后剩余的内容
    if (buffer.trim()) {
      onMessage(buffer.trim())
    }

    onComplete?.()
  } catch (error) {
    // 忽略中止错误，因为这是用户主动操作
    if (error instanceof Error && error.name === 'AbortError') {
      console.log('✅ 流式请求已被用户中止')
      return
    }
    console.error('流式请求失败:', error)
    onError?.(error as Error)
  }
}

/**
 * 创建新会话接口
 * @returns Promise<string> memoryId
 */
export const createNewSession = async (): Promise<string> => {
  try {
    const response = await request<string>('/ai/newSession', 'get')
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
 * AI咨询接口 - 非流式（备用）
 * @param params 请求参数
 * @returns Promise<string[]>
 */
export const aiChat = async (params: {
  memoryId?: string
  message?: string
}): Promise<string[]> => {
  try {
    const response = await request<string[]>('/ai/chat', 'post', params)
    // 解析返回的数据
    if (typeof response.data === 'string') {
      try {
        return JSON.parse(response.data)
      } catch (e) {
        return (response.data as string).split('\n')
      }
    }
    return response.data || []
  } catch (error) {
    console.error('AI咨询接口调用失败:', error)
    throw error
  }
}

/**
 * AI创作歌曲接口 - 非流式（备用）
 * @param params 请求参数
 * @returns Promise<string[]>
 */
export const aiMusicCreate = async (params: {
  memoryId?: string
  request?: string
}): Promise<string[]> => {
  try {
    const response = await request<string[]>('/ai/music/create', 'post', params)
    // 解析返回的数据
    if (typeof response.data === 'string') {
      try {
        return JSON.parse(response.data)
      } catch (e) {
        return (response.data as string).split('\n')
      }
    }
    return response.data || []
  } catch (error) {
    console.error('AI创作歌曲接口调用失败:', error)
    throw error
  }
}

/**
 * 获取会话消息记录
 */
export const getMessages = async (params: {
  memoryId: string
  pageNum: number
  pageSize: number
}): Promise<any[]> => {
  try {
    const response = await request<any[]>('/ai/messages', 'get', params)
    return response.data || []
  } catch (error) {
    console.error('获取消息记录失败:', error)
    throw error
  }
}

export const getSessionList = async (params: {
  sessionType?: string
  pageNum: number
  pageSize: number
}): Promise<any[]> => {
  try {
    const response = await request<any[]>('/ai/sessions', 'get', params)
    return response.data || []
  } catch (error) {
    console.error('获取用户会话列表失败:', error)
    throw error
  }
}
/**
 * 删除会话
 */
export const deleteSession = async (memoryId: string): Promise<boolean> => {
  try {
    const response = await request<boolean>('/ai/messages', 'delete', { memoryId })
    return response.success
  } catch (error) {
    console.error('删除会话失败:', error)
    throw error
  }
}

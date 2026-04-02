import type {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
  Method,
} from 'axios'
import axios from 'axios'
import type { LoadingInstance } from 'element-plus'
import { ElLoading, ElMessage } from 'element-plus'
import JSONBig from 'json-bigint'

let isRelogging = false
const TOKEN_KEY = 'auth_token'

const setToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token)
}

const getToken = () => {
  return localStorage.getItem(TOKEN_KEY) || ''
}

const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY)
}

// 响应数据通用类型
export type Data<T = unknown> = {
  success: boolean
  errorMsg: string | null // 兼容后端返回null的情况
  data: T
  total?: number | null
  errCode?: number | string | null // 兼容字符串类型的errCode
}

// 宽松的提交数据类型（解决接口参数类型不匹配问题）
type SubmitData = Record<string, unknown> | FormData | object | undefined

// Axios 请求配置接口
interface RequestConfig<T = unknown> extends AxiosRequestConfig {
  interceptors?: {
    requestInterceptor?: (config: AxiosRequestConfig) => AxiosRequestConfig
    requestInterceptorCatch?: (error: AxiosError) => Promise<any>
    responseInterceptor?: (res: AxiosResponse<Data<T>>) => AxiosResponse<Data<T>>
    responseInterceptorCatch?: (error: AxiosError) => Promise<any>
  }
  showLoading?: boolean
  returnFullResponse?: boolean
  noToken?: boolean
  isParams?: boolean // 新增：是否将数据强制作为 query 参数
}

// 配置 JSONBig 将大数字转为字符串
const JSONBigString = JSONBig({ storeAsString: true })

const service = axios.create({
  baseURL: '/api',
  timeout: 20000,
  transformResponse: [
    function (data) {
      if (typeof data === 'string') {
        try {
          // 如果转换成功则返回转换的数据结果
          return JSONBig.parse(data)
        } catch (err) {
          // 如果转换失败，则直接返回原始数据
          return data
        }
      }
      return data
    },
  ],
})

// 大数字转换工具函数
function convertBigNumbersToString(obj: any): any {
  if (!obj) return obj

  // 检查是否是 BigNumber 对象
  const isBigNumber =
    obj._isBigNumber ||
    (obj.constructor && obj.constructor.name === 'BigNumber') ||
    (obj.s !== undefined && obj.e !== undefined && obj.c !== undefined) // BigNumber2 的结构

  if (isBigNumber) {
    return obj.toString()
  }

  // 处理数组
  if (Array.isArray(obj)) {
    return obj.map((item) => convertBigNumbersToString(item))
  }

  // 处理普通对象
  if (typeof obj === 'object' && obj !== null) {
    const result: any = {}
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        result[key] = convertBigNumbersToString(obj[key])
      }
    }
    return result
  }

  return obj
}

// 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig & { noToken?: boolean }) => {
    const token = getToken()
    if (token && !config.noToken) {
      config.headers = config.headers || {}
      config.headers.Authorization = `${token}`
    }
    return config
  },
  (error: AxiosError) => {
    console.error('请求发送失败：', error)
    return Promise.reject(error)
  },
)

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse<Data<unknown>>) => {
    // 转换大数字为字符串
    const data = response.data
    if (data && typeof data === 'object') {
      response.data = convertBigNumbersToString(data)
    }

    const headers = response.headers
    // 测试是否携带了新的token请求头
    console.log('响应头', headers)
    const newToken = headers['authorization'] || headers['Authorization']
    const isRefreshed = headers['token-refreshed'] || headers['Token-Refreshed']
    if (newToken && isRefreshed) {
      const oldToken = getToken()
      if (newToken !== oldToken) {
        console.log('检测到 Token 自动续期，已更新')
        setToken(newToken)
      }
    }

    const res = response.data
    // 后端接口设计原因，token失效并不是状态码为401的情况，而是success为false且errMsg为特定值的情况，所以在此处统一进行处理
    if (res.success === false) {
      const msg = res.errorMsg || '请求失败'
      if (msg === '用户认证失败请重新登录') {
        if (location.pathname === '/UserAuth') return Promise.reject(new Error(msg))
        if (!isRelogging) {
          isRelogging = true
          removeToken()
          ElMessage.error('登录已过期，请重新登录')
          setTimeout(() => {
            window.location.href = '/UserAuth'
          }, 500)
        }
        return Promise.reject(new Error(msg)) // 拦截掉，不让请求往下走
      }
      ElMessage.closeAll()
      ElMessage.error(msg)
      return Promise.reject(new Error(msg))
    }
    return response
  },
  (error: AxiosError) => {
    console.error('响应错误：', error)
    let msg = '网络异常'

    if (error.response) {
      const status = error.response.status
      // 增强错误提示：优先使用后端返回的errorMsg
      const errorData = error.response.data as Data<unknown>
      if (errorData?.errorMsg) {
        msg = errorData.errorMsg
      } else {
        switch (status) {
          case 401:
            if (!isRelogging) {
              isRelogging = true
              removeToken()
              ElMessage.error('登录已过期，请重新登录')
              setTimeout(() => {
                window.location.href = '/UserAuth'
              }, 500)
            }
            break
          case 400:
            msg = '请求参数错误，请检查后重试'
            break
          case 404:
            msg = '请求的接口不存在'
            break
          case 500:
            msg = '服务器内部错误，请稍后重试'
            break
          default:
            msg = `请求失败（${status}）`
        }
      }
    } else if (error.message.includes('timeout')) {
      msg = '请求超时，请检查网络或稍后重试'
    }

    // 避免重复提示
    if (!error.message.includes('cancel')) {
      ElMessage.error(msg)
    }
    return Promise.reject(error)
  },
)

// 重载1：不返回完整响应
async function request<T = unknown>(
  url: string,
  method?: Method,
  submitData?: SubmitData, // 使用宽松类型
  config?: RequestConfig<T> & { returnFullResponse?: false },
): Promise<Data<T>>

// 重载2：返回完整响应
async function request<T = unknown>(
  url: string,
  method?: Method,
  submitData?: SubmitData, // 使用宽松类型
  config?: RequestConfig<T> & { returnFullResponse: true },
): Promise<AxiosResponse<Data<T>>>

// 核心实现
async function request<T = unknown>(
  url: string,
  method: Method = 'get',
  submitData?: SubmitData, // 使用宽松类型
  config?: RequestConfig<T>,
): Promise<Data<T> | AxiosResponse<Data<T>>> {
  let loading: LoadingInstance | undefined
  if (config?.showLoading) {
    loading = ElLoading.service({
      lock: true,
      text: '请求中...',
      background: 'rgba(0, 0, 0, 0.5)',
    })
  }

  // 核心修复：区分 GET/DELETE 用 params，其他用 data
  let axiosConfig: AxiosRequestConfig = {
    url,
    method,
    ...config,
  }

  // 判断请求类型：GET/DELETE 默认用 params，其他用 data
  const isGetOrDelete = ['get'].includes(method.toLowerCase())
  const isParams = config?.isParams // 新置：是否强制作为 query 参数

  if (submitData) {
    if (isParams || isGetOrDelete) {
      axiosConfig.params = submitData // 强制或默认作为 Query 参数
    } else {
      axiosConfig.data = submitData // 其他方法放到 Body 参数
      // 如果是FormData，确保axios自动设置Content-Type
      if (submitData instanceof FormData) {
        // 移除默认的Content-Type，让axios自动设置为multipart/form-data
        delete axiosConfig.headers?.['Content-Type']
      }
    }
  }

  // 执行请求拦截器
  if (config?.interceptors?.requestInterceptor) {
    axiosConfig = config.interceptors.requestInterceptor(axiosConfig)
  }

  try {
    const response = await service.request<Data<T>>(axiosConfig)

    // 执行响应拦截器
    let res: AxiosResponse<Data<T>> = response
    if (config?.interceptors?.responseInterceptor) {
      res = config.interceptors.responseInterceptor(res)
    }

    loading?.close()
    return config?.returnFullResponse ? res : res.data
  } catch (err: any) {
    loading?.close()

    // 执行响应错误拦截器
    if (config?.interceptors?.responseInterceptorCatch) {
      return config.interceptors.responseInterceptorCatch(err)
    }

    return Promise.reject(err)
  }
}

export default request
export { getToken, removeToken, setToken }

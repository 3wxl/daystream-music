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
  errorMsg: string
  data: T
  total?: number
  errCode?: number
}

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
          // 如果转换失败，则包装为统一数据格式并返回
          return {
            data,
          }
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
  if (typeof obj === 'object') {
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

    if (res.success === false) {
      const msg = res.errorMsg || '请求失败'
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
      if (status === 401) {
        if (!isRelogging) {
          isRelogging = true
          removeToken()
          ElMessage.error('登录已过期，请重新登录')
          setTimeout(() => {
            window.location.href = '/UserAuth'
          }, 500)
        }
        return Promise.reject(error)
      }
      if (status === 404) msg = '接口不存在'
      if (status === 500) msg = '服务器错误'
    } else if (error.message.includes('timeout')) {
      msg = '请求超时'
    }
    ElMessage.error(msg)
    return Promise.reject(error)
  },
)

async function request<T = unknown>(
  url: string,
  method?: Method,
  submitData?: Record<string, unknown> | FormData,
  config?: RequestConfig<T> & { returnFullResponse?: false },
): Promise<Data<T>>

async function request<T = unknown>(
  url: string,
  method?: Method,
  submitData?: Record<string, unknown> | FormData,
  config?: RequestConfig<T> & { returnFullResponse: true },
): Promise<AxiosResponse<Data<T>>>

async function request<T = unknown>(
  url: string,
  method: Method = 'get',
  submitData?: Record<string, unknown> | FormData,
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

  let axiosConfig: AxiosRequestConfig = {
    url,
    method,
    [method.toLowerCase() === 'get' ? 'params' : 'data']: submitData,
    ...config,
  }

  if (config?.interceptors?.requestInterceptor) {
    axiosConfig = config.interceptors.requestInterceptor(axiosConfig)
  }

  return service
    .request<Data<T>>(axiosConfig)
    .then((response) => {
      let res: AxiosResponse<Data<T>> = response

      if (config?.interceptors?.responseInterceptor) {
        res = config.interceptors.responseInterceptor(res)
      }

      loading?.close()
      if (config?.returnFullResponse) {
        return res
      }
      return res.data
    })
    .catch((err: AxiosError) => {
      loading?.close()

      if (config?.interceptors?.responseInterceptorCatch) {
        return config.interceptors.responseInterceptorCatch(err)
      }

      return Promise.reject(err)
    })
}

export default request
export { getToken, removeToken, setToken }

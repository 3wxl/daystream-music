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
type Data<T = unknown> = {
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
}

const service = axios.create({
  baseURL: '/api',
  timeout: 20000,
})

// 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken()
    if (token) {
      config.headers = config.headers || {}
      config.headers.Authorization = `Bearer ${token}`
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
    const headers = response.headers
    const newToken = headers['authorization'] || headers['Authorization']
    const isRefreshed = headers['token-refreshed'] || headers['Token-Refreshed']
    if(newToken && isRefreshed){
      setToken(newToken)
    }

    const res = response.data

    if(res.success === false){
      const msg = res.errorMsg || '请求失败'
      ElMessage.error(msg)
      return Promise.reject(new Error(msg))
    }
    return response // 返回完整响应对象
  },
  (error: AxiosError) => {
    console.error('响应错误：', error)
    let msg = '网络异常'

    if(error.response) {
      const status = error.response.status
      if(status === 401){
        removeToken()
        ElMessage.error('登录已过期，请重新登录')
        window.location.href = '/UserAuth'
        return Promise.reject(error)
      }
      if(status === 404) msg = '接口不存在'
      if(status === 500) msg = '服务器错误'
    }else if (error.message.includes('timeout')){
      msg = '请求超时'
    }
    ElMessage.error(msg)
    return Promise.reject(error)
  },
)

// 请求函数
async function request<T = unknown>(
  url: string,
  method?: Method,
  submitData?: Record<string, unknown>,
  config?: RequestConfig<T> & { returnFullResponse?: false },
): Promise<Data<T>>

async function request<T = unknown>(
  url: string,
  method?: Method,
  submitData?: Record<string, unknown>,
  config?: RequestConfig<T> & { returnFullResponse: true },
): Promise<AxiosResponse<Data<T>>>

async function request<T = unknown>(
  url: string,
  method: Method = 'get',
  submitData?: Record<string, unknown> | undefined,
  config?: RequestConfig<T> & { returnFullResponse?: boolean },
) {
  let loading: LoadingInstance | undefined
  if (config?.showLoading) {
    loading = ElLoading.service({
      lock: true,
      text: '请求中...',
      background: 'rgba(0, 0, 0, 0.5)',
    })
  }

  // 构建请求配置对象
  let axiosConfig: AxiosRequestConfig = {
    url,
    method,
    [method.toLowerCase() === 'get' ? 'params' : 'data']: submitData,
    ...config,
  }

  // 执行单个请求的请求拦截器
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

import axios from 'axios'
import type {
  AxiosRequestConfig,
  Method,
  AxiosResponse,
  InternalAxiosRequestConfig,
  AxiosError,
} from 'axios'
import { ElLoading, ElMessage } from 'element-plus'
import type { LoadingInstance } from 'element-plus'

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
  code: string
  message: string
  data: T
}

// Axios 请求配置接口
interface RequestConfig<T = unknown> extends AxiosRequestConfig {
  interceptors?: {
    requestInterceptor?: (config: AxiosRequestConfig) => AxiosRequestConfig
    requestInterceptorCatch?: (error: AxiosError) => Promise<AxiosError>
    responseInterceptor?: (res: AxiosResponse<Data<T>>) => AxiosResponse<Data<T>>
    responseInterceptorCatch?: (error: AxiosError) => Promise<AxiosError>
  }
  showLoading?: boolean
}

const service = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 5000,
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
    return response // 返回完整响应对象
  },
  (error: AxiosError) => {
    console.error('响应错误：', error)

    if (error.response?.status === 401) {
      removeToken()
      ElMessage.error('登录已过期，请重新登录')
      window.location.href = '/login'
    }

    return Promise.reject(error)
  },
)
// 请求函数
const request = <T = unknown>(
  url: string,
  method: Method = 'get',
  submitData?: Record<string, unknown> | undefined,
  config?: RequestConfig<T>,
) => {
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
export { setToken, getToken, removeToken }

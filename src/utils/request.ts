import axios from 'axios'
import type {
  AxiosRequestConfig,
  AxiosInstance,
  Method,
  AxiosResponse,
  InternalAxiosRequestConfig,
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

type Data<T = any> = {
  code: string
  message: string
  data: T
}

// Axios 请求配置接口
interface RequestConfig<T = any> extends AxiosRequestConfig {
  interceptors?: {
    requestInterceptor?: (config: AxiosRequestConfig) => AxiosRequestConfig
    requestInterceptorCatch?: (error: any) => any
    responseInterceptor?: (res: AxiosResponse<Data<T>>) => AxiosResponse<Data<T>>
    responseInterceptorCatch?: (error: any) => any
  }
  showLoading?: boolean
}

const service = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 5000,
})

// 添加响应拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken()
    if (token) {
      config.headers = config.headers || {}
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    console.error('请求发送失败：', error)
    return Promise.reject(error)
  },
)
service.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  (error) => {
    console.error('响应错误：', error)

    // 处理Token过期（401状态码，根据后端实际情况调整）
    if (error.response?.status === 401) {
      removeToken() // 清除无效Token
      ElMessage.error('登录已过期，请重新登录') // 提示用户
      window.location.href = '/login' // 跳转到登录页
    }

    return Promise.reject(error)
  },
)
const request = <T = any>(
  url: string,
  method: Method = 'get',
  submitData?: object,
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
      let res = response // 将整个 response 传入

      if (config?.interceptors?.responseInterceptor) {
        res = config.interceptors.responseInterceptor(res) // 此时 res 是 AxiosResponse 类型
      }

      loading?.close()
      return res // 最终返回 data 即可
    })
    .catch((err) => {
      // 错误时关闭加载动画
      loading?.close()

      // 执行单个请求的错误拦截器
      if (config?.interceptors?.responseInterceptorCatch) {
        return config.interceptors.responseInterceptorCatch(err)
      }

      return Promise.reject(err)
    })
}

// 导出请求函数和Token操作工具（供登录/退出组件使用）
export default request
export { setToken, getToken, removeToken }

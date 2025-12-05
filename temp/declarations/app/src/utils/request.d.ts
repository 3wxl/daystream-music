import type { AxiosError, AxiosRequestConfig, AxiosResponse, Method } from 'axios';
declare const setToken: (token: string) => void;
declare const getToken: () => string;
declare const removeToken: () => void;
type Data<T = unknown> = {
    success: boolean;
    errorMsg: string;
    data: T;
    total?: number;
    errCode?: number;
};
interface RequestConfig<T = unknown> extends AxiosRequestConfig {
    interceptors?: {
        requestInterceptor?: (config: AxiosRequestConfig) => AxiosRequestConfig;
        requestInterceptorCatch?: (error: AxiosError) => Promise<any>;
        responseInterceptor?: (res: AxiosResponse<Data<T>>) => AxiosResponse<Data<T>>;
        responseInterceptorCatch?: (error: AxiosError) => Promise<any>;
    };
    showLoading?: boolean;
    returnFullResponse?: boolean;
    noToken?: boolean;
}
declare function request<T = unknown>(url: string, method?: Method, submitData?: Record<string, unknown>, config?: RequestConfig<T> & {
    returnFullResponse?: false;
}): Promise<Data<T>>;
declare function request<T = unknown>(url: string, method?: Method, submitData?: Record<string, unknown>, config?: RequestConfig<T> & {
    returnFullResponse: true;
}): Promise<AxiosResponse<Data<T>>>;
export default request;
export { getToken, removeToken, setToken };

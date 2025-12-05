// api/checkIn.ts
import request from '@/utils/request'
import type { BaseResponse, CheckInStatusVO, Data } from '@/types/checkIn'

/**
 * 用户签到接口
 * GET /user/checkIn
 * @returns Promise<BaseResponse<string>>
 */
export function checkIn(): Promise<BaseResponse<string>> {
  return request<string>('/user/checkIn', 'get').then((response: Data<string>) => {
    // 将 Data<string> 转换为 BaseResponse<string>
    return {
      success: response.success,
      errorMsg: response.errorMsg,
      data: response.data,
      total: response.total,
      errCode: response.errCode,
    } as BaseResponse<string>
  })
}

/**
 * 获取用户签到状态
 * GET /user/checkIn/getCheckInStatus
 * @returns Promise<BaseResponse<CheckInStatusVO>>
 */
export function getCheckInStatus(): Promise<BaseResponse<CheckInStatusVO>> {
  return request<CheckInStatusVO>('/user/checkIn/getCheckInStatus', 'get').then(
    (response: Data<CheckInStatusVO>) => {
      return {
        success: response.success,
        errorMsg: response.errorMsg,
        data: response.data,
        total: response.total,
        errCode: response.errCode,
      } as BaseResponse<CheckInStatusVO>
    },
  )
}

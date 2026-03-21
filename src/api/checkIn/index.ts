// api/checkIn.ts
import request from '@/utils/request'
import type { BaseResponse, CheckInStatusVO, Data, PageRespUserTaskVO } from '@/types/checkIn'

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

/**
 * 获取用户任务状态列表
 * GET /user/task/list
 * @param pageNum 当前页码
 * @param pageSize 每页显示数量
 * @returns Promise<BaseResponse<PageRespUserTaskVO>>
 */
// export function getUserTaskList(
//   pageNum: number,
//   pageSize?: number,
// ): Promise<BaseResponse<PageRespUserTaskVO>> {
//   return request<PageRespUserTaskVO>('/user/task/list', 'get', {
//     params: {
//       pageNum,
//       pageSize,
//     },
//   }).then((response: Data<PageRespUserTaskVO>) => {
//     return {
//       success: response.success,
//       errorMsg: response.errorMsg,
//       data: response.data,
//       total: response.total,
//       errCode: response.errCode,
//     } as BaseResponse<PageRespUserTaskVO>
//   })
// }
export function getUserTaskList(
  pageNum: number,
  pageSize?: number,
): Promise<BaseResponse<PageRespUserTaskVO>> {
  return request<PageRespUserTaskVO>('/user/task/list', 'get', undefined, {
    params: {
      pageNum,
      pageSize,
    },
  }).then((response: Data<PageRespUserTaskVO>) => {
    return {
      success: response.success,
      errorMsg: response.errorMsg,
      data: response.data,
      total: response.total,
      errCode: response.errCode,
    } as BaseResponse<PageRespUserTaskVO>
  })
}
export const claimTaskReward = (taskId: number) => {
  return request('/user/task/reward/claim', 'POST', undefined, {
    params: { taskId },
  })
}

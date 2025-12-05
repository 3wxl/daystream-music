import type { BaseResponse, CheckInStatusVO } from '@/types/checkIn';
/**
 * 用户签到接口
 * GET /user/checkIn
 * @returns Promise<BaseResponse<string>>
 */
export declare function checkIn(): Promise<BaseResponse<string>>;
/**
 * 获取用户签到状态
 * GET /user/checkIn/getCheckInStatus
 * @returns Promise<BaseResponse<CheckInStatusVO>>
 */
export declare function getCheckInStatus(): Promise<BaseResponse<CheckInStatusVO>>;

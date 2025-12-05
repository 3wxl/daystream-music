export interface CheckInStatusVO {
    checkedIn: boolean;
    continuousDays: number;
    monthCheckInDays: number;
    tomorrowSignInReward: number;
    currentWaves: number;
}
export interface BaseResponse<T = any> {
    success: boolean;
    errorMsg?: string | null;
    data?: T;
    total?: number | null;
    errCode?: string | null;
}
export type Data<T = unknown> = {
    success: boolean;
    errorMsg: string;
    data: T;
    total?: number;
    errCode?: number;
};
export interface VipPrivilege {
    icon: string;
    title: string;
    description?: string;
}
export interface Task {
    id: number;
    title: string;
    description: string;
    icon: string;
    reward: number;
    completed: boolean;
}
export interface CoinRecord {
    id: number;
    title: string;
    time: string;
    amount: number;
    type: 'earn' | 'spend';
    icon: string;
}

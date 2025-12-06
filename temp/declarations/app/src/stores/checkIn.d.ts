import type { BaseResponse } from '@/types/checkIn';
export declare const useCheckInStore: import("pinia").StoreDefinition<"checkIn", Pick<{
    currentWaves: globalThis.Ref<number, number>;
    continuousDays: globalThis.Ref<number, number>;
    monthCheckInDays: globalThis.Ref<number, number>;
    isCheckedIn: globalThis.Ref<boolean, boolean>;
    loading: globalThis.Ref<boolean, boolean>;
    checkInLoading: globalThis.Ref<boolean, boolean>;
    lastCheckInResult: globalThis.Ref<{
        success: boolean;
        errorMsg?: string | null | undefined;
        data?: string | undefined;
        total?: number | null | undefined;
        errCode?: string | null | undefined;
    } | null, BaseResponse<string> | {
        success: boolean;
        errorMsg?: string | null | undefined;
        data?: string | undefined;
        total?: number | null | undefined;
        errCode?: string | null | undefined;
    } | null>;
    lastCheckInTime: globalThis.Ref<string | null, string | null>;
    tomorrowSignInReward: globalThis.Ref<number, number>;
    canCheckIn: globalThis.ComputedRef<boolean>;
    checkInButtonText: globalThis.ComputedRef<string>;
    checkInButtonStatus: globalThis.ComputedRef<{
        disabled: boolean;
        loading: boolean;
        type: "success" | "warning" | "default";
    }>;
    todayDate: globalThis.ComputedRef<string>;
    getCheckInPreview: globalThis.ComputedRef<{
        description: string;
    }>;
    getUserStatusSummary: globalThis.ComputedRef<{
        currentWaves: number;
        continuousDays: number;
        monthCheckInDays: number;
        isCheckedIn: boolean;
        canCheckIn: boolean;
        tomorrowSignInReward: number;
    }>;
    loadCheckInStatus: () => Promise<void>;
    doCheckIn: () => Promise<BaseResponse<string> | null>;
    reset: () => void;
    initialize: () => Promise<void>;
}, "loading" | "continuousDays" | "currentWaves" | "monthCheckInDays" | "isCheckedIn" | "checkInLoading" | "lastCheckInResult" | "lastCheckInTime" | "tomorrowSignInReward">, Pick<{
    currentWaves: globalThis.Ref<number, number>;
    continuousDays: globalThis.Ref<number, number>;
    monthCheckInDays: globalThis.Ref<number, number>;
    isCheckedIn: globalThis.Ref<boolean, boolean>;
    loading: globalThis.Ref<boolean, boolean>;
    checkInLoading: globalThis.Ref<boolean, boolean>;
    lastCheckInResult: globalThis.Ref<{
        success: boolean;
        errorMsg?: string | null | undefined;
        data?: string | undefined;
        total?: number | null | undefined;
        errCode?: string | null | undefined;
    } | null, BaseResponse<string> | {
        success: boolean;
        errorMsg?: string | null | undefined;
        data?: string | undefined;
        total?: number | null | undefined;
        errCode?: string | null | undefined;
    } | null>;
    lastCheckInTime: globalThis.Ref<string | null, string | null>;
    tomorrowSignInReward: globalThis.Ref<number, number>;
    canCheckIn: globalThis.ComputedRef<boolean>;
    checkInButtonText: globalThis.ComputedRef<string>;
    checkInButtonStatus: globalThis.ComputedRef<{
        disabled: boolean;
        loading: boolean;
        type: "success" | "warning" | "default";
    }>;
    todayDate: globalThis.ComputedRef<string>;
    getCheckInPreview: globalThis.ComputedRef<{
        description: string;
    }>;
    getUserStatusSummary: globalThis.ComputedRef<{
        currentWaves: number;
        continuousDays: number;
        monthCheckInDays: number;
        isCheckedIn: boolean;
        canCheckIn: boolean;
        tomorrowSignInReward: number;
    }>;
    loadCheckInStatus: () => Promise<void>;
    doCheckIn: () => Promise<BaseResponse<string> | null>;
    reset: () => void;
    initialize: () => Promise<void>;
}, "canCheckIn" | "checkInButtonText" | "checkInButtonStatus" | "todayDate" | "getCheckInPreview" | "getUserStatusSummary">, Pick<{
    currentWaves: globalThis.Ref<number, number>;
    continuousDays: globalThis.Ref<number, number>;
    monthCheckInDays: globalThis.Ref<number, number>;
    isCheckedIn: globalThis.Ref<boolean, boolean>;
    loading: globalThis.Ref<boolean, boolean>;
    checkInLoading: globalThis.Ref<boolean, boolean>;
    lastCheckInResult: globalThis.Ref<{
        success: boolean;
        errorMsg?: string | null | undefined;
        data?: string | undefined;
        total?: number | null | undefined;
        errCode?: string | null | undefined;
    } | null, BaseResponse<string> | {
        success: boolean;
        errorMsg?: string | null | undefined;
        data?: string | undefined;
        total?: number | null | undefined;
        errCode?: string | null | undefined;
    } | null>;
    lastCheckInTime: globalThis.Ref<string | null, string | null>;
    tomorrowSignInReward: globalThis.Ref<number, number>;
    canCheckIn: globalThis.ComputedRef<boolean>;
    checkInButtonText: globalThis.ComputedRef<string>;
    checkInButtonStatus: globalThis.ComputedRef<{
        disabled: boolean;
        loading: boolean;
        type: "success" | "warning" | "default";
    }>;
    todayDate: globalThis.ComputedRef<string>;
    getCheckInPreview: globalThis.ComputedRef<{
        description: string;
    }>;
    getUserStatusSummary: globalThis.ComputedRef<{
        currentWaves: number;
        continuousDays: number;
        monthCheckInDays: number;
        isCheckedIn: boolean;
        canCheckIn: boolean;
        tomorrowSignInReward: number;
    }>;
    loadCheckInStatus: () => Promise<void>;
    doCheckIn: () => Promise<BaseResponse<string> | null>;
    reset: () => void;
    initialize: () => Promise<void>;
}, "reset" | "loadCheckInStatus" | "doCheckIn" | "initialize">>;
export type CheckInStore = ReturnType<typeof useCheckInStore>;

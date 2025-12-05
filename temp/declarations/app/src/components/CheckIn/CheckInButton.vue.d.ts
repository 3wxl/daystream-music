import type { BaseResponse } from '@/types/checkIn';
interface Props {
    hasCheckedIn?: boolean;
    disabled?: boolean;
    loading?: boolean;
    continuousDays?: number;
    tomorrowReward?: number;
    currentWaves?: number;
}
declare const __VLS_export: import("vue").DefineComponent<Props, {
    triggerCheckIn: () => Promise<void>;
    refreshStatus: () => Promise<void>;
    setCheckInStatus: (status: boolean) => void;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    success: (result: BaseResponse<string>) => any;
    error: (error: Error) => any;
    checkin: () => any;
}, string, import("vue").PublicProps, Readonly<Props> & Readonly<{
    onSuccess?: ((result: BaseResponse<string>) => any) | undefined;
    onError?: ((error: Error) => any) | undefined;
    onCheckin?: (() => any) | undefined;
}>, {
    disabled: boolean;
    loading: boolean;
    hasCheckedIn: boolean;
    continuousDays: number;
    tomorrowReward: number;
    currentWaves: number;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;

import type { BaseResponse } from '@/types/checkIn';
interface Props {
    currentCoins: number;
    consecutiveDays: number;
    hasCheckedIn: boolean;
    nextDayCoins: number;
    loading?: boolean;
}
declare var __VLS_1: {};
type __VLS_Slots = {} & {
    'checkin-button'?: (props: typeof __VLS_1) => any;
};
declare const __VLS_base: import("vue").DefineComponent<Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    success: (result: BaseResponse<string>) => any;
    error: (error: Error) => any;
    checkin: () => any;
    "coins-changed": (newCoins: number) => any;
}, string, import("vue").PublicProps, Readonly<Props> & Readonly<{
    onSuccess?: ((result: BaseResponse<string>) => any) | undefined;
    onError?: ((error: Error) => any) | undefined;
    onCheckin?: (() => any) | undefined;
    "onCoins-changed"?: ((newCoins: number) => any) | undefined;
}>, {
    loading: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};

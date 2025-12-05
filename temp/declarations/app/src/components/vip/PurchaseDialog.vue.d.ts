import type { VipPackage, Coupon } from '@/types/vip/vipExchange';
interface Props {
    modelValue: boolean;
    selectedPackage: VipPackage | null;
    selectedOptionType: 'waves' | 'money';
    selectedOptionPrice: string;
    selectedOptionWaves: number;
    coupons: Coupon[];
    selectedCoupon: number | null;
    isProcessing: boolean;
}
declare const __VLS_export: import("vue").DefineComponent<Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    "update:modelValue": (value: boolean) => any;
    cancel: () => any;
    confirm: () => any;
    "update:selectedCoupon": (value: number | null) => any;
}, string, import("vue").PublicProps, Readonly<Props> & Readonly<{
    "onUpdate:modelValue"?: ((value: boolean) => any) | undefined;
    onCancel?: (() => any) | undefined;
    onConfirm?: (() => any) | undefined;
    "onUpdate:selectedCoupon"?: ((value: number | null) => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;

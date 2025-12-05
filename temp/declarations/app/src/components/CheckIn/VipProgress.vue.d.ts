import type { VipPrivilege } from '@/types/checkIn/index.ts';
interface Props {
    currentCoins: number;
    privileges: VipPrivilege[];
    animationDelay?: string;
}
interface VipTarget {
    value: number;
    duration: string;
    label: string;
    days: number;
}
declare const __VLS_export: import("vue").DefineComponent<Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "show-privilege": (privilege: VipPrivilege) => any;
    "redeem-vip": (target: VipTarget) => any;
}, string, import("vue").PublicProps, Readonly<Props> & Readonly<{
    "onShow-privilege"?: ((privilege: VipPrivilege) => any) | undefined;
    "onRedeem-vip"?: ((target: VipTarget) => any) | undefined;
}>, {
    animationDelay: string;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;

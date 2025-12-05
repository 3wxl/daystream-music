import type { UserData, ExchangeOption } from '@/types/vip/vipExchange';
interface Props {
    userData: UserData;
    exchangeOptions: ExchangeOption[];
    exchangeDuration: number | null;
    requiredWaves: number;
    isExchanging: boolean;
}
declare const __VLS_export: import("vue").DefineComponent<Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    "update:exchangeDuration": (value: number | null) => any;
    exchange: () => any;
}, string, import("vue").PublicProps, Readonly<Props> & Readonly<{
    "onUpdate:exchangeDuration"?: ((value: number | null) => any) | undefined;
    onExchange?: (() => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;

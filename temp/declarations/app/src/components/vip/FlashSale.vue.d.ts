import type { FlashSale, Countdown } from '@/types/vip/vipExchange';
interface Props {
    flashSales: FlashSale[];
    countdown: Countdown;
}
declare const __VLS_export: import("vue").DefineComponent<Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    flashSale: (flash: FlashSale) => any;
}, string, import("vue").PublicProps, Readonly<Props> & Readonly<{
    onFlashSale?: ((flash: FlashSale) => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;

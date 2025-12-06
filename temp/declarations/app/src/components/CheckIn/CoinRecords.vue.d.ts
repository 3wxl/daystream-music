import type { CoinRecord } from '@/types/checkIn/index.ts';
interface Props {
    records: CoinRecord[];
    animationDelay?: string;
}
declare const __VLS_export: import("vue").DefineComponent<Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "show-record": (record: CoinRecord) => any;
}, string, import("vue").PublicProps, Readonly<Props> & Readonly<{
    "onShow-record"?: ((record: CoinRecord) => any) | undefined;
}>, {
    animationDelay: string;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;

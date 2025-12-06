import type { ExchangeRecord } from '@/types/vip/vipExchange';
interface Props {
    records: ExchangeRecord[];
}
declare const __VLS_export: import("vue").DefineComponent<Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    recordClick: (record: ExchangeRecord) => any;
}, string, import("vue").PublicProps, Readonly<Props> & Readonly<{
    onRecordClick?: ((record: ExchangeRecord) => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;

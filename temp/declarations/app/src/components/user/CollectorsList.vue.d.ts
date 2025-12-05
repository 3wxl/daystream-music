interface Collector {
    id: number;
    avatarUrl: string;
    name: string;
    collectTime: number;
    signature?: string;
    followStatus: boolean;
}
interface Props {
    collectors: Collector[];
    searchKeyword?: string;
}
declare const __VLS_export: import("vue").DefineComponent<Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "toggle-follow": (id: number) => any;
    "update:searchKeyword": (value: string) => any;
}, string, import("vue").PublicProps, Readonly<Props> & Readonly<{
    "onToggle-follow"?: ((id: number) => any) | undefined;
    "onUpdate:searchKeyword"?: ((value: string) => any) | undefined;
}>, {
    searchKeyword: string;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;

interface Props {
    userName: string;
    userStatus: '在线' | '离线' | '忙碌';
    version?: string;
    avatar?: string;
}
declare const __VLS_export: import("vue").DefineComponent<Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    "show-history": () => any;
    "toggle-settings": () => any;
}, string, import("vue").PublicProps, Readonly<Props> & Readonly<{
    "onShow-history"?: (() => any) | undefined;
    "onToggle-settings"?: (() => any) | undefined;
}>, {
    version: string;
    avatar: string;
    userName: string;
    userStatus: "\u5728\u7EBF" | "\u79BB\u7EBF" | "\u5FD9\u788C";
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;

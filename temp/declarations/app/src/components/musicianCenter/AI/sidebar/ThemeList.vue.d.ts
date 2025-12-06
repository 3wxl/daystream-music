import type { Theme } from '@/types/lyricAssistant';
interface Props {
    themes: Theme[];
}
declare const __VLS_export: import("vue").DefineComponent<Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    "select-theme": (theme: Theme) => any;
}, string, import("vue").PublicProps, Readonly<Props> & Readonly<{
    "onSelect-theme"?: ((theme: Theme) => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;

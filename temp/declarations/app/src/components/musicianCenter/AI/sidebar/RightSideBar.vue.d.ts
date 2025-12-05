import type { Theme } from '@/types/lyricAssistant';
interface Props {
    themes: Theme[];
    panelCollapsed?: boolean;
}
declare const __VLS_export: import("vue").DefineComponent<Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    "toggle-panel": () => any;
    "select-theme": (theme: Theme) => any;
    "start-quick-creation": () => any;
}, string, import("vue").PublicProps, Readonly<Props> & Readonly<{
    "onToggle-panel"?: (() => any) | undefined;
    "onSelect-theme"?: ((theme: Theme) => any) | undefined;
    "onStart-quick-creation"?: (() => any) | undefined;
}>, {
    panelCollapsed: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;

import type { QuickPhrase } from '@/types/lyricAssistant';
interface Props {
    modelValue: string;
    placeholder?: string;
    quickPhrases: QuickPhrase[];
}
declare const __VLS_export: import("vue").DefineComponent<Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    "update:modelValue": (value: string) => any;
    send: () => any;
    "attach-file": () => any;
    "use-quick-phrase": (phrase: QuickPhrase) => any;
}, string, import("vue").PublicProps, Readonly<Props> & Readonly<{
    "onUpdate:modelValue"?: ((value: string) => any) | undefined;
    onSend?: (() => any) | undefined;
    "onAttach-file"?: (() => any) | undefined;
    "onUse-quick-phrase"?: ((phrase: QuickPhrase) => any) | undefined;
}>, {
    placeholder: string;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;

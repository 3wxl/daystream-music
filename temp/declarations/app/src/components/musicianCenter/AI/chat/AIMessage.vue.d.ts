import type { Message } from '@/types/lyricAssistant';
interface Props {
    message: Message;
}
declare const __VLS_export: import("vue").DefineComponent<Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    "play-lyric": (section: string) => any;
    "continue-creation": () => any;
    "preview-song": () => any;
    "save-lyrics": () => any;
}, string, import("vue").PublicProps, Readonly<Props> & Readonly<{
    "onPlay-lyric"?: ((section: string) => any) | undefined;
    "onContinue-creation"?: (() => any) | undefined;
    "onPreview-song"?: (() => any) | undefined;
    "onSave-lyrics"?: (() => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;

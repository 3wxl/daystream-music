import type { Message } from '@/types/lyricAssistant';
interface Props {
    messages: Message[];
    showWelcome?: boolean;
    welcomeMessage?: string;
    aiAvatar?: string;
}
declare const __VLS_export: import("vue").DefineComponent<Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    "play-lyric": (section: string) => any;
    "continue-creation": () => any;
    "preview-song": () => any;
    "save-lyrics": () => any;
    "send-message": (content: string) => any;
}, string, import("vue").PublicProps, Readonly<Props> & Readonly<{
    "onPlay-lyric"?: ((section: string) => any) | undefined;
    "onContinue-creation"?: (() => any) | undefined;
    "onPreview-song"?: (() => any) | undefined;
    "onSave-lyrics"?: (() => any) | undefined;
    "onSend-message"?: ((content: string) => any) | undefined;
}>, {
    showWelcome: boolean;
    welcomeMessage: string;
    aiAvatar: string;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;

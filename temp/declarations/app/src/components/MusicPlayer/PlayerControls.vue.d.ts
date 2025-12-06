declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: import("vue").DefineComponent<{}, {
    $emit: typeof __VLS_emit;
    $props: Partial<typeof __VLS_props>;
    progress: number;
    loop: boolean;
    volume: number;
    isPlaying: boolean;
    shuffle: boolean;
    muted: boolean;
    isLiked: boolean;
    progressPercentage: number;
    formatTime: Function;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
declare const __VLS_emit: (event: "toggle-play" | "toggle-like" | "toggle-shuffle" | "toggle-loop" | "toggle-mute" | "prev-song" | "next-song" | "handle-progress-click" | "handle-volume-click", ...args: any[]) => void;
declare const __VLS_props: {
    readonly progress: number;
    readonly loop: boolean;
    readonly volume: number;
    readonly isPlaying: boolean;
    readonly shuffle: boolean;
    readonly muted: boolean;
    readonly isLiked: boolean;
    readonly progressPercentage: number;
    readonly formatTime: Function;
};

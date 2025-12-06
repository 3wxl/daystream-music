declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: import("vue").DefineComponent<{}, {
    $emit: typeof emit;
    $props: Partial<typeof props>;
    activeTab: string;
    currentLyricIndex: number;
    currentLyricTime: string;
    similarSongs: unknown[];
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
declare const emit: (event: "update:active-tab" | "seek-to-lyric" | "play-similar-song", ...args: any[]) => void;
declare const props: {
    readonly activeTab: string;
    readonly currentLyricIndex: number;
    readonly currentLyricTime: string;
    readonly similarSongs: unknown[];
};

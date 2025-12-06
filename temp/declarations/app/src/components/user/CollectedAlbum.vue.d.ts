type __VLS_Props = {
    albums: {
        id: number;
        name: string;
        artist: string;
        cover: string;
        songCount: number;
        playCount: string;
        collectTime: string;
    }[];
};
declare const __VLS_export: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    goToAlbumDetail: (id: number) => any;
    playAlbum: (id: number) => any;
    toggleCollection: (id: number) => any;
    shareAlbum: (id: number) => any;
    exploreAlbums: () => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onGoToAlbumDetail?: ((id: number) => any) | undefined;
    onPlayAlbum?: ((id: number) => any) | undefined;
    onToggleCollection?: ((id: number) => any) | undefined;
    onShareAlbum?: ((id: number) => any) | undefined;
    onExploreAlbums?: (() => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;

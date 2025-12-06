import type { PropType } from 'vue';
export interface MusicItemProp {
    id: string | number;
    image: string;
    title: string;
    desc: string;
    raw?: any;
}
declare const __VLS_export: import("vue").DefineComponent<globalThis.ExtractPropTypes<{
    items: {
        type: PropType<MusicItemProp[]>;
        required: true;
        default: () => never[];
    };
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "click-music": (...args: any[]) => void;
}, string, import("vue").PublicProps, Readonly<globalThis.ExtractPropTypes<{
    items: {
        type: PropType<MusicItemProp[]>;
        required: true;
        default: () => never[];
    };
}>> & Readonly<{
    "onClick-music"?: ((...args: any[]) => any) | undefined;
}>, {
    items: MusicItemProp[];
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;

import type { RouteLocationRaw } from 'vue-router';
interface Props {
    imgUrl: string;
    title?: string;
    to: RouteLocationRaw;
    variant?: 'default' | 'album' | 'recommend' | 'artist';
    showPlayButton?: boolean;
}
declare var __VLS_7: {};
type __VLS_Slots = {} & {
    default?: (props: typeof __VLS_7) => any;
};
declare const __VLS_base: import("vue").DefineComponent<Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<Props> & Readonly<{}>, {
    title: string;
    variant: "default" | "album" | "recommend" | "artist";
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};

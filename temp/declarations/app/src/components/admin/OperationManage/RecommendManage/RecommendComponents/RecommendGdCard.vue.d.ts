type __VLS_Props = {
    data: {
        id: string;
        imgUrl: string;
        description: string;
        songCount: string;
        singerName: string;
    };
    index: number;
};
type __VLS_ModelProps = {
    modelValue?: boolean;
};
type __VLS_PublicProps = __VLS_Props & __VLS_ModelProps;
declare const __VLS_export: import("vue").DefineComponent<__VLS_PublicProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    select: (...args: any[]) => void;
    "update:modelValue": (value: boolean | undefined) => void;
}, string, import("vue").PublicProps, Readonly<__VLS_PublicProps> & Readonly<{
    onSelect?: ((...args: any[]) => any) | undefined;
    "onUpdate:modelValue"?: ((value: boolean | undefined) => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;

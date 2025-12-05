declare var __VLS_21: {};
type __VLS_Slots = {} & {
    default?: (props: typeof __VLS_21) => any;
};
declare const __VLS_base: import("vue").DefineComponent<globalThis.ExtractPropTypes<{
    width: {
        type: StringConstructor;
        required: false;
        default: string;
    };
    Teleport: {
        type: StringConstructor;
        required: false;
        default: string;
    };
    iconName: {
        type: StringConstructor;
        required: false;
    };
    iconColor: {
        type: StringConstructor;
        required: false;
        default: string;
    };
    iconSize: {
        type: NumberConstructor;
        required: false;
        default: number;
    };
    title: {
        type: StringConstructor;
        required: false;
    };
    isCustom: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    content: {
        type: StringConstructor;
        required: false;
        default: string;
    };
    modelValue: {
        type: globalThis.PropType<boolean>;
        required: true;
    };
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "update:modelValue": (value: boolean) => any;
}, string, import("vue").PublicProps, Readonly<globalThis.ExtractPropTypes<{
    width: {
        type: StringConstructor;
        required: false;
        default: string;
    };
    Teleport: {
        type: StringConstructor;
        required: false;
        default: string;
    };
    iconName: {
        type: StringConstructor;
        required: false;
    };
    iconColor: {
        type: StringConstructor;
        required: false;
        default: string;
    };
    iconSize: {
        type: NumberConstructor;
        required: false;
        default: number;
    };
    title: {
        type: StringConstructor;
        required: false;
    };
    isCustom: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    content: {
        type: StringConstructor;
        required: false;
        default: string;
    };
    modelValue: {
        type: globalThis.PropType<boolean>;
        required: true;
    };
}>> & Readonly<{
    "onUpdate:modelValue"?: ((value: boolean) => any) | undefined;
}>, {
    content: string;
    Teleport: string;
    width: string;
    iconColor: string;
    iconSize: number;
    isCustom: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};

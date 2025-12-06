type __VLS_Props = {
    /** 图标 ID（对应 FontClass 的类名，无需加 'icon-' 前缀） */
    name: string;
    /** 图标尺寸（支持数字/字符串，如 24、'24px'、'1.5em'） */
    size?: number | string;
    /** 图标颜色（支持 CSS 颜色格式） */
    color?: string;
    /** 自定义类名（用于额外样式） */
    customClass?: string;
    /** 自定义样式（覆盖默认样式） */
    customStyle?: Record<string, string | number>;
    /** 图标提示文本（hover 时显示） */
    title?: string;
};
declare const __VLS_export: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;

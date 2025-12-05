import type { Task } from '@/types/checkIn/index.ts';
interface Props {
    tasks: Task[];
    animationDelay?: string;
}
declare const __VLS_export: import("vue").DefineComponent<Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "complete-task": (task: Task) => any;
}, string, import("vue").PublicProps, Readonly<Props> & Readonly<{
    "onComplete-task"?: ((task: Task) => any) | undefined;
}>, {
    animationDelay: string;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;

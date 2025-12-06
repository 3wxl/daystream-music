import type { VipPrivilege } from '@/types/vip/vipExchange';
interface Props {
    privileges: VipPrivilege[];
}
declare const __VLS_export: import("vue").DefineComponent<Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    showPrivilegeDetail: (privilege: VipPrivilege) => any;
    scrollToPackages: () => any;
}, string, import("vue").PublicProps, Readonly<Props> & Readonly<{
    onShowPrivilegeDetail?: ((privilege: VipPrivilege) => any) | undefined;
    onScrollToPackages?: (() => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;

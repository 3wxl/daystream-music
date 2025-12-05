import type { VipPackage } from '@/types/vip/vipExchange';
interface Props {
    packages: VipPackage[];
    selectedPackageType: string;
    selectedPackage: string;
    selectedOptions: Record<string, 'waves'>;
    userWaves?: string | number;
}
declare const __VLS_export: import("vue").DefineComponent<Props, {
    scrollTo: () => void;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    selectOption: (params: {
        pkgId: string;
        optionType: "waves";
    }) => any;
    "update:selectedPackageType": (value: string) => any;
    selectPackage: (pkg: VipPackage) => any;
    purchase: (pkg: VipPackage) => any;
}, string, import("vue").PublicProps, Readonly<Props> & Readonly<{
    onSelectOption?: ((params: {
        pkgId: string;
        optionType: "waves";
    }) => any) | undefined;
    "onUpdate:selectedPackageType"?: ((value: string) => any) | undefined;
    onSelectPackage?: ((pkg: VipPackage) => any) | undefined;
    onPurchase?: ((pkg: VipPackage) => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;

export interface UserData {
    waves: number;
    vipLevel: string;
    vipDays: number;
    username: string;
}
export interface Countdown {
    hours: string;
    minutes: string;
    seconds: string;
}
export interface VipPrivilege {
    id: number;
    icon: string;
    title: string;
    description: string;
}
export interface VipPackageOption {
    type: 'waves';
    label: string;
    description: string;
    price: string;
    waves: number;
}
export interface VipPackage {
    id: string;
    type: 'month' | 'quarter' | 'year' | 'permanent';
    title: string;
    description: string;
    price: string;
    originalPrice?: string;
    unit: '音浪';
    dailyPrice: string;
    discount?: number;
    recommended: boolean;
    exchangeOptions: VipPackageOption[];
    wavesPrice: number;
    days: number;
}
export interface ExchangeOption {
    label: string;
    value: number;
    waves: number;
}
export interface ExchangeRecord {
    id?: string;
    date?: string;
    status?: 'success' | 'failed';
    type: string;
    amount: number;
    unit: string;
    waves?: number;
    price?: string;
}
export interface FlashSale {
    id: string;
    title: string;
    subtitle: string;
    originalPrice: number;
    flashPrice: number;
    total: number;
    sold: number;
    remaining: number;
    timeLeft: number;
    unit: '音浪';
}
export interface QuickAction {
    id: number;
    icon: string;
    label: string;
    action: string;
}
export interface Coupon {
    id: number;
    name: string;
    amount: number;
    minAmount: number;
}
export interface PurchaseResult {
    type: 'waves';
    package: VipPackage | null;
    waves: number;
    success: boolean;
}
export interface ExchangeResult {
    option: ExchangeOption | undefined;
    wavesUsed: number;
    daysAdded: number;
}
export interface SelectPackageEvent {
    pkg: VipPackage;
}
export interface SelectOptionEvent {
    pkgId: string;
    optionType: 'waves';
}
export interface FlashSaleEvent {
    flash: FlashSale;
}
export interface QuickActionEvent {
    action: QuickAction;
}

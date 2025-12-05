import type { Ref } from 'vue';
import type { UserData, Countdown, VipPackage, ExchangeOption, ExchangeRecord, FlashSale, ExchangeResult } from '@/types//vip/vipExchange';
export declare function useUserData(initialData?: Partial<UserData>): {
    userData: Ref<UserData, UserData>;
    updateWaves: (amount: number) => void;
    updateVipDays: (days: number) => void;
    updateVipLevel: (level: string) => void;
};
export declare function useCountdown(initialHours?: number, initialMinutes?: number, initialSeconds?: number): {
    countdown: Ref<Countdown, Countdown>;
    startCountdown: () => void;
    stopCountdown: () => void;
    resetCountdown: (hours?: number, minutes?: number, seconds?: number) => void;
};
export declare function useVipPackages(packages: VipPackage[]): {
    selectedPackageType: Ref<"month" | "year" | "quarter" | "permanent", "month" | "year" | "quarter" | "permanent">;
    selectedPackage: Ref<string, string>;
    selectedOption: Ref<Record<string, "waves" | "money">, Record<string, "waves" | "money">>;
    filteredPackages: globalThis.ComputedRef<VipPackage[]>;
    selectPackage: (pkg: VipPackage) => void;
    selectOption: (pkgId: string, optionType: "money" | "waves") => void;
};
export declare function useWavesExchange(exchangeOptions: ExchangeOption[], userData: Ref<UserData>): {
    exchangeDuration: Ref<number | null, number | null>;
    requiredWaves: Ref<number, number>;
    isExchanging: Ref<boolean, boolean>;
    selectedExchangeOption: globalThis.ComputedRef<ExchangeOption | undefined>;
    handleExchange: () => Promise<ExchangeResult>;
};
export declare function usePurchase(): {
    showConfirmDialog: Ref<boolean, boolean>;
    selectedVipPackage: Ref<{
        id: string;
        type: "month" | "quarter" | "year" | "permanent";
        title: string;
        description: string;
        price: string;
        originalPrice?: string | undefined;
        unit: "\u97F3\u6D6A";
        dailyPrice: string;
        discount?: number | undefined;
        recommended: boolean;
        exchangeOptions: {
            type: "waves";
            label: string;
            description: string;
            price: string;
            waves: number;
        }[];
        wavesPrice: number;
        days: number;
    } | null, VipPackage | {
        id: string;
        type: "month" | "quarter" | "year" | "permanent";
        title: string;
        description: string;
        price: string;
        originalPrice?: string | undefined;
        unit: "\u97F3\u6D6A";
        dailyPrice: string;
        discount?: number | undefined;
        recommended: boolean;
        exchangeOptions: {
            type: "waves";
            label: string;
            description: string;
            price: string;
            waves: number;
        }[];
        wavesPrice: number;
        days: number;
    } | null>;
    selectedOptionType: Ref<"waves" | "money", "waves" | "money">;
    selectedOptionPrice: Ref<string, string>;
    selectedOptionWaves: Ref<number, number>;
    selectedCoupon: Ref<number | null, number | null>;
    isProcessing: Ref<boolean, boolean>;
    openPurchaseDialog: (pkg: VipPackage, optionType: "waves" | "money") => void;
    closePurchaseDialog: () => void;
};
export declare function useExchangeRecords(initialRecords?: ExchangeRecord[]): {
    exchangeRecords: Ref<{
        id?: string | undefined;
        date?: string | undefined;
        status?: "success" | "failed" | undefined;
        type: string;
        amount: number;
        unit: string;
        waves?: number | undefined;
        price?: string | undefined;
    }[], ExchangeRecord[] | {
        id?: string | undefined;
        date?: string | undefined;
        status?: "success" | "failed" | undefined;
        type: string;
        amount: number;
        unit: string;
        waves?: number | undefined;
        price?: string | undefined;
    }[]>;
    addRecord: (record: Omit<ExchangeRecord, "id" | "date" | "status"> & Partial<ExchangeRecord>) => void;
    updateRecordStatus: (id: number, status: "success" | "pending" | "failed") => void;
    deleteRecord: (id: number) => void;
    getRecordById: (id: number) => ExchangeRecord | undefined;
};
export declare function useFlashSales(flashSales: FlashSale[]): {
    sales: Ref<{
        id: string;
        title: string;
        subtitle: string;
        originalPrice: number;
        flashPrice: number;
        total: number;
        sold: number;
        remaining: number;
        timeLeft: number;
        unit: "\u97F3\u6D6A";
    }[], FlashSale[] | {
        id: string;
        title: string;
        subtitle: string;
        originalPrice: number;
        flashPrice: number;
        total: number;
        sold: number;
        remaining: number;
        timeLeft: number;
        unit: "\u97F3\u6D6A";
    }[]>;
    handleFlashSale: (flashId: string) => Promise<boolean>;
};

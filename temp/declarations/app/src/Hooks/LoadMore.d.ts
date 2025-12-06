export declare function useLoadMore(apiFunc: Function): {
    loading: globalThis.Ref<boolean, boolean>;
    noMore: globalThis.Ref<boolean, boolean>;
    listData: globalThis.Ref<never[], never[]>;
    loadData: (params?: any, isReset?: boolean) => Promise<void>;
    isError: globalThis.Ref<boolean, boolean>;
};

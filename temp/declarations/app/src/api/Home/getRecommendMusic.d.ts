export declare const getRecommendMusic: () => Promise<{
    success: boolean;
    errorMsg: string;
    data: unknown;
    total?: number;
    errCode?: number;
}>;

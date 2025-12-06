export declare function getAllTags(): Promise<{
    success: boolean;
    errorMsg: string;
    data: unknown;
    total?: number;
    errCode?: number;
}>;

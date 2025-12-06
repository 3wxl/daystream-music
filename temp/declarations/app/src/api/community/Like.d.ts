export declare function Like(submitData: {
    targetId: string;
    targetType: number;
}): Promise<{
    success: boolean;
    errorMsg: string;
    data: unknown;
    total?: number;
    errCode?: number;
}>;

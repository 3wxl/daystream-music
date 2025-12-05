export declare function GetDynamicComment(data: {
    targetId: string;
    targetType: number;
    lastId?: string;
    size: number;
}): Promise<{
    success: boolean;
    errorMsg: string;
    data: unknown;
    total?: number;
    errCode?: number;
}>;
